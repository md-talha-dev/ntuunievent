# UniEvent (NTU Events Management System)

## Complete End-to-End Documentation

---

## Project Overview

The **NTU Events Management System** is a full-stack web application designed for National Textile University to manage and display campus events. It provides a platform for students to discover, register for, and track university events while giving administrators full control over event management.

### Key Objectives

- Centralized event management for NTU
- Student engagement through event discovery
- Admin-controlled event creation and management
- Mobile-responsive design for accessibility

---

## Technology Stack

### Frontend

| Technology           | Purpose                 |
| -------------------- | ----------------------- |
| **React 18**         | UI Library              |
| **TypeScript**       | Type Safety             |
| **Vite**             | Build Tool & Dev Server |
| **Tailwind CSS**     | Utility-First Styling   |
| **Shadcn/UI**        | Component Library       |
| **React Router DOM** | Client-Side Routing     |
| **TanStack Query**   | Data Fetching & Caching |
| **Lucide React**     | Icon Library            |
| **React Hook Form**  | Form Management         |
| **Zod**              | Schema Validation       |

### Backend (Lovable Cloud)

| Technology             | Purpose              |
| ---------------------- | -------------------- |
| **Supabase**           | Backend-as-a-Service |
| **PostgreSQL**         | Database             |
| **Edge Functions**     | Serverless Functions |
| **Row Level Security** | Data Protection      |

---

## Features

### Public Features

- ✅ Browse all upcoming events
- ✅ Filter events by category, department, and date
- ✅ Search events by title or description
- ✅ View event details (location, time, organizer)
- ✅ Responsive design (mobile & desktop)

### Student Features

- ✅ Student registration (restricted to @student.ntu.edu.pk emails)
- ✅ Sign in/Sign out
- ✅ Mark attendance (Going/Interested)
- ✅ View personal profile
- ✅ Track registered events

### Admin Features

- ✅ Admin-only sign in (no registration)
- ✅ Create new events
- ✅ Edit existing events
- ✅ Delete events
- ✅ Manage categories, departments, and organizers
- ✅ View event statistics

---

## Authentication System

### Overview

The system implements a dual authentication model:

```
┌─────────────────────────────────────────────────────────┐
│                  Authentication Flow                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ADMIN                          STUDENT                  │
│  ┌──────────────┐              ┌──────────────┐         │
│  │ Sign In Only │              │ Sign Up +    │         │
│  │              │              │ Sign In      │         │
│  └──────┬───────┘              └──────┬───────┘         │
│         │                              │                 │
│         ▼                              ▼                 │
│  ┌──────────────┐              ┌──────────────┐         │
│  │ Pre-seeded   │              │ Email must   │         │
│  │ credentials  │              │ end with     │         │
│  │              │              │ @student.    │         │
│  │              │              │ ntu.edu.pk   │         │
│  └──────────────┘              └──────────────┘         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Admin Credentials

```
contact @ali_animates_ on instagram
```

> **Security Note**: These credentials are seeded via an edge function. In production, change the password immediately after first login.

### Student Registration Rules

- Email **MUST** end with `@student.ntu.edu.pk`
- Students can both sign up and sign in
- Profile is automatically created on registration
- Default role: `student`

### Authentication Flow

```typescript
// Student Sign Up Validation
const validateStudentEmail = (email: string): boolean => {
  return email.endsWith('@student.ntu.edu.pk');
};

// Sign Up Process
1. User enters email + password
2. Email validated against @student.ntu.edu.pk
3. Supabase creates auth.users entry
4. Trigger creates profile in public.profiles
5. Trigger assigns 'student' role in public.user_roles
```

---

## User Roles & Permissions

### Role Definition

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'student');
```

### Permission Matrix

