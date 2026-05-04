"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProject } from "@/services/project.service";

export default function CreateProject() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const handleCreateProject = async () => {
    if (!projectName) {
      setError("Project Name is required");
      return;
    }
    try {
      const res = await createProject({ projectName });
      const projectId = res.project.id;
      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleSeeAllProjects = async () => {
    router.replace("/all-projects");
  };

  return (
    <div className="w-full px-4">
      <div className="flex gap-2 w-full">
        <input
          name="userName"
          id="userName"
          className="focus:outline-0 border border-gray-400 w-full sm:w-[80%] lg:w-[60%] px-2 py-1"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Give a project name"
          onFocus={() => setError("")}
        />
        <button
          onClick={handleCreateProject}
          className="bg-gray-500  text-white px-4 py-2 rounded cursor-pointer"
        >
          + Create Project
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mt-2">
        <button
          onClick={handleSeeAllProjects}
          className="bg-gray-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          View All Projects
        </button>
      </div>
    </div>
  );
}
