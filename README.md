# 🦉 Duolingo Clone — Full-Stack Web App

A high-fidelity, interactive **Duolingo Clone** built from scratch to recreate the authentic Duolingo language learning experience for German. It features an interactive learning path, animated exercises, hearts and streak systems, competitive leaderboards, an in-app gem shop, and dark mode.

---

## 1. Project Overview & Tech Stack

This project replicates the core gamified learning loop of Duolingo:

- **Frontend:** **Next.js** (App Router, React 19, TypeScript)
- **Backend:** **FastAPI** (Python 3.10+, Uvicorn)
- **Database & ORM:** **SQLite** (`duolingo.db`) with **SQLAlchemy**
- **Global State Management:** **Zustand** (with browser `localStorage` persistence)
- **Styling & UI:** **Tailwind CSS** (custom Duolingo color palette), **Lucide React** icons, Canvas Confetti, and the Web Speech API for text-to-speech pronunciation.

---

## 2. Setup & Installation Instructions

Follow these step-by-step instructions to run both the backend and frontend locally.

### Prerequisites
- **Node.js** (v18.17+ or v20+)
- **Python** (v3.10+)
- **Git**

---

### Step 1: Backend Setup (FastAPI & SQLite)

1. Open a terminal and enter the `backend` folder:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows (PowerShell):**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize and Seed the Database:**
   Run the seeding script to create `duolingo.db` and populate it with initial users, courses, units, lessons, and exercises:
   ```bash
   python seed_data.py
   ```

5. Start the FastAPI backend server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The API will be live at `http://localhost:8000`. You can also view interactive API docs at `http://localhost:8000/docs`.*

---

### Step 2: Frontend Setup (Next.js)

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the Next.js development server:
   ```bash
   npm run dev
   ```
   *Open your browser and navigate to `http://localhost:3000` to start learning!*

---

## 3. Architecture Overview

The app follows a **decoupled client-server architecture**:

- **Next.js Frontend:** Renders UI components, handles instant micro-animations, and manages local client state.
- **FastAPI Backend:** Acts as the source of truth for the database, user stats, course tree, and active exercise sessions.

### The "Demo-First" Rehydration Flow
To ensure the user interface feels fast, responsive, and free of loading spinners:
1. **Initial Load:** When the user opens the page, the frontend queries `GET /api/users/1` and `GET /api/courses/1/path` to retrieve saved user stats and lesson progress.
2. **Client Store Hydration:** The fetched data hydrates the global **Zustand** store. Actions like selecting answers, deducting hearts, updating daily XP, or toggling dark mode update the UI instantly (60fps).
3. **Background Database Sync:** Critical gamification events (finishing a lesson, refilling hearts with gems, purchasing a streak freeze, or saving in-flight question queues) send background HTTP requests to FastAPI so that changes persist in the SQLite database.

---

## 4. Core Functionality & Edge-Case Handling

Here is a simple explanation of how each feature works, along with the exact `if/else` checks implemented to handle edge cases.

---

### A. Skill Tree & Linear Progression
**What it does:** Users progress through skills one by one. Completing a skill unlocks the next one in line.

* **How it works:**
  - Skills exist in three states: `'completed'`, `'active'`, or `'locked'`.
  - Finishing a lesson sends progress to `POST /api/users/{user_id}/progress`.
* **Edge Cases & `if/else` Logic:**
  - `if (skill was already 'completed'):`
    The user can still practice the lesson and earn +10 XP, but the streak does *not* double-increment, and already-unlocked skills are left untouched.
  - `if (skill was 'active'):`
    The skill status changes to `'completed'`, its progress bar fills completely, and the backend finds the very next skill in line:
    - `if (next_skill.status == 'locked'):` Unlock it and set its status to `'active'`.
    - `if (target_skill is the last skill in the unit/course):` Cleanly finishes without throwing an out-of-bounds error.

---

### B. Single-Skip Rule & Retry Queue
**What it does:** If a user skips a question, it is placed in a retry queue to be answered later. When it returns, it **cannot be skipped again**.

* **How it works:**
  - The backend tracks active lesson sessions (`GET /api/skills/{skill_id}/session` and `POST /api/skills/{skill_id}/session`).
  - When a question is skipped, its ID is saved in `skipped_question_ids` and the exercise is queued for the retry phase.
