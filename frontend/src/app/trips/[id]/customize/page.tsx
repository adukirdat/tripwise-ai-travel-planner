"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Loader2,
  Plus,
  Save,
  Sparkles,
  Trash2
} from "lucide-react";

import {
  getStoredToken,
  getTrip,
  regenerateDay,
  updateTrip,
  type Activity,
  type ItineraryDay,
  type Trip
} from "@/lib/api";
import { getDayTitle, getTripDaysLabel, getTripImage } from "@/lib/trip-adapters";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const smartExamples = [
  "Add adventure activities to day 2",
  "Reduce budget for day 1",
  "Add local food experiences to day 3"
];

const parseDayNumber = (text: string) => {
  const match = text.match(/\bday\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

const updateDayActivities = (
  itinerary: ItineraryDay[],
  dayNumber: number,
  updater: (activities: Activity[]) => Activity[]
) =>
  itinerary.map((day) =>
    day.dayNumber === dayNumber
      ? {
          ...day,
          activities: updater(day.activities)
        }
      : day
  );

export default function CustomizeTripPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const tripId = params.id;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [draftItinerary, setDraftItinerary] = useState<ItineraryDay[]>([]);
  const [activityName, setActivityName] = useState("");
  const [activityTime, setActivityTime] = useState("");
  const [activityLocation, setActivityLocation] = useState("");
  const [smartInstruction, setSmartInstruction] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingDay, setSavingDay] = useState<number | null>(null);
  const [smartLoading, setSmartLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
        setDraftItinerary(response.trip.itinerary);
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

  const saveItinerary = async (dayNumber: number, itinerary = draftItinerary) => {
    if (!trip) {
      return;
    }

    setSavingDay(dayNumber);
    setError("");
    setSuccess("");

    try {
      const response = await updateTrip(trip._id, { itinerary });
      setTrip(response.trip);
      setDraftItinerary(response.trip.itinerary);
      setSuccess(`Day ${dayNumber} saved.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to save itinerary. Please try again."
      );
    } finally {
      setSavingDay(null);
    }
  };

  const handleAddActivity = () => {
    if (!draftItinerary.length || !activityName.trim()) {
      setError("Add an activity name before adding it to the itinerary.");
      return;
    }

    const requestedDayNumber = parseDayNumber(activityName);
    const targetDay =
      draftItinerary.find((day) => day.dayNumber === requestedDayNumber) ||
      draftItinerary[0];

    const newActivity: Activity = {
      title: activityName.trim(),
      timeOfDay: activityTime.trim() || "Anytime",
      description: activityLocation.trim(),
      estimatedCost: 0
    };

    setDraftItinerary((currentItinerary) =>
      updateDayActivities(currentItinerary, targetDay.dayNumber, (activities) => [
        ...activities,
        newActivity
      ])
    );
    setActivityName("");
    setActivityTime("");
    setActivityLocation("");
    setSuccess(`Activity added to day ${targetDay.dayNumber}.`);
    setError("");
  };

  const handleMoveActivity = (dayNumber: number, activityIndex: number, direction: -1 | 1) => {
    setDraftItinerary((currentItinerary) =>
      updateDayActivities(currentItinerary, dayNumber, (activities) => {
        const targetIndex = activityIndex + direction;

        if (targetIndex < 0 || targetIndex >= activities.length) {
          return activities;
        }

        const nextActivities = [...activities];
        const [activity] = nextActivities.splice(activityIndex, 1);
        nextActivities.splice(targetIndex, 0, activity);
        return nextActivities;
      })
    );
  };

  const handleDeleteActivity = (dayNumber: number, activityIndex: number) => {
    setDraftItinerary((currentItinerary) =>
      updateDayActivities(currentItinerary, dayNumber, (activities) =>
        activities.filter((_, index) => index !== activityIndex)
      )
    );
  };

  const handleSmartEdit = async () => {
    if (!trip) {
      return;
    }

    const dayNumber = parseDayNumber(smartInstruction);

    if (!dayNumber) {
      setError("Include a day number in the smart edit instruction, like day 3.");
      return;
    }

    setSmartLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await regenerateDay({
        tripId: trip._id,
        dayNumber,
        instruction: smartInstruction
      });
      setTrip(response.trip);
      setDraftItinerary(response.trip.itinerary);
      setSuccess(`Day ${dayNumber} regenerated.`);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to apply smart edit. Please try again."
      );
    } finally {
      setSmartLoading(false);
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
      <div className="mx-auto grid min-w-0 max-w-[1400px] gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <div className="min-w-0 space-y-7">
          <SectionHeading
            eyebrow="Customize Trip"
            title={`Refine ${trip.destination} day by day.`}
            description="Adjust the itinerary, add new stops, and keep the travel plan aligned with your pace."
          />

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

          <Card className="overflow-hidden p-0 shadow-soft">
            <div className="relative h-80">
              <Image
                src={getTripImage(trip.destination)}
                alt={trip.destination}
                fill
                priority
                sizes="(max-width: 1280px) 100vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white sm:left-8 sm:right-8">
                <Badge className="border-white/15 bg-white/15 text-white backdrop-blur">
                  {getTripDaysLabel(trip.durationDays)}
                </Badge>
                <h1 className="mt-3 break-words text-4xl font-semibold tracking-normal">
                  {trip.destination}
                </h1>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {draftItinerary.map((day) => (
              <Card key={day.dayNumber} className="min-w-0 p-5 sm:p-7">
                <div className="flex min-w-0 flex-col gap-4 min-[390px]:flex-row min-[390px]:items-start min-[390px]:justify-between">
                  <div className="min-w-0">
                    <Badge>{`Day ${day.dayNumber}`}</Badge>
                    <h2 className="mt-3 break-words text-xl font-semibold text-slate-950">
                      {getDayTitle(day)}
                    </h2>
                    <p className="mt-1 break-words text-sm text-slate-500">{trip.destination}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => saveItinerary(day.dayNumber)}
                    disabled={savingDay === day.dayNumber}
                  >
                    {savingDay === day.dayNumber ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save
                  </Button>
                </div>
                <div className="mt-5 space-y-3">
                  {day.activities.map((activity, activityIndex) => (
                    <div
                      key={`${day.dayNumber}-${activity.title}-${activityIndex}`}
                      className="flex min-w-0 flex-col gap-3 rounded-xl border border-slate-200/80 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="break-words font-semibold text-slate-950">{activity.title}</p>
                        <p className="mt-1 break-words text-sm text-slate-500">
                          {activity.timeOfDay || "Anytime"} - {activity.description || trip.destination}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Move activity up"
                          onClick={() => handleMoveActivity(day.dayNumber, activityIndex, -1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Move activity down"
                          onClick={() => handleMoveActivity(day.dayNumber, activityIndex, 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete activity"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteActivity(day.dayNumber, activityIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>

        <aside className="min-w-0 xl:sticky xl:top-28 xl:self-start">
          <Card className="overflow-hidden p-0 shadow-soft">
            <div className="border-b border-slate-200/80 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-normal text-primary">
                Edit Tools
              </p>
              <h2 className="mt-2 break-words text-2xl font-semibold text-slate-950">Customize Itinerary</h2>
            </div>

            <Tabs defaultValue="manual" className="p-5 sm:p-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manual">Manual Edit</TabsTrigger>
                <TabsTrigger value="smart">Smart Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="activity-name">Add Activity</Label>
                  <Input
                    id="activity-name"
                    placeholder="Sunset dinner in Canggu"
                    value={activityName}
                    onChange={(event) => setActivityName(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity-time">Time</Label>
                  <Input
                    id="activity-time"
                    placeholder="06:30 PM"
                    value={activityTime}
                    onChange={(event) => setActivityTime(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="activity-location">Location</Label>
                  <Input
                    id="activity-location"
                    placeholder="Canggu Beach"
                    value={activityLocation}
                    onChange={(event) => setActivityLocation(event.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleAddActivity}>
                  <Plus className="h-5 w-5" />
                  Add Activity
                </Button>

                <div className="grid gap-3 border-t border-slate-200 pt-5">
                  {["Edit Activity", "Delete Activity", "Reorder Activities"].map((action) => (
                    <Button key={action} variant="outline" className="justify-start">
                      {action}
                    </Button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="smart" className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Smart Edit Instructions</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Make day 3 more adventurous and keep the total budget under $1,700."
                    value={smartInstruction}
                    onChange={(event) => setSmartInstruction(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  {smartExamples.map((example) => (
                    <button
                      key={example}
                      type="button"
                      className="flex w-full min-w-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      onClick={() => setSmartInstruction(example)}
                    >
                      <Sparkles className="h-4 w-4 shrink-0 text-accent" />
                      <span className="min-w-0 break-words">{example}</span>
                    </button>
                  ))}
                </div>

                <Button className="w-full" onClick={handleSmartEdit} disabled={smartLoading}>
                  {smartLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : null}
                  Apply Changes
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
