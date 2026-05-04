"use client";

import { useFolderStructureStore } from "@/store/folderStructure.store";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";

export default function FolderStructure() {
  const params = useParams();
  const project_id = Array.isArray(params["project-id"])
    ? params["project-id"][0]
    : params["project-id"];

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"contract" | "config" | null>(
    null,
  );

  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");

  // ✅ Zustand store
  const { folderStructure, addFolder, removeFolder, addFile, removeFile } =
    useFolderStructureStore();

  const handleCreateFolder = () => {
    const trimmed = folderName.trim();

    if (!trimmed) {
      setError("Folder name is required");
      return;
    }

    const exists = folderStructure.some(
      (str) => str.folderName.toLowerCase() === trimmed.toLowerCase(),
    );

    if (exists) {
      setError(`Folder "${trimmed}" already exists`);
      return;
    }

    addFolder(trimmed);
    setFolderName("");
  };

  // ✅ Delete Folder
  const handleDeleteFolder = (folderName: string) => {
    removeFolder(folderName);
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
  const handleDeleteFile = (folderName: string, fileName: string) => {
    removeFile(folderName, fileName);
  };

  // ✅ File Select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || !activeFolder || !activeType) return;

    addFile(activeFolder, files, activeType);

    setActiveFolder(null);
    setActiveType(null);
  };

  if (!project_id) return <>Loading...</>;

  return (
    <section>
      <div className="flex my-2 gap-2">
        {" "}
        <input
          className="border border-gray-400 flex-1 px-2 py-1"
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Enter folder name"
          onFocus={() => setError("")}
        />
        <button
          onClick={handleCreateFolder}
          className={`text-white px-4 py-2 rounded ${!folderName ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 cursor-pointer"}`}
          disabled={!folderName}
        >
          + Create Folder
        </button>
      </div>

      {error && <p className="text-red-400">{error}</p>}

      <ol className="list-decimal pl-5 my-2 space-y-2">
        {folderStructure.map((str) => (
          <li key={str.folderName}>
            <div className="flex justify-between items-center">
              <p>{str.folderName}</p>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    handleTriggerUpload(str.folderName, "contract")
                  }
                  className="bg-green-500 px-3 py-1 rounded text-white cursor-pointer"
                >
                  Add contract
                </button>

                <button
                  onClick={() => handleTriggerUpload(str.folderName, "config")}
                  className="bg-green-500 px-3 py-1 rounded text-white cursor-pointer"
                >
                  Add config file
                </button>

                <button
                  onClick={() => handleDeleteFolder(str.folderName)}
                  className="bg-red-400 px-3 py-1 rounded text-white cursor-pointer"
                >
                  Delete Folder
                </button>
              </div>
            </div>

            <ol className="pl-5 mt-2 list-decimal">
              {str.files.map((f) => (
                <li key={`${str.folderName}-${f.fileName}`} className="mt-2">
                  <div className="flex justify-between">
                    <span>{f.fileName}</span>
                    <button
                      className="bg-red-400 px-3 py-1 rounded text-white cursor-pointer"
                      onClick={() =>
                        handleDeleteFile(str.folderName, f.fileName)
                      }
                    >
                      Delete {f.type}
                    </button>
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
