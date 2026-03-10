/* ****** API Key Setup Dialog ****** */

"use client";

import { useMemo, useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { useModels } from "../hooks/use-models";
import { toast } from "sonner";
import { ShieldCheck, KeyRound, Eye, EyeOff } from "lucide-react";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (provider: string, modelId: string, apiKey: string) => Promise<void>;
  initialProvider?: string;
  initialModel?: string;
  initialApiKey?: string;
}

export function ApiKeyDialog({
  open,
  onOpenChange,
  onSave,
  initialProvider,
  initialModel,
  initialApiKey,
}: ApiKeyDialogProps) {
  const { providers, isLoading: modelsLoading } = useModels();
  const [selectedProvider, setSelectedProvider] = useState("");
  const [providerSearch, setProviderSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [modelSearch, setModelSearch] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialProvider) {
        setSelectedProvider(initialProvider);
        const name = providers.find((p) => p.id === initialProvider)?.name ?? initialProvider;
        setProviderSearch(name);
      } else {
        setSelectedProvider("");
        setProviderSearch("");
      }

      if (initialModel) {
        setSelectedModel(initialModel);
        // Try to derive a friendly name for the model from providers, fall back to id
        const providerObjLocal = providers.find((p) => p.id === initialProvider);
        const modelNameFromProvider = providerObjLocal && providerObjLocal.models && providerObjLocal.models[initialModel]
          ? (typeof (providerObjLocal.models as any)[initialModel] === "string"
              ? initialModel
              : ((providerObjLocal.models as any)[initialModel].name ?? initialModel))
          : initialModel;
        setModelSearch(modelNameFromProvider ?? initialModel);
      } else {
        setSelectedModel("");
        setModelSearch("");
      }

      if (initialApiKey) {
        setApiKey(initialApiKey);
      } else {
        setApiKey("");
      }
    } else {
      // Clear transient state when dialog closes
      setIsSaving(false);
      setSelectedProvider("");
      setProviderSearch("");
      setSelectedModel("");
      setModelSearch("");
      setApiKey("");
      setShowKey(false);
    }
  }, [open, initialProvider, initialModel, initialApiKey, providers]);

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
        const modelMeta =
          typeof model === "object" && model !== null
            ? (model as { name?: string })
            : null;
        return {
          id,
          name: typeof model === "string" ? id : (modelMeta?.name ?? id),
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

  async function handleSave() {
    if (!isValid) return;

    try {
      setIsSaving(true);

      const response = await fetch("/api/ai/verify-key", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          provider: selectedProvider,
          modelName: selectedModel,
          apiKey: apiKey.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        toast.error(data.error ?? "Unable to verify API key.");
        return;
      }

      await onSave(selectedProvider, selectedModel, apiKey.trim());
      toast.success("AI model configured successfully.");
      onOpenChange(false);
      setApiKey("");
      setShowKey(false);
    } catch {
      toast.error("Unable to verify API key. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="bg-primary/10 rounded-lg p-2">
              <KeyRound className="size-4 text-primary" />
            </div>
            <DialogTitle>Configure AI Model</DialogTitle>
          </div>
          <DialogDescription>
            Select your AI provider and model, then paste your API key. The key
            is encrypted and stored only in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* ****** Step 1: Provider ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="provider">
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full size-5 text-xs flex items-center justify-center font-semibold">
                  1
                </span>
                Provider
              </span>
            </Label>
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
                  modelsLoading ? "Loading providers..." : "Search providers..."
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

          {/* ****** Step 2: Model ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="model">
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full size-5 text-xs flex items-center justify-center font-semibold">
                  2
                </span>
                Model
              </span>
            </Label>
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

          {/* ****** Step 3: API Key ****** */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="apiKey">
              <span className="inline-flex items-center gap-1.5">
                <span className="bg-muted text-muted-foreground rounded-full size-5 text-xs flex items-center justify-center font-semibold">
                  3
                </span>
                API Key
              </span>
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showKey ? "text" : "password"}
                placeholder="sk-... or your provider key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showKey ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Separator />

          {/* ****** Security note ****** */}
          <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/40 rounded-lg p-3">
            <ShieldCheck className="size-4 shrink-0 text-emerald-500 mt-0.5" />
            <p>
              Your API key is encrypted with AES-GCM and stored only in your
              browser&apos;s local storage. It is never sent to any server
              except the AI provider.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button disabled={!isValid || isSaving} onClick={handleSave}>
            {isSaving ? "Verifying key..." : "Save & Verify"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
