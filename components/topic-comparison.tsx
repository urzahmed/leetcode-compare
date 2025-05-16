"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"

interface TopicStrengths {
  arrays: number
  strings: number
  dp: number
  trees: number
  graphs: number
  sorting: number
}

interface UserData {
  username: string
  topicStrengths: TopicStrengths
}

interface TopicComparisonProps {
  data: {
    user1: UserData
    user2: UserData
  }
}

export function TopicComparison({ data }: TopicComparisonProps) {
  const { user1, user2 } = data

  // Prepare data for radar chart
  const chartData = Object.keys(user1.topicStrengths).map((topic) => ({
    topic: topic.charAt(0).toUpperCase() + topic.slice(1),
    [user1.username]: user1.topicStrengths[topic as keyof TopicStrengths],
    [user2.username]: user2.topicStrengths[topic as keyof TopicStrengths],
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      )
    }
    return null
  }

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
          <CardDescription>Compare problem-solving strengths across different topics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Radar
                  name={user1.username}
                  dataKey={user1.username}
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.3}
                />
                <Radar
                  name={user2.username}
                  dataKey={user2.username}
                  stroke="hsl(var(--chart-2))"
                  fill="hsl(var(--chart-2))"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user1.username}'s Topic Strengths</CardTitle>
          <CardDescription>Problem-solving proficiency by topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(user1.topicStrengths).map(([topic, strength]) => (
            <div key={topic} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{topic}</span>
                <span className="font-medium">{strength.toFixed(1)}%</span>
              </div>
              <Progress value={strength} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{user2.username}'s Topic Strengths</CardTitle>
          <CardDescription>Problem-solving proficiency by topic</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(user2.topicStrengths).map(([topic, strength]) => (
            <div key={topic} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="capitalize">{topic}</span>
                <span className="font-medium">{strength.toFixed(1)}%</span>
              </div>
              <Progress value={strength} className="h-2" />
            </div>
          ))}
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
