"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileComparison } from "@/components/profile-comparison"
import { ProblemComparison } from "@/components/problem-comparison"
import { ProgressPrediction } from "@/components/progress-prediction"
import { TopicComparison } from "@/components/topic-comparison"
import { ContestComparison } from "@/components/contest-comparison"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LeetCodeComparator() {
  const [username1, setUsername1] = useState("")
  const [username2, setUsername2] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [error, setError] = useState("")

  const handleCompare = async () => {
    if (!username1 || !username2) {
      setError("Please enter both usernames")
      return
    }

    setIsLoading(true)
    setError("")
    setProfileData(null) // Clear any previous data

    try {
      const response = await fetch(
        `/api/compare?user1=${encodeURIComponent(username1)}&user2=${encodeURIComponent(username2)}`,
        {
          // Add a longer timeout
          signal: AbortSignal.timeout(15000), // 15 seconds timeout
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch profile data" }))
        throw new Error(errorData.message || `Error ${response.status}: Failed to fetch profile data`)
      }

      const data = await response.json()

      if (!data.user1 || !data.user2) {
        throw new Error("Invalid response data. Please try again.")
      }

      setProfileData(data)
    } catch (err: any) {
      console.error("Error in comparison:", err)
      setError(err.message || "Error fetching profile data. Please check the usernames and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="username1">First LeetCode Username</Label>
              <Input
                id="username1"
                placeholder="e.g., leetcode_master"
                value={username1}
                onChange={(e) => setUsername1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username2">Second LeetCode Username</Label>
              <Input
                id="username2"
                placeholder="e.g., code_ninja"
                value={username2}
                onChange={(e) => setUsername2(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={handleCompare} className="w-full mt-6" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Comparing Profiles...
              </>
            ) : (
              "Compare Profiles"
            )}
          </Button>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {profileData && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="problems">Problems</TabsTrigger>
            <TabsTrigger value="prediction">Prediction</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6">
            <ProfileComparison data={profileData} />
          </TabsContent>
          <TabsContent value="problems" className="mt-6">
            <ProblemComparison data={profileData} />
          </TabsContent>
          <TabsContent value="prediction" className="mt-6">
            <ProgressPrediction data={profileData} />
          </TabsContent>
          <TabsContent value="topics" className="mt-6">
            <TopicComparison data={profileData} />
          </TabsContent>
          <TabsContent value="contests" className="mt-6">
            <ContestComparison data={profileData} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
