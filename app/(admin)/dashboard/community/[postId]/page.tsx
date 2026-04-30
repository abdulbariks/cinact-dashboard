import React from "react";
import { notFound } from "next/navigation";
import PostDetails from "@/components/icons/Community/PostDetails";
import { allPostsData } from "@/public/demoData/AllPostsData";

type PageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { postId } = await params;

  if (!postId) {
    notFound();
  }

  return <PostDetails postId={postId} />;
}
