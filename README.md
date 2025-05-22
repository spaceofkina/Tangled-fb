# Tangled 

## 📝 Project Description
**Tangled** is a minimalist Twitter clone built with modern web technologies. It allows users to:
- Sign in with Google authentication
- Sign in with JSONPlaceholder
  - User authentication system (Admin & Regular Users)
  - Post management with comments
  - Interactive user profiles with Mapblibre integration
  - Data visualization for admin users
- Post text and emojis (comments and image uploads coming soon)
- Like and interact with posts (applicable only to users-- signed in with google account)
- View a real-time feed of updates (applicable only to users-- signed in with google account)

Key Technologies:
- **Frontend**:
  - Next.js
  - React
  - Tailwind CSS
    
- **Authentication & Storage**:
  - Firebase Authentication (Google Sign-In)
  - Firebase Firestore (User data storage)

- **Mock API Services**:
  - JSON Placeholder (Posts/Comments data)
  - Fetch API (data fetching)

- **Mapping & Visualization**:
  - Maplibre GL JS (Address visualization)
  - ApexCharts (Admin dashboard)

- **Utilities**:
  - Zod (Form validation)
  - NextAuth.js (Session management)

- **Deployment**:
  - Vercel

## 🚀 Live Demo
Check out the deployed version:  
👉([tangled-fb.vercel.app](https://tangled-fb.vercel.app/)) <!-- Replace with your actual URL -->

## 🛠 Setup & Installation

### Prerequisites
- Node.js
- npm
- Firebase account

### Installation Steps
1. **Create Project**
   ```bash
   npx create-app-next Tangled
   cd Tangled
2. Install dependencies
3. Set Up Firebase
   - Create a new Firebase project
   - Enable Google Authentication
   - Set up Firestore database
   - Create .env.local file:
5. Run the development server
6. Open in browser

## 👥 Team Contribution

Katrina Jasmine Espenida
 - Implemented Google authentication
 - Designed and built the core posting functionality
 - Set up Firebase integration
 - Built post/likes/delete display logic 
 - Designed UI components with Tailwind CSS 
 - Implemented Post and Comments (from JSON Placeholder API)
 - Implemented user listing and profile views 
 - Implement a login system (from JSON Placeholder API [admin and users])

Maria Valencia
 - Implemented Zod form validation
 - Designed UI components with Tailwind CSS
 - Assisted in log in system (JSON Placeholder)
 - Group Presentor

Alec Vilanueva
 - Implemented Data Visualization using ApexCharts
 - Designed UI components with Tailwind CSS
 - Assisted in log in system (JSON Placeholder)
 - Group Presentor

Paul Adrian Agudo
 - Integrated Maplibre for address visualization
 - Designed UI components with Tailwind CSS
 - Assisted in log in system (JSON Placeholder)
 - Group Presentor


 📄 Academic Compliance
### This project fulfills all requirements for CS 321 - Applications Development and Emerging Technologies under:

- Program: BSCS 3-1 & 3-2
- Academic Year: 2024-2025
- Instructor: JARRIAN VINCE G. GOJAR
- Institution: Sorsogon State University-Bulan Campus

