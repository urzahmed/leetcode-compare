"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp } from "lucide-react"

export function ProgressPrediction({ data }: { data: any }) {
  const { user1, user2 } = data
  const [dailyProblems1, setDailyProblems1] = useState(user1.averageProblemsPerDay)
  const [dailyProblems2, setDailyProblems2] = useState(user2.averageProblemsPerDay)
  const [predictionDays, setPredictionDays] = useState(90)

  // Calculate total problems
  const totalProblems1 = user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard
  const totalProblems2 = user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard

  // Generate prediction data
  const generatePredictionData = () => {
    const predictionData = []
    let currentProblems1 = totalProblems1
    let currentProblems2 = totalProblems2

    for (let day = 0; day <= predictionDays; day += 7) {
      predictionData.push({
        day,
        [user1.username]: currentProblems1,
        [user2.username]: currentProblems2,
      })

      currentProblems1 += dailyProblems1 * 7
      currentProblems2 += dailyProblems2 * 7
    }

    return predictionData
  }

  const predictionData = generatePredictionData()

  // Calculate catch-up day (if applicable)
  const calculateCatchupDay = () => {
    if (totalProblems1 === totalProblems2) return "Both users are currently tied"

    const leader = totalProblems1 > totalProblems2 ? user1.username : user2.username
    const follower = totalProblems1 > totalProblems2 ? user2.username : user1.username
    const difference = Math.abs(totalProblems1 - totalProblems2)
    const dailyDifference =
      totalProblems1 > totalProblems2 ? dailyProblems2 - dailyProblems1 : dailyProblems1 - dailyProblems2

    if (dailyDifference <= 0) {
      return `${follower} will not catch up to ${leader} at the current pace`
    }

    const daysToMatch = Math.ceil(difference / dailyDifference)
    const catchupDate = new Date()
    catchupDate.setDate(catchupDate.getDate() + daysToMatch)

    return `${follower} will catch up to ${leader} in approximately ${daysToMatch} days (${catchupDate.toLocaleDateString()})`
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Progress Prediction</CardTitle>
          <CardDescription>Visualize future progress based on daily problem-solving rates</CardDescription>
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
            <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" label={{ value: "Days from now", position: "insideBottomRight", offset: -5 }} />
              <YAxis label={{ value: "Total Problems", angle: -90, position: "insideLeft" }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey={user1.username}
                stroke="var(--color-user1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey={user2.username}
                stroke="var(--color-user2)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adjust Parameters</CardTitle>
          <CardDescription>Modify daily problem rates to see different predictions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="user1-rate">{user1.username} Daily Problems</Label>
              <span className="text-sm font-medium">{dailyProblems1.toFixed(1)}</span>
            </div>
            <Slider
              id="user1-rate"
              min={0.1}
              max={10}
              step={0.1}
              value={[dailyProblems1]}
              onValueChange={(value) => setDailyProblems1(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="user2-rate">{user2.username} Daily Problems</Label>
              <span className="text-sm font-medium">{dailyProblems2.toFixed(1)}</span>
            </div>
            <Slider
              id="user2-rate"
              min={0.1}
              max={10}
              step={0.1}
              value={[dailyProblems2]}
              onValueChange={(value) => setDailyProblems2(value[0])}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="prediction-days">Prediction Period (Days)</Label>
              <span className="text-sm font-medium">{predictionDays}</span>
            </div>
            <Slider
              id="prediction-days"
              min={30}
              max={365}
              step={30}
              value={[predictionDays]}
              onValueChange={(value) => setPredictionDays(value[0])}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Catch-up Analysis</CardTitle>
          <CardDescription>Estimated time for one user to catch up to the other</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Catch-up Prediction</span>
            </div>
            <p className="text-muted-foreground">{calculateCatchupDay()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="font-medium">Current Pace</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  {user1.username}: {user1.averageProblemsPerDay.toFixed(1)} problems/day
                </p>
                <p className="text-sm">
                  {user2.username}: {user2.averageProblemsPerDay.toFixed(1)} problems/day
                </p>
              </div>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Adjusted Pace</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  {user1.username}: {dailyProblems1.toFixed(1)} problems/day
                </p>
                <p className="text-sm">
                  {user2.username}: {dailyProblems2.toFixed(1)} problems/day
                </p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setDailyProblems1(user1.averageProblemsPerDay)
              setDailyProblems2(user2.averageProblemsPerDay)
            }}
          >
            Reset to Current Pace
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
