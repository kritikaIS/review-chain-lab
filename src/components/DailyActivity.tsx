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

  // Generate a full year of data (365 days) starting from 1 year ago
  const generateFullYearData = () => {
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    const fullYearData = [];
    const currentDate = new Date(oneYearAgo);
    
    // Find the start of the week (Sunday)
    const dayOfWeek = currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - dayOfWeek);
    
    // Generate 53 weeks (371 days to ensure we cover the full year)
    for (let i = 0; i < 371; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const existingData = activityData.find(day => day.date === dateStr);
      
      fullYearData.push({
        date: dateStr,
        contributions: existingData ? existingData.contributions : 0,
        reviewsCompleted: existingData ? existingData.reviewsCompleted : 0,
        papersSubmitted: existingData ? existingData.papersSubmitted : 0,
        pointsEarned: existingData ? existingData.pointsEarned : 0
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return fullYearData;
  };

  const fullYearData = generateFullYearData();

  // Group data by weeks for display (53 weeks)
  const weeks = [];
  for (let i = 0; i < fullYearData.length; i += 7) {
    weeks.push(fullYearData.slice(i, i + 7));
  }

  // Get month labels for the full year
  const monthLabels = [];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Add month labels at appropriate positions
  const monthPositions = [0, 4, 9, 13, 17, 22, 26, 30, 35, 39, 43, 48]; // Approximate week positions for each month
  
  monthPositions.forEach((weekIndex, monthIndex) => {
    if (weekIndex < weeks.length) {
      monthLabels.push({
        month: months[monthIndex],
        weekIndex: weekIndex
      });
    }
  });

  // Get contribution intensity color (GitHub-style)
  const getContributionColor = (contributions: number) => {
    if (contributions === 0) return "bg-gray-100 dark:bg-gray-800";
    if (contributions === 1) return "bg-green-200 dark:bg-green-900";
    if (contributions <= 3) return "bg-green-300 dark:bg-green-800";
    if (contributions <= 6) return "bg-green-400 dark:bg-green-700";
    return "bg-green-500 dark:bg-green-600";
  };

  return (
    <Card className={`max-w-full ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="h-5 w-5" />
            <span>{totalContributions} contributions in the last year</span>
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Contribution settings
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {/* GitHub-style Activity Grid */}
        <div className="space-y-2">
          {/* Month Labels */}
          <div className="flex justify-start ml-6 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max">
              {monthLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground whitespace-nowrap"
                  style={{ marginLeft: `${label.weekIndex * 14}px` }}
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
                {/* Day of week labels */}
                <div className="flex flex-col space-y-1 mr-2">
                  <div className="h-3"></div> {/* Spacer for alignment */}
                  <div className="h-3 text-xs text-muted-foreground flex items-center">Mon</div>
                  <div className="h-3"></div>
                  <div className="h-3 text-xs text-muted-foreground flex items-center">Wed</div>
                  <div className="h-3"></div>
                  <div className="h-3 text-xs text-muted-foreground flex items-center">Fri</div>
                  <div className="h-3"></div>
                </div>
                
                {/* Activity squares */}
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col space-y-1">
                    {week.map((day, dayIndex) => {
                      const date = new Date(day.date);
                      const isToday = date.toDateString() === new Date().toDateString();
                      
                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`w-3 h-3 rounded-sm ${getContributionColor(day.contributions)} hover:ring-2 hover:ring-primary/50 transition-all cursor-pointer ${
                            isToday ? 'ring-2 ring-primary' : ''
                          }`}
                          title={`${day.contributions} contributions on ${date.toLocaleDateString()}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Learn how we count contributions</span>
            <div className="flex items-center space-x-1">
              <span>Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800"></div>
                <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-800"></div>
                <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
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
      </CardContent>
    </Card>
  );
};

// Helper functions
function calculateCurrentStreak(activityData: ActivityData[]): number {
  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);
  
  // Sort data by date (most recent first)
  const sortedData = [...activityData].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (let i = 0; i < sortedData.length; i++) {
    const dataDate = new Date(sortedData[i].date);
    const daysDiff = Math.floor((today.getTime() - dataDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === i && sortedData[i].contributions > 0) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

function calculateLongestStreak(activityData: ActivityData[]): number {
  const sortedData = [...activityData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  let longestStreak = 0;
  let currentStreak = 0;
  
  for (const day of sortedData) {
    if (day.contributions > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  return longestStreak;
}

export default DailyActivity;