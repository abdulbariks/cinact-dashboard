"use client";

import React, { useEffect, useMemo, useState } from "react";
import EyeIcon from "@/components/icons/SuperAdmindashboard/EyeIcon";
import Image from "next/image";
import Link from "next/link";
import GreenTikIcon from "@/components/icons/Community/GreenTikIcon";
import RedCross from "@/components/icons/Community/RedCross";
import { moderationRequestData } from "@/public/demoData/modaretionRequestData";
import { parseCookies } from "nookies";
import { showErrorToast, showSuccessToast } from "@/lib/hotToast";
import { AdminCommunityService } from "@/service/user/user.service";
import moment from "moment";
import PaginationPage from "@/components/reusable/PaginationPage";

type ModaretionRequestProps = {
  search?: string;
  enabled?: boolean;
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

export default function ModaretionRequest({
  search = "",
  selectedRole = "all-role",
  selectedStatus = "all-status",
}: ModaretionRequestProps) {
  const [requestPosts, setRequestPosts] = useState<PostCardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [failedAvatars, setFailedAvatars] = useState<Record<string, boolean>>(
    {},
  );

  // console.log("requestPosts============", requestPosts);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";

      // Clean parameters: if "all-status", send empty string or handle as per API requirements
      const statusParam = selectedStatus === "all-status" ? "" : selectedStatus;
      const roleParam = selectedRole === "all-role" ? "" : selectedRole;

      const response = await AdminCommunityService.getAllRequestedPosts({
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
        setRequestPosts(mappedPosts);
        setTotalItems(response.data.meta_data?.total || 0);
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to load request posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, itemsPerPage, search, selectedRole, selectedStatus]);

  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const handleDelete = async (postId: string) => {
    // Optional: Add a confirmation dialog
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const cookies = parseCookies();
      const token = cookies.token || cookies.accessToken || "";
      const response = await AdminCommunityService.deletePost(postId, token);

      if (response?.data?.success) {
        showSuccessToast(response.data.message || "Post deleted successfully");
        // Refresh the list after deletion
        fetchPosts();
      }
    } catch (error: any) {
      showErrorToast(error?.data?.message || "Failed to delete post");
    }
  };

  return (
    <div className=" space-y-3">
      {requestPosts.map((post) => (
        <div
          key={post.id}
          className="p-4 border border-[#383e57] rounded-xl bg-[#030C15] flex items-start justify-between"
        >
          <div className=" flex items-start gap-3.5">
            <div>
              {!post.avatar || failedAvatars[post.id] ? (
                <div className="size-10 rounded-full bg-[#1a2432] flex items-center justify-center text-xs text-[#E6E7E8] font-semibold">
                  {getNameInitials(post.user_name)}
                </div>
              ) : (
                <Image
                  src={post.avatar}
                  alt={post.user_name}
                  width={40}
                  height={40}
                  className="rounded-full object-cover size-10"
                  unoptimized
                  onError={() =>
                    setFailedAvatars((prev) => ({ ...prev, [post.id]: true }))
                  }
                />
              )}
            </div>

            <div>
              <div className=" flex items-center gap-2">
                <h3 className=" text-base text-[#A5A5AB] font-medium">
                  {post.user_name}
                </h3>
                <p
                  className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getTypeBadgeColors(post.role).bg} ${getTypeBadgeColors(post.role).text}`}
                >
                  {post.role}
                </p>
                <p
                  className={` text-sm py-0.5 px-1.5 rounded-lg inline-block ${getStatusBadgeColors(post.status).bg} ${getStatusBadgeColors(post.status).text}`}
                >
                  {post.status}
                </p>
                <p className=" text-sm text-[#777980] py-0.5 px-1.5   inline-block ">
                  {post.date}
                </p>
              </div>
              <p className=" text-[#A5A5AB] text-sm mt-3">{post.content}</p>
            </div>
          </div>

          <div className=" flex items-center gap-2">
            <Link
              href={`/dashboard/community/${post.id}`}
              className="p-1.5 bg-[#0e1825] rounded-lg"
            >
              <EyeIcon />
            </Link>
            <button className=" cursor-pointer p-1.75 bg-[#0e1825] rounded-lg">
              <GreenTikIcon />
            </button>
            <button
              onClick={() => handleDelete(post.id)}
              className=" cursor-pointer p-3 bg-[#0e1825] rounded-lg"
            >
              <RedCross />
            </button>
          </div>
        </div>
      ))}

      <PaginationPage
        totalPages={totalPages}
        dataLength={requestPosts.length}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
      />
    </div>
  );
}
