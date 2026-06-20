import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-6 flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-7",
        className
      )}
    >
      <div className="min-w-0 max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-normal text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="break-words text-2xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-2.5 max-w-xl break-words text-base leading-7 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="w-full shrink-0 sm:w-auto">{action}</div> : null}
    </div>
  );
}
