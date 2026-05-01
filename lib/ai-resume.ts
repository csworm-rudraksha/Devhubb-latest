import Groq from "groq-sdk"
import { GitHubStats, ResumeTone, ResumeSection, CoverLetter } from "@/types/resume"

const apiKey = process.env.GROQ_API_KEY
if (!apiKey) {
  throw new Error("GROQ_API_KEY environment variable is not set")
}

const client = new Groq({ apiKey })

function toneInstructions(tone: ResumeTone): string {
  const instructions: Record<ResumeTone, string> = {
    technical:
      "Use precise, technical verbs like 'Architected', 'Implemented', 'Optimised', 'Engineered', 'Deployed'. Target audience: senior engineers and tech leads. Focus on technical depth, scalability, and system design.",
    startup:
      "Use high-energy, action-oriented verbs like 'Shipped', 'Built', 'Launched', 'Scaled', 'Grew'. Target audience: CTOs and founders. Emphasize impact, speed to market, and business outcomes.",
    enterprise:
      "Use formal, leadership-focused verbs like 'Led', 'Delivered', 'Maintained', 'Managed', 'Coordinated'. Target audience: large company HR and hiring managers. Emphasize reliability, compliance, and team collaboration.",
    internship:
      "Use learning-focused, honest verbs like 'Built', 'Contributed', 'Explored', 'Developed', 'Assisted'. Target audience: junior-level hiring. Be honest about scope and learning outcomes, not inflating impact.",
  }
  return instructions[tone]
}

export function buildResumePrompt(
  stats: GitHubStats,
  tone: ResumeTone,
  targetRole?: string
): string {
  const topLanguages = Object.entries(stats.top_languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([lang]) => lang)

  const topRepos = stats.repos
    .slice(0, 12)
    .map((repo) => ({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      url: repo.html_url,
      topics: repo.topics,
      updated: repo.updated_at,
    }))

  const roleContext = targetRole ? `Target role: ${targetRole}. ` : ""

  return `You are an expert resume writer for software developers. Generate a professional resume section based on the following GitHub profile data.

${roleContext}
Developer: ${stats.name || stats.username}
Bio: ${stats.bio || "No bio provided"}
GitHub: ${stats.username}
Public Repos: ${stats.public_repos}
Followers: ${stats.followers}
Total Stars: ${stats.total_stars}
Estimated Commits: ${stats.commit_count_estimate}
Top Languages: ${topLanguages.join(", ")}

Top Repositories:
${JSON.stringify(topRepos, null, 2)}

Tone Instructions:
${toneInstructions(tone)}

Generate a resume section as valid JSON (no markdown fences) with this exact structure:
{
  "summary": "2-3 sentence professional summary highlighting key strengths and impact",
  "top_skills": ["skill1", "skill2", ...max 8 skills],
  "projects": [
    {
      "name": "project name",
      "description": "1-2 sentence description",
      "technologies": ["tech1", "tech2"],
      "highlights": ["achievement 1", "achievement 2", "achievement 3"],
      "url": "github url",
      "confidence_score": 85,
      "stars": 42
    }
  ],
  "education_prompt": "Placeholder for education section - user will fill in manually",
  "tone_used": "${tone}",
  "generated_at": "ISO timestamp"
}

Select 4-6 most impressive projects sorted by confidence_score (highest first). Do NOT invent metrics or achievements. Base everything on the repository data provided. Return ONLY valid JSON.`
}

export function buildCoverLetterPrompt(
  stats: GitHubStats,
  resume: ResumeSection,
  tone: ResumeTone,
  targetRole?: string
): string {
  const roleContext = targetRole
    ? `Target role: ${targetRole}. `
    : "The role is not specified, so write a general cover letter. "

  return `You are an expert cover letter writer for software developers. Write a professional 3-paragraph cover letter (180-230 words total) based on the developer's GitHub profile and resume.

${roleContext}
Developer: ${stats.name || stats.username}
GitHub: ${stats.username}
Top Skills: ${resume.top_skills.join(", ")}
Key Projects: ${resume.projects.map((p) => p.name).join(", ")}

Tone Instructions:
${toneInstructions(tone)}

Write a compelling cover letter with:
1. Opening paragraph: Brief introduction and why you're interested in the role
2. Middle paragraph: Key achievements and relevant experience from your projects
3. Closing paragraph: Call to action and enthusiasm

Do NOT include "Dear [Hiring Manager]" or "Sincerely, [Your Name]" - just the body paragraphs.
Keep it between 180-230 words. Make it personal and authentic based on the GitHub data.`
}

export async function generateResume(
  stats: GitHubStats,
  tone: ResumeTone,
  targetRole?: string
): Promise<ResumeSection> {
  const prompt = buildResumePrompt(stats, tone, targetRole)

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 2000,
    response_format: { type: "json_object" },
    temperature: 0.7,
  })

  const raw = completion.choices[0].message.content ?? "{}"
  const resumeData = JSON.parse(raw) as ResumeSection
  resumeData.generated_at = new Date().toISOString()
  return resumeData
}

export async function generateCoverLetter(
  stats: GitHubStats,
  resume: ResumeSection,
  tone: ResumeTone,
  targetRole?: string
): Promise<CoverLetter> {
  const prompt = buildCoverLetterPrompt(stats, resume, tone, targetRole)

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 600,
    temperature: 0.8,
  })

  const body = completion.choices[0].message.content?.trim() ?? ""
  return {
    body,
    tone_used: tone,
    generated_at: new Date().toISOString(),
  }
}
