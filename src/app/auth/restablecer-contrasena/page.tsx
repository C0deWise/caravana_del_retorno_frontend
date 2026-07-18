import { Suspense } from "react";
import ResetPasswordForm from "@/auth/components/ResetPasswordForm";

function ResetPasswordFallback() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl text-center">
        <p className="text-text-muted">Cargando...</p>
      </div>
    </div>
  );
}

export default function RestablecerContrasenaPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 bg-[linear-gradient(180deg,rgba(2,64,89,0.08),rgba(255,255,255,1))]">
      <Suspense fallback={<ResetPasswordFallback />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}