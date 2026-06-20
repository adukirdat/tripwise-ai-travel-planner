"use client";

import Link from "next/link";
import { CalendarDays, LogOut, Mail, MapPin, Pencil, UserRound } from "lucide-react";

import { images, profileStats } from "@/lib/data";
import { clearStoredToken } from "@/lib/api";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-6xl space-y-7">
        <SectionHeading
          eyebrow="Profile"
          title="Traveler profile and account activity."
          description="Profile details, created trips, published plans, purchased plans, and membership history."
        />

        <Card className="min-w-0 p-5 shadow-soft sm:p-8">
          <div className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 flex-col gap-5 min-[390px]:flex-row min-[390px]:items-center">
              <Avatar className="h-20 w-20 shrink-0 sm:h-24 sm:w-24">
                <AvatarImage src={images.avatar} alt="Aditya Sharma" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-semibold tracking-normal text-slate-950">
                  Aditya Sharma
                </h1>
                <p className="mt-2 flex min-w-0 items-center gap-2 text-slate-500">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-all">aditya@example.com</span>
                </p>
                <p className="mt-1 flex min-w-0 items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">Bangalore, India</span>
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button>
                <Pencil className="h-5 w-5" />
                Edit Profile
              </Button>
              <Button asChild variant="outline">
                <Link href="/login" onClick={clearStoredToken}>
                  <LogOut className="h-5 w-5" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {profileStats.map((stat) => (
            <Card key={stat.label} className="min-w-0 p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
                {stat.label === "Member Since" ? (
                  <CalendarDays className="h-5 w-5" />
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </div>
              <p className="mt-5 break-words text-sm font-semibold text-slate-500">{stat.label}</p>
              <p className="mt-2 break-words text-3xl font-semibold text-slate-950">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card className="min-w-0 p-5 sm:p-7">
          <h2 className="text-xl font-semibold text-slate-950">Profile Information</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ["Preferred Budget", "Comfort"],
              ["Traveller Type", "Couple"],
              ["Favorite Interests", "Food, beaches, culture"],
              ["Home Airport", "BLR - Kempegowda International"]
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                <p className="break-words text-sm font-semibold text-slate-500">{label}</p>
                <p className="mt-1 break-words font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
