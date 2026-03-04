import { useState } from "react";
import { toast } from "sonner";
import { Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SKILL_CATEGORIES } from "@/lib/skills-data";

export function ProfileSkillSelector({
  selected,
  onChange,
  errorMessage,
}: {
  selected: string[];
  onChange: (skills: string[]) => void;
  errorMessage?: string;
}) {
  const [activeCategoryId, setActiveCategoryId] = useState(
    SKILL_CATEGORIES[0].id,
  );
  const [customInput, setCustomInput] = useState("");

  const activeCategory = SKILL_CATEGORIES.find(
    (category) => category.id === activeCategoryId,
  )!;

  function toggleSkill(skill: string) {
    if (selected.includes(skill)) {
      onChange(selected.filter((selectedSkill) => selectedSkill !== skill));
      return;
    }
    onChange([...selected, skill]);
  }

  function addCustomSkill() {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    if (selected.includes(trimmed)) {
      toast.error("Skill already added.");
      return;
    }
    onChange([...selected, trimmed]);
    setCustomInput("");
  }

  return (
    <div className="space-y-4">
      {selected.length > 0 ? (
        <div className="min-h-12 flex flex-wrap gap-2 rounded-lg border bg-muted/40 p-3">
          {selected.map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="cursor-pointer gap-1 pr-1 transition-colors hover:bg-destructive/20 hover:text-destructive"
              onClick={() => toggleSkill(skill)}
            >
              {skill}
              <X className="size-3" />
            </Badge>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground min-h-12 flex items-center justify-center rounded-lg border bg-muted/20 p-3 text-sm">
          No skills selected — pick from categories below or add custom ones.
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {SKILL_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategoryId(category.id)}
            className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
              activeCategoryId === category.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {activeCategory.skills.map((skill) => {
          const isSelected = selected.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => toggleSkill(skill)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
                isSelected
                  ? "border-primary/50 bg-primary/10 font-medium text-primary"
                  : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent"
              }`}
            >
              {isSelected && <Check className="size-3" />}
              {skill}
            </button>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customSkill">Custom skill</Label>
        <div className="flex gap-2">
          <Input
            id="customSkill"
            placeholder="Add a custom skill..."
            value={customInput}
            onChange={(event) => setCustomInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomSkill();
              }
            }}
            className="text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCustomSkill}
          >
            <Plus className="size-4" />
            Add
          </Button>
        </div>
      </div>
      {errorMessage && (
        <p className="text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
