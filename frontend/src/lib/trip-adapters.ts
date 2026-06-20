import { images } from "@/lib/data";
import type { EstimatedBudget, Hotel, ItineraryDay, Trip } from "@/lib/api";

const destinationImages = [
  { match: "bali", image: images.bali },
  { match: "goa", image: images.goa },
  { match: "japan", image: images.japan },
  { match: "tokyo", image: images.japan },
  { match: "kyoto", image: images.japan },
  { match: "dubai", image: images.dubai },
  { match: "switzerland", image: images.switzerland },
  { match: "swiss", image: images.switzerland },
  { match: "santorini", image: images.santorini },
  { match: "maldives", image: images.maldives },
  { match: "paris", image: images.paris },
  { match: "kerala", image: images.kerala }
];

export type TripCardModel = {
  id: string;
  destination: string;
  location: string;
  image: string;
  days: string;
  budget: string;
  createdDate?: string;
};

export type BudgetLine = {
  label: string;
  value: string;
};

export type HotelCardModel = {
  name: string;
  area: string;
  price: string;
  note: string;
  image: string;
};

export const formatCurrency = (amount?: number) => {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return "Not set";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date?: string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

export const getTripId = (trip: Trip) => trip._id;

export const getTripImage = (destination: string) => {
  const normalizedDestination = destination.toLowerCase();
  const imageMatch = destinationImages.find(({ match }) =>
    normalizedDestination.includes(match)
  );

  return imageMatch?.image || images.hero;
};

export const getTripDaysLabel = (durationDays: number) =>
  `${durationDays} ${durationDays === 1 ? "day" : "days"}`;

export const tripToCard = (trip: Trip): TripCardModel => ({
  id: getTripId(trip),
  destination: trip.destination,
  location: trip.destination,
  image: getTripImage(trip.destination),
  days: getTripDaysLabel(trip.durationDays),
  budget: trip.estimatedBudget?.total
    ? formatCurrency(trip.estimatedBudget.total)
    : trip.budgetTier,
  createdDate: formatDate(trip.createdAt)
});

export const budgetToLines = (budget?: EstimatedBudget): BudgetLine[] => {
  if (!budget) {
    return [];
  }

  return [
    { label: "Transport", value: formatCurrency(budget.transport) },
    { label: "Hotels", value: formatCurrency(budget.accommodation) },
    { label: "Food", value: formatCurrency(budget.food) },
    { label: "Activities", value: formatCurrency(budget.activities) },
    { label: "Total", value: formatCurrency(budget.total) }
  ];
};

export const hotelsToCards = (hotels: Hotel[], destination: string): HotelCardModel[] =>
  hotels.map((hotel) => ({
    name: hotel.name,
    area: hotel.tier || destination,
    price: `${formatCurrency(hotel.estimatedCostNight)}/night`,
    note: hotel.rating ? `${hotel.rating.toFixed(1)} rating` : "Suggested stay",
    image: getTripImage(destination)
  }));

export const getDayTitle = (day: ItineraryDay) =>
  day.activities[0]?.title || `Day ${day.dayNumber}`;

export const getDayLocation = (trip: Trip, day: ItineraryDay) =>
  day.activities[0]?.description || trip.destination;

export const getTripOverview = (trip: Trip) =>
  trip.additionalNotes?.trim() ||
  `A ${getTripDaysLabel(trip.durationDays)} ${trip.budgetTier.toLowerCase()} trip for ${trip.travelerType.toLowerCase()} travelers, shaped around ${
    trip.interests.length ? trip.interests.join(", ") : "your selected interests"
  }.`;
