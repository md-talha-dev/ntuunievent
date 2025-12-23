# NTU Events Management System

## Complete End-to-End Documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Authentication System](#authentication-system)
5. [User Roles & Permissions](#user-roles--permissions)
6. [Database Schema](#database-schema)
7. [Project Structure](#project-structure)
8. [API & Edge Functions](#api--edge-functions)
9. [Design System](#design-system)
10. [Setup & Deployment](#setup--deployment)
11. [Security Considerations](#security-considerations)

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
| Technology | Purpose |
|------------|---------|
| **React 18** | UI Library |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Utility-First Styling |
| **Shadcn/UI** | Component Library |
| **React Router DOM** | Client-Side Routing |
| **TanStack Query** | Data Fetching & Caching |
| **Lucide React** | Icon Library |
| **React Hook Form** | Form Management |
| **Zod** | Schema Validation |

### Backend (Lovable Cloud)
| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Database |
| **Edge Functions** | Serverless Functions |
| **Row Level Security** | Data Protection |

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
Email:    talha@admin.ntu.pk
Password: hj38&%hj32JUY
```

> ⚠️ **Security Note**: These credentials are seeded via an edge function. In production, change the password immediately after first login.

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

| Action | Admin | Student | Public |
|--------|-------|---------|--------|
| View Events | ✅ | ✅ | ✅ |
| Create Events | ✅ | ❌ | ❌ |
| Edit Events | ✅ | ❌ | ❌ |
| Delete Events | ✅ | ❌ | ❌ |
| Register for Events | ✅ | ✅ | ❌ |
| Manage Categories | ✅ | ❌ | ❌ |
| Manage Departments | ✅ | ❌ | ❌ |
| Manage Organizers | ✅ | ❌ | ❌ |
| View Own Profile | ✅ | ✅ | ❌ |
| Sign Up | ❌ | ✅ | ❌ |

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

### Table Details

#### profiles
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| name | text | No | - |
| email | text | No | - |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

#### user_roles
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| user_id | uuid | No | - |
| role | app_role | No | - |
| created_at | timestamptz | No | now() |

#### events
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| title | text | No | - |
| description | text | No | - |
| date | date | No | - |
| time | text | No | - |
| location | text | No | - |
| category | text | No | - |
| department | text | Yes | - |
| organizer | text | No | - |
| image | text | Yes | - |
| status | text | No | 'active' |
| going_count | integer | No | 0 |
| interested_count | integer | No | 0 |
| created_at | timestamptz | No | now() |
| updated_at | timestamptz | No | now() |

#### event_participants
| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | uuid | No | gen_random_uuid() |
| event_id | uuid | No | - |
| user_id | uuid | No | - |
| status | text | No | - (going/interested) |
| created_at | timestamptz | No | now() |

---

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

### Database Functions

#### handle_new_user()
Trigger function that automatically:
1. Creates a profile entry when a new user signs up
2. Assigns the default 'student' role

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, name, email)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$function$
```

#### update_updated_at_column()
Trigger function for auto-updating timestamps:
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
```

---

## Design System

### Color Palette

| Token | Usage |
|-------|-------|
| `--background` | Page backgrounds |
| `--foreground` | Primary text |
| `--primary` | Brand color (buttons, links) |
| `--secondary` | Secondary UI elements |
| `--muted` | Muted backgrounds |
| `--accent` | Accent elements |
| `--destructive` | Error/delete actions |
| `--icon-brown` | Icon base color |
| `--icon-brown-light` | Icon highlight |
| `--icon-brown-dark` | Icon shadow |

### Icon System

3D Brown Icons with shadow effects:
```css
.icon-3d {
  color: hsl(var(--icon-brown));
  filter: drop-shadow(2px 2px 0px hsl(var(--icon-brown-dark)))
          drop-shadow(-1px -1px 0px hsl(var(--icon-brown-light)));
}
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| sm | 640px | Small tablets |
| md | 768px | Tablets |
| lg | 1024px | Laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large screens |

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

### Environment Variables

The following are auto-configured by Lovable Cloud:
```env
VITE_SUPABASE_URL=<auto-configured>
VITE_SUPABASE_PUBLISHABLE_KEY=<auto-configured>
VITE_SUPABASE_PROJECT_ID=<auto-configured>
```

### Deployment

1. **Lovable Deployment**:
   - Click "Publish" in the Lovable editor
   - Frontend changes require clicking "Update"
   - Backend changes deploy automatically

2. **Custom Domain**:
   - Navigate to Project > Settings > Domains
   - Add your custom domain
   - Configure DNS as instructed

### Seeding Admin User

After deployment, call the seed-admin edge function:
```bash
curl -X POST https://<project-id>.supabase.co/functions/v1/seed-admin
```

---

## Security Considerations

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

#### Events Table
```sql
-- Public read access
CREATE POLICY "Events are viewable by everyone" 
ON public.events FOR SELECT 
USING (true);

-- Admin write access
CREATE POLICY "Admins can insert events" 
ON public.events FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update events" 
ON public.events FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete events" 
ON public.events FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));
```

#### User Roles Table
```sql
-- Users can only view their own roles
CREATE POLICY "Users can view own roles" 
ON public.user_roles FOR SELECT 
USING (auth.uid() = user_id);

-- No insert/update/delete for users (managed by triggers)
```

### Security Best Practices Implemented

1. ✅ **Role-based access control** via database functions
2. ✅ **RLS on all tables** for data protection
3. ✅ **SECURITY DEFINER** functions to prevent recursive RLS
4. ✅ **Email validation** for student registration
5. ✅ **Separate roles table** to prevent privilege escalation
6. ✅ **Server-side role verification** (not client-side)
7. ✅ **Input validation** using Zod schemas

### Security Recommendations

1. **Change admin password** after first deployment
2. **Enable email confirmation** for production
3. **Set up rate limiting** for auth endpoints
4. **Regular security audits** of RLS policies
5. **Monitor auth logs** for suspicious activity

---

## Support & Resources

- **Lovable Documentation**: [docs.lovable.dev](https://docs.lovable.dev)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Shadcn/UI**: [ui.shadcn.com](https://ui.shadcn.com)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024 | Initial release |

---

## License

This project is proprietary software for National Textile University.

---

*Documentation generated for NTU Events Management System*
