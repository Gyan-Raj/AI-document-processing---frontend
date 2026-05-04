import { useUserDetails } from "@/store/auth.store";

const PUBLIC_PATHS = ["/login", "/signup"];

export const _signout = () => {
  useUserDetails.getState().clearUser();

  // ✅ Don't redirect if already on a public page — breaks the loop
  if (PUBLIC_PATHS.includes(window.location.pathname)) return;

  window.location.href = "/login";
};
