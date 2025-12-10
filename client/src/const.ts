export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Hardcoded values to fix the "Invalid URL" crash
export const APP_TITLE = "My Portfolio";
export const APP_LOGO = "https://via.placeholder.com/150";
export const ANALYTICS_ENDPOINT = "https://google.com";
export const ANALYTICS_WEBSITE_ID = "123";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // Safety check: if variables are missing, don't crash, just return a safe path
  if (!oauthPortalUrl || !appId) {
    return "#";
  }

  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  try {
    const url = new URL(`${oauthPortalUrl}/app-auth`);
    url.searchParams.set("appId", appId);
    url.searchParams.set("redirectUri", redirectUri);
    url.searchParams.set("state", state);
    url.searchParams.set("type", "signIn");
    return url.toString();
  } catch (error) {
    console.error("Failed to construct login URL", error);
    return "#";
  }
};
