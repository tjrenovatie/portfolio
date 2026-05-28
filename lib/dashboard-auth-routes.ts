export const DASHBOARD_LOGIN_PATH = "/dashboard/login";
export const DASHBOARD_HOME_PATH = "/dashboard";

type DashboardCallbackUrlOptions = {
  allowLogin?: boolean;
};

function isSafeDashboardPath(
  value: string,
  { allowLogin = false }: DashboardCallbackUrlOptions = {},
) {
  if (value.startsWith("//")) {
    return false;
  }

  if (allowLogin && value.startsWith(DASHBOARD_LOGIN_PATH)) {
    return true;
  }

  return (
    value.startsWith("/dashboard") && !value.startsWith(DASHBOARD_LOGIN_PATH)
  );
}

export function getSafeDashboardCallbackUrl(
  value?: string | null,
  options: DashboardCallbackUrlOptions = {},
) {
  if (!value) {
    return DASHBOARD_HOME_PATH;
  }

  if (isSafeDashboardPath(value, options)) {
    return value;
  }

  return DASHBOARD_HOME_PATH;
}

export function getSafeDashboardRedirectUrl({
  baseUrl,
  url,
}: {
  baseUrl: string;
  url: string;
}) {
  if (url.startsWith("/")) {
    return `${baseUrl}${getSafeDashboardCallbackUrl(url, { allowLogin: true })}`;
  }

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.origin !== baseUrl) {
      return `${baseUrl}${DASHBOARD_HOME_PATH}`;
    }

    return `${baseUrl}${getSafeDashboardCallbackUrl(
      `${parsedUrl.pathname}${parsedUrl.search}`,
      { allowLogin: true },
    )}`;
  } catch {
    return `${baseUrl}${DASHBOARD_HOME_PATH}`;
  }
}
