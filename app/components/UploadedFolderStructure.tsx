"use client";

import { deleteDocument, uploadDocument } from "@/services/project.service";
import { FolderStructureTypes } from "@/store/folderStructure.store";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { ButtonWithSpinner } from "./ButtonWithSpinner";

type FileType = {
  id?: string;
  fileName: string;
  type: "contract" | "config";
  file: File;
};

export type UploadedFolderStructureTypes = {
  folderName: string;
  files: FileType[];
};
export default function UploadedFolderStructure({
  folder_structure,
  refreshUIFunc,
  isDisabled,
}: {
  folder_structure: UploadedFolderStructureTypes[];
  refreshUIFunc?: () => void;
  isDisabled: boolean;
}) {
  const params = useParams();
  const project_id = Array.isArray(params["project-id"])
    ? params["project-id"][0]
    : params["project-id"];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeType, setActiveType] = useState<"contract" | "config" | null>(
    null,
  );
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  console.log(isLoading, "isLoading");

  const handleDeleteFolder = async (folderName: string) => {
    if (!folderName) return;
    setActiveFolder(folderName);
    setIsLoading(true);
    setActiveType(null);

    try {
      const folder = folder_structure.find(
        (str) => str.folderName === folderName,
      );

      if (!folder) return;

      await Promise.all(
        folder.files.map((f) =>
          deleteDocument({
            doc_id: f.id,
            doc_type: f.type,
            project_id,
          }),
        ),
      );
      refreshUIFunc && refreshUIFunc();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setActiveFolder(null);
    }
  };

  // ✅ Trigger file input
  const handleTriggerUpload = (
    folderName: string,
    type: "contract" | "config",
  ) => {
    setActiveFolder(folderName);
    setActiveType(type);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  // ✅ Delete File
  const handleDeleteFile = async (
    doc_id: string,
    doc_type: "contract" | "config",
  ) => {
    if (!doc_id || !doc_type) return;
    setActiveFileId(doc_id);
    setIsLoading(true);
    try {
      await deleteDocument({
        doc_id,
        doc_type,
        project_id,
      });
      refreshUIFunc && refreshUIFunc();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      setActiveFileId(null);
    }
  };

  // ✅ File Select
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!project_id) return;
    setIsLoading(true);
    try {
      const files = e.target.files;
      if (!files || !activeFolder || !activeType) return;

      let folderStructure: FolderStructureTypes[] = [];
      if (activeType === "config") {
        // replace config
        if (files[0]) {
          const folder = folder_structure.find(
            (f) => f.folderName === activeFolder,
          );
          const configFile = folder?.files.find(
            (file) => file.type === "config",
          );

          const hasConfig = !!configFile;
          if (hasConfig) {
            const configId = configFile?.id;
            await deleteDocument({
              doc_id: configId,
              doc_type: activeType,
              project_id,
            });
          }

          folderStructure.push({
            folderName: activeFolder,
            files: [
              {
                file: files[0],
                fileName: files[0].name,
                type: "config",
              },
            ],
          });
        }
      }

      if (activeType === "contract") {
        const newFiles: FileType[] = Array.from(files).map((file) => ({
          file,
          fileName: file.name,
          type: "contract",
        }));

        folderStructure.push({
          folderName: activeFolder,
          files: newFiles,
        });
      }
      await uploadDocument({
        project_id,
        folderStructure,
      });

      setActiveFolder(null);
      setActiveType(null);
      refreshUIFunc && refreshUIFunc();
    } catch (error) {
      console.error("Error uploading file", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!project_id) return <>Loading...</>;

  return (
    <section>
      <ol className="list-decimal pl-5 my-2 space-y-2">
        {folder_structure.map((str) => (
          <li key={str.folderName}>
            <div className="flex justify-between items-center">
              <p>{str.folderName ? str.folderName : "Project configuration"}</p>

              {str.folderName && (
                <div className="flex gap-2">
                  <ButtonWithSpinner
                    text="Add contract"
                    loadingText="Uploading contract..."
                    isLoading={
                      isLoading &&
                      activeFolder === str.folderName &&
                      activeType === "contract"
                    }
                    disabled={isDisabled}
                    onClick={() =>
                      handleTriggerUpload(str.folderName, "contract")
                    }
                  />

                  <ButtonWithSpinner
                    text={
                      str.files.some((f) => f.type === "config")
                        ? "Replace config file"
                        : "Add config file"
                    }
                    loadingText="Uploading config..."
                    isLoading={
                      isLoading &&
                      activeFolder === str.folderName &&
                      activeType === "config"
                    }
                    disabled={isDisabled}
                    onClick={() =>
                      handleTriggerUpload(str.folderName, "config")
                    }
                  />
                  <ButtonWithSpinner
                    text="Delete folder"
                    loadingText="Deleting folder..."
                    isLoading={
                      isLoading &&
                      activeFolder === str.folderName &&
                      activeType === null
                    }
                    disabled={isDisabled || activeFolder === str.folderName}
                    onClick={() => handleDeleteFolder(str.folderName)}
                    variant="danger"
                  />
                </div>
              )}
            </div>

            <ol className="list-decimal pl-5 mt-2">
              {str.files.map((f) => (
                <li
                  key={`${str.folderName}-${f.fileName}-${f.id}`}
                  className="mt-2"
                >
                  <div className="flex justify-between">
                    <span>{f.fileName}</span>
                    <ButtonWithSpinner
                      text={`Delete ${f.type}`}
                      loadingText={`Deleting ${f.type}`}
                      isLoading={isLoading && activeFileId === f.id}
                      onClick={() => f.id && handleDeleteFile(f.id, f.type)}
                      variant="danger"
                    />
                  </div>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple={activeType === "contract"}
      />
    </section>
  );
}
