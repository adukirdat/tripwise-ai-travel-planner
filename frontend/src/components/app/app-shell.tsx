"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Search } from "lucide-react";

import { appNavItems, images } from "@/lib/data";
import { clearStoredToken } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/app/logo";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F6F8FB]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-200/80 bg-white px-5 py-6 lg:flex">
        <Logo />

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {appNavItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href === "/my-trips" && pathname.startsWith("/trips")) ||
              (item.href === "/dashboard" && pathname === "/active-trip");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950",
                  active &&
                    "bg-blue-50 text-primary shadow-[inset_0_0_0_1px_rgba(37,99,235,0.10)]"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/login"
          onClick={clearStoredToken}
          className="flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-950"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </aside>

      <div className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/75 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-[4.5rem] min-w-0 items-center gap-3 px-3 sm:gap-4 sm:px-6 lg:px-10 xl:px-12">
            <Logo className="shrink-0 lg:hidden" />

            <div className="relative ml-auto min-w-0 flex-1 sm:max-w-md lg:ml-0">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                className="h-10 rounded-lg bg-slate-50 pl-10"
                placeholder="Search destinations, trips, hotels"
              />
            </div>

            <Avatar className="h-10 w-10 shrink-0 sm:h-11 sm:w-11">
              <AvatarImage src={images.avatar} alt="Aditya" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>

          <nav className="travel-scrollbar flex max-w-full gap-2 overflow-x-auto px-3 pb-3 sm:px-6 lg:hidden">
            {appNavItems.map((item) => {
              const Icon = item.icon;
              const active =
                pathname === item.href ||
                (item.href === "/my-trips" && pathname.startsWith("/trips")) ||
                (item.href === "/dashboard" && pathname === "/active-trip");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm",
                    active && "border-blue-100 bg-blue-50 text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="min-w-0 px-3 py-6 sm:px-6 lg:px-10 lg:py-9 xl:px-12">
          {children}
        </main>
      </div>
    </div>
  );
}
