"use client";

import { useRef, useState, useLayoutEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { RichText } from "./RichText";
import { cn } from "@/lib/utils";

const COLLAPSED_HEIGHT = 112; // roughly 4 lines of body text

export function ReadMoreRichText({ html, className }: { html: string; className?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [overflowing, setOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (contentRef.current) {
      setOverflowing(contentRef.current.scrollHeight > COLLAPSED_HEIGHT + 4);
    }
  }, [html]);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: expanded ? contentRef.current?.scrollHeight ?? undefined : COLLAPSED_HEIGHT }}
      >
        <RichText html={html} />
        {!expanded && overflowing && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-neutral-50 to-transparent" />
        )}
      </div>

      {overflowing && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
        >
          {expanded ? (
            <>
              بستن
              <ChevronUp size={15} />
            </>
          ) : (
            <>
              ادامه مطلب
              <ChevronDown size={15} />
            </>
          )}
        </button>
      )}
    </div>
  );
}
