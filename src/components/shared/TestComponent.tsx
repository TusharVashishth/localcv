"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { encryptSecret } from "@/lib/encryption";
import React, { useEffect } from "react";

export default function TestComponent() {
  const [configs, setConfigs] = React.useState<unknown[]>([]);

  useEffect(() => {
    const fetchConfigs = async () => {
      const allConfigs = await db.aiConfigs.toArray();
      setConfigs(allConfigs);
    };
    fetchConfigs();
  }, []);
  const handleClick = async () => {
    const existingKey = await db.aiConfigs.where("id").equals(1).first();

    if (existingKey) {
      alert("API key already exists. Check the console for details.");
      console.log("Existing API Key Config:", existingKey);
      return;
    }

    await db.aiConfigs.add({
      provider: "test",
      modelName: "test-model",
      encryptedApiKey: await encryptSecret("test-api-key"),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };
  return (
    <div>
      <h1>This is just for test</h1>
      <pre>{JSON.stringify(configs, null, 2)}</pre>
      <Button onClick={handleClick}>Click Me</Button>
    </div>
  );
}
