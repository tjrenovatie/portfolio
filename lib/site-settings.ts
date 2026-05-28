import { unstable_noStore as noStore } from "next/cache";
import { sql } from "@/lib/db";

const WEBSITE_DISPLAY_SETTING_KEY = "website_display_enabled";

type SiteSettingRow = {
  value: string;
};

function parseBooleanSetting(value: string | undefined, fallback: boolean) {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

export async function getWebsiteDisplayEnabled() {
  noStore();

  try {
    const rows = (await sql`
      SELECT value
      FROM site_settings
      WHERE key = ${WEBSITE_DISPLAY_SETTING_KEY}
      LIMIT 1
    `) as SiteSettingRow[];

    return parseBooleanSetting(rows[0]?.value, true);
  } catch (error) {
    console.error("Failed to load website display setting:", error);

    return true;
  }
}

export async function setWebsiteDisplayEnabled(enabled: boolean) {
  const rows = (await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${WEBSITE_DISPLAY_SETTING_KEY}, ${String(enabled)}, now())
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value,
          updated_at = now()
    RETURNING value
  `) as SiteSettingRow[];

  return parseBooleanSetting(rows[0]?.value, true);
}
