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
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGlobalConfigUploading, setIsGlobalConfigloading] = useState(false);
  const [uploadError, setUploadError] = useState<null | string>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { folderStructure, reset } = useFolderStructureStore();

  const [projectData, setProjectData] = useState<ProjectProps | null>(null);
  const [view, setView] = useState<"project-details" | "risk-assessment">(
    "project-details",
  );

  const fetchProjectDetails = async () => {
    try {
      setIsLoading(true);
      const res = await getProjectDetails({ project_id });
      setProjectData(res.project);
    } catch (error) {
      console.error("Error fetching project details", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!project_id) return;
    fetchProjectDetails();
  }, [project_id]);

  const uploadEnabled =
    folderStructure.some((str) =>
      str.files.some((f) => f.type === "contract"),
    ) && !isUploading;

  const handleUpload = async () => {
    if (!uploadEnabled) {
      setUploadError(
        "Create a folder and add atleast one contract to that folder to start uploading",
      );
      return;
    }
    setUploadError(null);
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
      setIsGlobalConfigloading(true);

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
          project_id,
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
      setIsGlobalConfigloading(false);
    }
  };

  const handleRunAssessmentAndGenerateRiskSummary = async () => {
    try {
      setIsGeneratingSummary(true);
      const payload = {
        project_id,
      };
      const res = await runAssessmentAndGenerateRiskSummary(payload);
      if (res.data.status_code === 202) {
        console.log(res, "res");
        setTimeout(() => handleRunAssessmentAndGenerateRiskSummary(), 30000);
      } else {
        fetchProjectDetails();
        setView("risk-assessment");
        setIsGeneratingSummary(false);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setIsGeneratingSummary(false);
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

  // if (isLoading) return <>Loading......</>;

  const handleSwitchView = (view: "project-details" | "risk-assessment") => {
    setView(view);
  };

  if (!projectData) return <>No data found</>;

  return (
    <div className="flex flex-col w-full h-full px-4 py-2">
      {projectData.folder_structure.length > 0 && (
        <section className="flex items-start gap-4 mb-2">
          {projectData.risk_summary && (
            <button
              // className={`text-white px-4 py-2 rounded ${view === "project-details" ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
              onClick={() => handleSwitchView("project-details")}
              disabled={view === "project-details"}
              className={`rounded-md text-sm px-4 py-2 font-medium text-white transition active:scale-95 cursor-pointer  ${
                view === "project-details"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              Show Project Details
            </button>
          )}
          {projectData.risk_summary && (
            <button
              className={`rounded-md text-sm px-4 py-2 font-medium text-white transition active:scale-95 cursor-pointer  ${
                view === "risk-assessment"
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              onClick={() => handleSwitchView("risk-assessment")}
            >
              Show Risk Assessment
            </button>
          )}
          <button
            onClick={handleRunAssessmentAndGenerateRiskSummary}
            className={`rounded-md text-sm px-4 py-2 font-medium text-white transition active:scale-95 cursor-pointer  ${
              !projectData.folder_structure.some((str) =>
                str.files.some((f) => f.type === "contract"),
              ) ||
              isGeneratingSummary ||
              isUploading ||
              isGlobalConfigUploading ||
              isLoading
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={
              isGeneratingSummary ||
              isUploading ||
              isGlobalConfigUploading ||
              isLoading
            }
          >
            {isGeneratingSummary && projectData.risk_summary
              ? "Re-Generating Risk Summary..."
              : !isGeneratingSummary && projectData.risk_summary
                ? "Re-Generate Risk Summary"
                : isGeneratingSummary && !projectData.risk_summary
                  ? "Generating Risk Summary..."
                  : "Generate Risk Summary"}
          </button>
          {projectData.risk_summary && (
            <button
              onClick={handleDownloadRiskSummary}
              className={`rounded-md text-sm px-4 py-2 font-medium text-white transition active:scale-95 cursor-pointer  ${
                !projectData.risk_summary || isGeneratingSummary
                  ? "bg-gray-600 hover:bg-gray-700"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={
                isGeneratingSummary ||
                isUploading ||
                isGlobalConfigUploading ||
                isLoading
              }
            >
              Download Risk Summary (pdf)
            </button>
          )}
        </section>
      )}

      <section className="mt-4">
        {projectData.project.project_name && (
          <div className="flex justify-between items-center mb-2">
            <h1>
              <b>Project Name: </b>
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
          {isLoading && <>Loading...</>}
          {!isLoading && projectData.folder_structure.length > 0 && (
            <div className="flex flex-col max-h-[65vh] overflow-auto">
              <button
                onClick={() => handleTriggerGlobalConfigUpload()}
                disabled={
                  isLoading || isGlobalConfigUploading || isGeneratingSummary
                }
                className={`rounded-md px-2 py-2 text-sm font-medium text-white transition active:scale-95 cursor-pointer ${
                  isLoading || isGlobalConfigUploading || isGeneratingSummary
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {!projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  !isGlobalConfigUploading &&
                  "Upload Global Config File"}
                {!projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  isGlobalConfigUploading &&
                  "Uploading Global Config File..."}
                {projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  !isGlobalConfigUploading &&
                  "Replace Global Config File"}
                {projectData.folder_structure.some(
                  (str) => str.folderName === "",
                ) &&
                  isGlobalConfigUploading &&
                  "Replacing Global Config File..."}
              </button>
              <UploadedFolderStructure
                folder_structure={projectData.folder_structure}
                refreshUIFunc={fetchProjectDetails}
                isDisabled={isGlobalConfigUploading || isGeneratingSummary}
              />
            </div>
          )}
          <div className="flex flex-col max-h-[65vh] overflow-auto">
            <div className="flex gap-2">
              {" "}
              {projectData.folder_structure.length === 0 && (
                <button
                  onClick={() => handleTriggerGlobalConfigUpload()}
                  className="rounded-md bg-green-500 px-2 py-2 text-sm font-medium text-white transition hover:bg-green-600 active:scale-95 cursor-pointer w-full"
                >
                  {!projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    !isGlobalConfigUploading &&
                    "Upload Global Config File"}
                  {!projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    isGlobalConfigUploading &&
                    "Uploading Global Config File..."}
                  {projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    !isGlobalConfigUploading &&
                    "Replace Global Config File"}
                  {projectData.folder_structure.some(
                    (str) => str.folderName === "",
                  ) &&
                    isGlobalConfigUploading &&
                    "Replacing Global Config File..."}
                </button>
              )}
              <button
                onClick={handleUpload}
                disabled={isUploading || isGeneratingSummary}
                className={`rounded-md px-2 py-2 text-sm font-medium text-white transition  active:scale-95 cursor-pointer w-full ${uploadEnabled && !isGeneratingSummary ? "bg-green-500 hover:bg-green-600" : "bg-gray-600 hover:bg-gray-700"}`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
            {uploadError && <p className="text-red-600">{uploadError}</p>}
            <FolderStructure
              setUploadError={setUploadError}
              isDisabled={isUploading || isGeneratingSummary}
            />
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
