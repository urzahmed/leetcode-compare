"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"

export function ProblemComparison({ data }: { data: any }) {
  const { user1, user2 } = data

  // Prepare data for the bar chart
  const chartData = [
    {
      category: "Easy",
      [user1.username]: user1.problemsSolved.easy,
      [user2.username]: user2.problemsSolved.easy,
      total: user1.totalProblems.easy,
    },
    {
      category: "Medium",
      [user1.username]: user1.problemsSolved.medium,
      [user2.username]: user2.problemsSolved.medium,
      total: user1.totalProblems.medium,
    },
    {
      category: "Hard",
      [user1.username]: user1.problemsSolved.hard,
      [user2.username]: user2.problemsSolved.hard,
      total: user1.totalProblems.hard,
    },
  ]

  // Calculate percentages for the stacked bar chart
  const percentageData = [
    {
      category: "Easy",
      [user1.username]: (user1.problemsSolved.easy / user1.totalProblems.easy) * 100,
      [user2.username]: (user2.problemsSolved.easy / user2.totalProblems.easy) * 100,
    },
    {
      category: "Medium",
      [user1.username]: (user1.problemsSolved.medium / user1.totalProblems.medium) * 100,
      [user2.username]: (user2.problemsSolved.medium / user2.totalProblems.medium) * 100,
    },
    {
      category: "Hard",
      [user1.username]: (user1.problemsSolved.hard / user1.totalProblems.hard) * 100,
      [user2.username]: (user2.problemsSolved.hard / user2.totalProblems.hard) * 100,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Problem Difficulty Comparison</CardTitle>
          <CardDescription>Compare the number of problems solved by difficulty level</CardDescription>
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
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={user1.username} fill="var(--color-user1)" radius={4} />
              <Bar dataKey={user2.username} fill="var(--color-user2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completion Percentage</CardTitle>
          <CardDescription>Percentage of problems solved by difficulty</CardDescription>
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
            <BarChart data={percentageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis unit="%" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={user1.username} fill="var(--color-user1)" radius={4} />
              <Bar dataKey={user2.username} fill="var(--color-user2)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Problem Distribution</CardTitle>
          <CardDescription>Distribution of solved problems by difficulty</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <h3 className="text-sm font-medium mb-2">{user1.username}</h3>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-green-500"
                style={{
                  width: `${(user1.problemsSolved.easy / (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) * 100}%`,
                }}
              />
              <div
                className="bg-yellow-500"
                style={{
                  width: `${(user1.problemsSolved.medium / (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) * 100}%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${(user1.problemsSolved.hard / (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-500">
                Easy:{" "}
                {Math.round(
                  (user1.problemsSolved.easy /
                    (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
              <span className="text-yellow-500">
                Medium:{" "}
                {Math.round(
                  (user1.problemsSolved.medium /
                    (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
              <span className="text-red-500">
                Hard:{" "}
                {Math.round(
                  (user1.problemsSolved.hard /
                    (user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{user2.username}</h3>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div
                className="bg-green-500"
                style={{
                  width: `${(user2.problemsSolved.easy / (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) * 100}%`,
                }}
              />
              <div
                className="bg-yellow-500"
                style={{
                  width: `${(user2.problemsSolved.medium / (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) * 100}%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${(user2.problemsSolved.hard / (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-green-500">
                Easy:{" "}
                {Math.round(
                  (user2.problemsSolved.easy /
                    (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
              <span className="text-yellow-500">
                Medium:{" "}
                {Math.round(
                  (user2.problemsSolved.medium /
                    (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
              <span className="text-red-500">
                Hard:{" "}
                {Math.round(
                  (user2.problemsSolved.hard /
                    (user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard)) *
                    100,
                )}
                %
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
