# HireWeb

A modern job portal application built with React, Vite, and Supabase that connects job seekers with employers.

## Features

### For Job Seekers
- 🔍 Browse and search available jobs
- 📝 Apply to job postings with resume upload (PDF/Word)
- 📊 Track application status
- 📖 View detailed job descriptions with markdown support
- 🗺️ Filter jobs by location (state and city)
- ❤️ Save favorite jobs for later

### For Employers/Recruiters
- ➕ Post job openings
- 🎛️ Manage job listings (open/closed status)
- 📋 Review applications
- 🏢 Add company profiles
- 👥 View applicant details and resumes
- 🗑️ Delete job postings

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4 with custom configuration
- **UI Components**: Radix UI primitives
- **Form Management**: React Hook Form with Zod validation
- **Authentication**: Clerk (with shadesOfPurple theme)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage (for resumes)
- **Routing**: React Router DOM 6
- **Markdown Editor**: @uiw/react-md-editor
- **Icons**: Lucide React
- **Location Data**: country-state-city
- **Loading Indicators**: React Spinners

## Project Structure

```
hireWeb/
├── public/
│   └── companies/          # Company logo images
├── src/
│   ├── api/               # API integration functions
│   │   ├── apiApplications.js
│   │   ├── apiCompanies.js
│   │   └── apiJobs.js
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Base UI components (Card, Button, Select, etc.)
│   │   ├── apply-job.jsx
│   │   ├── created-jobs.jsx
│   │   ├── header.jsx
│   │   ├── job-card.jsx
│   │   ├── protected-route.jsx
│   │   └── theme-provider.jsx
│   ├── data/             # Static data files
│   │   ├── companies.json
│   │   └── faq.json
│   ├── hooks/            # Custom React hooks
│   │   └── use-fetch.jsx
│   ├── layouts/          # Layout components
│   │   └── app-layout.jsx
│   ├── pages/            # Page components
│   │   ├── landing.jsx
│   │   ├── job.jsx
│   │   ├── job-listing.jsx
│   │   ├── my-job.jsx
│   │   ├── onboarding.jsx
│   │   ├── post-job.jsx
│   │   └── saved-job.jsx
│   ├── utils/            # Utility functions
│   │   └── supabase.js
│   ├── lib/              # Helper libraries
│   │   └── utils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env                  # Environment variables (not in repo)
├── vite.config.js       # Vite configuration
├── components.json      # shadcn/ui configuration
├── jsconfig.json        # JavaScript configuration
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- Supabase account
- Clerk account

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/maaz1604/HireWeb.git
cd HireWeb/hireWeb
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Set up environment variables:**

Create a `.env` file in the `hireWeb` directory by copying `.env.example`:

```bash
cp .env.example .env
```

Then update the `.env` file with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For Development: Use Clerk test key (pk_test_...)
# For Production: Use Clerk live key (pk_live_...)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_test_key
```

**Important for Production:**
- For deployment, replace the Clerk test key (`pk_test_...`) with your live publishable key (`pk_live_...`)
- Never commit your `.env` file to version control (it's already in `.gitignore`)

4. **Set up Supabase:**

Create the following tables in your Supabase database:

- `jobs` - Job postings
- `companies` - Company information
- `applications` - Job applications
- `saved_jobs` - Saved jobs by users

Create a storage bucket named `resumes` for resume uploads.

5. **Configure Clerk:**

- Set up your Clerk application
- Configure user metadata to include a `role` field (recruiter/candidate)
- Add the Clerk publishable key to your `.env` file

6. **Start the development server:**
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Deployment

### Environment Variables for Production

When deploying to production (Vercel, Netlify, etc.), make sure to set these environment variables:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_live_key  # Use LIVE key!
```

**⚠️ Important:** 
- Use Clerk's **live publishable key** (`pk_live_...`) for production
- Test keys (`pk_test_...`) should only be used in development
- Configure environment variables in your hosting platform's dashboard

### Build Command
```bash
pnpm build
```

### Deploy to Render

**For Render deployments with memory constraints:**

1. Set build command: `cd hireWeb && npm install && npm run build:render`
2. Set publish directory: `hireWeb/dist`
3. Add environment variables in Render dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_CLERK_PUBLISHABLE_KEY` (use live key!)
   - `NODE_VERSION=18`

**Memory optimization applied:**
- Chunk splitting for vendor libraries
- esbuild minification (faster, less memory)
- Disabled source maps
- Manual chunk optimization

### Deploy to Vercel

**Configuration for Vercel:**

1. **Root Directory:** Set to `hireWeb`
2. **Build Command:** `npm run build` (or `pnpm build`)
3. **Output Directory:** `dist`
4. **Install Command:** `npm install` (or `pnpm install`)

**Add Environment Variables in Vercel Dashboard:**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY` (use `pk_live_...` for production!)

**Deploy via CLI:**
```bash
vercel --prod
```

**Important:** The `vercel.json` file is already configured to handle client-side routing (React Router) properly, preventing 404 errors on page refresh.

## Key Features Implementation

### Job Posting with Markdown Support
Job requirements are edited using a Markdown editor (`@uiw/react-md-editor`), allowing rich formatting for job descriptions.

### Dependent Location Selection
State and city selection are dependent - cities populate only after selecting a state, using the `country-state-city` library for Indian locations.

### Resume Upload & Storage
Resumes are uploaded to Supabase Storage with unique filenames and publicly accessible URLs stored in the database.

### Application Tracking
- Optimistic UI updates prevent duplicate applications
- Drawer closes immediately on submission
- Local state tracks application status

### Job Management
- Recruiters can toggle hiring status (open/closed)
- Delete jobs with immediate UI updates
- View all applications per job

### Authentication & Authorization
- Protected routes using Clerk authentication
- Role-based access (recruiter vs candidate)
- User metadata for personalized experiences

## Styling

- **Tailwind CSS 4** with custom theme configuration
- **Dark mode** support with automatic Markdown preview theming
- **Radix UI** for accessible component primitives
- **Custom utility classes** defined in `index.css`
- **Responsive design** with mobile-first approach

## Database Schema

### Jobs Table
- `id`, `title`, `description`, `location`, `company_id`, `recruiter_id`, `isOpen`, `requirements`

### Applications Table
- `id`, `job_id`, `candidate_id`, `name`, `skills`, `experience`, `education`, `resume`, `status`

### Companies Table
- `id`, `name`, `logo_url`

### Saved Jobs Table
- `id`, `user_id`, `job_id`

## Authentication Flow

1. User signs in via Clerk
2. Role selection during onboarding (recruiter/candidate)
3. Role stored in Clerk user metadata
4. Protected routes check authentication and role


## Author

**Maaz Amir**
- GitHub: [@maaz1604](https://github.com/maaz1604)

Made with ❤️ by Maaz Amir
