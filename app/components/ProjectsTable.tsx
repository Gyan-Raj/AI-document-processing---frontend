"use client";

import { ProjectType } from "../(protected)/all-projects/page";
import { formatDateToLocal } from "@/utils/helper";
import { Spinner } from "./ButtonWithSpinner";

export default function ProjectsTable({
  projects,
  handleSelectProject,
  handleDeleteProject,
  isLoading,
  isActionDisabled,
}: {
  projects: ProjectType[];
  handleSelectProject: (project_id: string) => void;
  handleDeleteProject: (project_id: string) => void;
  isLoading: boolean;
  isActionDisabled: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              S. No.
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              Project Name
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              Project No.
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              Created On
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              Updated On
            </th>
            <th className="px-2 py-2 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            <tr>
              <td
                className="px-2 py-4 text-center text-sm text-gray-700"
                colSpan={6}
              >
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500" />
                  <span>Fetching your projects</span>
                </div>
              </td>
            </tr>
          ) : projects.length === 0 ? (
            <tr>
              <td
                className="px-2 py-4 text-center text-sm text-gray-700"
                colSpan={6}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>No projects found</span>
                </div>
              </td>
            </tr>
          ) : (
            projects.map((project, index) => (
              <tr
                key={project.id}
                className={`transition hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                }`}
              >
                <td className="px-2 py-2 text-sm text-gray-700">{index + 1}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">
                  {project.project_name}
                </td>
                <td className="px-2 py-2 text-sm text-gray-700">
                  {project.id}
                </td>

                <td className="px-2 py-2 text-sm text-gray-600">
                  {formatDateToLocal(project.created_at)}
                </td>

                <td className="px-2 py-2 text-sm text-gray-600">
                  {formatDateToLocal(project.updated_at)}
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-3">
                    <button
                      className="rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-green-600 active:scale-95 cursor-pointer"
                      onClick={() => handleSelectProject(project.id)}
                      disabled={isActionDisabled}
                    >
                      Open
                    </button>

                    <button
                      className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95 cursor-pointer"
                      onClick={() => handleDeleteProject(project.id)}
                      disabled={isActionDisabled}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
