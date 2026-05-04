export const LOGIN = "/auth/login";
export const SIGN_UP = "/auth/signup";
export const LOGOUT = "/auth/logout";
export const CREATE_PROJECT = "/create-project";
export const DELETE_PROJECT_BY_ID = (id: string) => `/project/${id}`;
export const GET_PROJECT_BY_ID = (id: string) => `/project/${id}`;
export const DOCUMENT = "/document";
export const RUN_ASSESSMENT_AND_GENERATE_SUMMARY =
  "/run-assessment-and-generate-summary";
export const ALL_PROJECTS = "/all-projects";
export const DOWNLOAD_RISK_SUMMARY = (id: string) =>
  `/download-risk-summary/${id}`;
