"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Target, TrendingUp } from "lucide-react"

export function ProfileComparison({ data }: { data: any }) {
  const { user1, user2 } = data

  // Calculate who is ahead
  const totalProblems1 = user1.problemsSolved.easy + user1.problemsSolved.medium + user1.problemsSolved.hard
  const totalProblems2 = user2.problemsSolved.easy + user2.problemsSolved.medium + user2.problemsSolved.hard
  const difference = Math.abs(totalProblems1 - totalProblems2)
  const leader = totalProblems1 > totalProblems2 ? user1.username : user2.username
  const follower = totalProblems1 > totalProblems2 ? user2.username : user1.username

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProfileCard user={user1} />
      <ProfileCard user={user2} />

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Quick Comparison</CardTitle>
          <CardDescription>Key metrics comparison between the two profiles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <span>Total Problems Solved</span>
              </div>
              <div className="flex gap-4">
                <Badge variant="outline">
                  {user1.username}: {totalProblems1}
                </Badge>
                <Badge variant="outline">
                  {user2.username}: {totalProblems2}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={(totalProblems1 / (totalProblems1 + totalProblems2)) * 100} className="h-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                <span>Acceptance Rate</span>
              </div>
              <div className="flex gap-4">
                <Badge variant="outline">
                  {user1.username}: {user1.acceptanceRate}%
                </Badge>
                <Badge variant="outline">
                  {user2.username}: {user2.acceptanceRate}%
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress
                value={(user1.acceptanceRate / (user1.acceptanceRate + user2.acceptanceRate)) * 100}
                className="h-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Global Ranking</span>
              </div>
              <div className="flex gap-4">
                <Badge variant="outline">
                  {user1.username}: {user1.globalRanking.toLocaleString()}
                </Badge>
                <Badge variant="outline">
                  {user2.username}: {user2.globalRanking.toLocaleString()}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Progress
                value={
                  (Math.min(user1.globalRanking, user2.globalRanking) /
                    Math.max(user1.globalRanking, user2.globalRanking)) *
                  100
                }
                className="h-2"
              />
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Progress Gap Analysis</span>
            </div>
            <p className="text-muted-foreground">
              {leader} is ahead by {difference} problems. At {follower}'s current pace of{" "}
              {totalProblems1 > totalProblems2 ? user2.averageProblemsPerDay : user1.averageProblemsPerDay} problems per
              day, it would take approximately{" "}
              {Math.ceil(
                difference /
                  (totalProblems1 > totalProblems2 ? user2.averageProblemsPerDay : user1.averageProblemsPerDay),
              )}{" "}
              days to catch up.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ProfileCard({ user }: { user: any }) {
  const totalProblems = user.problemsSolved.easy + user.problemsSolved.medium + user.problemsSolved.hard

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <span>{user.username}</span>
          {user.premium && <Badge className="bg-amber-500">Premium</Badge>}
        </CardTitle>
        <CardDescription>Member since {user.memberSince}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <div className="text-center">
            <div className="text-3xl font-bold">{totalProblems}</div>
            <div className="text-xs text-muted-foreground">Problems Solved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{user.acceptanceRate}%</div>
            <div className="text-xs text-muted-foreground">Acceptance Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">{user.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Global Ranking</span>
            <span className="font-medium">{user.globalRanking.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Contest Rating</span>
            <span className="font-medium">{user.contestRating}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Avg. Problems/Day</span>
            <span className="font-medium">{user.averageProblemsPerDay.toFixed(1)}</span>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-500">Easy</span>
            <span>
              {user.problemsSolved.easy}/{user.totalProblems.easy}
            </span>
          </div>
          <Progress value={(user.problemsSolved.easy / user.totalProblems.easy) * 100} className="h-2 bg-muted mb-2" />

          <div className="flex justify-between text-sm mb-1">
            <span className="text-yellow-500">Medium</span>
            <span>
              {user.problemsSolved.medium}/{user.totalProblems.medium}
            </span>
          </div>
          <Progress
            value={(user.problemsSolved.medium / user.totalProblems.medium) * 100}
            className="h-2 bg-muted mb-2"
          />

          <div className="flex justify-between text-sm mb-1">
            <span className="text-red-500">Hard</span>
            <span>
              {user.problemsSolved.hard}/{user.totalProblems.hard}
            </span>
          </div>
          <Progress value={(user.problemsSolved.hard / user.totalProblems.hard) * 100} className="h-2 bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}
