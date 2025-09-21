import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const TrustRating = ({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showValue = true,
  className 
}: TrustRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="flex">
        {[...Array(maxRating)].map((_, index) => {
          const filled = index < Math.floor(rating);
          const partial = index === Math.floor(rating) && rating % 1 !== 0;
          
          return (
            <Star
              key={index}
              className={cn(
                sizeClasses[size],
                filled || partial
                  ? "fill-accent text-accent"
                  : "text-muted-foreground"
              )}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={cn(
          "font-medium text-foreground",
          textSizeClasses[size]
        )}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default TrustRating;