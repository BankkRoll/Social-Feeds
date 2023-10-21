import React, { forwardRef, useState, useRef } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
} from "./card";
import { cn } from "../../lib/utils";

const GlowCard = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCoords({ x, y });
    }
  };

  const handleMouseLeave = () => {
    setCoords(null);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", className)}
      {...props}
    >
      <Card ref={ref} className="overflow-hidden dark:bg-background">
        {children}
      </Card>
      {coords && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(circle closest-side at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.8), transparent),
              radial-gradient(circle closest-side at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.6), transparent),
              radial-gradient(circle closest-side at ${coords.x}px ${coords.y}px, rgba(255, 255, 255, 0.4), transparent)
            `,
            mixBlendMode: "overlay",
          }}
        />
      )}
    </div>
  );
});

GlowCard.displayName = "GlowCard";

export {
  GlowCard,
  CardHeader as GlowCardHeader,
  CardFooter as GlowCardFooter,
  CardTitle as GlowCardTitle,
  CardDescription as GlowCardDescription,
  CardContent as GlowCardContent,
  CardImage as GlowCardImage,
};
