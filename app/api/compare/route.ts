import { NextResponse } from "next/server"

// LeetCode GraphQL API endpoint
const LEETCODE_API_URL = "https://leetcode.com/graphql"

// Function to fetch user profile data
async function fetchUserProfile(username: string) {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
          starRating
          userAvatar
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount
        rating
        globalRanking
        totalParticipants
        topPercentage
        badge {
          name
        }
      }
      userContestRankingHistory(username: $username) {
        attended
        trendDirection
        problemsSolved
        totalProblems
        finishTimeInSeconds
        rating
        ranking
        contest {
          title
          startTime
        }
      }
    }
  `

  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`)
    }

    return data.data
  } catch (error) {
    console.error(`Error fetching data for ${username}:`, error)
    throw error
  }
}

// Function to fetch user's solved problems by tags/topics
async function fetchUserSolvedByTags(username: string) {
  const query = `
    query userProblemsSolvedByTags($username: String!) {
      matchedUser(username: $username) {
        tagProblemCounts {
          advanced {
            tagName
            tagSlug
            problemsSolved
          }
          intermediate {
            tagName
            tagSlug
            problemsSolved
          }
          fundamental {
            tagName
            tagSlug
            problemsSolved
          }
        }
      }
    }
  `

  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`)
    }

    return data.data
  } catch (error) {
    console.error(`Error fetching tag data for ${username}:`, error)
    throw error
  }
}

// Function to fetch total problem counts
async function fetchTotalProblems() {
  // Updated query that matches LeetCode's current API structure
  const query = `
    query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
      problemsetQuestionList: questionList(
        categorySlug: $categorySlug
        limit: $limit
        skip: $skip
        filters: $filters
      ) {
        total: totalNum
        questions: data {
          difficulty
        }
      }
    }
  `

  try {
    const response = await fetch(LEETCODE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        Origin: "https://leetcode.com",
        Referer: "https://leetcode.com/problemset/",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.9",
      },
      body: JSON.stringify({
        query,
        variables: {
          categorySlug: "",
          skip: 0,
          limit: 1, // We only need the total count, not all questions
          filters: {},
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors[0].message}`)
    }

    // Count difficulties manually as a fallback
    const questions = data.data?.problemsetQuestionList?.questions || []
    const total = data.data?.problemsetQuestionList?.total || 0

    // If we can't get the breakdown by difficulty, use hardcoded percentages based on LeetCode's typical distribution
    return {
      total: total,
      easy: Math.round(total * 0.3), // ~30% are easy
      medium: Math.round(total * 0.5), // ~50% are medium
      hard: Math.round(total * 0.2), // ~20% are hard
    }
  } catch (error) {
    console.error("Error fetching total problems:", error)
    // Provide fallback values if the API call fails
    return {
      total: 2500, // Approximate total as of 2023
      easy: 750, // ~30%
      medium: 1250, // ~50%
      hard: 500, // ~20%
    }
  }
}

// Function to calculate average problems per day
function calculateAverageProblemsPerDay(totalSolved: number, memberSince: string) {
  const joinDate = new Date(memberSince)
  const today = new Date()
  const daysSinceJoining = Math.max(1, Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)))
  return totalSolved / daysSinceJoining
}

