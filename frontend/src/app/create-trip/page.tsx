"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Loader2, PlaneTakeoff } from "lucide-react";

import { generateTrip, getStoredToken, type GenerateTripPayload } from "@/lib/api";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const interestOptions = [
  "Beaches",
  "Food",
  "Culture",
  "Adventure",
  "Shopping",
  "Nightlife",
  "Nature",
  "Relaxation"
];

const budgetOptionToTier = {
  Budget: "Low",
  Comfort: "Medium",
  Premium: "High",
  Luxury: "High"
} satisfies Record<string, GenerateTripPayload["budgetTier"]>;

const travelerOptionToType = {
  Solo: "Solo",
  Couple: "Couple",
  Family: "Family",
  Friends: "Friends",
  Workation: "Solo"
} satisfies Record<string, GenerateTripPayload["travelerType"]>;

export default function CreateTripPage() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [budgetOption, setBudgetOption] =
    useState<keyof typeof budgetOptionToTier>("Budget");
  const [travelerOption, setTravelerOption] =
    useState<keyof typeof travelerOptionToType>("Solo");
  const [interests, setInterests] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!getStoredToken()) {
      router.push("/login");
    }
  }, [router]);

  const toggleInterest = (interest: string) => {
    setInterests((currentInterests) =>
      currentInterests.includes(interest)
        ? currentInterests.filter((item) => item !== interest)
        : [...currentInterests, interest]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await generateTrip({
        destination,
        durationDays: Number(durationDays),
        budgetTier: budgetOptionToTier[budgetOption],
        travelerType: travelerOptionToType[travelerOption],
        interests,
        additionalNotes
      });

      router.push(`/trips/${response.trip._id}`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to generate trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto min-w-0 max-w-6xl">
        <SectionHeading
          eyebrow="Create Trip"
          title="Plan a trip around your travel style."
          description="Add the essentials and TripWise will shape a complete itinerary with budget, stays, and daily activities."
        />

        <Card className="overflow-hidden p-0 shadow-soft">
          <div className="grid min-w-0 lg:grid-cols-[minmax(0,0.72fr)_minmax(260px,0.28fr)]">
            <form className="grid min-w-0 gap-6 p-5 sm:p-8 lg:p-10" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Bali, Indonesia"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  required
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="days">Number of Days</Label>
                  <Input
                    id="days"
                    type="number"
                    min={1}
                    placeholder="7"
                    value={durationDays}
                    onChange={(event) => setDurationDays(event.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="budget">Budget Type</Label>
                  <select
                    id="budget"
                    className="h-11 w-full rounded-lg border border-slate-200/95 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.025)] focus-visible:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15"
                    value={budgetOption}
                    onChange={(event) =>
                      setBudgetOption(event.target.value as keyof typeof budgetOptionToTier)
                    }
                  >
                    <option>Budget</option>
                    <option>Comfort</option>
                    <option>Premium</option>
                    <option>Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="traveller">Traveller Type</Label>
                <select
                  id="traveller"
                  className="h-11 w-full rounded-lg border border-slate-200/95 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.025)] focus-visible:border-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/15"
                  value={travelerOption}
                  onChange={(event) =>
                    setTravelerOption(event.target.value as keyof typeof travelerOptionToType)
                  }
                >
                  <option>Solo</option>
                  <option>Couple</option>
                  <option>Family</option>
                  <option>Friends</option>
                  <option>Workation</option>
                </select>
              </div>

              <div className="grid gap-3">
                <Label>Interests</Label>
                <div className="grid gap-3 min-[390px]:grid-cols-2 sm:grid-cols-4">
                  {interestOptions.map((interest) => (
                    <label
                      key={interest}
                      className="flex min-w-0 items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-3 py-3 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.025)]"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 rounded border-slate-300 text-primary focus:ring-primary"
                        checked={interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                      />
                      <span className="min-w-0 break-words">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Prefer boutique hotels, vegetarian food, and easy transfers."
                  value={additionalNotes}
                  onChange={(event) => setAdditionalNotes(event.target.value)}
                />
              </div>

              {error ? (
                <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="w-full sm:w-fit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Travel Plan...
                  </>
                ) : (
                  <>
                    <PlaneTakeoff className="h-5 w-5" />
                    Generate Trip
                  </>
                )}
              </Button>
            </form>

            <aside className="min-w-0 border-t border-slate-200/80 bg-slate-50 p-5 sm:p-8 lg:border-l lg:border-t-0">
              <Badge variant="accent">Planning Brief</Badge>
              <div className="mt-6 space-y-4">
                {[
                  ["Budget", "Flights, hotels, food, activities"],
                  ["Stay", "Hotel recommendations by area"],
                  ["Timeline", "Daily route with time and location"],
                  ["Travel", "Progress view for active trips"]
                ].map(([title, detail]) => (
                  <div
                    key={title}
                    className="rounded-lg border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.025)]"
                  >
                    <p className="break-words font-semibold text-slate-950">{title}</p>
                    <p className="mt-1 break-words text-sm leading-6 text-slate-600">{detail}</p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
