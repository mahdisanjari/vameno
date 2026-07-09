import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";

export function RichText({ html, className }: { html: string; className?: string }) {
  return (
    <div
      className={cn("prose prose-lg prose-rtl max-w-none prose-headings:font-bold prose-a:text-primary-700", className)}
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
    />
  );
}
