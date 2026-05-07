"use client";

import { ButtonWithSpinner } from "@/app/components/ButtonWithSpinner";
import ProjectsTable from "@/app/components/ProjectsTable";
import useDebounce from "@/hooks/useDebounce";
import {
  deleteProject,
  getAllProjects,
  searchProject,
} from "@/services/project.service";
import { formatDateToLocal } from "@/utils/helper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type ProjectType = {
  id: string;
  project_name: string;
  created_at: string;
  updated_at: string;
};
export default function AllProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [queryText, setQueryText] = useState<string | null>("");
  const router = useRouter();
  const [isProjectActionDisabled, setIsProjectActionDisabled] =
    useState<boolean>(false);

  const debouncedSearch = useDebounce(queryText ?? "", 500);

  const fetchAllProjects = async () => {
    try {
      if (!debouncedSearch) {
        setIsLoading(true);
        const res = await getAllProjects();
        setProjects(res.projects);
      } else {
        setIsSearching(true);
        const res = await searchProject({ query: debouncedSearch });
        setProjects(res.projects); // ✅ FIX
      }
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, [debouncedSearch]);

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
    <div className="flex flex-col w-full h-full px-4 py-2">
      <input
        type="text"
        name="user_name"
        id="user_name"
        className="focus:outline-0 border border-gray-400 w-full px-2 py-1 rounded-xl"
        value={queryText ?? ""}
        onChange={(e) => setQueryText(e.target.value)}
        // disabled={isSearching}
        placeholder="Search through the projects based on project_id, or project_name"
      />
      <ButtonWithSpinner
        text="+ Create Project"
        onClick={() => router.push("/dashboard")}
        className="w-full my-2"
      />

      <ProjectsTable
        projects={projects}
        isLoading={isLoading || isSearching}
        handleDeleteProject={handleDeleteProject}
        handleSelectProject={handleSelectProject}
        isActionDisabled={isProjectActionDisabled}
      />
    </div>
  );
}
