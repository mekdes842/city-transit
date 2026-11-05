# CITYTRANSIT ET
## Public Transport Route and Fare Finder

**Project Type:** Web Application  
**Team Project:** CityTransit ET  
**Frontend:** Next.js, React, TypeScript, Tailwind CSS  
**Backend:** Next.js API Routes and Supabase  
**Database:** Supabase PostgreSQL  
**Version Control:** Git and GitHub  

## 1. Introduction

City Transit ET 
City Transit ET is a web-based public transportation platform designed to simplify urban commuting by helping people find the most convenient ways to travel between destinations. Users can search for routes and discover the available means of transportation, including the specific taxi options to take for each journey. The platform identifies whether a direct route is available or whether multiple connections are required, providing clearer guidance on how to reach a destination. It also displays relevant fare information, helping commuters make informed travel decisions.
Beyond the commuter experience, City Transit ET features an Admin Portal that allows administrators to manage transit lines and update transportation information, helping keep route and fare data organized and accessible.
By bringing route discovery, transportation options, fare information, and transit management together in one platform, City Transit ET aims to make public transportation in Ethiopia easier to navigate, more accessible, and more convenient.

## 2. Problem Statement

Public transport users in Addis Ababa may experience difficulties identifying suitable routes, understanding fares, and determining which stops they need to pass through to reach their destinations. When transport information is scattered or difficult to access, planning journeys becomes inconvenient.

CityTransit ET addresses these challenges through a web-based platform that allows users to search for routes and access relevant stop and fare information in one place.

## 3. Project Objectives

### 3.1 General Objective

To develop a web application that helps users find public transport routes and access route, stop, and fare information in Addis Ababa.

### 3.2 Specific Objectives

- Allow users to select their origin and destination.
- Display suitable routes connecting selected locations.
- Provide fare information based on available route data.
- Present stops in their correct order along a route.
- Provide an administrative interface for managing transport information.
- Store and retrieve transport data through a structured database.
- Develop a responsive interface accessible through web browsers.

## 4. Project Scope and Main Features

CityTransit ET focuses on public transport route and fare information in Addis Ababa.

Its main features include:

- **Route Search:** Allows users to select starting and destination locations and find suitable transport routes.
- **Fare Information:** Displays stored or calculated journey fares based on available route data.
- **Stop Information:** Presents the stops associated with a selected route in their correct sequence.
- **Administrative Portal:** Provides an interface for managing transport locations, routes, stops, and fare information.
- **Database Integration:** Stores and retrieves transport information through Supabase PostgreSQL.
- **Responsive Interface:** Provides a user-friendly experience across different screen sizes.

Real-time vehicle tracking, live traffic updates, and GPS-based arrival predictions are outside the core project scope unless implemented separately.

## 5. Technology Stack

The project uses the following technologies:

| Technology | Purpose |
|---|---|
| Next.js | Main web application framework and application routing |
| React | Building reusable user interface components |
| TypeScript | Providing static typing and structured data definitions |
| Tailwind CSS | Responsive styling and interface design |
| Lucide React | Interface icons |
| Supabase | Backend services and database integration |
| PostgreSQL | Relational database management |
| Git | Version control |
| GitHub | Repository hosting and team collaboration |

## 6. System Architecture

CityTransit ET follows a web application architecture consisting of three main layers:

1. **Frontend Layer:** Provides the user interface for route searching, displaying itineraries, and accessing the administrative portal.
2. **Backend Layer:** Handles application requests, validates input, retrieves relevant transport information, and processes route and fare data.
3. **Database Layer:** Stores locations, routes, route stops, and related transport information using Supabase PostgreSQL.

### Main System Workflow

1. The user opens the application through a web browser.
2. The user selects an origin and destination.
3. The frontend sends a request to the backend.
4. The backend validates the request and retrieves relevant route and stop information.
5. Suitable routes and available fare information are determined.
6. The backend returns the results to the frontend.
7. The frontend displays the matching routes, stops, and fares.

The administrative interface follows a similar process while providing authorized users with transport data management capabilities.

## 7. Database Design

The project uses Supabase PostgreSQL to organize and maintain transport information through relational tables.

### 7.1 Locations Table

Stores the locations users can select as their starting points or destinations.

Possible fields:
- `id` – Unique location identifier.
- `name` – Name of the location.
- `sub_city` – Associated sub-city, where applicable.

### 7.2 Routes Table

Stores information about public transport routes.

Possible fields:
- `id` – Unique route identifier.
- `route_name` – Name of the route.
- `vehicle_type` – Type of transport.
- `base_fare` – Optional base fare.

### 7.3 Route Stops Table

Connects routes with their respective stops and maintains the sequence of stops.

Possible fields:
- `id` – Unique route-stop identifier.
- `route_id` – Reference to the associated route.
- `location_id` – Reference to the associated location.
- `stop_order` – Position of the stop along the route.
- `fare_from_start` – Cumulative fare from the beginning of the route, if applicable.

Foreign key relationships maintain connections between routes, locations, and stops.

## 8. Backend Design and API

The backend is responsible for processing route-search requests, retrieving transport information, and returning structured responses to the frontend.

A possible route-search API endpoint is:

`src/app/api/routes/search/route.ts`

The route-search process involves:

1. Receiving origin and destination identifiers.
2. Validating the provided identifiers.
3. Finding routes that contain both locations.
4. Checking that the origin appears before the destination in the selected direction.
5. Retrieving the relevant stops and fare information.
6. Calculating the journey fare when the stored fare model supports it.
7. Returning the matching routes and related information in JSON format.

For routes using cumulative fares, the journey fare can be calculated as:

**Journey Fare = Destination Cumulative Fare − Origin Cumulative Fare**

