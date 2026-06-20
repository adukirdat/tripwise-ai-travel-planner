"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  CalendarDays,
  CloudSun,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  Route
} from "lucide-react";

import { getStoredToken, getTrips, type Trip } from "@/lib/api";
import { getDayTitle } from "@/lib/trip-adapters";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ActiveTripPage() {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getStoredToken()) {
      router.push("/login");
      return;
    }

    const loadActiveTrip = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTrips();
        setTrip(response.trips[0] || null);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load active trip. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadActiveTrip();
  }, [router]);

  const today = trip?.itinerary?.[0];
  const progress = trip
    ? trip.status === "completed"
      ? 100
      : trip.status === "active"
        ? 50
        : 15
    : 0;
  const hotel = trip?.hotels?.[0];
  const upcomingActivities = useMemo(
    () =>
      trip?.itinerary
        ?.slice(1)
        .flatMap((day) => day.activities.map((activity) => activity.title))
        .slice(0, 4) || [],
    [trip]
  );

  if (loading) {
    return (
      <AppShell>
        <Card className="mx-auto flex min-h-[280px] max-w-[1400px] items-center justify-center p-6 text-slate-600 sm:p-8">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
          Loading active trip...
        </Card>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-[1400px] border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
          {error}
        </Card>
      </AppShell>
    );
  }

  if (!trip || !today) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-[1400px] p-6 text-sm font-semibold text-slate-600">
          No active trip yet. Create a trip to start following it.
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-[1400px] space-y-10">
        <SectionHeading
          eyebrow="Active Trip"
          title={`Today in ${trip.destination}`}
          description="Your current day, next stops, hotel details, and travel progress are together for quick checks on the road."
        />

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.68fr)_minmax(280px,0.32fr)]">
          <Card className="min-w-0 p-5 shadow-soft sm:p-8">
            <div className="flex min-w-0 flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <Badge variant="success">{`Day ${today.dayNumber} of ${trip.durationDays}`}</Badge>
                <h1 className="mt-4 break-words text-4xl font-semibold leading-tight tracking-normal text-slate-950">
                  {getDayTitle(today)}
                </h1>
                <p className="mt-2 flex min-w-0 items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">{trip.destination}</span>
                </p>
              </div>
              <Button asChild size="lg">
                <Link href={`/trips/${trip._id}`}>
                  <Route className="h-5 w-5" />
                  Full Itinerary
                </Link>
              </Button>
            </div>

            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between text-sm font-semibold text-slate-700">
                <span>Trip Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="min-w-0 p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-accent">
                <CloudSun className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">Weather Information</h2>
              <p className="mt-2 break-words text-slate-600">Weather details are not connected yet.</p>
            </Card>
            <Card className="min-w-0 p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-primary">
                <BedDouble className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">Hotel Information</h2>
              <p className="mt-2 break-words text-slate-600">
                {hotel
                  ? `${hotel.name}, ${hotel.tier || trip.destination}`
                  : "No hotel selected yet."}
              </p>
            </Card>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.64fr)_minmax(280px,0.36fr)]">
          <Card className="min-w-0 p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <h2 className="break-words text-2xl font-semibold text-slate-950">Today&apos;s Timeline</h2>
                <p className="mt-1 break-words text-slate-500">
                  Activities, timing, and locations for the day.
                </p>
              </div>
              <CalendarDays className="h-7 w-7 text-primary" />
            </div>

            <div className="mt-6 space-y-4">
              {today.activities.map((activity, index) => (
                <div
                  key={`${activity.title}-${index}`}
                  className="grid min-w-0 gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:grid-cols-[70px_minmax(0,1fr)_auto]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-slate-950">{activity.title}</p>
                    <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">{activity.timeOfDay || "Anytime"}</span>
                    </p>
                    <p className="mt-1 flex min-w-0 items-center gap-2 text-sm text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">{activity.description || trip.destination}</span>
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4" />
                    Navigate
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="min-w-0 p-5 sm:p-7">
            <h2 className="break-words text-2xl font-semibold text-slate-950">Upcoming Activities</h2>
            <div className="mt-6 space-y-3">
              {upcomingActivities.length ? (
                upcomingActivities.map((item, index) => (
                  <div key={item} className="min-w-0 rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-primary">Next {index + 1}</p>
                    <p className="mt-1 break-words font-semibold text-slate-900">{item}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">No upcoming activities yet.</p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
