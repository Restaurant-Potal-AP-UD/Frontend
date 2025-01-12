# Frontend Project

## Table of Contents
1. [File Structure](#file-structure)
2. [Backend Connections](#backend-connections)
   - [Python Backend](#1-python-backend)
   - [Java Backend](#2-java-backend)
3. [Purpose](#purpose)
4. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
5. [Usage](#usage)
6. [Future Enhancements](#future-enhancements)
7. [Contributing](#contributing)

---

This project serves as the frontend for a web application designed to manage restaurant-related operations. It is built using JavaScript and HTML, offering a structured approach to handling user interactions and API requests. Below are the key details of the project:

## File Structure

```
src/
    pages/
         templates/
                HTML classes
         JavaScript classes/
    utils/
```

### File Descriptions

- **`src/pages/templates/`**: Contains HTML class templates used to render the UI components of the application.
- **`src/pages/JavaScript classes/`**: Includes JavaScript files responsible for dynamic functionalities and page behaviors.
- **`src/utils/`**: Houses utility functions and shared logic used throughout the project.

## Backend Connections

This frontend connects to two separate backends to perform its operations:

### 1. **Python Backend**

- Handles CRUD operations for restaurants, reservations, and addresses.
- Manages the creation of new restaurants.
- Key Endpoints:
  - CRUD options for restaurants.
  - Reservation management.
  - Address management.

### 2. **Java Backend**

- Manages user authentication, including login and registration.
- Handles JWT (JSON Web Token) validations for secure user sessions.
- Key Endpoints:
  - User login.
  - User registration.
  - JWT validation.

## Purpose

The frontend facilitates user interactions with an API that supports creating and managing restaurant profiles within a community-based web portal. Users can:

- Create profiles for restaurants.
- Manage reservations and addresses.
- View and explore a larger network of restaurants.

### Key Features

- The platform allows users to establish restaurant profiles on a community-oriented website.
- It enables an expanded visualization of restaurants, similar to platforms like Rappi, Didi, or Uber Eats, but **without the options for food ordering or payment processing**.

## Getting Started

### Prerequisites

- A modern web browser.
- Docker installed on your system to pull backend images.

### Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```
3. Pull the Docker images for the backends:
   - Python backend:
     ```bash
     docker pull <python-backend-image>
     ```
   - Java backend:
     ```bash
     docker pull <java-backend-image>
     ```
4. Run the Docker containers for both backends.

## Usage

1. Start the Docker containers for the Python and Java backend servers.
2. Open the frontend in a web browser.
3. Interact with the user interface to:
   - Create and manage restaurant profiles.
   - Handle reservations and addresses.
   - Log in or register with user credentials.

## Future Enhancements

- Add a personal server functionality to allow testing in a closed environment. 
- Note: This project is intended for development purposes only and will not be deployed to production.

## Contributing

We welcome contributions from developers! If you'd like to contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit them:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push your branch to your fork:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request with a detailed description of your changes.


