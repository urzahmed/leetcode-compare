"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, TrendingUp } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

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
        [user1.username]: Math.round(currentProblems1),
        [user2.username]: Math.round(currentProblems2),
      })

      currentProblems1 += dailyProblems1 * 7
      currentProblems2 += dailyProblems2 * 7
    }

    return predictionData
  }

  const predictionData = generatePredictionData()

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">Day {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value} problems
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Progress Prediction</CardTitle>
          <CardDescription>Predict future progress based on current solving rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" label={{ value: "Days", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Problems Solved", angle: -90, position: "insideLeft" }} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey={user1.username}
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={user2.username}
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adjust Prediction Parameters</CardTitle>
          <CardDescription>Customize the prediction settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{user1.username}'s Daily Problems</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[dailyProblems1]}
                  onValueChange={([value]) => setDailyProblems1(value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-12 text-right">{dailyProblems1.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{user2.username}'s Daily Problems</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[dailyProblems2]}
                  onValueChange={([value]) => setDailyProblems2(value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="w-12 text-right">{dailyProblems2.toFixed(1)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Prediction Period (Days)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[predictionDays]}
                  onValueChange={([value]) => setPredictionDays(value)}
                  min={30}
                  max={365}
                  step={7}
                  className="flex-1"
                />
                <span className="w-12 text-right">{predictionDays}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Prediction Summary</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Based on current solving rates, {user1.username} will solve approximately{" "}
              {Math.round(dailyProblems1 * predictionDays)} more problems, and {user2.username} will solve approximately{" "}
              {Math.round(dailyProblems2 * predictionDays)} more problems in the next {predictionDays} days.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
