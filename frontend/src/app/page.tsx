import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe2,
  Quote,
  ShieldCheck,
  Star,
  WalletCards
} from "lucide-react";

import {
  howItWorks,
  images,
  landingFeatures,
  popularDestinations,
  testimonials
} from "@/lib/data";
import { DestinationCard } from "@/components/app/destination-card";
import { Logo } from "@/components/app/logo";
import { SectionHeading } from "@/components/app/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="bg-white">
      <header className="sticky top-0 z-50 border-b border-slate-200/75 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <Link href="#features" className="hover:text-slate-950">
              Features
            </Link>
            <Link href="#destinations" className="hover:text-slate-950">
              Destinations
            </Link>
            <Link href="#testimonials" className="hover:text-slate-950">
              Reviews
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard">Start Planning</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative min-h-[74vh] overflow-hidden">
          <Image
            src={images.hero}
            alt="Mountain lake travel destination"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="image-overlay absolute inset-0" />
          <div className="relative mx-auto flex min-h-[74vh] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <Badge className="border-white/20 bg-white/15 text-white backdrop-blur">
                Travel plans, hotels, budgets, and live itinerary guidance
              </Badge>
              <h1 className="mt-6 text-5xl font-semibold tracking-normal sm:text-6xl lg:text-7xl">
                Plan Smarter. Travel Better.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/88 sm:text-xl">
                Build complete trip plans, customize each day, buy proven itineraries,
                and follow the journey from arrival to the last checkout.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/dashboard">
                    Start Planning
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-slate-950"
                >
                  <Link href="/buy-plans">Explore Plans</Link>
                </Button>
              </div>
              <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  ["18k+", "Trips planned"],
                  ["4.8/5", "Traveler rating"],
                  ["72", "Countries covered"]
                ].map(([value, label]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/18 bg-white/12 px-5 py-4 backdrop-blur"
                  >
                    <p className="text-2xl font-semibold">{value}</p>
                    <p className="text-sm text-white/78">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="TripWise"
              title="Everything a real trip needs before and during travel."
              description="TripWise keeps planning practical: itinerary, hotel options, costs, purchased plans, and active trip guidance live together."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {landingFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title} className="p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{feature.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <SectionHeading
                eyebrow="How it works"
                title="From destination idea to ready-to-follow itinerary."
                description="The flow is built for travelers who want polished structure and enough room to make the trip feel personal."
              />
              <div className="grid gap-4">
                {howItWorks.map((item) => (
                  <div
                    key={item.step}
                    className="flex gap-4 rounded-xl border border-slate-200/80 bg-slate-50 p-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-950">{item.title}</h3>
                      <p className="mt-1 leading-6 text-slate-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image
                  src={images.bali}
                  alt="Bali trip itinerary"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-3">
                {[
                  { icon: Globe2, label: "7 day route" },
                  { icon: WalletCards, label: "$1,850 budget" },
                  { icon: ShieldCheck, label: "Ready to travel" }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-xl border border-slate-200/80 bg-slate-50 p-4">
                      <Icon className="h-5 w-5 text-primary" />
                      <p className="mt-3 text-sm font-semibold text-slate-950">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </section>

        <section id="destinations" className="bg-slate-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Popular destinations"
              title="Start with places travelers already love."
              action={
                <Button asChild variant="outline">
                  <Link href="/buy-plans">View Plans</Link>
                </Button>
              }
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {popularDestinations.map((destination) => (
                <DestinationCard key={destination.destination} {...destination} />
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Traveler stories"
              title="Built for people who care about the whole journey."
            />
            <div className="grid gap-5 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <Quote className="h-7 w-7 text-primary" />
                    <div className="flex text-accent">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="leading-7 text-slate-700">{testimonial.quote}</p>
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="font-semibold text-slate-950">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-14 text-white">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div>
              <h2 className="text-3xl font-semibold tracking-normal">Ready for your next trip?</h2>
              <p className="mt-2 text-slate-300">
                Create, customize, purchase, and follow travel plans in one place.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/dashboard">
                Start Planning
                <CheckCircle2 className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Logo />
          <p>2026 TripWise. Travel planning for people who actually travel.</p>
        </div>
      </footer>
    </div>
  );
}
