"use client";

import FolderStructure from "@/app/components/FolderStructure";
import RiskSummary, { RiskSummaryProps } from "@/app/components/RiskSummary";
import UploadedFolderStructure, {
  UploadedFolderStructureTypes,
} from "@/app/components/UploadedFolderStructure";
import {
  deleteDocument,
  downloadRiskSummary,
  getProjectDetails,
  runAssessmentAndGenerateRiskSummary,
  uploadDocument,
} from "@/services/project.service";
import { useFolderStructureStore } from "@/store/folderStructure.store";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type ProjectType = {
  project_id: string;
  project_name: string;
  contract_path: string;
  risk_path: string;
  contract_name: string;
};
type ProjectProps = {
  project: ProjectType;
  risk_summary: RiskSummaryProps;
  folder_structure: UploadedFolderStructureTypes[];
};

export default function Project() {
  const params = useParams();
  const project_id = Array.isArray(params["project-id"])
    ? params["project-id"][0]
    : params["project-id"];
  if (!project_id) return <>Loading...</>;
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { folderStructure, reset } = useFolderStructureStore();

  const [projectData, setProjectData] = useState<ProjectProps | null>(null);
  const [view, setView] = useState<"project-details" | "risk-assessment">(
    "project-details",
  );

  const fetchProjectDetails = async () => {
    try {
      const res = await getProjectDetails({ project_id });
      setProjectData(res.project);
    } catch (error) {
      console.error("Error fetching project details", error);
    }
  };

  useEffect(() => {
    if (!project_id) return;
    fetchProjectDetails();
  }, [project_id]);

  const uploadEnabled = folderStructure.some((str) =>
    str.files.some((f) => f.type === "contract"),
  );

  const handleUpload = async () => {
    if (!uploadEnabled) return;
    try {
      setIsUploading(true);

      await uploadDocument({
        project_id,
        folderStructure,
      });

      reset(); // reset after upload
      fetchProjectDetails(); // refresh UI
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTriggerGlobalConfigUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleUploadGlobalConfigFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = e.target.files?.[0];

      if (!file) return;

      const folder = projectData?.folder_structure.find(
        (f) => f.folderName === "",
      );
      const configFile = folder?.files.find((file) => file.type === "config");

      const hasConfig = !!configFile;
      if (hasConfig) {
        const configId = configFile?.id;
        await deleteDocument({
          doc_id: configId,
          doc_type: "config",
          project_id
        });
      }

      await uploadDocument({
        project_id,
        folderStructure: [
          {
            folderName: "",
            files: [{ file, fileName: file.name, type: "config" }],
          },
        ],
      });

      fetchProjectDetails();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRunAssessmentAndGenerateRiskSummary = async () => {
    try {
      const payload = {
        project_id,
      };
      await runAssessmentAndGenerateRiskSummary(payload);
      fetchProjectDetails();
      setView("risk-assessment");
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDownloadRiskSummary = async () => {
    try {
      const payload = {
        project_id,
        type: "pdf",
      };
      if (!projectData?.risk_summary) return;
      const res = await downloadRiskSummary(payload);
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `risk_summary.${payload.type}`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  if (!projectData) return <>No data found</>;

  const handleSwitchView = (view: "project-details" | "risk-assessment") => {
    setView(view);
  };

  return (
    <div className="flex flex-col w-full h-full px-4 py-2">
      {projectData.folder_structure.length > 0 && (
        <section className="flex items-start gap-4 mb-2">
          {projectData.risk_summary && (
            <button
              className={`text-white px-4 py-2 rounded ${view === "project-details" ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
              onClick={() => handleSwitchView("project-details")}
              disabled={view === "project-details"}
            >
              Show Project Details
            </button>
          )}
          {projectData.risk_summary && (
            <button
              className={`text-white px-4 py-2 rounded ${view === "risk-assessment" ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
              onClick={() => handleSwitchView("risk-assessment")}
            >
              Show Risk Assessment
            </button>
          )}
          <button
            onClick={handleRunAssessmentAndGenerateRiskSummary}
            className={`text-white px-4 py-2 rounded ${
              !projectData.folder_structure.some((str) =>
                str.files.some((f) => f.type === "contract"),
              )
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-500 cursor-pointer"
            }`}
          >
            {projectData.risk_summary
              ? "Re-Generate Risk Summary"
              : "Generate Risk Summary"}
          </button>
          {projectData.risk_summary && (
            <button
              onClick={handleDownloadRiskSummary}
              className={`text-white px-4 py-2 rounded ${!projectData.risk_summary ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
            >
              Download Risk Summary (pdf)
            </button>
          )}
        </section>
      )}

      <section className="mt-4">
        {projectData.project.project_name && (
          <div className="flex justify-between items-center">
            <h1>
              Project Name:{" "}
              <span className="text-gray-700">
                {projectData.project.project_name}
              </span>
            </h1>
          </div>
        )}

        {view === "project-details" &&
          projectData.folder_structure?.some((str) => str.folderName !== "") &&
          !projectData.folder_structure?.some((str) =>
            str.files.some((f) => f.type === "contract"),
          ) && (
            <h4 className="text-gray-400">
              No contract uploaded. Please upload some document(s) to a folder.
            </h4>
          )}
        {view === "project-details" &&
          !(projectData.folder_structure?.length > 0) && (
            <h4 className="text-gray-400">
              No contract uploaded. Please create a folder and some document(s)
              to it.
            </h4>
          )}
      </section>
      {view === "project-details" ? (
        <section
          className={`${projectData.folder_structure.length > 0 ? "grid grid-cols-2 gap-6" : ""}`}
        >
          {projectData.folder_structure.length > 0 && (
            <div className="flex flex-col max-h-[65vh] overflow-auto">
              <button
                onClick={() => handleTriggerGlobalConfigUpload()}
                className="text-white px-4 py-2 rounded bg-green-500 cursor-pointer"
              >
                {!projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  !isUploading &&
                  "Upload Global Config File"}
                {!projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  isUploading &&
                  "Uploading Global Config File..."}
                {projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  !isUploading &&
                  "Replace Global Config File"}
                {projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  isUploading &&
                  "Replacing Global Config File..."}
              </button>
              <UploadedFolderStructure
                folder_structure={projectData.folder_structure}
                refreshUIFunc={fetchProjectDetails}
              />
            </div>
          )}
          <div className="flex flex-col max-h-[65vh] overflow-auto">
            <div className="flex gap-2">
              {" "}
              {!(projectData.folder_structure.length > 0) && (
                <button
                  onClick={() => handleTriggerGlobalConfigUpload()}
                  className="text-white px-4 py-2 rounded h-full bg-green-500 cursor-pointer w-full"
                >
                  {!projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    !isUploading &&
                    "Upload Global Config File"}
                  {!projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    isUploading &&
                    "Uploading Global Config File..."}
                  {projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    !isUploading &&
                    "Replace Global Config File"}
                  {projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    isUploading &&
                    "Replacing Global Config File..."}
                </button>
              )}
              <button
                onClick={handleUpload}
                disabled={isUploading || !uploadEnabled}
                className={`text-white px-4 py-2 rounded w-full ${uploadEnabled ? "bg-green-500 cursor-pointer" : "bg-gray-600 cursor-not-allowed"}`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            <FolderStructure />
          </div>
        </section>
      ) : (
        projectData.risk_summary && (
          <RiskSummary
            data={projectData.risk_summary.data}
            meta={projectData.risk_summary.meta}
          />
        )
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUploadGlobalConfigFile}
        className="hidden"
        multiple={false}
      />
    </div>
  );
}
