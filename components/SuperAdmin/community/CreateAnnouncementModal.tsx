"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { AdminCommunityService } from "@/service/user/user.service";
import PlusIcon from "@/components/icons/SuperAdmindashboard/PlusIcon";
import CrossIcon from "@/components/icons/others/CrossIcon";

type CreateAnnouncementModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

export default function CreateAnnouncementModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateAnnouncementModalProps) {
  const [postType, setPostType] = useState<"POST" | "POLL">("POST");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
  const [pollOptions, setPollOptions] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      attachmentPreviews.forEach((preview) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, []);

  const handleSubmit = async () => {
    if (!content.trim()) {
      showErrorToast("Content is required");
      return;
    }

    if (postType === "POLL") {
      const validOptions = pollOptions.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        showErrorToast("Poll requires at least 2 options");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      const payload = {
        post_type: postType,
        content,
        attachments: attachments.length > 0 ? attachments : undefined,
        poll_options:
          postType === "POLL"
            ? pollOptions.filter((opt) => opt.trim())
            : undefined,
      };

      const response = await AdminCommunityService.createAnnouncement({
        token,
        ...payload,
      });

      if (response?.data?.success) {
        showSuccessToast("Announcement created successfully");
        onOpenChange(false);
        resetForm();
        onSuccess?.();
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to create announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setContent("");
    setAttachments([]);
    setAttachmentPreviews([]);
    setPollOptions([""]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Append new files to existing attachments instead of replacing
    const newAttachments = [...attachments, ...files];
    setAttachments(newAttachments);

    // Create preview URLs for all files
    const newPreviews = [...attachmentPreviews];
    files.forEach((file) => {
      newPreviews.push(URL.createObjectURL(file));
    });
    setAttachmentPreviews(newPreviews);
  };

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments];
    const newPreviews = [...attachmentPreviews];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(attachmentPreviews[index]);

    newAttachments.splice(index, 1);
    newPreviews.splice(index, 1);

    setAttachments(newAttachments);
    setAttachmentPreviews(newPreviews);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, ""]);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 1) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const updatePollOption = (index: number, title: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = title;
    setPollOptions(newOptions);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        className="w-full max-w-2xl rounded-2xl border-none bg-[#0A1726] p-6 text-white max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">
            Create Announcement
          </h2>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg bg-[#3d4566] hover:bg-[#505b86] cursor-pointer"
          >
            <CrossIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="postType"
                value="POST"
                checked={postType === "POST"}
                onChange={() => setPostType("POST")}
                className="w-4 h-4 text-[#E9201D] bg-[#0a1726] border-[#3D4566]"
              />
              <span className="text-sm text-[#A5A5AB]">POST</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="postType"
                value="POLL"
                checked={postType === "POLL"}
                onChange={() => setPostType("POLL")}
                className="w-4 h-4 text-[#E9201D] bg-[#0a1726] border-[#3D4566]"
              />
              <span className="text-sm text-[#A5A5AB]">POLL</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#A5A5AB] mb-2">
              Content
            </label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your announcement..."
              className="w-full bg-[#030C15] border border-[#3D4566] text-white min-h-25 resize-none"
            />
          </div>

          {postType === "POST" && (
            <div>
              <label className="block text-sm font-medium text-[#A5A5AB] mb-2">
                Attachments
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="attachment-upload"
                />
                <label
                  htmlFor="attachment-upload"
                  className="flex items-center gap-2 px-4 py-2 bg-[#030C15] border border-[#3D4566] rounded-lg cursor-pointer hover:bg-[#0a1726] text-white text-sm"
                >
                  <PlusIcon />
                  Add Files
                </label>
              </div>

              {attachmentPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3 md:grid-cols-4">
                  {attachmentPreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group aspect-video overflow-hidden rounded-lg"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#E9201D] text-white cursor-pointer shadow"
                      >
                        <CrossIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {postType === "POLL" && (
            <div>
              <label className="block text-sm font-medium text-[#A5A5AB] mb-2">
                Poll Options
              </label>
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 bg-[#030C15] border border-[#3D4566] text-white"
                    />
                    {pollOptions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePollOption(index)}
                        className="p-2 rounded-lg bg-[#E9201D] hover:bg-red-600 text-white"
                      >
                        <CrossIcon />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPollOption}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#3d4566] hover:bg-[#505b86] rounded-lg text-white text-sm"
                >
                  <PlusIcon />
                  Add Option
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 bg-[#07121d] hover:bg-red-100 border border-[#3D4566] text-white cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#E9201D] hover:bg-red-600 text-white cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
