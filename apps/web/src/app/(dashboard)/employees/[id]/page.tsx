// app/(dashboard)/employees/[id]/page.tsx

interface EmployeePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailsPage({
  params,
}: EmployeePageProps) {
  // Wyciąganie parametru id z URL
  const { id } = await params;
  console.log("ID of the employee:", id);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Szczegóły pracownika</h1>
      <p className="mt-2 text-zinc-700">
        ID wybranego pracownika to:{" "}
        <span className="font-mono font-semibold text-emerald-600">{id}</span>
      </p>

      {/* //! API: Tutaj wjedzie zapytanie z TanStack Query po dane pracownika o ID: ${id} */}
    </div>
  );
}
