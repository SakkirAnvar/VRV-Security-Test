
# Project Documentation

## Getting Started

### Client Setup

1. Open a terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install the dependencies:
   ```bash
   npm i
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Server Setup

1. Open another terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install the dependencies:
   ```bash
   npm i
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Project Overview

### Login Page
- Once the project is running, open the browser to view the login page.
- Use the following credentials to log in:
  - **Username:** `admin`
  - **Password:** `123`

### Dashboard
- After logging in, you will be navigated to the dashboard.
- The dashboard includes features for managing:
  - **Sub-users**
  - **Banner for the main page**

### Role-Based Access
- Features are accessible based on roles assigned to the current user.
- Only users with specific roles can:
  - View and manage sub-users
  - View and manage banners

### Sub-User Management
Users with the appropriate role can:
- **Create** a sub-user
- **Edit** sub-user details
- **Block** a sub-user
- **Delete** a sub-user

### Banner Management
Users with the appropriate role can:
- **Create** a banner
- **Edit** banner details
- **Delete** a banner

### Additional Features
- **User Profile Settings:** Allows users to update their personal information and preferences.
- **Pagination:** Efficiently handles large datasets by dividing them into manageable pages.
- **Table Structure Adjustments:** Tables adapt dynamically based on user preferences or roles.

---

## Notes
Ensure you have the correct roles assigned to access specific features in the dashboard. 
