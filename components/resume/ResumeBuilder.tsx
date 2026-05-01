"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { ResumePreview } from "./ResumePreview"
import { CoverLetterPreview } from "./CoverLetterPreview"
import { ResumeTone, ResumeGenerationResult } from "@/types/resume"
import { Download } from "lucide-react"

const TONES: Array<{ value: ResumeTone; label: string; description: string }> = [
  {
    value: "technical",
    label: "Technical",
    description: "For senior engineers & tech leads",
  },
  {
    value: "startup",
    label: "Startup",
    description: "For CTOs & founders",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "For large companies",
  },
  {
    value: "internship",
    label: "Internship",
    description: "For junior roles",
  },
]

interface ResumeBuilderProps {
  defaultGithubUsername?: string
}

export function ResumeBuilder({ defaultGithubUsername = "" }: ResumeBuilderProps) {
  const [githubUsername, setGithubUsername] = useState(defaultGithubUsername)
  const [tone, setTone] = useState<ResumeTone>("technical")
  const [targetRole, setTargetRole] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<ResumeGenerationResult | null>(null)
  const [activeTab, setActiveTab] = useState<"resume" | "cover-letter">("resume")

  const handleGenerate = async () => {
    if (!githubUsername.trim()) {
      setError("Please enter a GitHub username")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("/api/resume/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          github_username: githubUsername.trim(),
          tone,
          target_role: targetRole.trim() || undefined,
        }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to generate resume"
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`
        }
        
        // Check for quota exceeded error
        if (errorMessage.includes("quota") || errorMessage.includes("429")) {
          errorMessage = "API quota exceeded. Please try again later or check your billing details."
        }
        
        throw new Error(errorMessage)
      }

      const data: ResumeGenerationResult = await response.json()
      
      // Validate response structure
      if (!data.resume || !data.cover_letter || !data.github_stats) {
        throw new Error("Invalid response structure from server")
      }

      setResult(data)
      setActiveTab("resume")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred"
      setError(errorMessage)
      console.error("Resume generation error:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = () => {
    if (!result?.github_stats) {
      setError("No resume data available for download")
      return
    }

    try {
      const url = `/api/resume/pdf?username=${encodeURIComponent(result.github_stats.username)}&tone=${encodeURIComponent(tone)}#print`
      window.open(url, "_blank")
    } catch (err) {
      setError("Failed to open PDF download")
      console.error("PDF download error:", err)
    }
  }

  const loadingSteps = [
    "Fetching GitHub activity...",
    "Analysing repos...",
    "Writing resume bullets...",
    "Drafting cover letter...",
  ]

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-mono">
      {/* Left Panel */}
      <div className="w-full lg:w-[340px] border-r border-gray-800 p-6 overflow-y-auto flex flex-col">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">AI Resume Builder</h1>
          <p className="text-sm text-gray-400">Generate from your GitHub activity</p>
        </div>

        {/* GitHub Username Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            GitHub Username
          </label>
          <div className="flex items-center border border-gray-700 rounded bg-gray-900">
            <span className="px-3 text-gray-500 text-sm">github.com/</span>
            <Input
              type="text"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="username"
              className="flex-1 bg-transparent border-0 text-white placeholder-gray-600 focus:ring-0"
              disabled={loading}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleGenerate()
                }
              }}
            />
          </div>
        </div>

        {/* Target Role Input */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Target Role (Optional)
          </label>
          <Input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g., Senior Backend Engineer"
            className="bg-gray-900 border-gray-700 text-white placeholder-gray-600"
            disabled={loading}
          />
        </div>

        {/* Tone Selector */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-300 mb-3">
            Resume Tone
          </label>
          <div className="space-y-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTone(t.value)}
                disabled={loading}
                className={`w-full text-left p-3 rounded border transition-all ${
                  tone === t.value
                    ? "border-white bg-gray-900"
                    : "border-gray-700 bg-gray-950 hover:border-gray-600"
                }`}
              >
                <div className="font-semibold text-sm">{t.label}</div>
                <div className="text-xs text-gray-400">{t.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-white text-black hover:bg-gray-200 font-semibold mb-6"
          type="button"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Generating...
            </>
          ) : (
            "Generate Resume"
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-3 bg-red-900/20 border border-red-700 rounded text-sm text-red-200">
            <div className="font-semibold mb-1">Error</div>
            <div>{error}</div>
          </div>
        )}

        {/* GitHub Stats Snapshot */}
        {result && result.github_stats && (
          <div className="mt-auto pt-6 border-t border-gray-800">
            <div className="text-xs font-semibold text-gray-300 mb-3">GitHub Stats</div>
            <div className="space-y-2 text-xs text-gray-400">
              <div>
                <span className="text-gray-500">Repos:</span> {result.github_stats.public_repos}
              </div>
              <div>
                <span className="text-gray-500">Stars:</span> {result.github_stats.total_stars}
              </div>
              <div>
                <span className="text-gray-500">Followers:</span> {result.github_stats.followers}
              </div>
              <div>
                <span className="text-gray-500">Commits:</span>{" "}
                {result.github_stats.commit_count_estimate}
              </div>
              {result.cached && (
                <div className="mt-3 p-2 bg-blue-900/20 border border-blue-700 rounded text-blue-200">
                  Cached result
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Panel */}
      <div className="hidden lg:flex flex-1 flex-col bg-gray-950 overflow-hidden">
        {result && result.resume && result.cover_letter && result.github_stats ? (
          <>
            {/* Header Bar */}
            <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setActiveTab("resume")}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                    activeTab === "resume"
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Resume
                </button>
                <button
                  onClick={() => setActiveTab("cover-letter")}
                  className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${
                    activeTab === "cover-letter"
                      ? "border-white text-white"
                      : "border-transparent text-gray-400 hover:text-gray-300"
                  }`}
                >
                  Cover Letter
                </button>
              </div>
              <Button
                onClick={handleDownloadPDF}
                variant="outline"
                size="sm"
                className="border-gray-700 text-white hover:bg-gray-900"
                type="button"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === "resume" ? (
                <ResumePreview resume={result.resume} stats={result.github_stats} />
              ) : (
                <CoverLetterPreview coverLetter={result.cover_letter} />
              )}
            </div>
          </>
        ) : loading ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="space-y-4 w-full max-w-md">
              {loadingSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      i < Math.floor((Date.now() / 500) % loadingSteps.length)
                        ? "bg-white"
                        : "bg-gray-700"
                    }`}
                  />
                  <span className="text-sm text-gray-400">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <div className="text-gray-500 text-sm mb-2">Enter your GitHub username</div>
              <div className="text-gray-600 text-xs">
                and select a tone to generate your resume
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
