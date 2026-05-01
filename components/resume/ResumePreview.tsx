"use client"

import { ResumeSection, GitHubStats } from "@/types/resume"

interface ResumeSectionHeadingProps {
  children: React.ReactNode
}

function SectionHeading({ children }: ResumeSectionHeadingProps) {
  return (
    <div className="text-xs uppercase tracking-widest text-gray-500 border-b border-gray-300 pb-2 mb-3 font-semibold">
      {children}
    </div>
  )
}

interface ConfidenceDotProps {
  score: number
}

function ConfidenceDot({ score }: ConfidenceDotProps) {
  let color = "bg-gray-400"
  if (score >= 80) {
    color = "bg-green-500"
  } else if (score >= 50) {
    color = "bg-amber-500"
  }

  return (
    <div
      className={`h-2 w-2 rounded-full ${color}`}
      title={`Confidence: ${score}%`}
    />
  )
}

interface ResumePreviewProps {
  resume: ResumeSection
  stats: GitHubStats
}

export function ResumePreview({ resume, stats }: ResumePreviewProps) {
  return (
    <div className="bg-white text-black rounded-lg p-8 font-serif shadow-2xl max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">{stats.name || stats.username}</h1>
        <div className="text-xs text-gray-600 space-y-1">
          <div>github.com/{stats.username}</div>
          <div className="flex gap-4 text-gray-500">
            <span>{stats.public_repos} repos</span>
            <span>⭐ {stats.total_stars}</span>
            <span>👥 {stats.followers} followers</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-6">
        <SectionHeading>Summary</SectionHeading>
        <p className="text-sm leading-relaxed text-gray-800">{resume.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-6">
        <SectionHeading>Skills</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {resume.top_skills.map((skill) => (
            <span
              key={skill}
              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="mb-6">
        <SectionHeading>Projects</SectionHeading>
        <div className="space-y-4">
          {resume.projects.slice(0, 5).map((project) => (
            <div key={project.name} className="border-l-2 border-gray-300 pl-4">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <ConfidenceDot score={project.confidence_score} />
                  <h3 className="font-semibold text-sm">{project.name}</h3>
                </div>
                <span className="text-xs text-gray-600">⭐ {project.stars}</span>
              </div>
              <p className="text-sm italic text-gray-700 mb-2">{project.description}</p>
              <div className="text-xs font-mono text-gray-600 mb-2">
                {project.technologies.join(" • ")}
              </div>
              <ul className="text-xs text-gray-800 space-y-1">
                {project.highlights.map((highlight, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-gray-500">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <SectionHeading>Education</SectionHeading>
        <div className="border-2 border-dashed border-gray-300 rounded p-3 text-xs italic text-gray-600">
          {resume.education_prompt}
        </div>
      </div>
    </div>
  )
}
