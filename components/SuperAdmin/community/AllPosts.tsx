"use client";

import CommentIcon from "@/components/icons/Community/CommentIcon";
import FlagIcon from "@/components/icons/Community/FlagIcon";
import LikeIcon from "@/components/icons/Community/LikeIcon";
import TrashIconRed from "@/components/icons/course-management/TrashIconRed";
import EyeIcon from "@/components/icons/SuperAdmindashboard/EyeIcon";
import PaginationPage from "@/components/reusable/PaginationPage";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import warnigImg from "@/public/admin-dashboard/warning-img.png";
import CrossIcon from "@/components/icons/others/CrossIcon";
import TrashIcon from "@/components/icons/others/TrashIcon";

import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import moment from "moment";
import { AdminCommunityService } from "@/service/user/user.service";

type AllPostsProps = {
  search?: string;
  selectedRole?: string;
  selectedStatus?: string;
};

type PostCardItem = {
  id: string;
  user_name: string;
  avatar: string;
  role: string;
  status: string;
  date: string;
  likes: number;
  comments: number;
  content: string;
};

// Updated Mapper to match your JSON structure
const mapApiPost = (post: any): PostCardItem => ({
  id: post.id,
  user_name: post.author?.name || "Unknown User",
  avatar: post.author?.avatar || "",
  // Extracting role from the role_users array
  role: post.author?.role_users?.[0]?.role?.name || "STUDENT",
  status: post.status || "PENDING",
  date: post.createdAt ? moment(post.createdAt).format("DD MMM YYYY") : "-",
  likes: Number(post.likes) || 0,
  comments: Number(post.comments) || 0,
  content: String(post.content || "-"),
});

// Helper for Initials
const getNameInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Badge Colors (Kept from your original code)
const getTypeBadgeColors = (role: string) => {
  const t = role.toLowerCase();
  if (t === "student") return { bg: "bg-[#171c15]", text: "text-[#CC8718]" };
  if (t === "admin") return { bg: "bg-[#1c0b13]", text: "text-[#E9201D]" };
  if (t === "almuni") return { bg: "bg-[#06102a]", text: "text-[#6774FF]" };
  return { bg: "bg-[#06102a]", text: "text-[#6774FF]" };
};

const getStatusBadgeColors = (status: string) => {
  const s = status.toLowerCase();
  if (s === "approved") return { bg: "bg-[#051f19]", text: "text-[#18cc3f]" };
  if (s === "request") return { bg: "bg-[#5a4a1a]", text: "text-[#fbbf24]" };
  if (s === "rejected") return { bg: "bg-[#1c0b13]", text: "text-[#E9201D]" };
  if (s === "announcement")
    return { bg: "bg-[#051f19]", text: "text-[#18cc3f]" };
  return { bg: "bg-[#1c0b13]", text: "text-[#E9201D]" };
};

