import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold">Central de Produção de Sites</h1>
        <p className="text-sm text-muted-foreground">Entre com sua conta para continuar.</p>
      </div>
      <LoginForm />
    </div>
  );
}
