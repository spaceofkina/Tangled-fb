// components/ProtectedRoute.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session) {
      router.push("/login");
    } else if (adminOnly && !session.user?.isAdmin) {
      router.push("/unauthorized");
    }
  }, [session, status, router, adminOnly]);

  if (status === "loading" || !session) {
    return <div>Loading...</div>;
  }

  if (adminOnly && !session.user?.isAdmin) {
    return <div>Unauthorized</div>;
  }

  return children;
}