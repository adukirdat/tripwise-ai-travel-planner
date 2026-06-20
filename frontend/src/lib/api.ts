const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000/api";

const AUTH_TOKEN_KEY = "tripwise_token";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Activity = {
  title: string;
  description: string;
  estimatedCost: number;
  timeOfDay: string;
};

export type ItineraryDay = {
  dayNumber: number;
  activities: Activity[];
};

export type Hotel = {
  name: string;
  tier: string;
  estimatedCostNight: number;
  rating: number;
};

export type EstimatedBudget = {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  total: number;
};

export type PackingItem = {
  item: string;
  category: string;
  isPacked: boolean;
};

export type Trip = {
  _id: string;
  userId?: string;
  destination: string;
  durationDays: number;
  budgetTier: "Low" | "Medium" | "High";
  travelerType: "Solo" | "Couple" | "Friends" | "Family";
  interests: string[];
  additionalNotes?: string;
  status: "draft" | "active" | "completed";
  itinerary: ItineraryDay[];
  hotels: Hotel[];
  estimatedBudget: EstimatedBudget;
  packingList: PackingItem[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  token: string;
  user: ApiUser;
};

export type TripsResponse = {
  count: number;
  trips: Trip[];
};

export type TripResponse = {
  message?: string;
  trip: Trip;
};

export type DeleteTripResponse = {
  message: string;
};

export type GenerateTripPayload = {
  destination: string;
  durationDays: number;
  budgetTier: Trip["budgetTier"];
  travelerType: Trip["travelerType"];
  interests: string[];
  additionalNotes?: string;
};

export type RegenerateDayPayload = {
  tripId: string;
  dayNumber: number;
  instruction: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
};

export const setStoredToken = (token: string) => {
  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearStoredToken = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
  }
};

const parseResponseBody = async (response: Response) => {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
};

export const apiRequest = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { body, headers, auth = true, ...requestOptions } = options;
  const token = auth ? getStoredToken() : null;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const responseBody = await parseResponseBody(response);

  if (!response.ok) {
    if (response.status === 401) {
      clearStoredToken();
    }

    const message =
      responseBody && typeof responseBody === "object" && "message" in responseBody
        ? String(responseBody.message)
        : "Request failed. Please try again.";

    throw new ApiError(response.status, message);
  }

  return responseBody as T;
};

export const login = (payload: { email: string; password: string }) =>
  apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    auth: false,
    body: payload
  });

export const register = (payload: { name: string; email: string; password: string }) =>
  apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    auth: false,
    body: payload
  });

export const getMe = () => apiRequest<{ user: ApiUser }>("/auth/me");

export const getTrips = () => apiRequest<TripsResponse>("/trips");

export const getTrip = (tripId: string) => apiRequest<TripResponse>(`/trips/${tripId}`);

export const generateTrip = (payload: GenerateTripPayload) =>
  apiRequest<TripResponse>("/ai/generate-trip", {
    method: "POST",
    body: payload
  });

export const updateTrip = (tripId: string, payload: Partial<Trip>) =>
  apiRequest<TripResponse>(`/trips/${tripId}`, {
    method: "PUT",
    body: payload
  });

export const deleteTrip = (tripId: string) =>
  apiRequest<DeleteTripResponse>(`/trips/${tripId}`, {
    method: "DELETE"
  });

export const regenerateDay = (payload: RegenerateDayPayload) =>
  apiRequest<TripResponse>("/ai/regenerate-day", {
    method: "POST",
    body: payload
  });
