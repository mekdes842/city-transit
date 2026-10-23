# 🚌 CityTransit ET

**CityTransit ET** is a responsive web application built with Next.js, TypeScript, Tailwind CSS, and Supabase. It provides public transport route searching, fare calculation, stop sequence tracking, and administrative route management across sub-cities in Addis Ababa, Ethiopia.

---

## 👥 Team & Contributions

### **Developer A: Kenawak Berhanu** — *Backend & Database Lead*
* **Supabase Infrastructure:** Provisioned the Supabase backend project, configured environment variables, and managed API security.
* **Database Schema & RLS:** Executed table creations (`locations`, `routes`, `route_stops`), foreign key relationships, and configured Row Level Security (RLS) policies for public read and administrative write access.
* **Backend Data Pipeline:** Managed seed data insertion for Addis Ababa locations and ensured live data persistence across transit tables.

### **Developer B: Mekdes Tesfaye** — *Frontend Lead & Architecture*
* **UI/UX Design & Components:** Developed responsive navigation (`Navbar`), search interfaces (`SearchForm`), itinerary display cards (`ItineraryCard`), and animated loading states (`SkeletonCard`).
* **Page Architecture:** Built the main route search landing page (`src/app/page.tsx`) and the transit management Admin Portal (`src/app/admin/page.tsx`).
* **Supabase Client Integration:** Configured `@supabase/supabase-js` client SDK (`src/lib/supabase.ts`), TypeScript interfaces (`src/lib/types.ts`), fallback data handling, and SQL database schema scripts (`schema.sql`).
* **State & Loading Management:** Implemented interactive client-side route filtering and skeleton loading UI during network requests.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Database & BaaS:** Supabase (`@supabase/supabase-js`)
* **Version Control:** Git & GitHub

---

## 📁 Key Project Structure

```text
city-transit/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx        # Admin Portal for route management
│   │   ├── layout.tsx          # Root layout with fonts & global styles
│   │   └── page.tsx            # Main public search & itinerary finder
│   ├── components/
│   │   ├── ItineraryCard.tsx   # Transport route card display
│   │   ├── Navbar.tsx          # Main header navigation
│   │   ├── SearchForm.tsx      # Origin/destination selector form
│   │   └── SkeletonCard.tsx    # Animated loading indicator
│   └── lib/
│       ├── supabase.ts         # Supabase client helper instance
│       └── types.ts            # TypeScript interfaces & types
├── .env.local                  # Supabase environment variables
├── schema.sql                  # PostgreSQL database schema & seed data
└── package.json