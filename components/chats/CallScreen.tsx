"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { parseCookies } from "nookies";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast } from "@/lib/hotToast";

// LiveKit imports
import { Room, RoomEvent, LocalAudioTrack, LocalVideoTrack, AudioCaptureOptions, VideoTrack, AudioTrack } from "livekit-client";

type CallScreenProps = {
  conversationId: string;
  type: "audio" | "video";
  isIncoming: boolean;
  onCallEnd: () => void;
};

export default function CallScreen({ conversationId, type, isIncoming, onCallEnd }: CallScreenProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [statusText, setStatusText] = useState("Connecting...");
  const [room, setRoom] = useState<Room | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<LocalAudioTrack | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<any[]>([]);
  const [tokenRefreshTimer, setTokenRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  
  const callKind = type === "audio" ? "AUDIO" : "VIDEO";

  useEffect(() => {
    // Start the call when component mounts
    startCall();
    
    // Cleanup on unmount
    return () => {
      cleanupCall();
      if (tokenRefreshTimer) {
        clearTimeout(tokenRefreshTimer);
      }
    };
  }, []);

  const startCall = useCallback(async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    setStatusText(`${type === "audio" ? "Audio" : "Video"} call connecting...`);
    
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      
      let response;
      
      if (isIncoming) {
        // Join an existing call
        response = await ChatsService.joinCall({
          conversationId,
          token,
        });
      } else {
        // Start a new call
        response = await ChatsService.startCall({
          conversationId,
          token,
          data: {
            kind: callKind,
          },
        });
      }
      
      const { data } = response;
      const { livekit } = data;
      
      await connectToLiveKit(livekit.url, livekit.token, callKind);
      
      // Start token refresh timer (refresh 90 seconds before expiry)
      // TTL is 10 minutes (600 seconds), so refresh at 510 seconds
      const refreshToken = async () => {
        try {
          const tokenResponse = await ChatsService.getCallToken({
            conversationId,
            token,
          });
          
          const { data: tokenData } = tokenResponse;
          const { livekit: newLivekit } = tokenData;
          
          if (room) {
            await room.connect(newLivekit.url, newLivekit.token);
          }
          
          // Schedule next refresh
          setTokenRefreshTimer(setTimeout(refreshToken, 510 * 1000));
        } catch (error) {
          console.error("Token refresh failed:", error);
          // Try again in 30 seconds on failure
          setTokenRefreshTimer(setTimeout(refreshToken, 30 * 1000));
        }
      };
      
      setTokenRefreshTimer(setTimeout(refreshToken, 510 * 1000));
    } catch (error) {
      console.error("Failed to start call:", error);
      showErrorToast("Failed to start call");
      setStatusText("Failed to connect");
      setIsConnecting(false);
      
      // Auto-close after error
      setTimeout(() => {
        onCallEnd();
      }, 3000);
    }
  }, [conversationId, type, isIncoming, onCallEnd]);

  const connectToLiveKit = useCallback(async (serverUrl: string, accessToken: string, kind: string) => {
    // Clean up any existing room
    if (room) {
      await room.disconnect();
    }
    
    const roomInstance = new Room({
      adaptiveStream: true,
      dynacast: true,
    });
    
    // Event listeners
    roomInstance.on(RoomEvent.ParticipantConnected, (participant) => {
      console.log(`Participant connected: ${participant.identity}`);
      setStatusText(`${participant.identity} joined`);
    });
    
    roomInstance.on(RoomEvent.ParticipantDisconnected, (participant) => {
      console.log(`Participant disconnected: ${participant.identity}`);
      setRemoteParticipants(prev => prev.filter(p => p.identity !== participant.identity));
      setStatusText(`${participant.identity} left`);
    });
    
    roomInstance.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
      if (track.kind === "video" || track.kind === "audio") {
        // Add to remote participants list if not already there
        setRemoteParticipants(prev => {
          const exists = prev.some(p => p.identity === participant.identity);
          if (!exists) {
            return [...prev, {
              identity: participant.identity,
              name: participant.name || participant.identity,
              tracks: [...(prev.find(p => p.identity === participant.identity)?.tracks || []), track]
            }];
          }
          
          return prev.map(p => 
            p.identity === participant.identity 
              ? {...p, tracks: [...p.tracks, track]} 
              : p
          );
        });
        
        // Attach video track to its ref
        if (track.kind === "video") {
          const videoElement = videoRefs.current.get(participant.identity);
          if (videoElement) {
            track.attach(videoElement);
          }
        }
      }
    });
    
    roomInstance.on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
      if (track.kind === "video" || track.kind === "audio") {
        setRemoteParticipants(prev => 
          prev.map(p => 
            p.identity === participant.identity 
              ? {...p, tracks: p.tracks.filter(t => t !== track)} 
              : p
          )
        );
        
        // Detach the track
        track.detach();
        
        // Clean up the video ref if this was a video track
        if (track.kind === "video") {
          videoRefs.current.delete(participant.identity);
        }
      }
    });
    
    roomInstance.on(RoomEvent.Disconnected, () => {
      console.log("Disconnected from room");
      setIsConnected(false);
      setStatusText("Disconnected");
    });
    
    roomInstance.on(RoomEvent.Reconnecting, () => {
      setStatusText("Reconnecting...");
    });
    
    roomInstance.on(RoomEvent.Reconnected, () => {
      setStatusText("Reconnected");
    });
    
    // Connect to LiveKit
    await roomInstance.connect(serverUrl, accessToken);
    setRoom(roomInstance);
    setIsConnected(true);
    
    // Enable microphone
    try {
      await roomInstance.localParticipant.setMicrophoneEnabled(true);
      setMicEnabled(true);
    } catch (err) {
      setMicEnabled(false);
      showErrorToast("Microphone not available - you can hear but not speak");
    }
    
    // Enable camera for video calls
    if (kind === "VIDEO") {
      try {
        await roomInstance.localParticipant.setCameraEnabled(true);
        setCameraEnabled(true);
        
        // Get local video track
        const videoPublication = Array.from(roomInstance.localParticipant.videoTrackPublications.values())
          .find(pub => !pub.mute && pub.track);
        
        if (videoPublication?.track) {
          setLocalVideoTrack(videoPublication.track as LocalVideoTrack);
        }
      } catch (err) {
        setCameraEnabled(false);
        showErrorToast("Camera not available - audio only");
      }
    }
    
     // Get local audio track
    const audioPublication = Array.from(roomInstance.localParticipant.audioTrackPublications.values())
      .find(pub => !pub.mute && pub.track);
    
    if (audioPublication?.track) {
      setLocalAudioTrack(audioPublication.track as LocalAudioTrack);
    }
    
    setStatusText(`${kind === "VIDEO" ? "Video" : "Audio"} call connected`);
  }, [room]);

  const toggleMic = useCallback(async () => {
    if (!room) return;
    
    try {
      const newState = !micEnabled;
      await room.localParticipant.setMicrophoneEnabled(newState);
      setMicEnabled(newState);
      
      // Sync with backend
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      await ChatsService.updateMediaState({
        conversationId,
        token,
        data: {
          microphone: newState,
        },
      });
    } catch (error) {
      console.error("Failed to toggle mic:", error);
    }
  }, [room, micEnabled, conversationId]);

  const toggleCamera = useCallback(async () => {
    if (!room) return;
    
    try {
      const newState = !cameraEnabled;
      await room.localParticipant.setCameraEnabled(newState);
      setCameraEnabled(newState);
      
      // Sync with backend
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      await ChatsService.updateMediaState({
        conversationId,
        token,
        data: {
          camera: newState,
        },
      });
    } catch (error) {
      console.error("Failed to toggle camera:", error);
    }
  }, [room, cameraEnabled, conversationId]);

  const toggleSpeaker = useCallback(async () => {
    // Note: Speaker toggle would require native functionality in a mobile app
    // For web, we can't directly control speaker/earpiece
    setSpeakerEnabled(!speakerEnabled);
  }, [speakerEnabled]);

  const leaveCall = useCallback(async () => {
    try {
      // Leave the LiveKit room
      if (room) {
        await room.disconnect();
      }
      
      // Leave the call on backend
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      await ChatsService.leaveCall({
        conversationId,
        token,
      });
    } catch (error) {
      console.error("Failed to leave call:", error);
    } finally {
      cleanupCall();
      onCallEnd();
    }
  }, [room, conversationId, onCallEnd]);

  const cleanupCall = useCallback(() => {
    if (room) {
      room.disconnect();
      setRoom(null);
    }
    
    setLocalAudioTrack(null);
    setLocalVideoTrack(null);
    setRemoteParticipants([]);
    setIsConnected(false);
    setIsConnecting(false);
    
    if (tokenRefreshTimer) {
      clearTimeout(tokenRefreshTimer);
      setTokenRefreshTimer(null);
    }
  }, [room, tokenRefreshTimer]);

    // Handle local video track attachment/detachment
    useEffect(() => {
      if (localVideoTrack && localVideoRef.current) {
        localVideoTrack.attach(localVideoRef.current);
        return () => {
          localVideoTrack.detach(localVideoRef.current);
        };
      }
    }, [localVideoTrack]);
    
    // Handle remote video tracks attachment/detachment
    useEffect(() => {
      // Attach video tracks to their respective video elements
      remoteParticipants.forEach(participant => {
        const videoElement = document.querySelector(`video[key="video-${participant.id}"]`);
        if (videoElement) {
          participant.tracks.forEach((track: any) => {
            if (track.kind === "video") {
              track.attach(videoElement);
            }
          });
        }
      });
      
      // Cleanup function
      return () => {
        // Detach all tracks
        remoteParticipants.forEach(participant => {
          participant.tracks.forEach((track: any) => {
            if (track.kind === "video" || track.kind === "audio") {
              track.detach();
            }
          });
        });
      };
    }, [remoteParticipants]);

  if (!isConnected && !isConnecting) {
    return null; // Don't render anything if not connected or connecting
  }

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm z-50">
      <div className="relative w-full max-w-[400px] h-full max-h-[600px] bg-[#0a1929] border border-[#1a2336] rounded-xl overflow-hidden">
        {/* Status Bar */}
        <div className="px-4 py-3 border-b border-[#1a2336] flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-semibold">
              {type === "audio" ? "📞" : "📹"}
            </div>
            <div className="ml-3">
              <p className="text-white font-medium">{type === "audio" ? "Audio Call" : "Video Call"}</p>
              <p className="text-[12px] text-[#B2B5B8]">{statusText}</p>
            </div>
          </div>
          <button
            onClick={leaveCall}
            className="p-2 hover:bg-[#1a2336] rounded-lg text-white"
          >
            {"✕"}
          </button>
        </div>
        
        {/* Video Container */}
        <div className="flex-1 relative">
          {type === "video" && (
            <div className="absolute inset-0">
              {/* Local video preview (small) */}
              {localVideoTrack && (
                <div className="absolute bottom-4 right-4 w-24 h-32 bg-[#17212c] rounded-lg overflow-hidden">
                  <video autoPlay playsInline style={{ width: '100%', height: '100%' }} ref={localVideoRef} />
                </div>
              )}
              
            {/* Remote videos */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {remoteParticipants.length === 0 ? (
                  <div className="text-[14px] text-[#B2B5B8]">
                    Waiting for participants...
                  </div>
                ) : (
                  <div className="space-y-4 w-full max-w-[320px]">
                    {remoteParticipants.map((participant, index) => {
                      const videoRef = useRef<HTMLVideoElement | null>(null);
                      
                      // Attach/detach video tracks when they change
                      useEffect(() => {
                        const videoTrack = participant.tracks.find((t: any) => t.kind === "video");
                        if (videoTrack && videoRef.current) {
                          videoTrack.attach(videoRef.current);
                          return () => {
                            videoTrack.detach(videoRef.current);
                          };
                        }
                      }, [participant.tracks, videoRef]);
                      
                      return (
                        <div key={participant.identity} className="flex flex-col items-center">
                          <div className="w-24 h-32 bg-[#17212c] rounded-lg overflow-hidden relative">
                            {participant.tracks.some((t: any) => t.kind === "video") ? (
                              <video autoPlay playsInline ref={videoRef} style={{ width: '100%', height: '100%' }} />
                            ) : (
                              <div className="flex flex-col items-center justify-center h-full bg-[#17212c]">
                                <div className="w-10 h-10 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-semibold mb-2">
                                  {participant.identity.substring(0, 1).toUpperCase()}
                                </div>
                                <p className="text-[12px] text-white">{participant.identity}</p>
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-[12px] text-white">{participant.name || participant.identity}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Audio call UI */}
          {type === "audio" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-5xl text-white mb-6">
                📞
              </div>
              <div className="space-y-4">
                {remoteParticipants.map((participant, index) => (
                  <div key={participant.identity} className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-[#5f6ca0] flex items-center justify-center text-white font-semibold mb-3">
                      {participant.identity.substring(0, 1).toUpperCase()}
                    </div>
                    <p className="text-white">{participant.name || participant.identity}</p>
                    <p className="text-[12px] text-[#B2B5B8]">{participant.tracks.some((t: any) => t.kind === "audio") ? "🔊 Audio Active" : "🔇 Audio Off"}</p>
                  </div>
                ))}
                {remoteParticipants.length === 0 && (
                  <div className="text-[14px] text-[#B2B5B8]">
                    Waiting for participants...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="px-4 py-4 border-t border-[#1a2336]">
          <div className="flex items-center justify-between">
            {/* Mic Button */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-full transition-transform active:scale-95 ${
                micEnabled ? "text-white" : "text-red-500"
              } hover:bg-[#17212c/50]`}
            >
              {micEnabled ? "🎤" : "🎤"}
              {!micEnabled && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></span>}
            </button>
            
            {/* End Call Button */}
            <button
              onClick={leaveCall}
              className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition-transform active:scale-95"
            >
              📞
            </button>
            
            {/* Camera Button (video only) */}
            {type === "video" && (
              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-transform active:scale-95 ${
                  cameraEnabled ? "text-white" : "text-red-500"
                } hover:bg-[#17212c/50]`}
              >
                {cameraEnabled ? "📹" : "📹"}
                {!cameraEnabled && <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"></span>}
              </button>
            )}
            
            {/* Speaker Button */}
            <button
              onClick={toggleSpeaker}
              className={`p-3 rounded-full transition-transform active:scale-95 ${
                speakerEnabled ? "text-white" : "text-red-500"
              } hover:bg-[#17212c/50]`}
            >
              {speakerEnabled ? "🔊" : "🔇"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}