import { redirect } from "next/navigation";

import { ROUTES } from "@/lib/constants/navigation";

export default function HomePage() {
  redirect(ROUTES.employees);
}
