"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Pencil,
  RefreshCcw,
  Trash2
} from "lucide-react";

import {
  deleteTrip,
  getStoredToken,
  getTrip,
  regenerateDay,
  updateTrip,
  type Trip
} from "@/lib/api";
import {
  budgetToLines,
  getDayTitle,
  getTripDaysLabel,
  getTripImage,
  getTripOverview,
  hotelsToCards
} from "@/lib/trip-adapters";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function TripDetailsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [regeneratingDay, setRegeneratingDay] = useState<number | null>(null);
  const [deletingDay, setDeletingDay] = useState<number | null>(null);
  const [deletingTrip, setDeletingTrip] = useState(false);

  useEffect(() => {
    if (!getStoredToken()) {
      router.push("/login");
      return;
    }

    const loadTrip = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTrip(tripId);
        setTrip(response.trip);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load trip. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [router, tripId]);

  const budgetLines = useMemo(() => budgetToLines(trip?.estimatedBudget), [trip]);
  const hotels = useMemo(
    () => (trip ? hotelsToCards(trip.hotels, trip.destination) : []),
    [trip]
  );

  const handleRegenerateDay = async (dayNumber: number) => {
    if (!trip) {
      return;
    }

    const instruction = window.prompt(`How should TripWise regenerate day ${dayNumber}?`);

    if (!instruction?.trim()) {
      return;
    }

    setRegeneratingDay(dayNumber);
    setError("");
    setSuccess("");

    try {
      const response = await regenerateDay({
        tripId: trip._id,
        dayNumber,
        instruction
      });
      setTrip(response.trip);
      setSuccess(`Day ${dayNumber} regenerated.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to regenerate this day. Please try again."
      );
    } finally {
      setRegeneratingDay(null);
    }
  };

  const handleDeleteTrip = async () => {
    if (!trip) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${trip.destination}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingTrip(true);
    setError("");
    setSuccess("");

    try {
      await deleteTrip(trip._id);
      router.push("/my-trips?deleted=1");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete trip. Please try again."
      );
      setDeletingTrip(false);
    }
  };

  const handleDeleteDay = async (dayNumber: number) => {
    if (!trip) {
      return;
    }

    const confirmed = window.confirm(`Delete day ${dayNumber} from this itinerary?`);

    if (!confirmed) {
      return;
    }

    const nextItinerary = trip.itinerary.filter((day) => day.dayNumber !== dayNumber);
    setDeletingDay(dayNumber);
    setError("");
    setSuccess("");

    try {
      const response = await updateTrip(trip._id, { itinerary: nextItinerary });
      setTrip(response.trip);
      setSuccess(`Day ${dayNumber} deleted.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete this day. Please try again."
      );
    } finally {
      setDeletingDay(null);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <Card className="mx-auto flex min-h-[280px] max-w-[1400px] items-center justify-center p-6 text-slate-600 sm:p-8">
          <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
          Loading trip...
        </Card>
      </AppShell>
    );
  }

  if (error && !trip) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-[1400px] border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
          {error}
        </Card>
      </AppShell>
    );
  }

  if (!trip) {
    return (
      <AppShell>
        <Card className="mx-auto max-w-[1400px] p-6 text-sm font-semibold text-slate-600">
          Trip not found.
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-[1400px] space-y-10 lg:space-y-12">
        {error ? (
          <Card className="border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </Card>
        ) : null}

        {success ? (
          <Card className="border-green-100 bg-green-50 p-4 text-sm font-semibold text-green-700">
            {success}
          </Card>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl shadow-soft">
          <div className="relative h-[440px] sm:h-[500px]">
            <Image
              src={getTripImage(trip.destination)}
              alt={trip.destination}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/84 via-slate-950/48 to-slate-950/10" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-slate-950/48 to-transparent" />
            <div className="relative flex h-full max-w-3xl flex-col justify-end p-5 text-white sm:p-8 lg:p-12">
              <Badge className="w-fit border-white/15 bg-white/15 text-white backdrop-blur">
                Trip Details
              </Badge>
              <h1 className="mt-5 break-words text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
                {trip.destination}
              </h1>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/88">
                <span className="flex min-w-0 items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 backdrop-blur">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">{trip.destination}</span>
                </span>
                <span className="flex min-w-0 items-center gap-2 rounded-full border border-white/18 bg-white/12 px-4 py-2 backdrop-blur">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span className="min-w-0 break-words">{getTripDaysLabel(trip.durationDays)}</span>
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <Link href={`/trips/${trip._id}/customize`}>
                    <Pencil className="h-5 w-5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white hover:text-red-600"
                  onClick={handleDeleteTrip}
                  disabled={deletingTrip}
                >
                  {deletingTrip ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                  {deletingTrip ? "Deleting" : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.68fr)_minmax(280px,0.32fr)]">
          <Card className="min-w-0 p-5 sm:p-8">
            <SectionHeading
              title="Trip Overview"
              description={getTripOverview(trip)}
              className="mb-0"
            />
          </Card>

          <Card className="min-w-0 p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Budget Summary</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Estimated spend by category
                </p>
              </div>
              <Badge>{trip.budgetTier}</Badge>
            </div>
            <div className="mt-5 grid gap-2.5">
              {budgetLines.map((item, index) => (
                <div
                  key={item.label}
                  className={`flex min-w-0 flex-col gap-1 rounded-lg border px-4 py-3 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between ${
                    index === budgetLines.length - 1
                      ? "border-blue-100 bg-blue-50 text-primary"
                      : "border-slate-200/80 bg-slate-50"
                  }`}
                >
                  <span className="break-words text-sm font-medium text-slate-600">{item.label}</span>
                  <span className="break-words font-semibold text-slate-950">{item.value}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        <section>
          <SectionHeading title="Recommended Hotels" />
          <div className="grid gap-5 lg:grid-cols-3">
            {hotels.length ? (
              hotels.map((hotel) => (
                <Card
                  key={hotel.name}
                  className="travel-card-hover flex h-full min-w-0 flex-col overflow-hidden p-0"
                >
                  <div className="relative h-52 sm:h-56">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/42 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    <div className="flex min-w-0 flex-col gap-3 min-[390px]:flex-row min-[390px]:items-start min-[390px]:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
                          {hotel.name}
                        </h3>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-500">
                          {hotel.area}
                        </p>
                      </div>
                      <p className="w-fit shrink-0 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-primary">
                        {hotel.price}
                      </p>
                    </div>
                    <p className="mt-4 break-words text-sm leading-6 text-slate-600">{hotel.note}</p>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-6 text-sm font-semibold text-slate-600 lg:col-span-3">
                No hotel recommendations yet.
              </Card>
            )}
          </div>
        </section>

        <section>
          <SectionHeading title="Day-by-Day Itinerary Timeline" />
          <div className="relative space-y-5 before:absolute before:bottom-8 before:left-4 before:top-8 before:w-px before:bg-slate-200 md:before:left-6">
            {trip.itinerary.map((day, index) => (
              <Card key={day.dayNumber} className="relative ml-11 min-w-0 p-4 sm:p-6 md:ml-16 md:p-7">
                <div className="absolute -left-11 top-7 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#F6F8FB] bg-primary text-sm font-semibold text-white md:-left-16 md:h-12 md:w-12">
                  {index + 1}
                </div>
                <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <Badge>{`Day ${day.dayNumber}`}</Badge>
                    <h3 className="mt-3 break-words text-2xl font-semibold leading-tight text-slate-950">
                      {getDayTitle(day)}
                    </h3>
                    <p className="mt-1 flex min-w-0 items-center gap-2 text-slate-500">
                      <MapPin className="h-4 w-4 shrink-0" />
                      <span className="min-w-0 break-words">{trip.destination}</span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/trips/${trip._id}/customize`}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRegenerateDay(day.dayNumber)}
                      disabled={regeneratingDay === day.dayNumber}
                    >
                      {regeneratingDay === day.dayNumber ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCcw className="h-4 w-4" />
                      )}
                      Regenerate Day
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteDay(day.dayNumber)}
                      disabled={deletingDay === day.dayNumber}
                    >
                      {deletingDay === day.dayNumber ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      {deletingDay === day.dayNumber ? "Deleting" : "Delete"}
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div
                      key={`${day.dayNumber}-${activity.title}-${activityIndex}`}
                      className="grid min-w-0 gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:grid-cols-[132px_minmax(0,1fr)]"
                    >
                      <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-primary">
                        <Clock className="h-4 w-4 shrink-0" />
                        <span className="min-w-0 break-words">{activity.timeOfDay || "Anytime"}</span>
                      </p>
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{activity.title}</p>
                        <p className="mt-1 break-words text-sm text-slate-500">{activity.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
