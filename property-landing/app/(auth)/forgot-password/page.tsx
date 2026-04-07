/**
 * Reset password page.
 *
 * ZAŠTO:

 */

import ForgotPasswordForm from "@/components/ui/auth/ForgotPasswordForm";
import LoginPromoAI from "@/components/ui/auth/LoginPromoAI";

export default function ForgotPasswordPage() {
  return (
    <>
      {/* LEFT */}
      <div className="flex items-center justify-center bg-brand-bg px-6">
        <ForgotPasswordForm />
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex items-center justify-center bg-brand-primary text-white">
        <LoginPromoAI />
      </div>
    </>
  );
}