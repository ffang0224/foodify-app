# Data Product Frontend - Foodify

## Project Description

This project is the frontend prototype for our data product, **Foodify**, allowing users to explore restaurant collections, navigate lists, and view maps of restaurants. The primary goal was to implement a user-friendly, responsive interface using React, based on wireframes created in Figma.

## Figma Wireframe

The initial wireframe in Figma guided the layout and component structure for this project. It includes a basic flow between primary components, user interactions, and a focus on component placement. The wireframe link or exported file can be found [here](#).

## Component Documentation

### App.js

`App.js` is the main entry point for the application, setting up routing for different pages using `react-router-dom`. Key routes include pages for registration, login, restaurant lists, maps, and individual restaurant details. `App.js` integrates several components and provides navigation throughout the app.

### Login.js

The `Login` component presents a login form where users can enter their credentials or sign in using social login options. This component features a split-screen layout with the form on the right and a placeholder image area on the left. Upon submission, users are navigated to the map view.

### Register.js

The `Register` component provides a registration form where users can sign up with their email, username, and password. Similar to `Login.js`, this component includes a split-screen layout and social login buttons. Upon form submission, users are navigated to the login page.

## Setup Instructions

1. **Clone the Repository**:

   - `git clone https://github.com/ffang0224/foodify-app`
   - `cd foodify-app`

2. **Install Dependencies**:

   - Run `npm install` to install all necessary packages.

3. **Run the Application**:

   - Use `npm start` to start the development server.

4. **Dependencies**:

   - `react-router-dom` for navigation between pages.
   - `@react-google-maps/api` for map integration (for future use).
   - `lucide-react` for icon support.

5. **Environment Variables**:
   For Google Maps or other API keys, create a `.env` file at the root level and add any necessary keys in the format:
   - `REACT_APP_GOOGLE_API_KEY=your_google_maps_api_key`

## Development Process

### Design Decisions

- **Component-Based Architecture**: Each component represents a distinct feature or page (e.g., login, register, restaurant collection), creating a modular and organized codebase.
- **Mock Data Integration**: We used mock data to simulate API responses, enabling us to structure components and layouts without backend dependencies.
- **Tailwind CSS**: Tailwind CSS utility classes were used for consistent styling, maintaining layout and spacing without separate CSS files.

### Technical Choices

- **React**: Selected for its component-based structure and efficient rendering, making it ideal for rapid prototyping.
- **Figma for Wireframing**: Used to design and plan the UI layout, helping streamline the development process.
- **GitHub for Collaboration**: Version control allowed team members to contribute seamlessly with a clear commit history reflecting progress.
