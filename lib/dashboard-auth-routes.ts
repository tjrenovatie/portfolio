export const DASHBOARD_LOGIN_PATH = "/dashboard/login";
export const DASHBOARD_HOME_PATH = "/dashboard";

export function getSafeDashboardCallbackUrl(value?: string | null) {
  if (!value) {
    return DASHBOARD_HOME_PATH;
  }

  if (
    value.startsWith("/dashboard") &&
    !value.startsWith(DASHBOARD_LOGIN_PATH) &&
    !value.startsWith("//")
  ) {
    return value;
  }

  return DASHBOARD_HOME_PATH;
}
