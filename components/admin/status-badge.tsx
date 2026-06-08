export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-red-600/20 px-3 py-1 text-xs font-black uppercase text-red-400">
      {status.replace("_", " ")}
    </span>
  );
}
