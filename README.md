# +15 Skywalk - Frontend

## Overview

This repository contains the frontend application for the +15 Skywalk website, a digital platform for Calgary's extensive elevated pedestrian walkway system. The +15 Skywalk connects over 100 buildings through 18 kilometers of climate-controlled pathways, making it the world's largest indoor pedestrian network.

## Project Purpose

The +15 Skywalk platform aims to solve navigation and discovery challenges by providing:

- A digital hub with real-time information about the walkway system
- Easy access to news and events happening in downtown Calgary
- A comprehensive directory of hospitality services (restaurants, cafes, shops) accessible via the +15
- User accounts with personalized favorites for frequent visitors

## Features

### Hospitality Directory

- Categorized listings of restaurants and services
- Detailed information including hours, location, and descriptions
- User favoriting functionality

### Event & News Management

- Downtown events listing
- News updates about the +15 system
- Categorized content organization

### User Interface

- Interactive map for navigating the +15 Skywalk (Future Enhancement)
- Responsive design for various screen sizes
- User-friendly interface for accessing information

### Authentication System

- User registration and login
- Profile management
- Favorites feature

## Tech Stack

- **Framework**: React
- **Build Tool**: Vite
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Yup for validation
- **Rich Text Editor**: TinyMCE (if used for content creation)
- **Linting**: ESLint

## Getting Started

### Prerequisites

- Node.js (v14+ or as specified in your project)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url] # Replace with your frontend repository URL

# Navigate to the project directory
cd plus15skywalk-fe

# Install dependencies
npm install
# or
# yarn install

# Create .env file with the following variables if needed
# Example:
# VITE_API_BASE_URL=your_backend_api_url

# Start development server
npm run dev
# or
# yarn dev
```

### Building for Production

```bash
npm run build
# or
# yarn build
```

### Linting

```bash
npm run lint
# or
# yarn lint
```

## User Stories

- **As a user,** I want to browse a categorized directory of restaurants and services accessible via the +15 Skywalk, view their details (hours, location), and save my favorites.
- **As a user,** I want to find listings for downtown events and read news updates related to the +15 system, all organized by category.
- **As a user,** I want to easily register for an account, log in, and manage my profile.
- **As a user,** I want to be able to mark restaurants, events, or news articles as favorites and access them easily.
- **As a user,** I want to access and use the application effectively on different devices (desktop, mobile) due to a responsive design.
- **As a user,** I want a clear and intuitive interface to find information quickly.

## Development Challenges

- **Data Limitations**: As a student project, access to real-time or official +15 data was limited. (Consider if this is still relevant for the frontend or if there are new frontend-specific challenges)
- **Scope Management**: Balancing feature development with timeline constraints.

## Future Enhancements

- Real-time walkway access and closure updates (requires backend integration)
- Traffic level indicators (requires backend integration)
- Enhanced user profiles with saved routes
- Interactive map implementation
- CMS interface for content management (if applicable to frontend administration)
- Mobile application version (or progressive web app enhancements)
