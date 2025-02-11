'use client';
import { SignInDialog } from "@/components/auth/SignInDialog";
import { useAuthGuard } from "@/hooks/use-auth-guard";


export default function AuthPage() {
    const { showSignIn, closeSignIn } = useAuthGuard()
  return (
    <div>
        <h1 className="text-4xl font-bold text-center mt-8">Auth Page</h1>
        <h2 className="text-2xl font-bold text-center mt-4">you are logged in already! why open this page??</h2>
       <SignInDialog isOpen={showSignIn} onClose={closeSignIn} />
    </div>
  );
}