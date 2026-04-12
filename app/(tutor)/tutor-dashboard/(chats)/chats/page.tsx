import React from "react";

export default function ChatsPage() {
  return (
    <section className="hidden min-h-[80vh] items-center justify-center rounded-2xl bg-[#0a1726] p-6 text-center text-card-foreground lg:flex">
      <div className="max-w-sm">
        <h2 className="text-lg font-semibold text-white">
          Select a conversation
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a user from the list to open the chat area.
        </p>
      </div>
    </section>
  );
}
