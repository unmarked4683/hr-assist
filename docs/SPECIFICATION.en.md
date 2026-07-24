# HR Assist — Technical & Business Specification

A lightweight, high-performance internal web application for employee management, working hours tracking, and leave records.

---

## Architecture & Core Design System

### Technology Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Shadcn UI, Fuse.js (Fuzzy Search)
- **Backend:** NestJS (Node.js framework), TypeScript
- **Database & ORM:** PostgreSQL + Prisma ORM
- **DevOps & Containerization:** Docker + Docker Compose

### Runtime Environment (One-Command Setup)

The application is fully containerized. Spinning up the entire development and production environment (Frontend + Backend + PostgreSQL Database) requires running a single command after pulling the repository:

```bash
docker compose up --build
```

**Benefits: Zero manual local database configuration, guaranteed environment consistency across developers, and seamless deployment to production servers (Zero Configuration Overhead).**

### Engineering Principles

- **Single Source of Truth:** Zero state duplication across components.
- **Modularity:** Strictly one responsibility per file. Component files must stay under ~150–200 lines of code.
- **Strict TypeScript:** Absolute ban on `any`. All domain entities must be fully typed.
- **Layout Stability:** Fixed two-column layout (`100vh`) with zero Cumulative Layout Shift (CLS).

### Structural Layout

- **Sidebar (`Aside / Nav`):** Fixed left panel (200–300px width, `100vh`).
- **Main Stage (`Main`):** Dynamic right workspace filling the remaining viewport (`100vh`).

---

## Release Plan & Changelog

> [!IMPORTANT]
> **Scope Contract for Management & Stakeholders**
> Features listed under **`v1.0.0 (MVP)`** constitute the entire binding contract for the initial release. Any additional features, extra fields, or workflow modifications requested during development are automatically deferred to **`v2.0.0+`**.

### `v1.0.0` — MVP (Current Scope)

#### Access & Security Model

- **Single Role (Admin / HR):** Trusted operator model. HR inputs verified, real-world data directly. No multi-level approval workflows.

---

#### Sidebar (`Aside`)

- **Header:** Top tile with "HR Assist" branding.
- **Navigation:** Two tabs — **Pracownicy** and **Dni wolne** (active tab highlighted with background and border).
- **Bottom Profile Tile:**
  - Displays a circle with uppercase initials, Full Name, and a right arrow.
  - **On Click:** Darkens tile, rotates arrow, and opens a popover with a **Wyloguj się** option.
  - **Dismissal:** Closes via re-click, clicking outside, or pressing `Esc`.
  - **Logout Action:** Clears session/cookies and redirects to the login screen.

---

#### Authentication Screen

- Centered square container.
- Vertical stack: Profile Icon $\rightarrow$ `Email` Input $\rightarrow$ `Password` Input $\rightarrow$ **Zaloguj się** Button.
- Redirects to the **Pracownicy** view upon successful authentication.

---

#### View: Employee List (`/employees`)

- **Top Bar:**
  - Search input powered by **Fuse.js** (searches across _First Name, Last Name, Position, Location, PESEL_).
  - Square `+` button triggering the **Add Employee Modal**.
- **System Table:**
  - HTML `<table>` with full-row borders (`<tr>`) and no vertical borders (`<td>`).
  - Header columns (UPPERCASE, centered): `IMIĘ`, `NAZWISKO`, `STANOWISKO`, `LOKALIZACJA`, `STATUS`.
  - **Rows:** Zebra striping. Clicking anywhere on a row navigates to the employee details page.
  - **Location Cell:** Visual badge (e.g., "Hala" + icon).
  - **Status Indicators:**
    - 🟢 **Status OK:** Green indicator + `OK` text.
    - 🔴 **Status NN:** Red indicator + `NN` text + **subtle, distinct red row pulsing** (triggered on unexcused absence).
  - **Scroll:** Independent internal scroll (`overflow-y: auto`) with a sticky, non-transparent header.

---

#### View: Employee Details (`/employees/[id]`)

##### Top Section: Tabs Component

- **Tab 1: "Dane pracownika"**
  - Line 1: Full Name (UPPERCASE, e.g., `JAN KOWALSKI`).
  - Line 2: `PESEL: 85071812345 (18.07.1985)` (PESEL + calculated birth date).
  - Line 3: `Position • Location • Department/Legal Entity` (e.g., `Magazynier • Hala • Dział Konstrukcji`).
  - Line 4: `Working Hours • FTE Status • Contract Type` (e.g., `08:00 - 16:00 • 8 godz./dzień (Pełen etat) • UoP`).
  - **Action Bar (Top-Right):** 4 icon buttons — `Edit`, `Report`, `Archive`, `Delete` (configured with stub handlers `alert("Funkcja w przygotowaniu")`).
- **Tab 2: "Urlopy"**
  - Fixed 2-column grid (`grid-cols-2`):
    - **Left Column:** Overdue Leave (e.g., `Zaległy: 10 / 20 dni`) + `Progress` bar (50%).
    - **Right Column:** Current Leave (e.g., `Aktualny: 0 / 26 dni`) + `Progress` bar (0%).
  - **Null/No-Allowance Handling:** Renders `- / - dni` with a 0% progress bar. Percentages are rounded to 2 decimal places (e.g., `66.67%`).

