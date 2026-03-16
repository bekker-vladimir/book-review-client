# Book Review Client

> 🔗 **Looking for the API?** This is the frontend application. For backend server setup and database instructions, please refer to the [Main Backend Repository]([../](https://github.com/bekker-vladimir/book-review-api)).

This directory contains the frontend client application for the Book Review project. It provides a user interface for users to browse books, submit reviews, and manage their authentication profiles. The application is built as a Single Page Application (SPA).

## Project Overview

The client connects seamlessly to the main backend API running on `localhost:8080`. It manages user authentication via JSON Web Tokens (JWT) stored in `localStorage` and handles routing securely, granting different access privileges (e.g., viewing, adding books, or moderation dashboard) depending on the authenticated user's roles.

## Tech Stack

The client application leverages modern web technologies for a responsive and performant user experience:

* **React 19**: A JavaScript library for building user interfaces.
* **React Router DOM**: Declarative routing for React, enabling seamless navigation between views.
* **Tailwind CSS**: A utility-first CSS framework for rapid and customized UI development.
* **Axios**: A promise-based HTTP client for the browser to communicate with the backend API.
* **jwt-decode**: Used to decode access tokens on the client-side for role and username extraction.

## Prerequisites

To run the client application locally, ensure you have the following installed on your system:

* **Node.js**: Environment to run JavaScript code outside of a web browser.
* **npm**: Node package manager (comes bundled with Node.js).

## Instructions

To get the frontend client up and running locally, follow these steps:

1.  **Navigate to the Client Directory:**
    Ensure you are currently inside the `testclient` directory.
    ```bash
    cd testclient
    ```

2.  **Install Dependencies:**
    Download and install all necessary node modules required by the project.
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    Run the application in development mode.
    ```bash
    npm start
    ```
    * This will typically start the application on `http://localhost:3000`.
    * The browser will automatically open, or you can manually navigate to the URL.
    * The page will reload when you make edits, and any lint errors will appear in the console.

## API Connection

The client application is configured to automatically communicate with the main backend API.

* **Base URL:** By default, Axios is configured (`src/services/axiosClient.js`) to point its base URL to `http://localhost:8080`.
* **Authentication Interceptors:** The HTTP client is set up with interceptors. If a user is logged in (i.e., a token exists in `localStorage`), the token is automatically appended as a Bearer token to the `Authorization` header of all outgoing requests. It also handles automatic redirection to the login page upon encountering 401/403 errors (excluding auth pages).
