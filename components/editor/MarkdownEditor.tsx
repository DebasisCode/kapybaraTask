"use client";

import { useState } from "react";
import { Eye, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder = "Write your post content in Markdown..." }: MarkdownEditorProps) {
  const [preview, setPreview] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between border-b">
        <label className="text-sm font-medium">Content</label>
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
        >
          {preview ? (
            <>
              <FileText className="h-4 w-4" />
              Edit
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Preview
            </>
          )}
        </button>
      </div>

      {preview ? (
        <div className="min-h-[400px] rounded-md border bg-card p-6">
          <div className="prose prose-zinc max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "*No content to preview*"}</ReactMarkdown>
          </div>
        </div>
      ) : (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      )}
    </div>
  );
}






