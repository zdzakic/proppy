import RegisterCompanyForm from "@/components/ui/auth/RegisterCompanyForm";
import LoginPromo from "@/components/ui/auth/LoginPromo";

/**
 * RegisterPage

 * ZAŠTO:
 * - isti layout kao login (UX consistency)
 * - reuse postojećih komponenti (KISS)
 *
 * ŠTA RJEŠAVA:
 * - dupliranje layout logike
 * - različit izgled auth stranica
 */

export default function RegisterPage() {
  return (
      <>
        {/* LEFT - FORM */}
        <div className="flex items-center justify-center bg-brand-bg px-6">
            <RegisterCompanyForm />
        </div>

        {/* RIGHT - PROMO */}
        <div className="hidden lg:flex items-center justify-center bg-brand-primary text-white">
            <LoginPromo />
        </div>

      </>
  );
}