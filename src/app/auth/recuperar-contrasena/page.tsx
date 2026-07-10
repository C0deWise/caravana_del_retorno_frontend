import ForgotPasswordForm from "@/auth/components/ForgotPasswordForm";

export default function RecuperarContrasenaPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 bg-[linear-gradient(180deg,rgba(2,64,89,0.08),rgba(255,255,255,1))]">
      <ForgotPasswordForm />
    </div>
  );
}