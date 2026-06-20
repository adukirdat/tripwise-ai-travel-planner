import Link from "next/link";
import { Compass } from "lucide-react";

import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-sm">
        <Compass className="h-5 w-5" />
      </span>
      <span className="text-xl font-semibold tracking-normal text-slate-950">TripWise</span>
    </Link>
  );
}