* **Edge Cases & `if/else` Logic:**
  - `if (exercise.id in skipped_question_ids OR is_review_phase == True):`
    The backend and frontend set `can_skip = False`. The **Skip** button is disabled (`opacity-40`, `cursor-not-allowed`), forcing the user to submit an answer.
  - `if (user exits lesson midway via 'X' button):`
    The current question index, progress percentage, and retry queue are saved to the backend. When the user returns to the skill, they resume exactly where they left off with their retry queue intact.
  - `if (lesson is completed):`
    The backend clears the active session and mid-progress data (`DELETE /api/skills/{skill_id}/session`), so the next time the skill is opened, it starts fresh.

---

### C. Hearts System & Refills
**What it does:** Users have 5 hearts. Wrong answers cost 1 heart. Losing all hearts blocks the user from continuing lessons.

* **How it works:**
  - Hearts are tracked both in the Zustand store and in the backend `users.hearts` database column.
* **Edge Cases & `if/else` Logic:**
  - `if (answer is incorrect):`
    Hearts decrement by 1 (`Math.max(0, hearts - 1)`).
  - `if (hearts == 0):`
    The user is locked out from continuing lessons via the `OutOfHeartsModal`. A 10-minute cooldown timer is automatically stored in `localStorage`.
  - `if (user buys a refill for 350 gems):`
    The backend checks `if user.gems >= 350`. If valid, it deducts 350 gems, restores hearts to 5, and clears any active cooldown timer.
    `else:` Returns an error saying insufficient gems.
  - `if (user clicks 'Practice' while at 0 hearts):`
    The user is routed to a practice session that awards +1 heart upon completion without spending gems.

---

### D. Daily Streaks & Streak Freeze
**What it does:** Tracks consecutive days practiced. Completing lessons on consecutive calendar days increments the streak.

* **How it works:**
  - The database records the user's `last_active_date` as `YYYY-MM-DD`.
* **Edge Cases & `if/else` Logic:**
  - `if (skill was 'active' AND last_active_date != today):`
    The streak increases by 1, and `last_active_date` updates to today.
  - `if (user completes another lesson on the same calendar day):`
    The streak does **not** increment again. This prevents artificial streak inflation.
  - `if (user equips a Streak Freeze for 100 gems):`
    The backend sets `user.streak_freeze_active = True`. If a day is missed, this shield protects the user's streak from resetting.

---

### E. Leaderboard & Badge Tiers
**What it does:** Displays how the user ranks compared to other learners based on total XP.

* **How it works:**
  - `GET /api/leaderboard` queries the real user and merges them with 15 seeded dummy learners.
  - The combined list is sorted descending by `total_xp`.
* **Edge Cases & `if/else` Logic:**
  - `if (rank == 1):` User/competitor receives a **Gold** badge (🥇) and yellow border accent.
  - `if (rank == 2):` Receives a **Silver** badge (🥈) and silver border accent.
  - `if (rank == 3):` Receives a **Bronze** badge (🥉) and bronze border accent.
  - `else (rank > 3):` Displayed with a standard numbered rank and neutral styling.

---

### F. Daily Goal Widget & In-Flight Progress
* **Daily Goal Tracker:**
  - Users can select a daily target (10, 20, 30, or 40 XP).
  - `if (daily_earned_xp >= goal):` The widget marks the goal as completed with a green checkmark and celebration styling. The state is saved with the current date key (`YYYY-MM-DD`) so it persists across page reloads throughout the day.
* **In-Flight Lesson Progress Ring (`skill_mid_progress`):**
  - While inside a lesson, each question answered saves mid-lesson progress to `/api/skills/{skill_id}/mid-progress`.
  - The skill button on the `/learn` page displays a circular progress ring reflecting exact in-flight completion percentage.
  - `if (lesson is fully finished):` Mid-progress is removed and replaced by a completed green ring.

---

## 5. Database Schema

The SQLite database (`duolingo.db`) is managed via SQLAlchemy with 6 relational tables:

```
┌──────────┐       1:N       ┌──────────┐       1:N       ┌──────────┐
│  Course  ├────────────────►│   Unit   ├────────────────►│  Skill   │
└──────────┘                 └──────────┘                 └────┬─────┘
                                                               │ 1:N
┌──────────┐       1:N       ┌──────────┐                      ▼
│   User   │                 │ Exercise │◄────────────────┌──────────┐
└──────────┘                 └──────────┘       1:N       │  Lesson  │
                                                          └──────────┘
```

