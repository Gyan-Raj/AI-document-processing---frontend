"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getRecentProjects,
} from "@/services/project.service";
import { ProjectType } from "../all-projects/page";
import ProjectsTable from "@/app/components/ProjectsTable";

export default function CreateProject() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAllProjects = async () => {
    try {
      setIsLoading(true);
      const res = await getRecentProjects();
      setProjects(res.projects);
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchAllProjects();
  }, []);
  const handleCreateProject = async () => {
    if (!projectName) {
      setError("Project Name is required");
      return;
    }
    try {
      const res = await createProject({ project_name: projectName });
      const projectId = res.project.id;
      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const handleSeeAllProjects = async () => {
    router.replace("/all-projects");
  };

  const handleSelectProject = (id: string) => {
    router.push(`/project/${id}`);
  };

  const handleDeleteProject = async (project_id: string) => {
    try {
      await deleteProject({ project_id });
      await fetchAllProjects();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="flex gap-2 w-full mt-2 p-2 border border-gray-400 rounded-xl">
        <input
          name="user_name"
          id="user_name"
          className="focus:outline-0 border border-gray-400 w-[70%] px-2 py-1 rounded-xl"
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Give a project name"
          onFocus={() => setError("")}
        />
        <button
          onClick={handleCreateProject}
          className="bg-green-400  text-white px-4 py-0 rounded cursor-pointer w-[30%]  transition hover:bg-green-600 active:scale-95 "
        >
          + Create Project
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mt-2 p-2 border border-gray-400 rounded-xl">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <b>Your last 10 projects:</b>
            <button
              onClick={handleSeeAllProjects}
              className="bg-green-400  text-white px-4 py-1 rounded cursor-pointer w-[30%]  transition hover:bg-green-600 active:scale-95 "
            >
              View All Projects
            </button>
          </div>
          <ProjectsTable
            projects={projects}
            handleDeleteProject={handleDeleteProject}
            handleSelectProject={handleSelectProject}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