// Function to process and format user data
function processUserData(profileData: any, tagData: any, totalProblems: any) {
  if (!profileData.matchedUser) {
    throw new Error("User not found")
  }

  const user = profileData.matchedUser
  const contestData = profileData.userContestRanking
  const contestHistory = profileData.userContestRankingHistory || []

  // Extract submission stats
  const submitStats = user.submitStats.acSubmissionNum.reduce((acc: any, item: any) => {
    acc[item.difficulty.toLowerCase()] = item.count
    return acc
  }, {})

  // Calculate total solved problems
  const totalSolved = submitStats.easy + submitStats.medium + submitStats.hard

  // Extract member since date (approximation based on first contest or current date)
  const memberSince =
    contestHistory.length > 0
      ? new Date(contestHistory[contestHistory.length - 1].contest.startTime * 1000).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
        })
      : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short" })

  // Calculate average problems per day
  const averageProblemsPerDay = calculateAverageProblemsPerDay(totalSolved, memberSince)

  // Process tag data to get topic strengths
  const allTags = [
    ...(tagData.matchedUser?.tagProblemCounts?.advanced || []),
    ...(tagData.matchedUser?.tagProblemCounts?.intermediate || []),
    ...(tagData.matchedUser?.tagProblemCounts?.fundamental || []),
  ]

  // Map common tags to our simplified categories
  const topicMapping: Record<string, string> = {
    array: "arrays",
    string: "strings",
    "dynamic-programming": "dp",
    tree: "trees",
    "binary-tree": "trees",
    graph: "graphs",
    "depth-first-search": "graphs",
    "breadth-first-search": "graphs",
    sorting: "sorting",
    "binary-search": "sorting",
  }

  // Initialize topic strengths
  const topicStrengths: Record<string, number> = {
    arrays: 0,
    strings: 0,
    dp: 0,
    trees: 0,
    graphs: 0,
    sorting: 0,
  }

  // Calculate topic strengths (normalized to 0-100 scale)
  const maxProblemsPerTopic = 100 // Assumption for normalization
  allTags.forEach((tag) => {
    const mappedTopic = topicMapping[tag.tagSlug]
    if (mappedTopic && topicStrengths[mappedTopic] !== undefined) {
      // Add to the topic strength, but cap at 100
      topicStrengths[mappedTopic] = Math.min(
        100,
        topicStrengths[mappedTopic] + (tag.problemsSolved / maxProblemsPerTopic) * 100,
      )
    }
  })

  // Extract contest history ratings
  const contestRatings = contestHistory
    .sort((a: any, b: any) => a.contest.startTime - b.contest.startTime)
    .map((contest: any) => contest.rating || 1500) // Default to 1500 if rating is null

  return {
    username: user.username,
    memberSince,
    premium: false, // LeetCode API doesn't expose premium status
    problemsSolved: {
      easy: submitStats.easy || 0,
      medium: submitStats.medium || 0,
      hard: submitStats.hard || 0,
    },
    totalProblems: {
      easy: totalProblems.easy,
      medium: totalProblems.medium,
      hard: totalProblems.hard,
    },
    acceptanceRate: Math.round((totalSolved / (totalSolved + 100)) * 100), // Approximation
    globalRanking: user.profile.ranking || 999999,
    streak: 0, // LeetCode API doesn't expose streak
    contestRating: contestData?.rating || 1500,
    averageProblemsPerDay,
    topicStrengths,
    contestHistory: contestRatings.length > 0 ? contestRatings : [1500],
  }
}

// Add a new helper function to fetch and process user data in one step
async function fetchUserData(username: string, totalProblems: any) {
  try {
    const [profileData, tagData] = await Promise.all([fetchUserProfile(username), fetchUserSolvedByTags(username)])

    return processUserData(profileData, tagData, totalProblems)
  } catch (error) {
    throw error
  }
}

// Update the GET function to handle errors better
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const user1 = searchParams.get("user1")
  const user2 = searchParams.get("user2")

  if (!user1 || !user2) {
    return NextResponse.json({ error: "Both usernames are required" }, { status: 400 })
  }

  try {
    // Fetch total problems (same for both users)
    const totalProblems = await fetchTotalProblems()

    // Fetch data for both users in parallel with individual error handling
    const [user1Data, user2Data] = await Promise.all([
      fetchUserData(user1, totalProblems).catch((error) => {
        console.error(`Error fetching data for ${user1}:`, error)
        throw new Error(`Could not fetch data for ${user1}: ${error.message}`)
      }),
      fetchUserData(user2, totalProblems).catch((error) => {
        console.error(`Error fetching data for ${user2}:`, error)
        throw new Error(`Could not fetch data for ${user2}: ${error.message}`)
      }),
    ])

    return NextResponse.json({
      user1: user1Data,
      user2: user2Data,
    })
  } catch (error: any) {
    console.error("Error fetching LeetCode data:", error)

    return NextResponse.json(
      {
        error: "Failed to fetch LeetCode data",
        message: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
