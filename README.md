# ESS Assessment

**Project Description:** This assessment serves the exclusive purpose of a technical mock-up project for Expert System Solutions.

**Author:** Ali Jawad

---

## Setup Guide

Before you begin, make sure the following prerequisites are installed on your machine:

- Node.js
- Git
- PostgreSQL
- Prisma

Follow these steps to set up the project:

1. **Clone the Git Repository:**
   - Run: `git clone https://github.com/AliJawadSheikh/ess-assessment.git`

2. **Install Project Dependencies:**
   - Run: `npm install`

3. **Database Setup:**
   - Create a PostgreSQL database, preferably named "ESS" (or choose a name you prefer).
   - Update the database connection settings in the `.env` file.

4. **Run Database Migrations:**
   - Execute: `npx prisma migrate dev`

5. **Running the Project:**
   - Start the project with: `npm run start`

6. **Documentation and API Calls:**
   - For detailed documentation and API calls, refer to the "Postman APIs Collection" folder.
   - Import the Postman collection to easily make API requests.
   - Create an environment (env) file with the following variables:
     - `baseURL`: The base URL for your API endpoints.
     - `authToken`: Your authentication token.
     - `userId`: Your user ID.
     - `boardId`: Your board ID.

Explore, test, and contribute to the ESS Assessment project. Enjoy your development journey!

---