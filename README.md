# o_f_Front

o_f_Front is a front-end application built with Angular, designed to provide a scalable and modular structure for developing web applications with a focus on maintainability and reusability. It is the front-end counterpart of the OpenFabricAPI.

## Features

- Angular for developing the web application
- TypeScript for static typing and better development experience
- Modular architecture with lazy-loaded feature modules
- Route guards for securing routes
- Interceptors for handling HTTP requests and responses
- Services for encapsulating business logic
- Components for UI representation
- Reactive forms for handling user input
- Angular Material and Bootstrap for UI design
- Environment-based configuration

## Libraries Used

- @angular/core
- @angular/common
- @angular/forms
- @angular/router
- @angular/material
- bootstrap

## Project Structure

- `src` - Contains the main source code for the application
  - `app` - Contains the main application module and related files
    - `core` - Contains core features and services of the application
    - `shared` - Contains components, directives, and pipes that are shared across the application
    - `layouts` - Contains the main layout for the application
    - `modules` - Contains the feature modules of the application
      - `auth` - Contains components related to authentication
      - `products` - Contains components related to products
      - `profile` - Contains components related to user profile
  - `assets` - Contains static assets like images, icons, etc.
  - `environments` - Contains environment variables
  - `styles.scss` - Contains global styles for the application
  - `index.html` - The main HTML page that is served when someone visits your site

## Getting Started

1. Clone the repository and navigate to the project root directory.
2. Run `npm install` to install the dependencies.
3. Run `ng serve` to start the development server.
4. Navigate to `http://localhost:4200/` in your browser to view the application.

## Contributing

Please read the contributing guidelines for the project before making any changes or submitting pull requests.

## Author

- Ephrem Bayru
  - Email: ephybayru@gmail.com
