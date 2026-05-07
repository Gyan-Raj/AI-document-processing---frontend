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
import { ButtonWithSpinner } from "@/app/components/ButtonWithSpinner";

export default function CreateProject() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isProjectActionDisabled, setIsProjectActionDisabled] =
    useState<boolean>(false);

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
      setIsCreating(true);
      const res = await createProject({ project_name: projectName });
      const projectId = res.project.id;
      router.push(`/project/${projectId}`);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsCreating(false);
    }
  };
  const handleSeeAllProjects = async () => {
    router.replace("/all-projects");
  };

  const handleSelectProject = (id: string) => {
    router.push(`/project/${id}`);
  };

  const handleDeleteProject = async (project_id: string) => {
    if (!project_id) return;
    setIsProjectActionDisabled(true);
    try {
      await deleteProject({ project_id });
      await fetchAllProjects();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsProjectActionDisabled(false);
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateProject();
            }
          }}
          disabled={isCreating}
        />
        <ButtonWithSpinner
          text="+ Create Project"
          loadingText="Creating new project"
          onClick={handleCreateProject}
          isLoading={isCreating}
          className="w-[30%]"
        />
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="mt-2 p-2 border border-gray-400 rounded-xl">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <b>Your last 10 projects:</b>
            <ButtonWithSpinner
              text="View All Projects"
              onClick={handleSeeAllProjects}
              className="w-[30%]"
            />
          </div>
          <ProjectsTable
            projects={projects}
            handleDeleteProject={handleDeleteProject}
            handleSelectProject={handleSelectProject}
            isLoading={isLoading}
            isActionDisabled={isProjectActionDisabled}
          />
        </div>
      </div>
    </div>
  );
}
