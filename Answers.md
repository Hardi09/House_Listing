
**IMPORTANT NOTE:**  

Ensure all connections are whitelisted for your Mongo Database, meaning your database will accept any IP. If I cannot replicate the project or if I encounter an error, the grade will be significantly impacted.

**PLEASE READ THE FOLLOWING CAREFULLY:**  

When submitting your project, please address the following questions:

1. How would you say your project exceeds expectations?

    My project is a house listing website that incorporates CRUD (Create, Read, Update, Delete) operations for managing property listings. It features a user-friendly interface for adding, updating, and deleting property details. The website also allows users to search for houses based on their names and locations. To enhance security and user experience, I've implemented session management for user authentication, enabling login and logout functionality. All data is stored using MongoDB, ensuring efficient and organized data management.

2. What is the structure of your project?  

    My project follows a well-organized structure, utilizing the nodejs framework to manage routing and handle different endpoints. The application effectively utilizes the Model-View-Controller (MVC) architecture to ensure separation of concerns and maintainable code.

    Here's an overview of the project's structure:

    a. Routing and Controllers (C): Express.js is employed to define and manage various routes, such as sign-up, sign-in, dashboard, adding and updating houses, searching, and more. Each route is associated with a specific controller function, which handles the logic and interacts with the data models.

    b. Data Models (M): MongoDB is utilized to create and manage data models. These models define the structure of the stored data, including information about houses, users, and sessions. The Mongoose library facilitates the interaction between the application and the MongoDB database.

    c. Views (V) - EJS Templates: The front-end views are rendered using Embedded JavaScript (EJS) templates. These templates dynamically generate HTML content and are populated with data from the controllers. EJS templates ensure a consistent and dynamic user interface.

    d. Static Files: Static assets such as CSS stylesheets, images, and client-side JavaScript files are stored in designated folders and served to the client using Express middleware. This ensures a visually appealing and interactive user experience.

    e. Session Management: The project incorporates session management using the `express-session` middleware. This allows users to securely log in and out, and their session data is stored in the MongoDB database, ensuring persistence across requests.

    f. Error Handling: Custom error handling is implemented to handle scenarios such as invalid URLs, server errors, and user-specific errors. This enhances user experience by providing appropriate error messages and status codes.

    g. Middleware: Middleware functions are used to perform tasks such as parsing incoming requests, handling file uploads, and authenticating users. These functions enhance the functionality and security of the application.

    h. API Endpoints: The project includes API endpoints that provide JSON responses for specific functionalities, such as retrieving house data and owner details. These endpoints enable external applications to interact with the project's data.

    By following this structured approach, the project ensures scalability, maintainability, and a seamless user experience. The use of Express.js, EJS templates, MongoDB, and effective separation of concerns contributes to a well-organized and feature-rich house listing website.

3. How are you implementing CRUD operations in your app?  
  In my house listing website, I have implemented CRUD (Create, Read, Update, Delete) operations to allow users to effectively manage house listings. These operations are accessible only to signed-in users, and users can only edit the houses they have added. Here's how each CRUD operation is implemented:

    a. **Create (Add) Operation:**
    After a user signs in, they can access the "Add House" functionality. When a user submits the house details through a form, the application processes the data and creates a new house listing. The new house is then saved to the MongoDB database, associated with the user who added it. This ensures that users can contribute new house listings to the platform.

    b. **Read Operation:**
    Users can view a list of all available houses on the platform. The "Houses" page displays the house listings, including details such as title, description, price, and location. Users can navigate through the house listings and explore the houses added by various users.

    c. **Update Operation:**
    Users are allowed to update the details of houses they have added. When a user accesses the "Update House" functionality and selects a house they own, they can modify the title, description, price, and location. The updated information is then processed and stored in the database, ensuring that users can make changes to their own listings.

    d. **Delete Operation:**
    Users have the ability to delete houses that they have added. By accessing the "Delete House" functionality and selecting a house they own, users can initiate the deletion process. The selected house is removed from the database, ensuring that users can manage and remove their own listings.

    These CRUD operations are implemented with proper validation and authentication checks. Only signed-in users can perform these operations, and they are limited to houses they have added. The use of user-specific sessions and database associations ensures that each user can only interact with and modify their own data, enhancing data security and user experience.


4. How are you managing user logins, and how does your application determine if a user is logged in? (For instance, are you using cookies, sessions, state management, etc.?)

    By using sessions, the application maintains user authentication throughout their interaction with the website. The use of sessions ensures that users can access their own data, perform CRUD operations, and enjoy a personalized experience while adhering to security and privacy standards.

