"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { DashboardButton } from "@/components/dashboard/Button";

type DashboardGoogleLoginButtonProps = {
  callbackUrl: string;
};

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.805 10.023h-9.58v3.955h5.516c-.238 1.273-.965 2.352-2.059 3.078v2.559h3.332c1.949-1.797 3.074-4.441 3.074-7.574 0-.684-.063-1.344-.184-2.018z"
        fill="#4285F4"
      />
      <path
        d="M12.225 22c2.781 0 5.113-.922 6.82-2.504l-3.332-2.559c-.922.617-2.102.98-3.488.98-2.684 0-4.957-1.809-5.77-4.242H3.018v2.641C4.713 19.684 8.193 22 12.225 22z"
        fill="#34A853"
      />
      <path
        d="M6.455 13.676A5.942 5.942 0 0 1 6.143 12c0-.582.113-1.145.313-1.676V7.684H3.018A9.995 9.995 0 0 0 2 12c0 1.555.371 3.027 1.018 4.316l3.438-2.641z"
        fill="#FBBC05"
      />
      <path
        d="M12.225 6.082c1.512 0 2.867.52 3.934 1.539l2.961-2.961C17.33 2.992 15.002 2 12.225 2 8.193 2 4.713 4.316 3.018 7.684l3.438 2.641c.813-2.434 3.086-4.242 5.77-4.242z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function DashboardGoogleLoginButton({
  callbackUrl,
}: DashboardGoogleLoginButtonProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <DashboardButton
      type="button"
      className="min-h-11 px-5"
      disabled={isPending}
      icon={<GoogleIcon />}
      onClick={() => {
        setIsPending(true);
        void signIn("google", { callbackUrl });
      }}
      variant={isPending ? "disabled" : "primary"}
    >
      {isPending ? "Opening Google..." : "Continue with Google"}
    </DashboardButton>
  );
}
