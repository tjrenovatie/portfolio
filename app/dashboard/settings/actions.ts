"use server";

import { revalidatePath } from "next/cache";
import {
  DASHBOARD_UNAUTHORIZED_MESSAGE,
  isDashboardAuthenticated,
} from "@/lib/auth";
import { setWebsiteDisplayEnabled } from "@/lib/site-settings";

export type ToggleWebsiteDisplayState = {
  isWebsiteEnabled?: boolean;
  message?: string;
  status: "idle" | "error" | "success";
};

export async function toggleWebsiteDisplayAction(
  _previousState: ToggleWebsiteDisplayState,
  formData: FormData,
): Promise<ToggleWebsiteDisplayState> {
  if (!(await isDashboardAuthenticated())) {
    return {
      message: DASHBOARD_UNAUTHORIZED_MESSAGE,
      status: "error",
    };
  }

  const enabled = formData.get("enabled") === "true";

  try {
    const isWebsiteEnabled = await setWebsiteDisplayEnabled(enabled);

    revalidatePath("/", "layout");
    revalidatePath("/dashboard/settings");

    return {
      isWebsiteEnabled,
      message: isWebsiteEnabled
        ? "The website is visible to visitors."
        : "The public website now shows a blank white page.",
      status: "success",
    };
  } catch (error) {
    console.error("Website display toggle error:", error);

    return {
      message: "Could not update the website display setting.",
      status: "error",
    };
  }
}
