import { AutoResizeTextarea } from "@/components/ui/auto-resize-textarea";
import { EventPosterUploader } from "./event-poster-uploader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EventFormValue = {
  id?: string;
  title?: string;
  description?: string | null;
  location?: string | null;

  latitude?: string | number | null;
  longitude?: string | number | null;
  geoRadiusMeters?: number | null;

  startsAt?: Date | string;
  endsAt?: Date | string | null;
  status?: string;
  posterImageUrl?: string | null;
  posterImageKey?: string | null;
};

type Props = {
  event?: EventFormValue;
};

function toDateTimeLocal(value?: Date | string | null) {
  if (!value) return "";

  const date = new Date(value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  return date.toISOString().slice(0, 16);
}

export function EventFormFields({ event }: Props) {
  return (
    <div className="grid gap-4">
      {event?.id ? <input type="hidden" name="id" value={event.id} /> : null}

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Title
        </label>
        <input
          name="title"
          defaultValue={event?.title ?? ""}
          required
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Location
        </label>
        <input
          name="location"
          defaultValue={event?.location ?? ""}
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Latitude
        </label>

        <input
          type="number"
          step="0.0000001"
          name="latitude"
          defaultValue={event?.latitude ?? ""}
          placeholder="14.676041"
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Longitude
        </label>

        <input
          type="number"
          step="0.0000001"
          name="longitude"
          defaultValue={event?.longitude ?? ""}
          placeholder="121.043700"
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Radius (Meters)
        </label>

        <input
          type="number"
          min="1"
          name="geoRadiusMeters"
          defaultValue={event?.geoRadiusMeters ?? 100}
          placeholder="80"
          className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            Start Date
          </label>
          <input
            type="datetime-local"
            name="startsAt"
            defaultValue={toDateTimeLocal(event?.startsAt)}
            required
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
          />
        </div>

        <div>
          <label className="text-xs font-black uppercase tracking-widest text-white/50">
            End Date
          </label>
          <input
            type="datetime-local"
            name="endsAt"
            defaultValue={toDateTimeLocal(event?.endsAt)}
            className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none focus:border-red-500"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-black uppercase tracking-widest text-white/50">
          Status
        </label>
        <Select name="status" defaultValue={event?.status}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <AutoResizeTextarea
          label="Description"
          name="description"
          defaultValue={event?.description ?? ""}
        />
      </div>

      <EventPosterUploader
        defaultImageUrl={event?.posterImageUrl}
        defaultImageKey={event?.posterImageKey}
      />
    </div>
  );
}
