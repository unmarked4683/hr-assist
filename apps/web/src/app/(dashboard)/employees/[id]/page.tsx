import { EmployeeDetails } from "@/components/Employees/EmployeeDetails";

interface EmployeePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EmployeeDetailsPage({
  params,
}: EmployeePageProps) {
  const { id } = await params;

  return <EmployeeDetails employeeId={id} />;
}
