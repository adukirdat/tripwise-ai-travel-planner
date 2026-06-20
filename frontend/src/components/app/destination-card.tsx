import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type DestinationCardProps = {
  destination: string;
  country: string;
  image: string;
  description: string;
  price?: string;
};

export function DestinationCard({
  destination,
  country,
  image,
  description,
  price
}: DestinationCardProps) {
  return (
    <Card className="travel-card-hover group flex h-full min-w-0 flex-col overflow-hidden p-0">
      <div className="relative h-56 sm:h-60">
        <Image
          src={image}
          alt={destination}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/5 to-transparent" />
        {price ? (
          <Badge
            variant="dark"
            className="absolute right-4 top-4 bg-white text-slate-950 shadow-sm"
          >
            {price}
          </Badge>
        ) : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="break-words text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
              {destination}
            </h3>
            <p className="mt-1 break-words text-sm font-medium text-slate-500">{country}</p>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-white">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p className="mt-3 break-words text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </Card>
  );
}
