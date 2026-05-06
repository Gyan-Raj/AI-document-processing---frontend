"use client";

import CreateProject from "./CreateProject";

export default function Dashboard() {
  return (
    <div className="flex w-full p-2 h-[calc(100vh-4rem)]">
      <CreateProject />
    </div>
  );
}