export default function AllPosts({
  search = "",
  selectedRole = "all-role",
  selectedStatus = "all-status",
}: AllPostsProps) {
  const [posts, setPosts] = useState<PostCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [selectedPostToDelete, setSelectedPostToDelete] = useState<
    string | null
  >(null);

  // console.log("posts============", posts);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      // Clean parameters: if "all-status", send empty string or handle as per API requirements
      const statusParam = selectedStatus === "all-status" ? "" : selectedStatus;
      const roleParam = selectedRole === "all-role" ? "" : selectedRole;

      const response = await AdminCommunityService.getAllPosts({
        token,
        status: statusParam,
        role: roleParam,
        page: currentPage,
        limit: itemsPerPage,
        search: search,
      });

      // console.log("response=============", response);

      if (response?.data?.success) {
        const mappedPosts = response.data.data.map(mapApiPost);
        setPosts(mappedPosts);
        setTotalItems(response.data.meta_data?.total || 0);
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, itemsPerPage, search, selectedRole, selectedStatus]);

  useEffect(() => {
    const handleAnnouncementCreated = () => {
      fetchPosts();
    };
    window.addEventListener("announcement-created", handleAnnouncementCreated);
    return () => {
      window.removeEventListener(
        "announcement-created",
        handleAnnouncementCreated,
      );
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleDelete = async (postId: string) => {
    // Open confirmation dialog for delete
    setSelectedPostToDelete(postId);
    setIsWarningOpen(true);
  };

  // Actual deletion performed after confirming in dialog
  const performDelete = async () => {
    if (!selectedPostToDelete) return;
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCommunityService.deletePost(
        selectedPostToDelete,
        token,
      );

      if (response?.data?.success) {
        showSuccessToast(response.data.message || "Post deleted successfully");
        // Refresh the list after deletion
        fetchPosts();
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to delete post");
    } finally {
      setIsWarningOpen(false);
      setSelectedPostToDelete(null);
    }
  };

  return (
    <div className="space-y-3">
      {isLoading ? (
        <div className="text-white p-8 sm:p-10 text-center">
          Loading posts...
        </div>
      ) : posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post.id}
            className="p-3 sm:p-4 border border-[#383e57] rounded-xl bg-[#030C15] flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0"
          >
            <div className="flex items-start gap-2.5 sm:gap-3.5">
              <div>
                {!post.avatar || failedAvatars[post.id] ? (
                  <div className="size-9 sm:size-10 rounded-full bg-[#1a2432] flex items-center justify-center text-xs text-[#E6E7E8] font-semibold">
                    {getNameInitials(post.user_name)}
                  </div>
                ) : (
                  <Image
                    src={post.avatar}
                    alt={post.user_name}
                    width={40}
                    height={40}
                    className="rounded-full object-cover size-9 sm:size-10"
                    unoptimized
                    onError={() =>
                      setFailedAvatars((prev) => ({ ...prev, [post.id]: true }))
                    }
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <h3 className="text-sm sm:text-base text-[#A5A5AB] font-medium">
                    {post.user_name}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm py-0.5 px-1 rounded-lg inline-block ${getTypeBadgeColors(post.role).bg} ${getTypeBadgeColors(post.role).text}`}
                  >
                    {post.role}
                  </p>
                  <p
                    className={`text-xs sm:text-sm py-0.5 px-1 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}
                  >
                    {post.status}
                  </p>
                  <p className="text-xs sm:text-sm text-[#777980] py-0.5 px-1 inline-block">
                    {post.date}
                  </p>
                </div>
                <p className="text-[#A5A5AB] text-xs sm:text-sm mt-2 sm:mt-3">
                  {post.content}
                </p>
                <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-3">
                  <div className="flex items-center gap-1">
                    <LikeIcon />
                    <p className="text-xs text-[#B2B5B8] font-medium">
                      {post.likes}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <CommentIcon />
                    <p className="text-xs text-[#B2B5B8] font-medium">
                      {post.comments}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 self-end sm:self-auto">
              <Link
                href={`/dashboard/community/${post.id}`}
                className="p-1 sm:p-1.5 bg-[#0e1825] rounded-lg"
              >
                <EyeIcon />
              </Link>
              {/* <button className="p-1.5 sm:p-2.5 bg-[#0e1825] rounded-lg">
                <FlagIcon />
              </button> */}
              <button
                onClick={() => handleDelete(post.id)}
                className="p-1 sm:p-1.5 bg-[#0e1825] rounded-lg cursor-pointer"
              >
                <TrashIconRed />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="p-8 sm:p-10 border border-[#383e57] rounded-xl bg-[#030C15] text-[#A5A5AB] text-center">
          No posts found
        </div>
      )}

      <PaginationPage
        totalPages={totalPages}
        dataLength={posts.length}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
      <Dialog open={isWarningOpen} onOpenChange={setIsWarningOpen}>
        <DialogContent
          hideCloseButton
          className="w-120 max-w-[95vw] rounded-2xl border-none bg-[#0A1726] p-6 sm:p-8 text-white"
        >
          <div className="flex flex-col items-center text-center">
            <Image src={warnigImg} alt="Warning" />
            <h3 className="mt-4 text-lg sm:text-xl font-semibold text-white">
              Delete Post?
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#B2B5B8]">
              Are you sure you want to delete this post?
            </p>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsWarningOpen(false)}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl border border-[#3D4566] px-8 sm:px-11 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#5F6CA0]"
              >
                <CrossIcon />
                Cancel
              </button>
              <button
                type="button"
                onClick={performDelete}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-[#E9201D] px-8 sm:px-11 py-3 sm:py-4 text-xs sm:text-sm font-medium text-white hover:bg-[#ff3b1f]"
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
