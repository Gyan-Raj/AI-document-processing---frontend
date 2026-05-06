import { create } from "zustand";

export type FileType = {
  file: File;
  fileName: string;
  type: "contract" | "config";
};

export type FolderStructureTypes = {
  folderName: string;
  files: FileType[];
};

type FolderStore = {
  folderStructure: FolderStructureTypes[];

  addFolder: (name: string) => void;
  removeFolder: (name: string) => void;

  addFile: (
    folderName: string,
    files: FileList,
    type: "contract" | "config",
  ) => void;

  removeFile: (
    index: number,
    folderName: string,
    fileName: string,
    type: string,
  ) => void;

  reset: () => void;
};

export const useFolderStructureStore = create<FolderStore>((set) => ({
  folderStructure: [],

  // ✅ Add folder (unique)
  addFolder: (name) =>
    set((state) => {
      const exists = state.folderStructure.some(
        (f) => f.folderName.toLowerCase() === name.toLowerCase(),
      );

      if (exists) return state;

      return {
        folderStructure: [
          ...state.folderStructure,
          { folderName: name, files: [] },
        ],
      };
    }),

  // ✅ Remove folder
  removeFolder: (name) =>
    set((state) => ({
      folderStructure: state.folderStructure.filter(
        (f) => f.folderName !== name,
      ),
    })),

  // ✅ Add file(s)
  addFile: (folderName, files, type) =>
    set((state) => ({
      folderStructure: state.folderStructure.map((folder) => {
        if (folder.folderName !== folderName) return folder;

        let updatedFiles = [...folder.files];

        if (type === "config") {
          // replace config
          updatedFiles = updatedFiles.filter((f) => f.type !== "config");

          if (files[0]) {
            updatedFiles.push({
              file: files[0],
              fileName: files[0].name,
              type: "config",
            });
          }
        }

        if (type === "contract") {
          const newFiles: FileType[] = Array.from(files).map((file) => ({
            file,
            fileName: file.name,
            type: "contract",
          }));

          updatedFiles = [...updatedFiles, ...newFiles];
        }

        return {
          ...folder,
          files: updatedFiles,
        };
      }),
    })),

  // ✅ Remove file (using folderName + fileName)
  removeFile: (index, folderName, fileName, type) =>
    set((state) => ({
      folderStructure: state.folderStructure.map((folder) => {
        if (folder.folderName !== folderName) return folder;
        console.log(
          index,
          folderName,
          fileName,
          type,
          "index, folderName, fileName, type",
        );

        return {
          ...folder,
          files: folder.files.filter((_, idx) => idx !== index),
        };
      }),
    })),

  // ✅ Reset
  reset: () => set({ folderStructure: [] }),
}));
