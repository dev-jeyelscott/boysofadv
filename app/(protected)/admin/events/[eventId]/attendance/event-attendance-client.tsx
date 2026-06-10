"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { QrCode, RefreshCcw, Users } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EventData = {
  id: string;
  title: string;
  location: string | null;
  startDate: Date | string | null;
  endDate: Date | string | null;
  status: string;
  posterImageUrl: string | null;
};

type AttendanceRow = {
  id: string;
  status: string;
  checkedInAt: Date | string;
  distanceMeters: string;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  email: string | null;
};

type Props = {
  event: EventData;
  attendance: AttendanceRow[];
};

const QR_ROTATION_SECONDS = 30;

export function EventAttendanceClient({ event, attendance }: Props) {
  const [secondsLeft, setSecondsLeft] = useState(QR_ROTATION_SECONDS);

  const [checkInUrl, setCheckInUrl] = useState("");
  const [isLoadingQr, setIsLoadingQr] = useState(true);

  useEffect(() => {
    refreshQr();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          refreshQr();
          return QR_ROTATION_SECONDS;
        }

        return current - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event.id]);

  async function refreshQr() {
    setIsLoadingQr(true);

    const response = await fetch(
      `/api/admin/events/${event.id}/attendance/qr`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      setIsLoadingQr(false);
      return;
    }

    const data = (await response.json()) as {
      checkInUrl: string;
      expiresInSeconds: number;
    };

    setCheckInUrl(data.checkInUrl);
    setSecondsLeft(data.expiresInSeconds);
    setIsLoadingQr(false);
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[420px_1fr]">
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/4">
        <div className="relative aspect-[4/3] bg-white/5">
          {event.posterImageUrl ? (
            <Image
              src={event.posterImageUrl}
              alt={event.title}
              fill
              sizes="420px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-white/30">
              No poster
            </div>
          )}

          <div className="absolute left-4 top-4">
            <Badge className="rounded-full bg-red-600 px-4 py-1 font-black uppercase text-white">
              {event.status}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
              Tambike Event
            </p>

            <h2 className="mt-2 text-2xl font-black uppercase leading-tight text-white">
              {event.title}
            </h2>
          </div>

          <div className="grid gap-3 text-sm text-white/60">
            <Info label="Location" value={event.location || "—"} />
            <Info
              label="Start"
              value={
                event.startDate
                  ? new Date(event.startDate).toLocaleString()
                  : "—"
              }
            />
            <Info
              label="End"
              value={
                event.endDate ? new Date(event.endDate).toLocaleString() : "—"
              }
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                Secure QR
              </p>

              <h3 className="mt-2 text-xl font-black uppercase text-white">
                Scan to Check In
              </h3>
            </div>

            <div className="rounded-2xl border border-red-600/30 bg-red-600/10 p-3 text-red-400">
              <QrCode />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-5">
            {checkInUrl && !isLoadingQr ? (
              <QRCodeSVG
                value={checkInUrl}
                size={340}
                level="H"
                className="h-full w-full"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center text-sm font-black uppercase text-black/50">
                Generating QR...
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-white/40">
                Refreshes In
              </p>
              <p className="text-3xl font-black text-white">{secondsLeft}s</p>
            </div>

            <Button
              type="button"
              onClick={refreshQr}
              className="rounded-full bg-red-600 font-black uppercase text-white hover:bg-red-500"
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Rotate
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/4 p-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-red-400">
                Attendance
              </p>

              <h3 className="mt-2 text-xl font-black uppercase text-white">
                Live Check-ins
              </h3>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-white/60">
              <Users />
            </div>
          </div>

          <div className="space-y-3">
            {attendance.length > 0 ? (
              attendance.map((item) => {
                const name =
                  [item.firstName, item.lastName].filter(Boolean).join(" ") ||
                  item.nickname ||
                  item.email ||
                  "Unknown Member";

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-black uppercase text-white">
                          {name}
                        </p>

                        <p className="mt-1 text-xs text-white/40">
                          {item.email || "No email"}
                        </p>
                      </div>

                      <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-black uppercase text-emerald-400">
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-xs text-white/50 sm:grid-cols-2">
                      <p>
                        Checked in:{" "}
                        <span className="text-white/80">
                          {new Date(item.checkedInAt).toLocaleString()}
                        </span>
                      </p>

                      <p>
                        Distance:{" "}
                        <span className="text-white/80">
                          {Math.round(Number(item.distanceMeters))}m
                        </span>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center">
                <p className="text-sm text-white/50">No check-ins yet.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs font-black uppercase tracking-widest text-white/40">
        {label}
      </p>
      <p className="mt-1 break-words font-semibold text-white">{value}</p>
    </div>
  );
}
