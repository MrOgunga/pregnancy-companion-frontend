import { redirect } from "next/navigation";
import { getClinician } from "@/lib/clinicianSession";
import { listAlerts } from "@/lib/queries";
import ClinicAlerts from "../_components/ClinicAlerts";

export const dynamic = "force-dynamic";

export default async function ClinicPage() {
  const clin = await getClinician();
  if (!clin) redirect("/clinic/login");
  const alerts = await listAlerts(undefined, 100);
  return <ClinicAlerts clinicianName={clin.name} alerts={alerts} />;
}