##### Bottom Section: Calendar Module (Persistent)

_Always visible below the tabs section regardless of the active top tab._

- **Date Controls (Top-Left):**
  - `<` Button $\rightarrow$ Month Select (`STYCZEŃ`–`GRUDZIEŃ`) $\rightarrow$ Year Select (`2026`–`2036`) $\rightarrow$ `>` Button.
  - Arrows are disabled at boundary limits (Jan 2026 / Dec 2036).
- **Locking Mechanism (Top-Right):**
  - **Current Month:** Lock icon disabled with a tooltip (_"Nie można zablokować miesiąca, gdyż jeszcze trwa"_).
  - **Days 1–10 of Following Month:** Lock icon active with a green accent. Clicking triggers a confirmation modal to permanently lock editing.
  - **Day 11 Onwards (00:00):** Automatic system lock applied (Red, locked icon).
  - **Lock Effect:** Calendar grid opacity drops, interactions are disabled, and cursor changes to `not-allowed`.
- **Calendar Grid:**
  - 6 Columns: `Dzień` | `Dzień tygodnia` | `Godziny pracy` | `Nominalny czas` | `Realny czas` | `Status`.
  - Statuses: `OB` (Present - Green), `NN` (Unexcused Absence - Red + row highlight), `USP` (Excused Absence / Leave - Orange).

Day Editability Criteria & Attendance Dictionary:
Day Editability Rules:

A day cell is clickable (cursor-pointer + hover effect) if and only if:

The month is not locked.

The day is not a Saturday or Sunday.

The day is not a Statutory Public Holiday.

The day is not a Company-wide Leave Day (stored under the hood as UW — Vacation Leave, protected from manual edit).

Non-editable days enforce cursor: not-allowed.

Attendance Dictionary (16 Statuses):

OB (Present - default, no DB entry), CH (Sick Leave), NN (Unexcused Absence), UB (Unpaid Leave), UW (Vacation Leave / Company-wide Leave), UM (Maternity Leave), NUN (Excused Unpaid Absence), NUP (Excused Paid Absence), UO (Paternity Leave), OP (Childcare Leave), REH (Rehabilitation Benefit), UR (Parental Leave), UŻ (Leave on Demand), UOK (Special Leave), WZS (Day off for Holiday), WYC (Child-rearing Leave).

Attendance Edit Modal (<Modal />):

Header: Date formatted as D MONTH YYYY (e.g., 1 JULY 2026).

UI Layout: 3 equal-width, vertically balanced elements:

Attendance Select Dropdown: Formatted as Description (SHORT_CODE).

"Usuń frekwencję" Button: Removes the DB exception, reverting to default OB.

"Aktualizuj" Button: Saves the selected status in the DB.

## UX Guard: Modal closes automatically only after the backend responds and the grid re-renders.

#### Reusable Modal Component (`<Modal />`)

- Centered container with a blurred backdrop (`backdrop-blur`).
- Header: Centered title + `[X]` close button on the right.
- Footer: Primary action button, disabled until full form validation passes.
- **Double Confirmation (`confirmConfig`):** Optional prop that triggers an alert dialog (_"Czy na pewno kontynuować?"_) before executing irreversible actions.

##### Add Employee Modal (4-Row Grid)

- **Row 1:** `First Name` | `Last Name` | `PESEL` (11 digits + NPM validation + real-time birth date helper text).
- **Row 2:** `Contract Type` (Locked to `UoP`) | `FTE Dimension` (1/8 to 8/8 + calculated hours helper text) | `Start Time` | `End Time`.
  - _Sync Logic:_ Modifying start time auto-shifts end time based on FTE hours. Allowed window: `04:00`–`22:00`. Out-of-bounds values highlight fields in red and disable the submit button.
- **Row 3:** `Location` (Segmented Control: `Biuro` | `Hala`) | `Position` (Combobox with unique suggestions + custom entry) | `Legal Entity` (Async dropdown).
- **Row 4:** `Overdue Leave` (Numeric input $0$–$26$ days) | `Annual Pool` (Toggle: `20 dni` | `26 dni`).

---

### `v2.0.0+` — Future Roadmap

Features planned for subsequent iterations. **Out of scope for `v1.0.0 (MVP)`**:

- **`v2.1.0` — Multi-Role Access Control (RBAC)**
  - User roles: `Employee`, `Manager / HR`, `Admin / Executive`.
  - Leave application approval panel & workflow (`PENDING` $\rightarrow$ `APPROVED` / `REJECTED`).
- **`v2.2.0` — Reporting & Export Engine**
  - Activation of the `Report` button on employee cards.
  - Automated PDF / XLSX exports for monthly attendance registers.
- **`v2.3.0` — Profile Management & Notifications**
  - Modals for employee data editing, archiving, and profile deletion.
  - Email / Slack notification integrations for monthly lockouts and unexcused absences.

```

```
