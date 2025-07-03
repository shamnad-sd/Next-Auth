import LoadingFallback from "@/components/LoadingFallback";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { Suspense } from "react";

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  )
}