import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: number;
  value: number;
  onValueChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Rating({
  count = 5,
  value,
  onValueChange,
  readOnly = false,
  size = "md",
  className,
  ...props
}: RatingProps) {
  const handleClick = (index: number) => {
    if (readOnly) return;
    
    // If clicking on the currently selected star, unselect it
    if (value === index + 1) {
      onValueChange?.(0);
    } else {
      onValueChange?.(index + 1);
    }
  };
  
  const getSize = () => {
    switch (size) {
      case "sm": return "w-4 h-4";
      case "lg": return "w-8 h-8";
      default: return "w-6 h-6";
    }
  };
  
  const starSize = getSize();
  
  return (
    <div
      className={cn("flex items-center gap-1", className)}
      {...props}
    >
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            starSize,
            "cursor-pointer transition-all",
            value > i 
              ? "fill-yellow-500 text-yellow-500" 
              : "text-muted-foreground",
            !readOnly && "hover:text-yellow-500"
          )}
          onClick={() => handleClick(i)}
        />
      ))}
    </div>
  );
}