import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(220,38,38,0.2),transparent_35%)]" />
      <div className="absolute inset-0 bg-black/70" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-20">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <p className="text-sm font-black uppercase tracking-[0.4em] text-red-500">
              Boys of ADV
            </p>

            <h1 className="mt-5 text-5xl font-black uppercase leading-none md:text-7xl">
              Not Your <span className="text-red-600 italic">Ordinary</span> ADV
            </h1>

            <p className="mt-6 max-w-xl text-lg font-medium text-white/70">
              Sign in to access your rider profile, builds, photos, and
              community features.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-4xl bg-red-600/20 blur-3xl" />

            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
              appearance={{
                variables: {
                  colorPrimary: "#dc2626",
                  colorBackground: "#111111",
                  colorText: "#ffffff",
                  colorTextSecondary: "rgba(255,255,255,0.75)",
                  colorInputText: "#ffffff",
                  colorInputBackground: "#171717",
                  colorDanger: "#ef4444",
                  borderRadius: "1rem",
                  fontFamily: "Montserrat, sans-serif",
                },
                elements: {
                  rootBox: "relative z-10 w-full",

                  cardBox:
                    "w-full rounded-4xl border border-white/10 bg-neutral-950/95 shadow-2xl backdrop-blur-xl",

                  card: "bg-transparent shadow-none",

                  headerTitle:
                    "!text-white text-3xl font-black uppercase tracking-tight",

                  headerSubtitle: "!text-white/70",

                  socialButtonsBlockButton:
                    "!bg-neutral-900 !text-white border-white/10 hover:!bg-neutral-800",

                  socialButtonsBlockButtonText: "!text-white",

                  dividerLine: "!bg-white/10",

                  dividerText: "!text-white/50",

                  formFieldLabel:
                    "!text-white/80 font-bold uppercase text-xs tracking-wide",

                  formFieldInput:
                    "!h-12 !rounded-full !border-white/10 !bg-neutral-900 !text-white placeholder:!text-white/55 focus:!border-red-500 focus:!ring-red-500",

                  formFieldInputShowPasswordButton:
                    "!text-white/50 hover:!text-white",

                  formFieldHintText: "!text-white/50",

                  formFieldErrorText: "!text-red-400",

                  formButtonPrimary:
                    "!h-12 !rounded-full !bg-red-600 font-black uppercase tracking-wide !text-white hover:!bg-red-700",

                  footerActionText: "!text-white/60",

                  footerActionLink:
                    "!font-bold !text-red-500 hover:!text-red-400",

                  identityPreviewText: "!text-white",

                  identityPreviewEditButton:
                    "!text-red-500 hover:!text-red-400",

                  otpCodeFieldInput:
                    "!border-white/10 !bg-neutral-900 !text-white",

                  formResendCodeLink:
                    "!text-red-500 hover:!text-red-400",

                  alertText: "!text-white",

                  alert: "!border-white/10 !bg-neutral-900",

                  userPreviewMainIdentifier: "!text-white",

                  userPreviewSecondaryIdentifier: "!text-white/60",
                },
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}