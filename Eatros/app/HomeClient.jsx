"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";
import { checkUserSession } from "@/utils/auth";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAnimationComplete = async () => {
    setLoading(false);
    const session = await checkUserSession();
    if (session.isAuthenticated) {
      router.replace(session.route);
    } else {
      router.replace("/auth/login");
    }
  };

  if (loading) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return null;
}
