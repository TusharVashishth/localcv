"use client";

/* ****** Drag & Drop Section Priority Editor ****** */

import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import {
  type ResumeSectionKey,
  RESUME_SECTION_LABELS,
  moveSectionItem,
} from "@/components/features/resume-templates";
import { Button } from "@/components/ui/button";

interface SectionPriorityEditorProps {
  order: ResumeSectionKey[];
  onChange: (nextOrder: ResumeSectionKey[]) => void;
}

export function SectionPriorityEditor({
  order,
  onChange,
}: SectionPriorityEditorProps) {
  function handleMove(currentIndex: number, direction: -1 | 1) {
    const nextIndex = currentIndex + direction;
    onChange(moveSectionItem(order, currentIndex, nextIndex));
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground">
        Drag sections to change priority. Export follows this order.
      </p>

      <ul className="space-y-2">
        {order.map((section, index) => (
          <li
            key={section}
            draggable
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", section);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
            }}
            onDrop={(event) => {
              event.preventDefault();
              const draggedSection = event.dataTransfer.getData("text/plain");
              const fromIndex = order.indexOf(
                draggedSection as ResumeSectionKey,
              );
              const toIndex = index;
              onChange(moveSectionItem(order, fromIndex, toIndex));
            }}
            className="flex items-center gap-2 rounded-md border bg-muted/30 px-2.5 py-2"
          >
            <GripVertical className="size-3.5 text-muted-foreground" />
            <span className="flex-1 text-xs font-medium">
              {RESUME_SECTION_LABELS[section]}
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6"
                disabled={index === 0}
                onClick={() => handleMove(index, -1)}
              >
                <ArrowUp className="size-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-6"
                disabled={index === order.length - 1}
                onClick={() => handleMove(index, 1)}
              >
                <ArrowDown className="size-3.5" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
