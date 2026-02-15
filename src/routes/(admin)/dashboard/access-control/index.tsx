import { createFileRoute } from "@tanstack/react-router";
import { AccessControlPage } from "@/domains/users/containers/access-control-page";

export const Route = createFileRoute("/(admin)/dashboard/access-control/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AccessControlPage />;
}
