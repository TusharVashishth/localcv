/* ****** Previous Resume Card ****** */

"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Pencil, Trash2 } from "lucide-react";
import type { Resume } from "@/lib/db/schema";

interface ResumeCardProps {
  resume: Resume;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function ResumeCard({ resume, onEdit, onDelete }: ResumeCardProps) {
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(resume.updatedAt));

  return (
    <Card className="group hover:ring-primary/30 transition-all">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary rounded-lg p-2">
            <FileText className="size-5" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate">{resume.title}</CardTitle>
            <CardDescription>{formattedDate}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary">{resume.templateId}</Badge>
          {resume.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline">
              {skill}
            </Badge>
          ))}
          {resume.skills.length > 3 && (
            <Badge variant="outline">+{resume.skills.length - 3}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => resume.id && onEdit(resume.id)}
        >
          <Pencil data-icon="inline-start" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => resume.id && onDelete(resume.id)}
        >
          <Trash2 data-icon="inline-start" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
