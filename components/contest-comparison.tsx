"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Trophy, TrendingUp, TrendingDown, Medal } from "lucide-react"

export function ContestComparison({ data }: { data: any }) {
  const { user1, user2 } = data

  // Prepare data for the line chart
  const contestData = user1.contestHistory.map((contest, index) => ({
    contest: `Contest ${index + 1}`,
    [user1.username]: contest,
    [user2.username]: user2.contestHistory[index],
  }))

  // Calculate contest stats
  const getContestStats = (user) => {
    const history = user.contestHistory
    const maxRating = Math.max(...history)
    const minRating = Math.min(...history)
    const currentRating = history[history.length - 1]
    const previousRating = history[history.length - 2] || currentRating
    const trend = currentRating > previousRating ? "up" : currentRating < previousRating ? "down" : "stable"
    const change = Math.abs(currentRating - previousRating)

    return {
      maxRating,
      minRating,
      currentRating,
      previousRating,
      trend,
      change,
    }
  }

  const user1Stats = getContestStats(user1)
  const user2Stats = getContestStats(user2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Contest Rating History</CardTitle>
          <CardDescription>Compare performance in LeetCode contests over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              [user1.username]: {
                label: user1.username,
                color: "hsl(var(--chart-1))",
              },
              [user2.username]: {
                label: user2.username,
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <LineChart data={contestData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="contest" />
              <YAxis domain={["dataMin - 100", "dataMax + 100"]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey={user1.username}
                stroke="var(--color-user1)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey={user2.username}
                stroke="var(--color-user2)"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user1.username}'s Contest Stats</CardTitle>
          <CardDescription>Performance metrics in LeetCode contests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>Current Rating</span>
            </div>
            <Badge className="text-lg px-3 py-1">{user1Stats.currentRating}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-purple-500" />
              <span>Highest Rating</span>
            </div>
            <span className="font-medium">{user1Stats.maxRating}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Lowest Rating</span>
            <span className="font-medium">{user1Stats.minRating}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Last Contest Change</span>
            <div className="flex items-center gap-1">
              {user1Stats.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : user1Stats.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`font-medium ${
                  user1Stats.trend === "up" ? "text-green-500" : user1Stats.trend === "down" ? "text-red-500" : ""
                }`}
              >
                {user1Stats.trend === "stable" ? "No change" : `${user1Stats.change} points`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Contests Participated</span>
            <span className="font-medium">{user1.contestHistory.length}</span>
          </div>

          <div className="p-4 bg-muted rounded-lg mt-4">
            <h3 className="text-sm font-medium mb-2">Rating Category</h3>
            <div className="flex items-center gap-2">
              <Badge
                className={`${
                  user1Stats.currentRating >= 2100
                    ? "bg-purple-500"
                    : user1Stats.currentRating >= 1800
                      ? "bg-yellow-500"
                      : user1Stats.currentRating >= 1500
                        ? "bg-blue-500"
                        : "bg-green-500"
                }`}
              >
                {user1Stats.currentRating >= 2100
                  ? "Master"
                  : user1Stats.currentRating >= 1800
                    ? "Expert"
                    : user1Stats.currentRating >= 1500
                      ? "Specialist"
                      : "Beginner"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user2.username}'s Contest Stats</CardTitle>
          <CardDescription>Performance metrics in LeetCode contests</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              <span>Current Rating</span>
            </div>
            <Badge className="text-lg px-3 py-1">{user2Stats.currentRating}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal className="h-5 w-5 text-purple-500" />
              <span>Highest Rating</span>
            </div>
            <span className="font-medium">{user2Stats.maxRating}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Lowest Rating</span>
            <span className="font-medium">{user2Stats.minRating}</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Last Contest Change</span>
            <div className="flex items-center gap-1">
              {user2Stats.trend === "up" ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : user2Stats.trend === "down" ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span
                className={`font-medium ${
                  user2Stats.trend === "up" ? "text-green-500" : user2Stats.trend === "down" ? "text-red-500" : ""
                }`}
              >
                {user2Stats.trend === "stable" ? "No change" : `${user2Stats.change} points`}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span>Contests Participated</span>
            <span className="font-medium">{user2.contestHistory.length}</span>
          </div>

          <div className="p-4 bg-muted rounded-lg mt-4">
            <h3 className="text-sm font-medium mb-2">Rating Category</h3>
            <div className="flex items-center gap-2">
              <Badge
                className={`${
                  user2Stats.currentRating >= 2100
                    ? "bg-purple-500"
                    : user2Stats.currentRating >= 1800
                      ? "bg-yellow-500"
                      : user2Stats.currentRating >= 1500
                        ? "bg-blue-500"
                        : "bg-green-500"
                }`}
              >
                {user2Stats.currentRating >= 2100
                  ? "Master"
                  : user2Stats.currentRating >= 1800
                    ? "Expert"
                    : user2Stats.currentRating >= 1500
                      ? "Specialist"
                      : "Beginner"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