| Action              | Admin | Student | Public |
| ------------------- | ----- | ------- | ------ |
| View Events         | ✅    | ✅      | ✅     |
| Create Events       | ✅    | ❌      | ❌     |
| Edit Events         | ✅    | ❌      | ❌     |
| Delete Events       | ✅    | ❌      | ❌     |
| Register for Events | ✅    | ✅      | ❌     |
| Manage Categories   | ✅    | ❌      | ❌     |
| Manage Departments  | ✅    | ❌      | ❌     |
| Manage Organizers   | ✅    | ❌      | ❌     |
| View Own Profile    | ✅    | ✅      | ❌     |
| Sign Up             | ❌    | ✅      | ❌     |

### Role Checking Function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;
```

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  auth.users  │     │   profiles   │     │  user_roles  │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (PK)      │◄────│ user_id (FK) │     │ id (PK)      │
│ email        │     │ id (PK)      │     │ user_id      │
│ ...          │     │ name         │     │ role         │
└──────────────┘     │ email        │     │ created_at   │
                     │ created_at   │     └──────────────┘
                     │ updated_at   │
                     └──────────────┘

┌──────────────┐     ┌───────────────────┐
│    events    │     │ event_participants│
├──────────────┤     ├───────────────────┤
│ id (PK)      │◄────│ event_id (FK)     │
│ title        │     │ id (PK)           │
│ description  │     │ user_id           │
│ date         │     │ status            │
│ time         │     │ created_at        │
│ location     │     └───────────────────┘
│ category     │
│ department   │
│ organizer    │
│ image        │
│ status       │
│ going_count  │
│ interested_  │
│   count      │
│ created_at   │
│ updated_at   │
└──────────────┘

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  categories  │  │  departments │  │  organizers  │
├──────────────┤  ├──────────────┤  ├──────────────┤
│ id (PK)      │  │ id (PK)      │  │ id (PK)      │
│ name         │  │ name         │  │ name         │
│ created_at   │  │ created_at   │  │ created_at   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Project Structure

```
ntu-events/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── ntu-logo.png
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminEventCard.tsx
│   │   │   └── EventForm.tsx
│   │   ├── events/
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventDetails.tsx
│   │   │   └── EventFilters.tsx
│   │   ├── layout/
│   │   │   └── Header.tsx
│   │   ├── ui/
│   │   │   └── [shadcn components]
│   │   └── NavLink.tsx
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── EventContext.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   ├── data.ts
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Admin.tsx
│   │   ├── Events.tsx
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   └── Profile.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   ├── config.toml
│   └── functions/
│       └── seed-admin/
│           └── index.ts
├── .env
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## API & Edge Functions

### Edge Function: seed-admin

**Purpose**: Creates and configures the admin user account.

**Endpoint**: `/functions/v1/seed-admin`

**Method**: POST

**Response**:

```json
{
  "success": true,
  "message": "Admin user created and role assigned successfully",
  "userId": "uuid"
}
```

**Implementation**:

```typescript
// supabase/functions/seed-admin/index.ts
- Creates admin user with predefined credentials
- Assigns 'admin' role in user_roles table
- Handles existing user scenario
```

---

## Setup & Deployment

### Prerequisites

- Node.js 18+
- npm or bun
- Lovable account (for deployment)

### Local Development

```bash
# Clone the repository
git clone <repository-url>
cd ntu-events

# Install dependencies
npm install

# Start development server
npm run dev
```

---

### Security Best Practices Implemented

1. **Role-based access control** via database functions
2. **RLS on all tables** for data protection
3. **SECURITY DEFINER** functions to prevent recursive RLS
4. **Email validation** for student registration
5. **Separate roles table** to prevent privilege escalation
6. **Server-side role verification** (not client-side)
7. **Input validation** using Zod schemas

## Version History

| Version | Date | Changes         |
| ------- | ---- | --------------- |
| 1.0.0   | 23 Dec, 2025 | Initial release |

---

## Impact
This system improves **student engagement**, reduces **administrative overhead**, and provides a **scalable digital solution** for campus event management.

---

## Conclusion
NTU Events Management System demonstrates a **real-world, production-ready solution** with strong focus on usability, security, and scalability — making it ideal for institutional adoption.

---
## License

This project is proprietary software for National Textile University.
