"use client";

import { SessionProvider } from "next-auth/react";
import React from "react";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {children}
    </SessionProvider>
  );
}
