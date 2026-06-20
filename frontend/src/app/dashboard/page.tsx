"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock, Loader2, MapPin } from "lucide-react";

import {
  popularDestinations,
  quickActions
} from "@/lib/data";
import { getMe, getStoredToken, getTrips, type ApiUser, type Trip } from "@/lib/api";
import { getTripDaysLabel, getTripImage, tripToCard } from "@/lib/trip-adapters";
import { AppShell } from "@/components/app/app-shell";
import { DestinationCard } from "@/components/app/destination-card";
import { SectionHeading } from "@/components/app/section-heading";
import { TripCard } from "@/components/app/trip-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<ApiUser | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getStoredToken()) {
      router.push("/login");
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const [meResponse, tripsResponse] = await Promise.all([getMe(), getTrips()]);
        setUser(meResponse.user);
        setTrips(tripsResponse.trips);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load dashboard. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [router]);

  const activeTrip = trips[0];
  const recentTripCards = useMemo(() => trips.slice(0, 3).map(tripToCard), [trips]);
  const activeTripImage = activeTrip ? getTripImage(activeTrip.destination) : getTripImage("");
  const activeTripProgress = activeTrip
    ? activeTrip.status === "completed"
      ? 100
      : activeTrip.status === "active"
        ? 50
        : 15
    : 0;
  const nextActivity = activeTrip?.itinerary?.[0]?.activities?.[0]?.title || "Create your first activity";

  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-[1400px] space-y-10 lg:space-y-12">
        <section>
          <SectionHeading
            eyebrow="Dashboard"
            title={`Welcome back${user?.name ? `, ${user.name}` : ""}`}
            description="Your active itinerary, saved trips, and travel inspiration are ready."
          />

          {loading ? (
            <Card className="flex min-h-[280px] items-center justify-center p-8 text-slate-600">
              <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
              Loading dashboard...
            </Card>
          ) : error ? (
            <Card className="border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
              {error}
            </Card>
          ) : (
          <Card className="overflow-hidden rounded-3xl border-0 p-0 shadow-soft">
            <div className="relative min-h-[440px] sm:min-h-[480px]">
              <Image
                src={activeTripImage}
                alt={activeTrip?.destination || "Travel destination"}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/88 via-slate-950/56 to-slate-950/18" />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/50 to-transparent" />
              <div className="relative grid min-h-[440px] min-w-0 items-end gap-6 p-5 text-white sm:min-h-[480px] sm:p-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:p-10 xl:p-12">
                <div className="min-w-0 max-w-3xl">
                  <Badge className="w-fit border-white/20 bg-white/15 text-white backdrop-blur">
                    Continue Trip
                  </Badge>
                  <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                    {activeTrip?.destination || "Create your first trip"}
                  </h1>
                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/88">
                    <span className="flex min-w-0 items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 backdrop-blur">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">
                        {activeTrip ? `Day 1 of ${activeTrip.durationDays}` : "No trip yet"}
                      </span>
                    </span>
                    <span className="flex min-w-0 items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 backdrop-blur">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">
                        {activeTrip?.destination || "Choose a destination"}
                      </span>
                    </span>
                  </div>
                  <Button asChild size="lg" className="mt-8 w-fit">
                    <Link href={activeTrip ? `/trips/${activeTrip._id}` : "/create-trip"}>
                      {activeTrip ? "Continue Trip" : "Create Trip"}
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <div className="min-w-0 rounded-2xl border border-white/18 bg-white/14 p-5 shadow-[0_18px_48px_rgba(0,0,0,0.20)] backdrop-blur md:p-6">
                  <div className="mb-3 flex items-center justify-between text-sm font-semibold text-white/90">
                    <span>Trip progress</span>
                    <span>{activeTripProgress}%</span>
                  </div>
                  <Progress value={activeTripProgress} className="bg-white/25" />
                  <div className="mt-6 border-t border-white/16 pt-5">
                    <p className="text-xs font-semibold uppercase tracking-normal text-white/70">
                    Next Activity
                    </p>
                    <p className="mt-2 break-words text-lg font-semibold leading-snug">
                      {nextActivity}
                    </p>
                    {activeTrip ? (
                      <p className="mt-1 text-sm text-white/70">
                        {getTripDaysLabel(activeTrip.durationDays)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          )}
        </section>

        <section>
          <SectionHeading
            title="Quick Actions"
            description="Pick up the common planning paths without digging through menus."
          />
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const tone =
                action.tone === "green"
                  ? "bg-green-50 text-success"
                  : action.tone === "orange"
                    ? "bg-orange-50 text-accent"
                    : "bg-blue-50 text-primary";

              return (
                <Link href={action.href} key={action.title}>
                  <Card className="travel-card-hover h-full min-w-0 p-5 sm:p-6">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 break-words text-lg font-semibold leading-tight text-slate-950">
                      {action.title}
                    </h3>
                    <p className="mt-3 break-words text-sm leading-6 text-slate-600">
                      {action.description}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Travel Inspiration"
            description="Browse destinations that pair well with ready-made plans and custom itineraries."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {popularDestinations.map((destination) => (
              <DestinationCard key={destination.destination} {...destination} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            title="Recent Trips"
            action={
              <Button asChild variant="outline">
                <Link href="/my-trips">View All</Link>
              </Button>
            }
          />
          <div className="grid gap-5 lg:grid-cols-3">
            {recentTripCards.map((trip) => (
              <TripCard key={trip.id} {...trip} />
            ))}
            {!loading && !error && recentTripCards.length === 0 ? (
              <Card className="p-6 text-sm font-semibold text-slate-600 lg:col-span-3">
                No trips yet. Create one to see it here.
              </Card>
            ) : null}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