5. How are you utilizing the API? (Remember, the API counts for 20% and should be testable by any REST client like Insomnia or Postman.)  

    In my house listing website, I have implemented a RESTful API with three endpoints, allowing users to interact with the data in the system.
     Here's how I'm utilizing the API:
    a. **Retrieve All Houses:**
    Endpoint: `GET /api/houses`
    This endpoint allows users to retrieve a list of all houses available in the system. It returns a JSON response containing details about each house, including its title, description, price, location, and owner information.
    b. **Search Houses:**
    Endpoint: `GET /api/search`
    Users can search for houses based on specific criteria, such as the house title or location. This endpoint takes query parameters (`title` and `location`) and returns a JSON response containing houses that match the search criteria.
    c. **Retrieve House Owner Details:**
    Endpoint: `GET /api/owner-details/:houseTitle`
    Users can retrieve the owner details of a specific house by providing its title as a URL parameter. The endpoint returns a JSON response containing the owner's information and additional details about the house.
    I have thoroughly tested these API endpoints using REST clients like Insomnia. This allows me to ensure that the endpoints are functioning as expected, returning the correct data, and handling different scenarios gracefully. Users can interact with the API to retrieve house information, search for specific houses, and access owner details, enhancing the usability and functionality of the application.

6. How do you handle non-existent routes, like when a route `/displayData` isn't registered in your `server.js`?  

    I have a 404 page that handles any unregistered routes.

7. In what ways do you believe your code is clean, easy to read, and maintainable?  

    Your code demonstrates several practices that contribute to its cleanliness, readability, and maintainability:

    a. **Modularization**: You've divided your code into logical sections and separate files for different functionalities. For instance, you have separate files for models (e.g., `SignUpInModel`, `House`), routes, and utility functions.

    b. **Descriptive Variable Names**: You use meaningful variable names that help readers understand the purpose and content of the variables.

    c. **Structured Routing**: Your routes are organized with clear endpoint names and HTTP methods. This makes it easy to understand the different functionalities your application provides.

    d. **Consistent Formatting**: Your code follows consistent formatting and indentation throughout, which enhances readability.

    e. **Comments**: You've added comments at key sections of your code, explaining what different parts of the code do. This makes it easier for other developers (and your future self) to understand your codebase.

    f. **Error Handling**: You have implemented error handling at various stages of your application, providing helpful error messages and statuses in case of failures.

    g. **Middleware**: The use of middleware, such as `authenticateUser`, helps keep your route handlers focused on their primary tasks and separates concerns.

    h. **Reusability**: You use reusable code patterns, like the logic to retrieve houses with owners, which is used in multiple endpoints.

    i. **Expressive Routes**: Your route names, such as `/api/houses` and `/api/search`, clearly indicate their purpose.

    j. **Structured Directory Layout**: You've organized your project files in a structured manner, which makes it easier to locate specific files and modules.

    By following these practices, your codebase is well-organized, easy to understand, and maintainable. It sets a strong foundation for future enhancements, bug fixes, and collaboration with other developers.

8. What considerations should the professor keep in mind when grading your project? Please outline any assumptions or specific details that are important for understanding your work.  

    When grading my project, here are some considerations, assumptions, and specific details that are important for understanding my work:

    a. **Session-based Authentication**: I've implemented session-based authentication for user logins. Users are required to sign up and log in before accessing certain functionalities. User sessions are managed using the `express-session` middleware.

    b. **User Password Security**: For the sake of this project, I've stored user passwords in plain text in the database. In a real-world scenario, password hashing and salting would be implemented for enhanced security.

    c. **Database Initialization**: The application loads sample house data from a JSON file on startup if the database is empty. This simplifies the grading process and demonstrates the application's functionality.

    d. **File Uploads**: Users can upload house images using the `multer` middleware. The images are stored in the `HouseImages` directory, and the file paths are saved in the database.

    e. **Search Functionality**: The application provides a search feature to find houses based on their title or location. The search queries are case-insensitive and use regular expressions.

    f. **Middleware Usage**: Middleware functions are used for authentication (`authenticateUser`) and handling static files. Middleware chaining is used to ensure proper authentication before accessing certain routes.

    g. **Assumed Dependencies**: It's assumed that the necessary dependencies are installed using npm and are accessible in the project directory. These dependencies include `express`, `body-parser`, `express-session`, `ejs`, `path`, `multer`, and `mongoose`.

    h. **Assumed Environment**: The project is designed to run in a local development environment. It uses a hardcoded port (`3000`) for the server to listen on.

    i. **Error Pages**: I've implemented custom error pages (e.g., `404.ejs`) to handle situations where users access non-existent routes or encounter errors.

    j. **Testing API Endpoints**: The provided API endpoints can be tested using tools like Insomnia or Postman, making it easy to verify the functionality and data retrieval of the routes.

    k. **Database Connection**: The application connects to a MongoDB database using Mongoose. The database connection URL and credentials are assumed to be provided in the `util/config.js` file.

These considerations and details provide insights into how the application is structured, its limitations, and its intended functionality.



**Screenshots Needed:**  

- Screenshot of `server.js`.

- Screenshot of the left side panel showing all your project directories.

- Screenshots of the frontend of at least two app screens.

- Mongo Atlas displaying the data used.



Happy Coding!