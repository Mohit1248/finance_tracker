Welcome to the Financial Dashboard project! This application allows users to manage and visualize financial transactions, including tracking expenses by category and date. This README provides detailed instructions to set up and run the project locally, along with information about its features and a working demo. The current date and time is 12:49 AM IST on Monday, July 07, 2025.

Getting Started
Prerequisites
Before proceeding, make sure you have the following installed:

Node.js: Version 14.x or higher is recommended (download from nodejs.org).
npm: Included with Node.js, used for managing dependencies.
MongoDB: A local or remote MongoDB instance is required (install via mongodb.com or use MongoDB Atlas).
Installation
Clone the Repository
Clone this repository to your local machine:
text

Collapse

Wrap

Copy
git clone <repository-url>
Replace <repository-url> with the URL of your Git repository.
Backend Setup
Navigate to the backend directory:
text

Collapse

Wrap

Copy
cd backend
Install the required dependencies:
text

Collapse

Wrap

Copy
npm install
Configure environment variables:
The project requires a .env file for configuration. Use the provided .env.example as a template:
Copy .env.example to create a .env file:
text

Collapse

Wrap

Copy
cp .env.example .env
Open .env and fill in the following values:
text

Collapse

Wrap

Copy
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
Replace <your-mongodb-connection-string> with your MongoDB connection string (e.g., mongodb://localhost:27017/financialdb for a local instance or a URI from MongoDB Atlas).
Replace <your-jwt-secret> with a secure, random string (e.g., a long passphrase or a generated key like mysecretkey123!).
Important: Never commit the .env file to Git. Ensure it’s listed in .gitignore (add it with echo ".env" >> .gitignore if missing).
Start the backend server:
text

Collapse

Wrap

Copy
npm start
The server should run on http://localhost:5000 (or the port you set in .env). Note: The backend is also deployed at https://financetracker-backend-bj92.onrender.com for remote access.
Frontend Setup
Navigate to the frontend directory:
text

Collapse

Wrap

Copy
cd frontend
Install the required dependencies:
text

Collapse

Wrap

Copy
npm install
Start the frontend development server:
text

Collapse

Wrap

Copy
npm start
Open your browser and visit http://localhost:3000 to access the application. The frontend is configured to connect to the deployed backend at https://financetracker-backend-bj92.onrender.com.
Usage
Login: Use the default credentials {email: "user1@gmail.com", password: "user12"} to log in initially.
Dashboard: After logging in, you’ll see a dashboard with a transaction list, charts for expenses by category and date, and date range filters.
Add Transactions: Use the form to input new transactions (e.g., amount, category, date), which will update the list and charts.
Pagination: Navigate through transaction pages using the "Previous" and "Next" buttons.
Filtering: Adjust the date range and click "Apply Filter" to view transactions within that period.
Working Demo
Check out a live demonstration of the Financial Dashboard in action:

Watch the Demo
This video showcases the key features, including login, transaction management, charting, and filtering.
