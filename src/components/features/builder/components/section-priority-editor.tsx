"use client";

/* ****** Drag & Drop Section Priority Editor — 2026 Redesign ****** */

import { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  type ResumeSectionKey,
  RESUME_SECTION_LABELS,
  moveSectionItem,
} from "@/components/features/resume-templates";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionPriorityEditorProps {
  order: ResumeSectionKey[];
  onChange: (nextOrder: ResumeSectionKey[]) => void;
}

export function SectionPriorityEditor({
  order,
  onChange,
}: SectionPriorityEditorProps) {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [draggingSection, setDraggingSection] = useState<string | null>(null);

  function handleMove(currentIndex: number, direction: -1 | 1) {
    const nextIndex = currentIndex + direction;
    onChange(moveSectionItem(order, currentIndex, nextIndex));
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        Drag or use arrows to reorder. The export follows this order.
      </p>

      {/* ****** Section list — fills available height with internal scroll ****** */}
      <ul className="space-y-1.5 overflow-y-auto flex-1 max-h-[calc(100vh-28rem)] lg:max-h-none pr-0.5">
        <AnimatePresence initial={false}>
          {order.map((section, index) => {
            const isDraggingThis = draggingSection === section;
            const isDropTarget = dragOverIndex === index && !isDraggingThis;

            return (
              <motion.li
                key={section}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                draggable
                onDragStart={(event) => {
                  (event as unknown as React.DragEvent).dataTransfer.effectAllowed = "move";
                  (event as unknown as React.DragEvent).dataTransfer.setData("text/plain", section);
                  setDraggingSection(section);
                }}
                onDragEnd={() => {
                  setDraggingSection(null);
                  setDragOverIndex(null);
                }}
                onDragOver={(event) => {
                  (event as unknown as React.DragEvent).preventDefault();
                  (event as unknown as React.DragEvent).dataTransfer.dropEffect = "move";
                  setDragOverIndex(index);
                }}
                onDragLeave={() => setDragOverIndex(null)}
                onDrop={(event) => {
                  (event as unknown as React.DragEvent).preventDefault();
                  const draggedSection = (event as unknown as React.DragEvent).dataTransfer.getData("text/plain");
                  const fromIndex = order.indexOf(draggedSection as ResumeSectionKey);
                  const toIndex = index;
                  if (fromIndex !== toIndex) onChange(moveSectionItem(order, fromIndex, toIndex));
                  setDragOverIndex(null);
                  setDraggingSection(null);
                }}
                className={cn(
                  "group flex items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all duration-150 cursor-grab active:cursor-grabbing select-none",
                  isDraggingThis
                    ? "opacity-40 scale-95 border-dashed border-muted-foreground/40 bg-muted/20"
                    : isDropTarget
                      ? "border-primary/50 bg-primary/5 shadow-sm shadow-primary/10"
                      : "border-border/50 bg-background/80 hover:border-border hover:bg-muted/30",
                )}
              >
                {/* ****** Index badge ****** */}
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full text-[9px] font-bold tabular-nums transition-colors",
                    isDraggingThis
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {index + 1}
                </span>

                {/* ****** Drag handle ****** */}
                <GripVertical className="size-3.5 shrink-0 text-muted-foreground/50 group-hover:text-muted-foreground transition-colors" />

                {/* ****** Section label ****** */}
                <span className="flex-1 text-xs font-medium text-foreground">
                  {RESUME_SECTION_LABELS[section]}
                </span>

                {/* ****** Arrow controls ****** */}
                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-20"
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                  >
                    <ArrowUp className="size-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-6 rounded-lg hover:bg-primary/10 hover:text-primary disabled:opacity-20"
                    disabled={index === order.length - 1}
                    onClick={() => handleMove(index, 1)}
                  >
                    <ArrowDown className="size-3" />
                  </Button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
