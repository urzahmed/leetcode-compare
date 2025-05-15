import { LeetCodeComparator } from "@/components/leetcode-comparator"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2">LeetCode Profile Comparator</h1>
        <p className="text-center text-muted-foreground mb-8">
          Compare two LeetCode profiles and visualize the differences
        </p>
        <LeetCodeComparator />
      </div>
    </main>
  )
}
