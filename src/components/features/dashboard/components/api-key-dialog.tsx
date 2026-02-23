/* ****** API Key Setup Dialog ****** */

"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { KeyRound } from "lucide-react";
import { useModels } from "../hooks/use-models";

interface ApiKeyDialogProps {
  open: boolean;
  onSave: (provider: string, modelId: string, apiKey: string) => void;
}

export function ApiKeyDialog({ open, onSave }: ApiKeyDialogProps) {
  const { providers, isLoading: modelsLoading } = useModels();
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [apiKey, setApiKey] = useState("");

  // Filter providers by search
  const filteredProviders = useMemo(() => {
    if (!providerSearch) return providers;
    return providers.filter((p) =>
      p.name.toLowerCase().includes(providerSearch.toLowerCase()),
    );
  }, [providers, providerSearch]);

  // Find selected provider object (selectedProvider stores provider id)
  const providerObj = useMemo(
    () => providers.find((p) => p.id === selectedProvider),
    [providers, selectedProvider],
  );

  // Filter models by search
  const availableModels = useMemo(() => {
    if (!providerObj) return [];
    // providerObj.models is an object: { [id]: { ...modelData } }
    const modelsArr = Object.entries(providerObj.models || {}).map(
      ([id, model]) => {
        const m = model as any;
        return {
          id,
          name: typeof model === "string" ? id : (m?.name ?? id),
        };
      },
    );
    if (!modelSearch) return modelsArr;
    return modelsArr.filter(
      (m) =>
        m.name.toLowerCase().includes(modelSearch.toLowerCase()) ||
        m.id.toLowerCase().includes(modelSearch.toLowerCase()),
    );
  }, [providerObj, modelSearch]);

  const isValid = selectedProvider && selectedModel && apiKey.trim();

  function handleSave() {
    if (!isValid) return;
    onSave(selectedProvider, selectedModel, apiKey.trim());
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure AI Model</DialogTitle>
          <DialogDescription>
            Add your LLM API key to enable AI-powered resume features.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4">
          {/* ****** Provider Select with Search ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="provider">Provider</Label>
            <Combobox
              value={selectedProvider}
              onValueChange={(val) => {
                const name = providers.find((p) => p.id === val)?.name ?? "";
                setSelectedProvider(val ?? "");
                setProviderSearch(name); // ****** Set search to name so it reflects selection ******
                setSelectedModel("");
                setModelSearch("");
              }}
            >
              <ComboboxInput
                placeholder={
                  modelsLoading ? "Loading..." : "Search providers..."
                }
                value={providerSearch}
                onChange={(e) => setProviderSearch(e.target.value)}
                disabled={modelsLoading}
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>No providers found.</ComboboxEmpty>
                  {filteredProviders.map((p) => (
                    <ComboboxItem key={p.id} value={p.id}>
                      {p.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* ****** Model Name with Search ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="model">Model</Label>
            <Combobox
              value={selectedModel}
              onValueChange={(val) => {
                const name =
                  availableModels.find((m) => m.id === val)?.name ?? "";
                setSelectedModel(val ?? "");
                setModelSearch(name); // ****** Set search to name so it reflects selection ******
              }}
              disabled={!selectedProvider || !providerObj}
            >
              <ComboboxInput
                placeholder={
                  !selectedProvider
                    ? "Select a provider first"
                    : "Search models..."
                }
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                disabled={!selectedProvider || !providerObj}
              />
              <ComboboxContent>
                <ComboboxList>
                  <ComboboxEmpty>No models found.</ComboboxEmpty>
                  {availableModels.map((model) => (
                    <ComboboxItem key={model.id} value={model.id}>
                      {model.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </div>

          {/* ****** API Key Input ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apiKey">API Key</Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button disabled={!isValid} onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
