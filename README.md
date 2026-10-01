# 🎯 AI Interview Prep & Strategy Platform

An intelligent, full-stack career preparation application powered by **Google Gemini AI**. Tailor your interview preparation to specific job descriptions by analyzing your resume, identifying skill gaps, generating targeted technical/behavioral interview questions with model answers, and creating a step-by-step preparation roadmap.

---

## 🌟 Key Features

- **🤖 AI-Driven Strategy Generation**: Analyzes job requirements alongside your resume and self-description using Google Gemini (`@google/genai`).
- **📊 Match Score & Skill Gap Analysis**: Calculates profile alignment percentage and highlights critical vs. minor skill gaps.
- **💡 Curated Interview Questions**:
  - **Technical Questions**: In-depth questions with "What this tests" intentions and suggested answers.
  - **Behavioral Questions**: Situational questions mapped to company culture and behavioral evaluation.
- **🗺️ Day-by-Day Preparation Roadmap**: Structured daily milestones and actionable tasks to prepare effectively before the interview.
- **📄 Resume PDF Export**: Uses headless Chrome via **Puppeteer** to generate and download tailored resumes based on target job roles.
- **🔒 Secure Authentication**: User signup, login, session persistence, and protected routes using JWT (`jsonwebtoken`), HTTP-only cookies, and `bcryptjs`.
- **✨ Premium Dark UI**: Modern dark glassmorphism interface built with SCSS, featuring non-blocking loading states, shimmering skeleton loaders, and responsive layouts.
- **📂 Report History**: Automatically saves previous interview reports for quick access and tracking progress.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **Styling**: Vanilla SCSS (Modern glassmorphism, responsive grid/flexbox, custom animations)
- **HTTP Client**: Axios (with credential/cookie support)

### Backend
- **Runtime**: Node.js & Express (v5)
- **Database**: MongoDB with Mongoose ODM
- **AI Engine**: Google Gemini API (`@google/genai`)
- **Document Parsing**: `pdf-parse`, `multer` (for handling resume uploads)
- **PDF Generation**: `puppeteer` (headless Chrome rendering)
- **Authentication**: JWT (`jsonwebtoken`), `cookie-parser`, `bcryptjs`
- **Validation**: `zod`

---

## 📁 Project Structure

```text
GenAi Project/
├── backend/
│   ├── controller/         # Request handlers (auth, interview)
│   ├── middleware/         # Auth verification, Multer file upload
│   ├── models/             # Mongoose schemas (User, InterviewReport)
│   ├── routes/             # Express API routes (/api/auth, /api/interview)
│   ├── services/           # Gemini AI prompts, PDF generation service
│   ├── db.js               # MongoDB connection setup
│   ├── index.js            # Express server entry point
│   ├── package.json        # Backend dependencies & scripts
│   └── .env.example        # Environment variable template
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/       # Login, Register, AuthContext, ProtectedRoute
│   │   │   └── interview/  # Home, Interview report, Skeletons, SCSS styles
│   │   ├── app.routes.jsx  # Frontend routing configuration
│   │   ├── App.jsx         # Root app with context providers
│   │   ├── main.jsx        # React DOM entry point
│   │   └── style.scss      # Global styles & theme variables
│   ├── package.json        # Frontend dependencies & scripts
│   └── vite.config.js      # Vite configuration
│
└── README.md               # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v18.x or v20+ recommended)
- **npm** or **yarn**
- **MongoDB** (Local instance or MongoDB Atlas cluster URI)
- **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `backend/` directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your `.env` variables:
   ```env
   PORT=3000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/interview_prep?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

5. Start the backend server:
   ```bash
   npm start
   # or with node directly:
   node index.js
   ```
   > The server will start on `http://localhost:3000` (or your configured `PORT`).

---

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) If running the backend locally on port `3000`, verify `baseURL` in:
   `frontend/src/features/interview/services/interview.api.js` and `frontend/src/features/auth/services/auth.api.js`.
   For local development:
   ```javascript
   baseURL: "http://localhost:3000"
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   > The Vite dev server will run at `http://localhost:5173`.

---

## 📖 How to Use

1. **Sign Up / Log In**:
   - Open `http://localhost:5173` in your browser.
   - If not logged in, you will be redirected to `/login`. Click **Register** to create an account.
2. **Create an Interview Strategy**:
   - On the **Home** dashboard:
     - Paste the **Job Description** (role requirements, responsibilities, tech stack).
     - Upload your **Resume (PDF)** or type a **Self Description** highlighting your background and projects.
   - Click **Generate My Interview Strategy**.
3. **Explore Your Personalized Report**:
   - **Technical Questions**: Review expected technical questions, key concepts tested, and sample high-scoring answers.
   - **Behavioral Questions**: Practice situational questions tailored to leadership, conflict resolution, and problem solving.
   - **Road Map**: Follow a day-by-day plan with targeted tasks to master missing competencies.
   - **Skill Gaps & Match Score**: Inspect your readiness score and areas requiring immediate revision.
4. **Export Resume PDF**:
   - Click **Generate Resume PDF** in the report sidebar to download an optimized PDF resume.
5. **Access Past Reports**:
   - Access previously generated reports anytime from the **Recent Reports** section on the home page.

---

## 📡 API Reference

### Auth Endpoints (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login with email and password |
| `GET` | `/api/auth/getme` | Retrieve authenticated user profile (Protected) |
| `GET` | `/api/auth/logout` | Logout user and clear session cookie |

### Interview Endpoints (`/api/interview`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/interview/interview` | Generate report from job description, self description & resume upload |
| `GET` | `/api/interview/interview/:id` | Fetch specific interview report by ID |
| `GET` | `/api/interview/interviews` | Fetch all previous interview reports for current user |
| `POST` | `/api/interview/resume/pdf/:id` | Generate and download tailored resume PDF via Puppeteer |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a PR or submit an issue.
