/* ============================================================
   Login Page — /login
   ============================================================
   Wraps the login form in a Suspense boundary so
   useSearchParams() works during static generation.
   ============================================================ */

import { Suspense } from 'react';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="text-gold text-xl font-bold">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
