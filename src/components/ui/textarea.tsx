import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-transparent dark:border-neutral-700 flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-neutral-300 bg-neutral-100 dark:bg-neutral-900 shadow-md",
        'focus-visible:border-ring focus-visible:ring-ring/20 focus-visible:ring-[3px]',
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
