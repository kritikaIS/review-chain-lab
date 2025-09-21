import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  currentPoints: number;
  level: string;
}

const ProgressBar = ({ currentPoints, level }: ProgressBarProps) => {
  const getLevelInfo = (level: string) => {
    switch (level) {
      case "Bronze Tier":
        return { min: 0, max: 999, next: "Silver Tier", color: "bg-amber-600" };
      case "Silver Tier":
        return { min: 1000, max: 2499, next: "Gold Tier", color: "bg-gray-400" };
      case "Gold Tier":
        return { min: 2500, max: 4999, next: "Platinum Tier", color: "bg-yellow-500" };
      case "Platinum Tier":
        return { min: 5000, max: 9999, next: "Diamond Tier", color: "bg-blue-400" };
      default:
        return { min: 0, max: 999, next: "Silver Tier", color: "bg-amber-600" };
    }
  };

  const levelInfo = getLevelInfo(level);
  const progress = ((currentPoints - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100;
  const pointsNeeded = levelInfo.max - currentPoints + 1;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{level}</span>
        <span className="text-muted-foreground">
          {currentPoints} / {levelInfo.max} points
        </span>
      </div>
      <Progress value={Math.min(progress, 100)} className="h-2" />
      <div className="text-xs text-muted-foreground text-center">
        {progress >= 100 ? (
          `Maximum level reached!`
        ) : (
          `${pointsNeeded} points to ${levelInfo.next}`
        )}
      </div>
    </div>
  );
};

export default ProgressBar;