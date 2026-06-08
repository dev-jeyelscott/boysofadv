import Link from "next/link";
import { MemberShell } from "@/components/member/member-shell";

const cards = [
  {
    title: "Complete Profile",
    description: "Update your member details, nickname, codename, and bio.",
    href: "/member/profile",
  },
  {
    title: "Setup My Build",
    description: "Add your ADV setup, modifications, photos, and build story.",
    href: "/member/my-build",
  }
];

export default function MemberDashboardPage() {
  return (
    <MemberShell
      title="Dashboard"
      description="Manage your Boys of ADV member profile and motorcycle build."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition hover:-translate-y-1 hover:border-red-600/50 hover:bg-red-600/10"
          >
            <h2 className="text-xl font-black uppercase text-white">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/60">
              {card.description}
            </p>
          </Link>
        ))}
      </div>
    </MemberShell>
  );
}