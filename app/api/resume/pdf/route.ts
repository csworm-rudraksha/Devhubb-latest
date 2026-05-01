import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getUserResumes } from "@/lib/resume-store"
import { ResumeTone } from "@/types/resume"

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")
    const tone = searchParams.get("tone") as ResumeTone | null

    if (!username || !tone) {
      return NextResponse.json(
        { error: "username and tone query parameters are required" },
        { status: 400 }
      )
    }

    // Fetch resume from Supabase
    const resumes = await getUserResumes(user.id)
    const resume = resumes.find(
      (r) => r.github_username === username && r.tone === tone
    )

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 })
    }

    const stats = resume.github_stats
    const resumeData = resume.resume_data

    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${stats.name || stats.username} - Resume</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Georgia, serif;
      background-color: #f5f5f5;
      padding: 20px;
      color: #333;
    }

    .container {
      max-width: 720px;
      margin: 0 auto;
      background-color: white;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      line-height: 1.6;
    }

    .header {
      border-bottom: 2px solid #333;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    .name {
      font-size: 28px;
      font-weight: bold;
      margin-bottom: 8px;
    }

    .meta {
      font-size: 12px;
      color: #666;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .section-heading {
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #666;
      border-bottom: 1px solid #ddd;
      padding-bottom: 8px;
      margin-top: 20px;
      margin-bottom: 12px;
    }

    .summary {
      font-size: 14px;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .skill-tag {
      background-color: #f0f0f0;
      padding: 4px 8px;
      border-radius: 3px;
      font-size: 12px;
      font-family: 'Courier New', monospace;
    }

    .project {
      margin-bottom: 16px;
      page-break-inside: avoid;
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    .project-name {
      font-weight: bold;
      font-size: 14px;
    }

    .project-stars {
      font-size: 12px;
      color: #666;
    }

    .project-description {
      font-size: 13px;
      font-style: italic;
      color: #555;
      margin-bottom: 6px;
    }

    .project-tech {
      font-size: 11px;
      font-family: 'Courier New', monospace;
      color: #666;
      margin-bottom: 6px;
    }

    .project-highlights {
      font-size: 13px;
      margin-left: 16px;
      margin-bottom: 8px;
    }

    .project-highlights li {
      margin-bottom: 4px;
    }

    .education-placeholder {
      border: 1px dashed #ccc;
      padding: 12px;
      border-radius: 4px;
      font-size: 13px;
      color: #999;
      font-style: italic;
    }

    .download-btn {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 10px 16px;
      background-color: #333;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      z-index: 1000;
    }

    .download-btn:hover {
      background-color: #555;
    }

    @media print {
      body {
        background-color: white;
        padding: 0;
      }

      .container {
        max-width: 100%;
        box-shadow: none;
        padding: 0;
      }

      .download-btn {
        display: none;
      }

      .no-print {
        display: none;
      }
    }

    @page {
      margin: 0.5in;
    }
  </style>
</head>
<body>
  <button class="download-btn no-print" onclick="window.print()">Download PDF ↗</button>

  <div class="container">
    <div class="header">
      <div class="name">${stats.name || stats.username}</div>
      <div class="meta">
        <div class="meta-item">
          <span>github.com/${stats.username}</span>
        </div>
        <div class="meta-item">
          <span>${stats.public_repos} repos</span>
        </div>
        <div class="meta-item">
          <span>⭐ ${stats.total_stars}</span>
        </div>
        <div class="meta-item">
          <span>👥 ${stats.followers} followers</span>
        </div>
      </div>
    </div>

    <div class="section-heading">Summary</div>
    <div class="summary">${resumeData.summary}</div>

    <div class="section-heading">Skills</div>
    <div class="skills">
      ${resumeData.top_skills.map((skill) => `<div class="skill-tag">${skill}</div>`).join("")}
    </div>

    <div class="section-heading">Projects</div>
    ${resumeData.projects
      .slice(0, 5)
      .map(
        (project) => `
      <div class="project">
        <div class="project-header">
          <div class="project-name">${project.name}</div>
          <div class="project-stars">⭐ ${project.stars}</div>
        </div>
        <div class="project-description">${project.description}</div>
        <div class="project-tech">${project.technologies.join(" • ")}</div>
        <ul class="project-highlights">
          ${project.highlights.map((h) => `<li>${h}</li>`).join("")}
        </ul>
      </div>
    `
      )
      .join("")}

    <div class="section-heading">Education</div>
    <div class="education-placeholder">
      ${resumeData.education_prompt}
    </div>
  </div>

  <script>
    if (window.location.hash === '#print') {
      window.print();
    }
  </script>
</body>
</html>`

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
    })
  } catch (error) {
    console.error("PDF generation error:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { error: `Failed to generate PDF: ${message}` },
      { status: 500 }
    )
  }
}
