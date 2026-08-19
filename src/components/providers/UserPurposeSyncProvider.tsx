"use client";

import { useUserPurposeSync } from "@/hooks/useUserPurposeSync";

export function UserPurposeSyncProvider({ children }: { children: React.ReactNode }) {
  useUserPurposeSync();
  return <>{children}</>;
}
