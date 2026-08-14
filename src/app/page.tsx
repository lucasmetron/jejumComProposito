import React from "react";
import { HomePageClient } from "@/components/home/HomePageClient";
import { getVerseOfTheDayServer } from "@/lib/verseService";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const initialVerse = await getVerseOfTheDayServer();

  return <HomePageClient initialVerse={initialVerse} />;
}
