export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Hardcoded values to prevent crashes
export const APP_TITLE = "My Portfolio";
export const APP_LOGO = "https://via.placeholder.com/150";
export const ANALYTICS_ENDPOINT = "https://google.com";
export const ANALYTICS_WEBSITE_ID = "123";

// FIX: Bypass login and go straight to the app
export const getLoginUrl = () => {
  return "/create"; 
};
