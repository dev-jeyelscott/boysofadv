export default function AdminPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <div className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-red-500">
          Admistrator
        </p>
        <h1 className="mt-3 text-3xl font-black uppercase text-white md:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}