### Table Breakdown

| Table | Purpose | Key Columns & Types | Relationships |
|---|---|---|---|
| **`users`** | Stores user profile, currency, and streaks | `id` (PK, Int), `username` (Str), `email` (Str), `hearts` (Int), `xp` (Int), `gems` (Int), `streak` (Int), `streak_days` (Int), `streak_freeze_active` (Bool), `last_active_date` (Str) | Belongs to `current_course` |
| **`courses`** | Available language courses | `id` (PK, Int), `title` (Str), `language_code` (Str), `flag_icon` (Str), `description` (Str) | Has many `units`, has many `users` |
| **`units`** | Groupings of skills (Unit 1, Unit 2, Unit 3) | `id` (PK, Int), `course_id` (FK, Int), `title` (Str), `description` (Str), `order` (Int) | Belongs to `course`, has many `skills` |
| **`skills`** | Individual nodes on the learning path | `id` (PK, Int), `unit_id` (FK, Int), `title` (Str), `icon` (Str), `order` (Int), `status` (`locked`\|`active`\|`completed`), `progress` (Int), `total_lessons` (Int) | Belongs to `unit`, has many `lessons` |
| **`lessons`** | Specific lessons inside a skill | `id` (PK, Int), `skill_id` (FK, Int), `title` (Str), `order` (Int), `xp_reward` (Int) | Belongs to `skill`, has many `exercises` |
| **`exercises`** | Individual quiz questions | `id` (PK, Int), `lesson_id` (FK, Int), `type` (Str), `prompt` (Str), `target_sentence` (Str), `audio_url` (Str), `options` (JSON Text), `correct_answer` (Str), `order` (Int) | Belongs to `lesson` |

---

## 6. API Overview

FastAPI backend endpoints available at `http://localhost:8000`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/{user_id}` | Returns user stats: heart count, total XP, current streak, gems balance, and freeze status. |
| `POST` | `/api/users/{user_id}/progress` | Saves completed lesson progress, increments XP, verifies streak logic, and unlocks the next skill. |
| `POST` | `/api/users/{user_id}/refill-hearts` | Deducts 350 gems to restore user hearts back to 5. |
| `POST` | `/api/users/{user_id}/practice-heart` | Awards +1 heart for completing a practice lesson without deducting gems. |
| `POST` | `/api/users/{user_id}/sync-hearts` | Synchronizes the current heart count when a mistake is made during an exercise. |
| `POST` | `/api/users/{user_id}/equip-freeze` | Purchases and equips a Streak Freeze shield for 100 gems. |
| `POST` | `/api/users/{user_id}/unequip-freeze` | Unequips the active Streak Freeze shield. |
| `GET` | `/api/courses/{course_id}/path` | Returns the course curriculum tree including units, skills, statuses, and in-flight progress rings. |
| `GET` | `/api/lessons/{lesson_id}` | Returns the list of exercises for a specified lesson. |
| `GET` | `/api/skills/{skill_id}/session` | Loads or initializes an active in-flight lesson session with retry queues and skip flags. |
| `POST` | `/api/skills/{skill_id}/session` | Saves midway question index, skipped question IDs, retry queues, and in-flight progress. |
| `DELETE` | `/api/skills/{skill_id}/session` | Resets and clears the active session when a lesson is completed. |
| `POST` | `/api/skills/{skill_id}/mid-progress` | Updates the circular in-flight progress indicator displayed on `/learn`. |
| `GET` | `/api/leaderboard` | Returns real-time user rankings alongside 15 seeded competitors sorted descending by XP. |

---

## 7. Assumptions & Demonstration Mode

- **Single-User Demonstration:** For straightforward demonstration and evaluation, the app runs with a pre-configured learner account (`id: 1`, `username: "alex_learner"`). Full multi-user login / authentication screens are omitted so anyone can immediately test all features.
- **Seeded Mock Data:** Leaderboard competitors, additional units, and German vocabulary questions are seeded directly via `seed_data.py`.
- **In-App Currency (Gems):** Gem transactions in the Shop and Popovers operate on local and database balances without actual external payment gateways.
- **Text-to-Speech:** German audio pronunciations utilize the standard browser-native `window.speechSynthesis` API (`de-DE`).

---

## License

This project is created for educational and portfolio demonstration purposes. All Duolingo trademarks, mascots, and logos belong to Duolingo, Inc.
