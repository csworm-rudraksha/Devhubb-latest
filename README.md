# DevHubb

> A unified SaaS platform for developer productivity, collaboration, analytics, and AI-powered career tooling.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

DevHubb is a production-grade full-stack developer platform designed to eliminate workflow fragmentation by combining:

* 📊 Developer analytics
* 📝 Markdown knowledge management
* 👨‍💻 Real-time collaborative coding
* 🤖 AI-powered resume generation
* 🌐 Public developer portfolios

Instead of switching between GitHub, LeetCode, Notion, collaborative editors, and resume builders, DevHubb brings everything into one integrated workspace.

---

## ✨ Features

### 📈 Unified Developer Analytics

* GitHub repository analytics
* Stars, followers, forks, repositories tracking
* LeetCode statistics integration
* Competitive programming performance dashboard
* Server-side API aggregation

### 📝 Markdown Notebook System

* Rich Markdown editor with live preview
* Notebook and note hierarchy
* Persistent cloud storage using Supabase
* Organized technical documentation system

### 👨‍💻 Real-Time Collaborative Editor

* Monaco Editor integration (VS Code experience)
* Shared coding rooms
* Multi-user collaborative sessions
* Java-focused collaborative environment

### 🤖 AI Resume Builder

* Groq LLM integration
* ATS-optimized resume generation
* Resume generation from live GitHub + LeetCode data
* Structured professional formatting

### 🌐 Public Developer Profiles

* Shareable developer profile pages
* SEO-friendly public routes
* Unified portfolio showcase
* Integrated metrics and social links

### 🔐 Production-Grade Security

* Supabase authentication
* PostgreSQL Row Level Security (RLS)
* Middleware-based route protection
* Server-side API key isolation
* Zod input validation

---

# 🏗️ Architecture Overview

DevHubb follows a modular full-stack SaaS architecture:

```text
Client Layer
   ↓
Next.js App Router (React Server Components)
   ↓
API / Server Actions
   ↓
Supabase PostgreSQL + Auth
   ↓
Third-party APIs (GitHub, LeetCode, Groq)
```

### Core Architectural Principles

* Server-first rendering
* Zero client-side credential exposure
* Modular feature separation
* Database-layer security
* Edge deployment optimization

---

# 🧠 Tech Stack

| Layer          | Technology           |
| -------------- | -------------------- |
| Framework      | Next.js 16           |
| UI Library     | React 19             |
| Language       | TypeScript           |
| Styling        | Tailwind CSS v4      |
| Components     | Radix UI + shadcn/ui |
| Database       | Supabase PostgreSQL  |
| Authentication | Supabase Auth        |
| Editor         | Monaco Editor        |
| Markdown       | @uiw/react-md-editor |
| AI             | Groq SDK             |
| Charts         | Recharts             |
| Validation     | Zod                  |
| Forms          | React Hook Form      |
| Deployment     | Vercel               |

---

# 📂 Project Structure

```bash
app/
 ├── (auth)/
 │    ├── login/
 │    └── signup/
 │
 ├── (dashboard)/
 │    ├── overview/
 │    ├── notebooks/
 │    ├── rooms/
 │    ├── resume/
 │    └── profile/
 │
 ├── [username]/
 │
components/
 ├── analytics/
 ├── editor/
 ├── resume/
 └── ui/

lib/
 ├── github.ts
 ├── leetcode.ts
 └── supabase/

hooks/
styles/
middleware.ts
```

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone https://github.com/csworm-rudraksha/Devhubb-latest.git
cd Devhubb-latest
```

---

## 2. Install Dependencies

Using pnpm:

```bash
pnpm install
```

Or using npm:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GITHUB_TOKEN=
GROQ_API_KEY=

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Setup Supabase Database

Run the required SQL schema and RLS policies.

### Profiles Table

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  college TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  city TEXT,
  github_username TEXT,
  leetcode_username TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Notebooks Table

```sql
CREATE TABLE notebooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Notes Table

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notebook_id UUID NOT NULL REFERENCES notebooks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Rooms Table

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  initial_code TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# 🔒 Row Level Security (RLS)

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE notebooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
```

### Profiles Policy

```sql
CREATE POLICY "profiles_isolation" ON profiles
FOR ALL USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### Notebook Policy

```sql
CREATE POLICY "notebooks_isolation" ON notebooks
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### Notes Policy

```sql
CREATE POLICY "notes_isolation" ON notes
FOR ALL USING (
  notebook_id IN (
    SELECT id FROM notebooks WHERE user_id = auth.uid()
  )
);
```

### Rooms Policy

```sql
CREATE POLICY "rooms_owner" ON rooms
FOR ALL USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);
```

---

# ▶️ Run the Development Server

```bash
pnpm dev
```

Open:

```text
http://localhost:3000
```

---

# 🤖 AI Resume Builder Flow

The AI Resume Builder works completely server-side:

1. User triggers resume generation
2. Server fetches GitHub + LeetCode + profile data
3. Structured prompt is generated
4. Groq LLM generates ATS-friendly resume
5. Resume is returned and rendered in UI

### Why Server-Side?

* Protects API keys
* Prevents client-side abuse
* Improves security
* Keeps prompts private

---

# 📊 Performance Highlights

| Metric                 | Result |
| ---------------------- | ------ |
| Dashboard TTFB         | ~280ms |
| LCP                    | ~1.4s  |
| AI Resume Generation   | ~1.8s  |
| Lighthouse Performance | 84/100 |
| Accessibility Score    | 91/100 |

---

# 🛡️ Security Model

DevHubb uses a defence-in-depth security architecture:

### Layer 1 — Input Validation

* Zod schema validation

### Layer 2 — Middleware Protection

* JWT-based authentication checks

### Layer 3 — Protected API Routes

* Session revalidation before mutations

### Layer 4 — Supabase Auth

* Secure token issuance and validation

### Layer 5 — PostgreSQL RLS

* Database-level data isolation

---

# 🌍 Deployment

The platform is optimized for deployment on Vercel.

## Deploy

```bash
vercel
```

Production architecture:

* Vercel Edge Network
* Supabase PostgreSQL
* Groq LLM APIs
* Server-rendered React Server Components

---

# 🔮 Future Improvements

* CRDT-based true real-time collaboration
* AI code review assistant
* Cover letter generator
* Multi-language collaborative editor
* GitHub OAuth integration
* AI mock interview simulator
* Productivity heatmaps
* Team workspaces with RBAC
* PWA and offline support
* Better TypeScript strictness enforcement

---

# 👥 Team

### Developers

* Rudraksha Kushwaha
* Rudra Pratap Singh
* Ronak Harbala

### Supervisor

* Mr. Mohit Kumar

---

# 📚 Academic Reference

This README and project architecture are based on the official DevHubb project report submitted for the Bachelor of Technology degree in Computer Science & Engineering – Artificial Intelligence at G.L. Bajaj Institute of Technology & Management. fileciteturn0file0

---

# 📄 License

This project is licensed under the MIT License.

---

# ⭐ Support

If you found this project useful:

* Star the repository
* Share it with developers
* Contribute to the project
* Open issues and feature requests

---

# 💡 Vision

DevHubb aims to become the all-in-one operating system for modern developers — combining productivity, collaboration, analytics, and AI into a single seamless platform.
