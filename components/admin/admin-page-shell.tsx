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
    <main className="min-h-screen bg-black p-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-6">
        <div>
          <h1 className="text-3xl font-black uppercase">{title}</h1>
          <p className="mt-2 text-white/60">{description}</p>
        </div>

        {children}
      </div>
    </main>
  );
}
