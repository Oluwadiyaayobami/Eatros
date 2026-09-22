"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";

export default function HomeClient() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleAnimationComplete = () => {
    setLoading(false);
    // Changing this to point to the new login page route
    router.push('/login');
  };

  if (loading) {
    return <LoadingAnimation onComplete={handleAnimationComplete} />;
  }

  return null;
}
