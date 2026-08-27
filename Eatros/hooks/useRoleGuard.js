"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useRoleGuard(allowedRole) {
  const router = useRouter();

  useEffect(() => {
    const userString = localStorage.getItem("eatroUser");
    if (!userString) {
      router.replace("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user.role !== allowedRole) {
        // Redirect to their appropriate dashboard based on actual role
        if (user.role === "vendor") {
          router.replace("/restaurant/home_dashboard");
        } else if (user.role === "agent") {
          router.replace("/agent/home_dashboard");
        } else if (user.role === "customer" || user.role === "user") {
          router.replace("/user/home_dashboard");
        } else {
          router.replace("/auth/login");
        }
      }
    } catch (e) {
      router.replace("/auth/login");
    }
  }, [router, allowedRole]);
}
