"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAnimationComplete = () => {
    setLoading(false);
    // User requested to show the login page
    router.push('/auth/login');
  };

  if (loading) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return null;
}
