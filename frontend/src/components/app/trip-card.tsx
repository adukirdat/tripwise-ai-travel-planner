import Image from "next/image";
import Link from "next/link";
import { Calendar, CircleDollarSign, Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TripCardProps = {
  id: string;
  destination: string;
  location: string;
  image: string;
  days: string;
  budget: string;
  createdDate?: string;
  variant?: "compact" | "detailed";
  deleting?: boolean;
  onDelete?: (id: string) => void;
};

export function TripCard({
  id,
  destination,
  location,
  image,
  days,
  budget,
  createdDate,
  variant = "compact",
  deleting = false,
  onDelete
}: TripCardProps) {
  return (
    <Card className="travel-card-hover flex h-full min-w-0 flex-col overflow-hidden p-0">
      <div className="relative h-52 sm:h-56">
        <Image
          src={image}
          alt={destination}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950/45 to-transparent" />
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
              {destination}
            </h3>
            <p className="mt-1.5 flex min-w-0 items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="min-w-0 break-words">{location}</span>
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 text-sm min-[380px]:grid-cols-2">
          <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
            <p className="flex min-w-0 items-center gap-1.5 font-semibold text-slate-800">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <span className="min-w-0 break-words">{days}</span>
            </p>
          </div>
          <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
            <p className="flex min-w-0 items-center gap-1.5 font-semibold text-slate-800">
              <CircleDollarSign className="h-4 w-4 shrink-0 text-success" />
              <span className="min-w-0 break-words">{budget}</span>
            </p>
          </div>
        </div>

        {createdDate ? (
          <p className="mt-4 text-sm font-medium text-slate-500">Created {createdDate}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
          <Button asChild size="sm">
            <Link href={`/trips/${id}`}>View Details</Link>
          </Button>
          {variant === "detailed" ? (
            <>
              <Button asChild size="sm" variant="outline">
                <Link href={`/trips/${id}/customize`}>Customize</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/active-trip">Start Trip</Link>
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete?.(id)}
                disabled={deleting}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {deleting ? "Deleting" : "Delete"}
              </Button>
            </>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
