"use client";

import CreateProject from "./CreateProject";

export default function Dashboard() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
      <CreateProject />
    </div>
  );
}
