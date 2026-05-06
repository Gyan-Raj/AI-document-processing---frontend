import axiosInstance from "@/lib/api/axios-instance";
import {
  ALL_PROJECTS,
  CREATE_PROJECT,
  DELETE_PROJECT_BY_ID,
  DOCUMENT,
  DOWNLOAD_RISK_SUMMARY,
  GET_PROJECT_BY_ID,
  GET_PROJECT_BY_QUERY,
  RECENT_PROJECTS,
  RUN_ASSESSMENT_AND_GENERATE_SUMMARY,
} from "@/lib/api/config";
import { FolderStructureTypes } from "@/store/folderStructure.store";

export const createProject = async (data: { project_name: string }) => {
  try {
    const res = await axiosInstance.post(CREATE_PROJECT, data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const deleteProject = async (data: { project_id: string }) => {
  try {
    const res = await axiosInstance.delete(
      DELETE_PROJECT_BY_ID(data.project_id),
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const uploadDocument = async (data: {
  project_id: string;
  folderStructure: FolderStructureTypes[];
}) => {
  try {
    const formData = new FormData();
    const { project_id, folderStructure } = data;

    formData.append("project_id", project_id);

    const structure: any[] = [];

    folderStructure.forEach((folder, folderIndex) => {
      const folderPayload: any = {
        folderName: folder.folderName,
        files: [],
      };

      folder.files.forEach((file) => {
        // add file metadata to structure
        folderPayload.files.push({
          fileName: file.fileName,
          type: file.type,
          // file: file.file,
        });
        // append actual file
        formData.append(`${folder.folderName}-${file.fileName}`, file.file);
      });

      structure.push(folderPayload);
    });

    // attach structure JSON
    formData.append("structure", JSON.stringify(structure));

    const res = await axiosInstance.post(DOCUMENT, formData);

    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const deleteDocument = async (data: {
  folderName?: string;
  doc_id?: string;
  doc_type?: string;
  project_id?: string;
}) => {
  try {
    const res = await axiosInstance.delete(DOCUMENT, { data });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const getProjectDetails = async (data: { project_id: string }) => {
  try {
    const res = await axiosInstance.get(GET_PROJECT_BY_ID(data.project_id));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const searchProject = async (data: { query: string }) => {
  try {
    const res = await axiosInstance.get(GET_PROJECT_BY_QUERY(data.query));
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const runAssessmentAndGenerateRiskSummary = async (data: {
  project_id: string;
}) => {
  try {
    const res = await axiosInstance.post(
      RUN_ASSESSMENT_AND_GENERATE_SUMMARY,
      data,
    );
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const downloadRiskSummary = async ({
  project_id,
  type = "pdf",
}: {
  project_id: string;
  type?: string;
}) => {
  try {
    const res = await axiosInstance.get(DOWNLOAD_RISK_SUMMARY(project_id), {
      params: { type },
      responseType: "blob",
    });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const getAllProjects = async () => {
  try {
    const res = await axiosInstance.get(ALL_PROJECTS);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};

export const getRecentProjects = async () => {
  try {
    const res = await axiosInstance.get(RECENT_PROJECTS);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error; // Catch errors in service only if you transform
  }
};
