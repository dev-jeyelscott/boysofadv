import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPartnerInquiry } from "./actions";
import { SiteHeader } from "@/components/site/site-header";
import { AutoResizeTextarea } from "@/components/member/auto-resize-textarea";

export default async function BeAPartnerPage({
  searchParams,
}: {
  searchParams: Promise<{ submitted?: string }>;
}) {
  const params = await searchParams;
  const submitted = params.submitted === "true";

  return (
    <main className="min-h-screen bg-black text-white">
      <SiteHeader />

      <section className="relative overflow-hidden px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.18),transparent_35%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-red-600/40" />
            <h1 className="text-center text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
              Be a Partner
            </h1>
            <div className="h-px flex-1 bg-red-600/40" />
          </div>
          <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-7 text-white/60 md:text-base">
            Connect your brand with the Boys of ADV community. Submit your
            partnership inquiry and our team will review your details.
          </p>

          <div className="mx-auto max-w-4xl">
            {submitted ? (
              <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 p-5 text-sm font-bold text-green-300">
                Partnership inquiry submitted successfully.
              </div>
            ) : null}

            <form
              action={submitPartnerInquiry}
              className="rounded-2xl border border-white/10 bg-white/4 p-6 shadow-2xl shadow-red-950/20 md:p-8"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Business Name"
                  name="businessName"
                  placeholder="Your business name"
                  required
                />

                <Field
                  label="Contact Person"
                  name="contactPerson"
                  placeholder="Full name"
                  required
                />

                <Field
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="partner@email.com"
                  required
                />

                <Field
                  label="Phone Number"
                  name="phoneNumber"
                  placeholder="09XX XXX XXXX"
                />

                <Field
                  label="Website URL"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://yourwebsite.com"
                />

                <Field
                  label="Facebook URL"
                  name="facebookUrl"
                  type="url"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div className="mt-5">
                <AutoResizeTextarea
                  label="Message"
                  name="message"
                  required
                  placeholder="Tell us about your brand, products, and partnership proposal..."
                />
              </div>

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="mt-8 -skew-x-12 rounded-none bg-red-600 px-8 py-6 text-sm font-black uppercase tracking-widest text-white hover:bg-red-500"
                >
                  Submit Partnership Inquiry
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

type FieldProps = {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
};

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required,
}: FieldProps) {
  return (
    <div>
      <Label className="text-xs font-black uppercase tracking-widest text-white/50">
        {label}
      </Label>
      <Input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 rounded-xl border-white/10 bg-black text-white placeholder:text-white/30 focus-visible:ring-red-600"
      />
    </div>
  );
}
