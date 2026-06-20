"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock, CreditCard, UserRound } from "lucide-react";

import { marketplacePlans } from "@/lib/data";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/app/app-shell";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function BuyPlansPage() {
  const [selectedPlan, setSelectedPlan] = useState(marketplacePlans[0]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const purchased = purchasedIds.includes(selectedPlan.id);

  return (
    <AppShell>
      <div className="mx-auto grid min-w-0 max-w-[1400px] gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(320px,430px)]">
        <div className="min-w-0">
          <SectionHeading
            eyebrow="Buy Plans"
            title="Travel plans created by experienced travelers."
            description="Browse ready-made routes with hotels, costs, and day-by-day details."
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {marketplacePlans.map((plan) => {
              const active = selectedPlan.id === plan.id;
              const isPurchased = purchasedIds.includes(plan.id);

              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className="min-w-0 text-left"
                >
                  <Card
                    className={cn(
                      "travel-card-hover flex h-full min-w-0 flex-col overflow-hidden p-0",
                      active && "border-blue-300 ring-2 ring-primary/15"
                    )}
                  >
                    <div className="relative h-60 sm:h-64">
                      <Image
                        src={plan.image}
                        alt={plan.name}
                        fill
                        sizes="(max-width: 1280px) 100vw, 35vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-950/62 to-transparent" />
                      <div className="absolute left-4 top-4 flex gap-2">
                        {isPurchased ? <Badge variant="success">Purchased</Badge> : null}
                      </div>
                      <div className="absolute bottom-4 right-4 rounded-full bg-white px-4 py-2 text-lg font-semibold text-slate-950 shadow-sm">
                        {plan.price}
                      </div>
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                      <h3 className="break-words text-lg font-semibold leading-tight text-slate-950 sm:text-xl">
                        {plan.name}
                      </h3>
                      <p className="mt-1.5 break-words text-sm font-medium text-slate-500">
                        {plan.destination}
                      </p>
                      <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-slate-600">
                        {plan.overview}
                      </p>

                      <div className="mt-auto grid gap-2.5 pt-5 min-[390px]:grid-cols-3">
                        <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
                          <Clock className="h-4 w-4 text-primary" />
                          <p className="mt-2 break-words text-sm font-semibold text-slate-900">{plan.days}</p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
                          <CreditCard className="h-4 w-4 text-success" />
                          <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                            {plan.budgetType}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-3">
                          <UserRound className="h-4 w-4 text-accent" />
                          <p className="mt-2 truncate text-sm font-semibold text-slate-900">
                            {plan.creator}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="min-w-0 xl:sticky xl:top-28 xl:self-start">
          <Card className="overflow-hidden p-0 shadow-soft">
            <div className="relative h-56">
              <Image
                src={selectedPlan.image}
                alt={selectedPlan.name}
                fill
                sizes="430px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/76 via-slate-950/16 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <Badge className="border-white/15 bg-white/15 text-white backdrop-blur">
                  Selected Plan
                </Badge>
                <div className="mt-3 flex min-w-0 flex-col gap-3 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
                  <h2 className="break-words text-2xl font-semibold leading-tight">{selectedPlan.name}</h2>
                  <p className="w-fit shrink-0 rounded-full bg-white px-3 py-1 text-base font-semibold text-slate-950">
                    {selectedPlan.price}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <section>
                <h3 className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  Overview
                </h3>
                <p className="mt-2 break-words leading-7 text-slate-600">{selectedPlan.overview}</p>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  Budget Breakdown
                </h3>
                <div className="mt-3 grid gap-2">
                  {selectedPlan.budget.map((item) => (
                    <div
                      key={item}
                      className="break-words rounded-lg border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  Hotels
                </h3>
                <div className="mt-3 grid gap-2">
                  {selectedPlan.hotels.map((hotel) => (
                    <div
                      key={hotel}
                      className="break-words rounded-lg border border-slate-200/80 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      {hotel}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-semibold uppercase tracking-normal text-slate-500">
                  Full Itinerary
                </h3>
                <div className="mt-3 grid gap-2">
                  {selectedPlan.itinerary.map((item, index) => (
                    <div
                      key={item}
                      className="flex min-w-0 gap-3 rounded-lg border border-slate-200/80 bg-slate-50 px-4 py-3"
                    >
                      <span className="shrink-0 font-semibold text-primary">D{index + 1}</span>
                      <span className="min-w-0 break-words text-sm font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              <Button
                className="w-full"
                size="lg"
                variant={purchased ? "secondary" : "default"}
                onClick={() => {
                  setPurchasedIds((current) =>
                    current.includes(selectedPlan.id)
                      ? current
                      : [...current, selectedPlan.id]
                  );
                }}
              >
                {purchased ? (
                  <>
                    <CheckCircle2 className="h-5 w-5" />
                    Added to My Trips
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Purchase Plan
                  </>
                )}
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
