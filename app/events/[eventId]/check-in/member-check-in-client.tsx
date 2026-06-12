"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, MapPin, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

type EventData = {
  id: string;
  title: string;
  location: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  status: string;
};

type Props = {
  event: EventData;
  token: string;
};

type CheckInStatus = "idle" | "loading" | "success" | "error";

export function MemberCheckInClient({ event, token }: Props) {
  const [status, setStatus] = useState<CheckInStatus>("idle");
  const [message, setMessage] = useState("");

  async function handleCheckIn() {
    setStatus("loading");
    setMessage("Checking your location...");

    if (!navigator.geolocation) {
      setStatus("error");
      setMessage("Your browser does not support location checking.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `/api/events/${event.id}/attendance/check-in`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token,
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
              }),
            },
          );

          const data = (await response.json()) as {
            message?: string;
          };

          if (!response.ok) {
            setStatus("error");
            setMessage(data.message || "Check-in failed.");
            return;
          }

          setStatus("success");
          setMessage(data.message || "Attendance recorded successfully.");
        } catch {
          setStatus("error");
          setMessage("Something went wrong while checking in.");
        }
      },
      () => {
        setStatus("error");
        setMessage("Location permission is required to check in.");
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10 text-white">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/4 p-6 shadow-2xl shadow-red-950/30 sm:p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-red-600/30 bg-red-600/10 text-red-400">
          {status === "success" ? (
            <CheckCircle2 className="h-8 w-8" />
          ) : status === "error" ? (
            <ShieldAlert className="h-8 w-8" />
          ) : (
            <MapPin className="h-8 w-8" />
          )}
        </div>

        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-red-400">
            Tambike Attendance
          </p>

          <h1 className="mt-3 text-3xl font-black uppercase leading-tight sm:text-4xl">
            Check In
          </h1>

          <p className="mt-4 text-sm leading-7 text-white/60">
            Confirm your attendance for this tambike event. Location access is
            required to verify that you are near the venue.
          </p>
        </div>

        <div className="mt-8 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-4">
          <Info label="Event" value={event.title} />
          <Info label="Location" value={event.location || "—"} />
          <Info
            label="Start"
            value={
              event.startDate ? new Date(event.startDate).toLocaleString() : "—"
            }
          />
        </div>

        {message ? (
          <div
            className={`mt-5 rounded-2xl border p-4 text-sm leading-6 ${
              status === "success"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : status === "error"
                  ? "border-red-500/20 bg-red-500/10 text-red-300"
                  : "border-white/10 bg-white/5 text-white/60"
            }`}
          >
            {message}
          </div>
        ) : null}

        <Button
          type="button"
          disabled={status === "loading" || status === "success"}
          onClick={handleCheckIn}
          className="mt-6 h-12 w-full rounded-full bg-red-600 font-black uppercase text-white hover:bg-red-500"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying
            </>
          ) : status === "success" ? (
            "Checked In"
          ) : (
            "Confirm Check In"
          )}
        </Button>

        <p className="mt-5 text-center text-xs leading-6 text-white/70">
          Your QR token, login session, and GPS location will be validated by
          the server.
        </p>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-widest text-white/70">
        {label}
      </p>
      <p className="mt-1 wrap-break-word text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}
