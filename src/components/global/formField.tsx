"use client";
import { Control } from "react-hook-form";
import { cloneElement } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "../ui/badge";

interface FormFildItemProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  name: string;
  label?: string;
  isOptional?: boolean;
  description?: string;
  children: React.ReactElement;
}

export function FormFildItem({
  control,
  name,
  label,
  isOptional = false,
  description,
  children,
}: FormFildItemProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label &&
            <span className="flex flex-row items-center gap-2">
              <FormLabel>{label}</FormLabel>
              {isOptional &&
                <Badge variant='style' className="text-xs text-muted-foreground">
                  opcional
                </Badge>
              }
            </span>
          }
          <FormControl>
            {cloneElement(children, { ...field })}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}