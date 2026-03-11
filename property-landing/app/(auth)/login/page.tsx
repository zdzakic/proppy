/**
 * LoginPage
 *
 * ZAŠTO:
 * AuthLayout već definiše grid strukturu.
 * Ova stranica samo popunjava lijevu i desnu kolonu.
 */

import LoginForm from "@/components/ui/auth/LoginForm";
import LoginPromo from "@/components/ui/auth/LoginPromo";

export default function LoginPage() {
  return (
    <>
      {/* LEFT */}
      <div className="flex items-center justify-center bg-brand-bg px-6">
        <LoginForm />
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center bg-brand-primary text-white">
        <LoginPromo />
      </div>
    </>
  );
}