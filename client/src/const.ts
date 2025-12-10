export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Hardcoded settings
export const APP_TITLE = "My Portfolio";
export const APP_LOGO = "https://via.placeholder.com/150";
export const ANALYTICS_ENDPOINT = "https://google.com";
export const ANALYTICS_WEBSITE_ID = "123";

// FORCE the button to go to the Create page
export const getLoginUrl = () => {
  return "/create";
};
