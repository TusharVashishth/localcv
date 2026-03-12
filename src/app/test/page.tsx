import TestComponent from "@/components/shared/TestComponent";
import { buildPageMetadata } from "@/lib/seo";
import React from "react";

export const metadata = buildPageMetadata({
  title: "Test",
  description: "Internal test page.",
  path: "/test",
  noIndex: true,
  keywords: ["internal"],
});

export default function testPage() {
  return <TestComponent />;
}
