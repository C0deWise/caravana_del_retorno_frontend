import ResetPasswordForm from "@/auth/components/ResetPasswordForm";

export default function RestablecerContrasenaPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 bg-[linear-gradient(180deg,rgba(2,64,89,0.08),rgba(255,255,255,1))]">
      <ResetPasswordForm />
    </div>
  );
}