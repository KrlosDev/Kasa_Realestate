import { createLazyFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "@/components/layout/auth-layout";
import { SignupForm } from "@/components/auth/signup-from";

export const Route = createLazyFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthLayout>
      <div className="w-full max-w-lg my-auto">
        <SignupForm />
      </div>
    </AuthLayout>
  );
}
