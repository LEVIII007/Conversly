/**
 * An array of public route paths for the application.
 * These routes are accessible without authentication.
 *
 * @constant
 *
 * @default ["/", "/about", "/courses", "/courses/[courseId]"]
 */
export const publicRoutes = [
    "/",
    "/about",
    "/blog",
  ];
  
  /**
   * An array of authentication route paths.
   *
   * This array contains the paths for the login and register routes
   * used in the authentication process.
   */
  export const authRoutes = [
    "/pricing",
    "/chat",
    "/chatbot",
    "/profile"
  ];
  
  /**
   * The prefix for API authentication routes.
   *
   * This prefix is used to namespace all authentication-related API endpoints.
   */
  export const apiAuthPrefix = "/api/auth";
  
  /**
   * The default path to which users are redirected after a successful login.
   * This is typically the home page or dashboard of the application.
   */
  export const DEFAULT_LOGIN_REDIRECT = "/profile";