"use client"

import { useState } from "react"
import { CoverLetter } from "@/types/resume"
import { Copy, Check } from "lucide-react"

interface CoverLetterPreviewProps {
  coverLetter: CoverLetter
}

export function CoverLetterPreview({ coverLetter }: CoverLetterPreviewProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyToClipboard() {
    navigator.clipboard.writeText(coverLetter.body)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const paragraphs = coverLetter.body.split("\n\n").filter((p) => p.trim())

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={handleCopyToClipboard}
        className="mb-4 flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied ✓
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy to Clipboard
          </>
        )}
      </button>

      <div className="bg-white text-black rounded-lg p-8 font-serif shadow-2xl">
        {/* Placeholder Header */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <div className="text-sm italic text-gray-500 space-y-1">
            <div>[Your Name]</div>
            <div>[Your Email] • [Your Phone]</div>
            <div>[Date]</div>
          </div>
        </div>

        {/* Placeholder Recipient */}
        <div className="mb-6 text-sm italic text-gray-500">
          <div>[Hiring Manager Name]</div>
          <div>[Company Name]</div>
          <div>[Company Address]</div>
        </div>

        {/* Cover Letter Body */}
        <div className="space-y-4 mb-6 text-sm leading-relaxed text-gray-800">
          {paragraphs.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        {/* Placeholder Closing */}
        <div className="text-sm italic text-gray-500 space-y-2">
          <div>Sincerely,</div>
          <div className="h-12" />
          <div>[Your Name]</div>
        </div>
      </div>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-gray-900 border border-gray-800 rounded text-xs text-gray-400">
        Add your name, email, and company details to the bracketed sections above.
      </div>
    </div>
  )
}
