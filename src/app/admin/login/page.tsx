import { LoginForm } from "@/app/admin/login/LoginForm";

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold">Admin Sign In</h1>
      <p className="mt-2 text-sm text-muted">Manage bookings, events, gallery, and pricing.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
