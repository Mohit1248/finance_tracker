Working Demo:

Explore the application in action:

[Watch the Demo](https://youtu.be/3cDBH7sieYA)


This video demonstrates login, transaction management, charting, and filtering features.




Welcome to the Financial Dashboard, a web application designed to help you manage and visualize your financial transactions. This tool allows you to track expenses by category and date, with features like adding transactions, pagination, and date-based filtering. The backend is deployed on Render, and detailed instructions are provided below to help you run the project locally or use the deployed version.

Getting Started

1)Installation
Clone the Repository
Clone the repo to your local machine:
[git clone https://github.com/<your-username>/financial-dashboard.git](https://github.com/Mohit1248/finance_tracker.git)


2)Backend Setup
Navigate to the backend directory:
cd backend

Install the required dependencies:
npm install

3)Set up environment variables:
Copy
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>

4)Start the local backend server:
npm start
Alternatively, the backend is deployed at https://financetracker-backend-bj92.onrender.com, so you can use this for the frontend without running a local backend.


5)Frontend Setup
Navigate to the frontend directory:
cd frontend


6)Install the required dependencies:
npm install


7)Start the frontend development server:
npm start


Open your browser and go to http://localhost:3000. 
Usage

8)Login: Use the default credentials {email: "user1@gmail.com", password: "user12"} to log in.



Dashboard: View a list of transactions, charts showing expenses by category and date, and apply date range filters.
Add Transactions: Enter new transactions using the form to update the data live.
Pagination: Navigate through transaction pages with "Previous" and "Next" buttons.
Filtering: Adjust the date range and click "Apply Filter" to see transactions within that period.
Additional Information
Transaction Limits: Expense amounts are capped at 10,000 in charts for better readability.
Technologies Used: The project uses React for the frontend, Express and Mongoose for the backend, and Chart.js for visualizations, with MongoDB as the database.
Deployment: The backend is hosted on Render at https://financetracker-backend-bj92.onrender.com.
Code Structure: The application is built with modular components (e.g., forms, lists, charts) to ensure maintainability and reusability.
