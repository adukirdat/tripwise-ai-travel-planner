"use client";

import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { deleteTrip, getStoredToken, getTrips, type Trip } from "@/lib/api";
import { tripToCard } from "@/lib/trip-adapters";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { TripCard } from "@/components/app/trip-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function MyTripsPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingTripId, setDeletingTripId] = useState<string | null>(null);
  const tripCards = useMemo(() => trips.map(tripToCard), [trips]);

  useEffect(() => {
    if (!getStoredToken()) {
      router.push("/login");
      return;
    }

    const loadTrips = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getTrips();
        setTrips(response.trips);
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load trips. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTrips();
  }, [router]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("deleted") === "1") {
      setSuccess("Trip deleted successfully.");
    }
  }, []);

  const handleDeleteTrip = async (tripId: string) => {
    const trip = trips.find((item) => item._id === tripId);
    const confirmed = window.confirm(
      `Delete ${trip?.destination || "this trip"}? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingTripId(tripId);
    setError("");
    setSuccess("");

    try {
      await deleteTrip(tripId);
      setTrips((currentTrips) => currentTrips.filter((item) => item._id !== tripId));
      setSuccess("Trip deleted successfully.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to delete trip. Please try again."
      );
    } finally {
      setDeletingTripId(null);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-[1400px]">
        <SectionHeading
          eyebrow="My Trips"
          title="All your travel plans in one place."
          description="Saved, customized, and purchased itineraries stay organized by destination."
          action={
            <Button asChild>
              <Link href="/create-trip">
                <PlusCircle className="h-5 w-5" />
                Create Trip
              </Link>
            </Button>
          }
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {loading ? (
            <Card className="p-6 text-sm font-semibold text-slate-600 lg:col-span-3">
              Loading trips...
            </Card>
          ) : null}

          {error ? (
            <Card className="border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700 lg:col-span-3">
              {error}
            </Card>
          ) : null}

          {success ? (
            <Card className="border-green-100 bg-green-50 p-6 text-sm font-semibold text-green-700 lg:col-span-3">
              {success}
            </Card>
          ) : null}

          {!loading && !error && tripCards.length === 0 ? (
            <Card className="p-6 text-sm font-semibold text-slate-600 lg:col-span-3">
              No trips yet. Create a trip to start building your travel plans.
            </Card>
          ) : null}

          {tripCards.map((trip) => (
            <TripCard
              key={trip.id}
              {...trip}
              variant="detailed"
              deleting={deletingTripId === trip.id}
              onDelete={handleDeleteTrip}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
