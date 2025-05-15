"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts"
import { Badge } from "@/components/ui/badge"

export function TopicComparison({ data }: { data: any }) {
  const { user1, user2 } = data

  // Prepare data for the radar chart
  const radarData = [
    {
      subject: "Arrays",
      [user1.username]: user1.topicStrengths.arrays,
      [user2.username]: user2.topicStrengths.arrays,
      fullMark: 100,
    },
    {
      subject: "Strings",
      [user1.username]: user1.topicStrengths.strings,
      [user2.username]: user2.topicStrengths.strings,
      fullMark: 100,
    },
    {
      subject: "DP",
      [user1.username]: user1.topicStrengths.dp,
      [user2.username]: user2.topicStrengths.dp,
      fullMark: 100,
    },
    {
      subject: "Trees",
      [user1.username]: user1.topicStrengths.trees,
      [user2.username]: user2.topicStrengths.trees,
      fullMark: 100,
    },
    {
      subject: "Graphs",
      [user1.username]: user1.topicStrengths.graphs,
      [user2.username]: user2.topicStrengths.graphs,
      fullMark: 100,
    },
    {
      subject: "Sorting",
      [user1.username]: user1.topicStrengths.sorting,
      [user2.username]: user2.topicStrengths.sorting,
      fullMark: 100,
    },
  ]

  // Calculate strengths and weaknesses
  const getTopStrengths = (user) => {
    const topics = Object.entries(user.topicStrengths)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic, score]) => ({ topic, score }))

    return topics
  }

  const getTopWeaknesses = (user) => {
    const topics = Object.entries(user.topicStrengths)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([topic, score]) => ({ topic, score }))

    return topics
  }

  const user1Strengths = getTopStrengths(user1)
  const user1Weaknesses = getTopWeaknesses(user1)
  const user2Strengths = getTopStrengths(user2)
  const user2Weaknesses = getTopWeaknesses(user2)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Topic Strength Comparison</CardTitle>
          <CardDescription>Compare proficiency across different problem topics</CardDescription>
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
            className="h-[400px]"
          >
            <RadarChart outerRadius={150} data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar
                name={user1.username}
                dataKey={user1.username}
                stroke="var(--color-user1)"
                fill="var(--color-user1)"
                fillOpacity={0.3}
              />
              <Radar
                name={user2.username}
                dataKey={user2.username}
                stroke="var(--color-user2)"
                fill="var(--color-user2)"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user1.username}'s Profile</CardTitle>
          <CardDescription>Strengths and areas for improvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Top Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {user1Strengths.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                  {item.topic} ({item.score}%)
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {user1Weaknesses.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 bg-red-50 text-red-700 border-red-200">
                  {item.topic} ({item.score}%)
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Recommended Focus Areas</h3>
            <ul className="space-y-1 text-sm">
              {user1Weaknesses.map((item, index) => (
                <li key={index}>• Practice more {item.topic.toLowerCase()} problems to improve your skills</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user2.username}'s Profile</CardTitle>
          <CardDescription>Strengths and areas for improvement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Top Strengths</h3>
            <div className="flex flex-wrap gap-2">
              {user2Strengths.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                  {item.topic} ({item.score}%)
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Areas for Improvement</h3>
            <div className="flex flex-wrap gap-2">
              {user2Weaknesses.map((item, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 bg-red-50 text-red-700 border-red-200">
                  {item.topic} ({item.score}%)
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="text-sm font-medium mb-2">Recommended Focus Areas</h3>
            <ul className="space-y-1 text-sm">
              {user2Weaknesses.map((item, index) => (
                <li key={index}>• Practice more {item.topic.toLowerCase()} problems to improve your skills</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
