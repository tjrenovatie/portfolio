type DashboardStatusMessageProps = {
  children: string;
  className?: string;
  status: "error" | "success";
};

export function DashboardStatusMessage({
  children,
  className,
  status,
}: DashboardStatusMessageProps) {
  return (
    <div
      className={[
        "rounded-md border px-4 py-3 text-sm font-semibold",
        status === "success"
          ? "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950 dark:text-green-200"
          : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      role={status === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
