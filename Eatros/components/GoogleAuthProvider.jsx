"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const DEFAULT_GOOGLE_CLIENT_ID =
  "703620296200-516k43vgq4vqn4a66km0cuirk4ogghup.apps.googleusercontent.com";

export default function GoogleAuthProvider({ children }) {
  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || DEFAULT_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}

