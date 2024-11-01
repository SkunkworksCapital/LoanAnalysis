In-Browser Loan Data Analyzer

Interactive Loan Data Analysis in the Browser with TensorFlow.js
Welcome to the In-Browser Loan Data Analyzer! This project allows users to upload a CSV file of loan data and receive instant analysis directly within their browser. The tool uses TensorFlow.js to analyze loan-related metrics, train a simple neural network, and answer user questions about their loan data—all without requiring a backend server.

Features
CSV Upload & Analysis: Users can upload a CSV file of loan data, which is parsed and analyzed instantly.
Canned Questions: Predefined questions, like "What is the average loan amount?" provide users with quick insights.
Custom Question Input: Users can type their own questions and receive answers based on keyword matching.
Risk Prediction Model: The tool trains a neural network model in-browser to predict loan risk levels (high or low).
Real-Time Results: The model's results and insights are displayed instantly within the browser.
Technologies Used
TensorFlow.js: For building and training the in-browser machine learning model.
PapaParse: To parse CSV files for quick data processing in the browser.
Chart.js: For visualizing data insights.
Bootstrap: For a responsive and clean UI.
Getting Started
Prerequisites
To run this project, you need:

A modern web browser (Chrome, Firefox, Safari, or Edge).
A CSV file with loan data (see “CSV Format” section below).
CSV Format
The loan data CSV file should include the following columns (headers are case-sensitive):

Loan_Amount: Amount of the loan
Interest_Rate: Interest rate on the loan
Income: Income of the borrower
Credit_Score: Credit score of the borrower
Risk_Level: A label indicating risk level (e.g., High or Low)
Sample data:

Loan_Amount	Interest_Rate	Income	Credit_Score	Risk_Level
5000	3.5	45000	680	Low
10000	5.2	55000	720	High
Installation
Clone this repository:

bash
Copy code
git clone https://github.com/yourusername/in-browser-loan-analyzer.git
Navigate to the project directory:

bash
Copy code
cd in-browser-loan-analyzer
Open index.html in your browser to start the app.

Usage
Upload a CSV File: Click "Upload Loan Data CSV" and select your CSV file.
Analyze Data: Click the "Upload and Analyze" button to parse and analyze the data.
Ask Questions:
Use the canned questions for quick insights.
Type your own questions in the input box to get specific answers based on keywords.
View Analysis Results: After training the model, results will be displayed under "Loan Analysis Results."
Code Structure
index.html: Contains the HTML layout and loads required libraries (TensorFlow.js, PapaParse, Chart.js).
loanAnalyzer.js: Handles CSV parsing, data processing, and in-browser machine learning analysis.
CSV Generator.py: (Optional) Python script for generating sample loan data for testing.
Key Functions
processFile(): Parses CSV data and initiates analysis.
analyzeData(): Preprocesses data and trains a TensorFlow.js model to classify loans as high- or low-risk.
answerQuestion(): Maps user questions to corresponding analysis functions based on keywords.
Example Questions
Here are some example questions the tool can answer:

"What is the average loan amount?"
"How many high-risk loans are there?"
"What is the average credit score?"
"What is the total income of all borrowers?"
Challenges
This project comes with a few challenges, like handling large CSV files in the browser and efficiently training models with TensorFlow.js. However, using WebGL acceleration in TensorFlow.js helps streamline the model training process, making it feasible for small datasets.

Future Enhancements
Data Visualization: Expand visualizations with Chart.js for deeper insights.
Additional ML Models: Introduce more complex models for advanced predictions.
Question Parsing Improvements: Add natural language processing (NLP) capabilities to better understand user questions.
Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your improvements.

License
This project is licensed under the MIT License.
