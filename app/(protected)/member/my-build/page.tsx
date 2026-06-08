import { eq } from "drizzle-orm";

import { MemberShell } from "@/components/member/member-shell";
import { db } from "@/db/db";
import { builds } from "@/db/schema";
import { updateMyBuild } from "../actions";
import { BuildCoverUploader } from "@/components/member/build-cover-uploader";
import { getCurrentUser } from "@/lib/get-current-user";
import { AutoResizeTextarea } from "@/components/member/auto-resize-textarea";

export default async function MyBuildPage() {
  const user = await getCurrentUser();

  const build = await db.query.builds.findFirst({
    where: eq(builds.userId, user.id),
  });

  return (
    <MemberShell
      title="My Build"
      description="Manage your Honda ADV build details, parts list, story, and featured build information."
    >
      <form
        action={updateMyBuild}
        className="grid gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-6"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            name="title"
            label="Build Name"
            placeholder="ADV 160 Street Beast"
            defaultValue={build?.title ?? ""}
            required
          />

          <Field
            name="motorcycleModel"
            label="Motorcycle Model"
            placeholder="Honda ADV 160"
            defaultValue={build?.motorcycleModel ?? ""}
            required
          />

          <Field
            name="yearModel"
            label="Year Model"
            placeholder="2024"
            defaultValue={build?.yearModel ?? ""}
          />

          <Field
            name="concept"
            label="Concept"
            placeholder="Circuit / Indo / Malaysian"
            defaultValue={build?.concept ?? ""}
          />
        </div>

        <AutoResizeTextarea
          name={"description"}
          label="Build Description"
          defaultValue={build?.description ?? ""}
          placeholder={"Short summary of your setup..."}
        />

        <AutoResizeTextarea
          name={"engineSetup"}
          label="Engine Setup"
          defaultValue={build?.engineSetup ?? ""}
          placeholder={"Example: MTRT 63mm block, cams, throttle body, injector..."}
        />

        <AutoResizeTextarea
          name={"cvtSetup"}
          label="CVT Setup"
          defaultValue={build?.cvtSetup ?? ""}
          placeholder={"Example: pulley, flyball grams, center spring, clutch spring..."}
        />

        <AutoResizeTextarea
          name={"suspensionSetup"}
          label="Suspension Setup"
          defaultValue={build?.suspensionSetup ?? ""}
          placeholder={"Example: RCB rear shock, front fork tuning..."}
        />

        <AutoResizeTextarea
          name={"brakingSetup"}
          label="Braking Setup"
          defaultValue={build?.brakingSetup ?? ""}
          placeholder={"Example: caliper, disc, brake hose, pads..."}
        />

        <AutoResizeTextarea
          name={"wheelSetup"}
          label="Wheel / Tire Setup"
          defaultValue={build?.wheelSetup ?? ""}
          placeholder={"Example: RCB mags, tire sizes, tire brand..."}
        />

        <AutoResizeTextarea
          name={"accessories"}
          label="Accessories"
          defaultValue={build?.accessories ?? ""}
          placeholder={"Example: box, lights, windshield, crash guard, phone mount..."}
        />

        <div>
          <BuildCoverUploader defaultValue={build?.coverImageUrl ?? ""} />
        </div>

        <div className="rounded-2xl border border-white/10 bg-black p-5">
          <p className="text-xs font-black uppercase tracking-widest text-white/50">
            Build Status
          </p>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <span className="rounded-full border border-white/10 px-4 py-2 font-bold uppercase text-white/70">
              Status: {build?.status ?? "draft"}
            </span>

            <span className="rounded-full border border-white/10 px-4 py-2 font-bold uppercase text-white/70">
              Featured: {build?.isFeatured ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <button className="w-fit -skew-x-12 bg-red-600 px-6 py-3 text-sm font-black uppercase text-white hover:bg-red-500">
          Save Build
        </button>
      </form>
    </MemberShell>
  );
}

function Field({
  name,
  label,
  placeholder,
  defaultValue,
  required = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>

      <input
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  placeholder,
  defaultValue,
  rows = 4,
}: {
  name: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </label>

      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-red-600"
      />
    </div>
  );
}