For example, if the destination cumulative fare is 20 ETB and the origin cumulative fare is 5 ETB, the journey fare is 15 ETB.

## 9. Frontend Design and Implementation

The frontend is developed using Next.js, React, TypeScript, and Tailwind CSS. It provides the main interface through which users interact with the application.

The frontend includes reusable components such as:

- **Navbar:** Provides the main navigation interface.
- **SearchForm:** Allows users to select their origin and destination.
- **ItineraryCard:** Displays available transport route information.
- **SkeletonCard:** Provides animated loading placeholders while data is being retrieved.

The application also includes a public route-search landing page and an administrative portal for transport data management.

Interactive client-side route filtering, responsive layouts, and loading-state management help provide a consistent user experience.

## 10. Team Members and Individual Contributions

The project was developed collaboratively, with responsibilities divided between backend infrastructure, database management, frontend development, and application architecture.
Kenawak Berhanu CTC-6591-26
Mekdes Tesfaye CTC-1711-26

### 10.1 Kenawak Berhanu – Backend and Database Lead

Responsible for the backend infrastructure and database management of CityTransit ET.

Key contributions:

- **Supabase Infrastructure:** Provisioned the Supabase backend project, configured environment variables, and managed API security.
- **Database Design and Security:** Created the `locations`, `routes`, and `route_stops` tables, established foreign key relationships, and configured Row Level Security (RLS) policies for public read and administrative write access.
- **Data Management:** Managed the insertion of Addis Ababa location seed data and ensured data persistence across the transport tables.

### 10.2 Mekdes Tesfaye – Frontend Lead and Application Architecture

Responsible for frontend development, interface design, and application structure.

Key contributions:

- **UI/UX Development:** Designed and developed responsive components, including the navigation bar, search form, itinerary cards, and animated loading indicators.
- **Page Architecture:** Built the main route-search landing page (`src/app/page.tsx`) and the administrative portal (`src/app/admin/page.tsx`).
- **Supabase Integration:** Configured the Supabase JavaScript client (`src/lib/supabase.ts`), TypeScript interfaces (`src/lib/types.ts`), and fallback data handling.
- **Database Schema Support:** Prepared SQL database schema scripts (`schema.sql`) to support database setup and integration.
- **State and Loading Management:** Implemented interactive client-side route filtering and skeleton loading interfaces during network requests.

## 11. Project Structure

The project follows an organized Next.js application structure:

```text
city-transit/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ItineraryCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── SearchForm.tsx
│   │   └── SkeletonCard.tsx
│   └── lib/
│       ├── supabase.ts
│       └── types.ts
├── .env.local
├── schema.sql
└── package.json
```

### Main Directories and Files

- `src/app/`: Contains the application's pages and overall layout.
- `src/app/admin/`: Contains the administrative portal.
- `src/components/`: Contains reusable frontend components.
- `src/lib/supabase.ts`: Configures the Supabase client.
- `src/lib/types.ts`: Defines TypeScript interfaces and data types.
- `.env.local`: Stores environment configuration.
- `schema.sql`: Contains database schema and seed data scripts.
- `package.json`: Defines project dependencies and scripts.

## 12. Security Considerations

Security is important because the application stores transport data and provides administrative management capabilities.

The project incorporates or requires the following security practices:

- Store sensitive credentials in environment variables.
- Keep service-role keys out of frontend code and public repositories.
- Apply appropriate Supabase Row Level Security policies.
- Allow public read access only to approved transport information.
- Restrict administrative write operations to authorized users.
- Validate and sanitize user-provided input.
- Handle errors without exposing sensitive internal information.

## 13. Testing and Evaluation

Testing is necessary to evaluate the application's functionality, reliability, and usability.

Recommended test cases include:

1. Searching with valid origin and destination locations.
2. Finding routes that connect two selected locations.
3. Handling locations that do not share a route.
4. Verifying the correct sequence of route stops.
5. Checking fare calculations against known values.
6. Handling missing or invalid location identifiers.
7. Managing database errors appropriately.
8. Preventing unauthorized administrative modifications.
9. Testing the interface across different screen sizes.
10. Verifying that frontend components display retrieved data correctly.

Testing results should be documented based on actual execution.

## 14. Project Limitations

Potential limitations of CityTransit ET include:

- Incomplete or outdated transport information.
- Incorrect route or fare results when database records are inaccurate.
- Limited coverage if only a subset of Addis Ababa routes is available.
- Dependence on internet access for database-backed features.
- No real-time vehicle tracking or arrival predictions unless implemented separately.

## 15. Future Improvements

Possible improvements include:

- Expanding the database to cover more public transport routes.
- Supporting transfers between multiple routes.
- Adding map-based route visualization.
- Introducing Amharic and English language support.
- Improving mobile usability.
- Implementing stronger administrative auditing and monitoring.
- Integrating real-time transport information when reliable data sources become available.

## 16. Conclusion

CityTransit ET is a web application developed to make public transport route and fare information more accessible to users in Addis Ababa. By combining Next.js, React, TypeScript, Supabase, and PostgreSQL, the project provides a foundation for searching transport routes, viewing ordered stops, and retrieving fare information.

The project also demonstrates the practical application of frontend development, backend integration, relational database management, security configuration, and collaborative software engineering.

Through the combined contributions of Kenawak Berhanu and Mekdes Tesfaye, the project brings together backend infrastructure, database management, frontend implementation, and application architecture to support its goal of simplifying public transport journey planning.
## 17.Presentation 
We have provided the link for our presentation below.
https://drive.google.com/file/d/1rSl2ZKJWC6q239PYPudOIgWB_7msFdE7/view?usp=sharing
# 18. Team Members Name and ID
Kenawak Berhanu CTC-6591-26
Mekdes Tesfaye CTC-1711-26
