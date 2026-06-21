"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Volume2, X } from "lucide-react";
import { parseCookies } from "nookies";
import { Room, RoomEvent, LocalAudioTrack, LocalVideoTrack } from "livekit-client";
import { ChatsService } from "@/service/chats/chats.service";
import { showErrorToast } from "@/lib/hotToast";
import { cn } from "@/lib/utils";

type CallScreenProps = {
  conversationId: string;
  type: "audio" | "video";
  isIncoming: boolean;
  onCallEnd: () => void;
};

type RemoteParticipantView = {
  identity: string;
  name: string;
  tracks: any[];
};

const getAuthToken = () => {
  const cookies = parseCookies();
  return cookies.token || cookies.accessToken || "";
};

const extractCallData = (response: any) => response?.data?.data || response?.data || response;

function RemoteVideo({ track }: { track: any }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!track || !videoRef.current) return;

    track.attach(videoRef.current);
    return () => {
      track.detach(videoRef.current);
    };
  }, [track]);

  return <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />;
}

function RemoteAudio({ track }: { track: any }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!track || !audioRef.current) return;

    track.attach(audioRef.current);
    return () => {
      track.detach(audioRef.current);
    };
  }, [track]);

  return <audio ref={audioRef} autoPlay />;
}

export default function CallScreen({
  conversationId,
  type,
  isIncoming,
  onCallEnd,
}: CallScreenProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(type === "video");
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [statusText, setStatusText] = useState("Connecting...");
  const [localVideoTrack, setLocalVideoTrack] = useState<LocalVideoTrack | null>(null);
  const [remoteParticipants, setRemoteParticipants] = useState<RemoteParticipantView[]>([]);

  const roomRef = useRef<Room | null>(null);
  const tokenRefreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const hasStartedRef = useRef(false);

  const callKind = type === "audio" ? "AUDIO" : "VIDEO";

  const clearTokenRefreshTimer = useCallback(() => {
    if (tokenRefreshTimerRef.current) {
      clearTimeout(tokenRefreshTimerRef.current);
      tokenRefreshTimerRef.current = null;
    }
  }, []);

  const cleanupCall = useCallback(() => {
    clearTokenRefreshTimer();
    roomRef.current?.disconnect();
    roomRef.current = null;
    setLocalVideoTrack(null);
    setRemoteParticipants([]);
    setIsConnected(false);
    setIsConnecting(false);
  }, [clearTokenRefreshTimer]);

  const scheduleTokenRefresh = useCallback(() => {
    clearTokenRefreshTimer();

    tokenRefreshTimerRef.current = setTimeout(async () => {
      try {
        const response = await ChatsService.getCallToken({
          conversationId,
          token: getAuthToken(),
        });
        const livekit = extractCallData(response)?.livekit;
        const currentRoom = roomRef.current;

        if (livekit?.url && livekit?.token && currentRoom) {
          currentRoom.disconnect();
          await currentRoom.connect(livekit.url, livekit.token);
        }

        scheduleTokenRefresh();
      } catch (error) {
        console.error("Token refresh failed:", error);
        tokenRefreshTimerRef.current = setTimeout(scheduleTokenRefresh, 30 * 1000);
      }
    }, 510 * 1000);
  }, [clearTokenRefreshTimer, conversationId]);

  const connectToLiveKit = useCallback(
    async (serverUrl: string, accessToken: string) => {
      cleanupCall();
      setIsConnecting(true);

      const roomInstance = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      const upsertRemoteTrack = (participant: any, track: any) => {
        setRemoteParticipants((prev) => {
          const existing = prev.find((item) => item.identity === participant.identity);
          const nextTrack = (tracks: any[]) =>
            tracks.some((item) => item.sid === track.sid || item === track)
              ? tracks
              : [...tracks, track];

          if (!existing) {
            return [
              ...prev,
              {
                identity: participant.identity,
                name: participant.name || participant.identity,
                tracks: nextTrack([]),
              },
            ];
          }

          return prev.map((item) =>
            item.identity === participant.identity
              ? { ...item, name: participant.name || item.name, tracks: nextTrack(item.tracks) }
              : item,
          );
        });
      };

      roomInstance.on(RoomEvent.ParticipantConnected, (participant) => {
        setStatusText(`${participant.name || participant.identity} joined`);
        setRemoteParticipants((prev) =>
          prev.some((item) => item.identity === participant.identity)
            ? prev
            : [
                ...prev,
                {
                  identity: participant.identity,
                  name: participant.name || participant.identity,
                  tracks: [],
                },
              ],
        );
      });

      roomInstance.on(RoomEvent.ParticipantDisconnected, (participant) => {
        setRemoteParticipants((prev) =>
          prev.filter((item) => item.identity !== participant.identity),
        );
        setStatusText(`${participant.name || participant.identity} left`);
      });

      roomInstance.on(RoomEvent.TrackSubscribed, (track, _publication, participant) => {
        upsertRemoteTrack(participant, track);
      });

      roomInstance.on(RoomEvent.TrackUnsubscribed, (track, _publication, participant) => {
        track.detach();
        setRemoteParticipants((prev) =>
          prev.map((item) =>
            item.identity === participant.identity
              ? { ...item, tracks: item.tracks.filter((savedTrack) => savedTrack !== track) }
              : item,
          ),
        );
      });

      roomInstance.on(RoomEvent.Disconnected, () => {
        setIsConnected(false);
        setStatusText("Disconnected");
      });

      roomInstance.on(RoomEvent.Reconnecting, () => {
        setStatusText("Reconnecting...");
      });

      roomInstance.on(RoomEvent.Reconnected, () => {
        setStatusText("Reconnected");
      });

      await roomInstance.connect(serverUrl, accessToken);
      roomRef.current = roomInstance;
      setIsConnected(true);
      setIsConnecting(false);

      try {
        await roomInstance.localParticipant.setMicrophoneEnabled(true);
        setMicEnabled(true);
      } catch (error) {
        setMicEnabled(false);
        showErrorToast("Microphone is not available");
      }

      if (callKind === "VIDEO") {
        try {
          await roomInstance.localParticipant.setCameraEnabled(true);
          setCameraEnabled(true);
          const videoPublication = Array.from(
            roomInstance.localParticipant.videoTrackPublications.values(),
          ).find((publication) => !publication.isMuted && publication.track);

          setLocalVideoTrack((videoPublication?.track as LocalVideoTrack) || null);
        } catch (error) {
          setCameraEnabled(false);
          showErrorToast("Camera is not available. Continuing with audio.");
        }
      }

      setStatusText(`${callKind === "VIDEO" ? "Video" : "Audio"} call connected`);
      scheduleTokenRefresh();
    },
    [callKind, cleanupCall, scheduleTokenRefresh],
  );

  const startCall = useCallback(async () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setStatusText(`${type === "audio" ? "Audio" : "Video"} call connecting...`);

    try {
      const token = getAuthToken();
      const response = isIncoming
        ? await ChatsService.joinCall({ conversationId, token })
        : await ChatsService.startCall({
            conversationId,
            token,
            data: { kind: callKind },
          });

      const livekit = extractCallData(response)?.livekit;

      if (!livekit?.url || !livekit?.token) {
        throw new Error("LiveKit connection details are missing");
      }

      await connectToLiveKit(livekit.url, livekit.token);
    } catch (error) {
      console.error("Failed to start call:", error);
      showErrorToast("Failed to start call");
      setStatusText("Failed to connect");
      setIsConnecting(false);
      setTimeout(onCallEnd, 1500);
    }
  }, [callKind, connectToLiveKit, conversationId, isIncoming, onCallEnd, type]);

  useEffect(() => {
    void startCall();
    return cleanupCall;
  }, [cleanupCall, startCall]);

  useEffect(() => {
    if (!localVideoTrack || !localVideoRef.current) return;

    localVideoTrack.attach(localVideoRef.current);
    return () => {
      localVideoTrack.detach(localVideoRef.current);
    };
  }, [localVideoTrack]);

  const toggleMic = useCallback(async () => {
    const room = roomRef.current;
    if (!room) return;

    try {
      const newState = !micEnabled;
      await room.localParticipant.setMicrophoneEnabled(newState);
      setMicEnabled(newState);

      await ChatsService.updateMediaState({
        conversationId,
        token: getAuthToken(),
        data: { microphone: newState },
      });
    } catch (error) {
      console.error("Failed to toggle mic:", error);
      showErrorToast("Failed to update microphone");
    }
  }, [conversationId, micEnabled]);

  const toggleCamera = useCallback(async () => {
    const room = roomRef.current;
    if (!room || type !== "video") return;

    try {
      const newState = !cameraEnabled;
      await room.localParticipant.setCameraEnabled(newState);
      setCameraEnabled(newState);

      const videoPublication = Array.from(
        room.localParticipant.videoTrackPublications.values(),
      ).find((publication) => !publication.isMuted && publication.track);
      setLocalVideoTrack(newState ? ((videoPublication?.track as LocalVideoTrack) || null) : null);

      await ChatsService.updateMediaState({
        conversationId,
        token: getAuthToken(),
        data: { camera: newState },
      });
    } catch (error) {
      console.error("Failed to toggle camera:", error);
      showErrorToast("Failed to update camera");
    }
  }, [cameraEnabled, conversationId, type]);

  const leaveCall = useCallback(async () => {
    try {
      cleanupCall();
      await ChatsService.leaveCall({
        conversationId,
        token: getAuthToken(),
      });
    } catch (error) {
      console.error("Failed to leave call:", error);
    } finally {
      onCallEnd();
    }
  }, [cleanupCall, conversationId, onCallEnd]);

  const remoteAudioTracks = useMemo(
    () =>
      remoteParticipants.flatMap((participant) =>
        participant.tracks
          .filter((track) => track.kind === "audio")
          .map((track) => ({ participantId: participant.identity, track })),
      ),
    [remoteParticipants],
  );

  const remoteVideoParticipants = useMemo(
    () =>
      remoteParticipants.map((participant) => ({
        ...participant,
        videoTrack: participant.tracks.find((track) => track.kind === "video"),
        hasAudio: participant.tracks.some((track) => track.kind === "audio"),
      })),
    [remoteParticipants],
  );

  if (!isConnected && !isConnecting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      {remoteAudioTracks.map(({ participantId, track }) => (
        <RemoteAudio key={`${participantId}-${track.sid || "audio"}`} track={track} />
      ))}

      <div className="relative flex h-full max-h-[640px] w-full max-w-[420px] flex-col overflow-hidden rounded-xl border border-[#1a2336] bg-[#0a1929]">
        <div className="flex items-center justify-between border-b border-[#1a2336] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5f6ca0] text-white">
              {type === "audio" ? <Phone size={18} /> : <Video size={18} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {type === "audio" ? "Audio Call" : "Video Call"}
              </p>
              <p className="truncate text-xs text-[#B2B5B8]">{statusText}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={leaveCall}
            className="rounded-lg p-2 text-white hover:bg-[#1a2336]"
            aria-label="Close call"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          {type === "video" ? (
            <div className="absolute inset-0 flex items-center justify-center p-4">
              {remoteVideoParticipants.length === 0 ? (
                <p className="text-sm text-[#B2B5B8]">Waiting for participants...</p>
              ) : (
                <div className="grid w-full grid-cols-1 gap-3">
                  {remoteVideoParticipants.map((participant) => (
                    <div
                      key={participant.identity}
                      className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[#17212c]"
                    >
                      {participant.videoTrack ? (
                        <RemoteVideo track={participant.videoTrack} />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center">
                          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-[#5f6ca0] text-lg font-semibold text-white">
                            {participant.name.slice(0, 1).toUpperCase()}
                          </div>
                          <p className="max-w-full truncate px-3 text-xs text-white">
                            {participant.name}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {localVideoTrack ? (
                <div className="absolute bottom-4 right-4 h-32 w-24 overflow-hidden rounded-lg border border-white/20 bg-[#17212c]">
                  <video ref={localVideoRef} autoPlay muted playsInline className="h-full w-full object-cover" />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
              <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[#5f6ca0] text-white">
                <Phone size={34} />
              </div>
              <div className="w-full space-y-4">
                {remoteVideoParticipants.length === 0 ? (
                  <p className="text-center text-sm text-[#B2B5B8]">Waiting for participants...</p>
                ) : (
                  remoteVideoParticipants.map((participant) => (
                    <div key={participant.identity} className="flex flex-col items-center">
                      <div className="mb-3 flex size-16 items-center justify-center rounded-full bg-[#5f6ca0] font-semibold text-white">
                        {participant.name.slice(0, 1).toUpperCase()}
                      </div>
                      <p className="max-w-full truncate text-white">{participant.name}</p>
                      <p className="text-xs text-[#B2B5B8]">
                        {participant.hasAudio ? "Audio active" : "Audio off"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-[#1a2336] px-4 py-4">
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={toggleMic}
              className={cn(
                "relative rounded-full p-3 text-white transition-transform hover:bg-[#17212c] active:scale-95",
                !micEnabled && "bg-red-600 hover:bg-red-700",
              )}
              aria-label={micEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {micEnabled ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            <button
              type="button"
              onClick={leaveCall}
              className="rounded-full bg-red-600 p-4 text-white transition-transform hover:bg-red-700 active:scale-95"
              aria-label="End call"
            >
              <PhoneOff size={22} />
            </button>

            {type === "video" ? (
              <button
                type="button"
                onClick={toggleCamera}
                className={cn(
                  "rounded-full p-3 text-white transition-transform hover:bg-[#17212c] active:scale-95",
                  !cameraEnabled && "bg-red-600 hover:bg-red-700",
                )}
                aria-label={cameraEnabled ? "Turn camera off" : "Turn camera on"}
              >
                {cameraEnabled ? <Video size={20} /> : <VideoOff size={20} />}
              </button>
            ) : null}

            <button
              type="button"
              onClick={() => setSpeakerEnabled((value) => !value)}
              className={cn(
                "rounded-full p-3 text-white transition-transform hover:bg-[#17212c] active:scale-95",
                !speakerEnabled && "bg-red-600 hover:bg-red-700",
              )}
              aria-label="Toggle speaker"
            >
              <Volume2 size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
