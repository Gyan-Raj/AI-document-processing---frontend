"use client";

import { ProjectType } from "../(protected)/all-projects/page";
import { formatDateToLocal } from "@/utils/helper";

export default function ProjectsTable({
  projects,
  handleSelectProject,
  handleDeleteProject,
}: {
  projects: ProjectType[];
  handleSelectProject: (project_id: string) => void;
  handleDeleteProject: (project_id: string) => void;
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
          {projects.map((project, index) => (
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
              <td className="px-2 py-2 text-sm text-gray-700">{project.id}</td>

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
                  >
                    Open
                  </button>

                  <button
                    className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-600 active:scale-95 cursor-pointer"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
