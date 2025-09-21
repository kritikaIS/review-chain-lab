import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityData } from "@/data/mockData";
import { Calendar, TrendingUp } from "lucide-react";

interface DailyActivityProps {
  activityData: ActivityData[];
  className?: string;
}

const DailyActivity = ({ activityData, className = "" }: DailyActivityProps) => {
  // Calculate statistics
  const totalContributions = activityData.reduce((sum, day) => sum + day.contributions, 0);
  const currentStreak = calculateCurrentStreak(activityData);
  const longestStreak = calculateLongestStreak(activityData);
  const thisYearContributions = activityData.filter(day => 
    new Date(day.date).getFullYear() === new Date().getFullYear()
  ).reduce((sum, day) => sum + day.contributions, 0);

  // Get the maximum contributions in a single day for scaling
  const maxContributions = Math.max(...activityData.map(day => day.contributions), 1);

  // Group data by weeks for display
  const weeks = [];
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7));
  }

  // Get month labels
  const monthLabels = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = 0; i < weeks.length; i += 4) {
    const week = weeks[i];
    if (week && week.length > 0) {
      const date = new Date(week[0].date);
      monthLabels.push({
        month: months[date.getMonth()],
        weekIndex: i
      });
    }
  }

  return (
    <Card className={`max-w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Daily Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-hidden">
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalContributions}</div>
            <div className="text-xs text-muted-foreground">Total Contributions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{thisYearContributions}</div>
            <div className="text-xs text-muted-foreground">This Year</div>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="space-y-2">
          {/* Month Labels */}
          <div className="flex justify-start ml-2 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max">
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground whitespace-nowrap"
                  style={{ marginLeft: `${label.weekIndex * 12}px` }}
                >
                  {label.month}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Grid Container */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-1 min-w-max pb-2">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => {
                      const intensity = day.contributions / maxContributions;
                      const getColorClass = (intensity: number) => {
                        if (intensity === 0) return "bg-muted";
                        if (intensity <= 0.25) return "bg-primary/20";
                        if (intensity <= 0.5) return "bg-primary/40";
                        if (intensity <= 0.75) return "bg-primary/60";
                        return "bg-primary";
                      };

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${getColorClass(intensity)} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer`}
                          title={`${day.contributions} contributions on ${new Date(day.date).toLocaleDateString()}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Scroll hint */}
            <div className="absolute top-0 right-0 bg-gradient-to-l from-background to-transparent w-8 h-full pointer-events-none opacity-50" />
            <div className="absolute bottom-0 right-0 bg-gradient-to-t from-background to-transparent w-full h-4 pointer-events-none opacity-50" />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Less</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 rounded-sm bg-muted"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/20"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/40"></div>
              <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
              <div className="w-3 h-3 rounded-sm bg-primary"></div>
            </div>
            <span>More</span>
          </div>
        </div>

          {/* Activity Summary */}
        <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Activity Summary</span>
          </div>
          <div className="text-xs text-muted-foreground">
            You've been active for {activityData.filter(day => day.contributions > 0).length} days in the past year.
            {currentStreak > 0 && ` Currently on a ${currentStreak}-day streak!`}
          </div>
          <div className="text-xs text-muted-foreground mt-2 opacity-75">
            💡 Scroll horizontally to view the full year
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to calculate current streak
const calculateCurrentStreak = (activityData: ActivityData[]): number => {
  let streak = 0;
  const today = new Date();
  
  for (let i = activityData.length - 1; i >= 0; i--) {
    const day = activityData[i];
    const dayDate = new Date(day.date);
    const daysDiff = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak && day.contributions > 0) {
      streak++;
    } else if (daysDiff === streak + 1 && day.contributions === 0) {
      // Allow for one day gap
      continue;
    } else {
      break;
    }
  }
  
  return streak;
};

// Helper function to calculate longest streak
const calculateLongestStreak = (activityData: ActivityData[]): number => {
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const day of activityData) {
    if (day.contributions > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
};

export default DailyActivity;
