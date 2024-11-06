# Data Product Frontend - Foodify

## Project Description

This project is the frontend prototype for our data product, **Foodify**, allowing users to explore restaurant collections, navigate lists, and view maps of restaurants. The primary goal this week was to implement a user-friendly, responsive interface using React, based on wireframes we created in Figma.

## Figma Wireframe

The initial wireframe in Figma guided the layout and component structure for this project. It includes a basic flow between primary components, user interactions, and a focus on component placement. The wireframe link or exported file can be found [here](https://www.figma.com/design/9TSA9lHTsOBFWM9XFOGB6k/Foodify-Wireframe?node-id=0-1&m=dev&t=zLGmbL571CAWqaCm-1).

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
   - `@react-google-maps/api` for map integration.
   - `lucide-react` for icon support.

5. **Environment Variables**:
   For Google Maps or other API keys, create a `.env` file at the root level and add any necessary keys in the format:
   - `REACT_APP_GOOGLE_API_KEY=your_google_maps_api_key`

## Development Process

### Design Decisions

- **Consistent Visual Layout**: We aimed for a clean, minimalistic interface, keeping components well-spaced and using a neutral color palette to maintain focus on content.
- **Responsive Layouts**: The app was designed to be responsive, ensuring a seamless experience across both desktop and mobile views. Tailwind CSS’s responsive utilities helped us quickly adjust layouts for different screen sizes.
- **User-Friendly Navigation**: We implemented a straightforward navigation flow with prominent buttons and clear sections, allowing users to easily switch between login, registration, lists, and maps.
- **Social Login Integration**: Social login buttons for Google and Facebook were added to streamline the login experience, positioned prominently to encourage quick access.

### Technical Choices

- **Tailwind CSS**: Tailwind CSS was selected for its utility-first approach, enabling us to rapidly style components without creating separate CSS files. This choice ensured design consistency and streamlined the layout process across the app.

- **Google Maps API**: We included @react-google-maps/api in preparation for map integration within the app. While not fully implemented yet, this setup provides a foundation for future development involving location-based restaurant data.

- **Icon Library**: We opted for lucide-react to provide a versatile and lightweight icon set, enhancing the app’s UI with minimal setup and ensuring our icons fit seamlessly within the design.

### AI Usage

AI was used to assist with the initial structuring and formatting of components, particularly in ensuring consistent styles and layout across files. It provided guidance on component organization, helped troubleshoot minor issues, and offered examples for setting up Tailwind CSS classes. With the help of the AI, our team handled the detailed component development, functionality, and UI logic to align with our specific requirements.
