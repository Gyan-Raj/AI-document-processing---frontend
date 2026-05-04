"use client";

import { deleteProject, getAllProjects } from "@/services/project.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ProjectType = {
  id: string;
  project_name: string;
  contract_path: string | null;
  risk_path: string | null;
  contract_name: string | null;
};
export default function AllProjects() {
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchAllProjects = async () => {
    setIsLoading(true);
    try {
      const res = await getAllProjects();
      setProjects(res.projects);
    } catch (error) {
      console.error("Error fetching project details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProjects();
  }, []);
  if (isLoading) return <>Loading...</>;

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
    <div className="flex flex-col w-full h-full px-4 py-2">
      {projects.length <= 0 ? (
        <>
          No project to show
          <button
            className="bg-gray-400 cursor-pointer text-white py-2 mt-2 disabled:opacity-50"
            onClick={() => router.push("/dashboard")}
          >
            + Create project
          </button>
        </>
      ) : (
        <ol className="list-decimal pl-5 divide-y divide-gray-200">
          {projects.map((project) => (
            <li key={project.id}>
              <div className="flex justify-between my-2 items-center">
                {project.project_name}
                <div className="flex gap-2">
                  <button
                    className="text-white px-4 py-1 rounded bg-green-500 cursor-pointer"
                    onClick={() => handleSelectProject(project.id)}
                  >
                    Open
                  </button>
                  <button
                    className="text-white px-4 py-1 rounded bg-red-500 cursor-pointer"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete Project
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
