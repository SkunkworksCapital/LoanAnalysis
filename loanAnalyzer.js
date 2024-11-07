// Function to fill the question input with a canned question
function fillQuestion(question) {
    document.getElementById('questionInput').value = question;
}

let data = []; // Store uploaded data globally for analysis

// Parse and preprocess data, then display a preview
async function processFile() {
    const fileInput = document.getElementById('dataFile').files[0];
    if (!fileInput) {
        document.getElementById('analysisResult').innerText = "Please upload a file.";
        return;
    }

    // Parse CSV using PapaParse
    Papa.parse(fileInput, {
        header: true,
        dynamicTyping: true,
        complete: async (result) => {
            data = result.data;
            displayDataPreview(data); // Show preview of first 5 rows
            document.getElementById('analysisResult').innerText += "\nData uploaded and ready for analysis.";
            await analyzeData(data);
        }
    });
}
// Function to show a temporary notification
function showTrainingNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('alert', 'alert-success', 'mt-3');
    notification.innerText = message;

    // Append notification to the body or a specific div
    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 8000);
}
// Display the first 5 rows of data as a preview
function displayDataPreview(data) {
    const previewData = data.slice(0, 5); // Get the first 5 rows
    const previewTable = document.createElement('table');
    previewTable.classList.add('table', 'table-bordered', 'mt-3');

    // Create table header
    const headerRow = document.createElement('tr');
    Object.keys(previewData[0]).forEach(key => {
        const th = document.createElement('th');
        th.innerText = key;
        headerRow.appendChild(th);
    });
    previewTable.appendChild(headerRow);

    // Create table rows for preview data
    previewData.forEach(row => {
        const dataRow = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.innerText = value;
            dataRow.appendChild(td);
        });
        previewTable.appendChild(dataRow);
    });

    // Display preview table in the analysisResult div
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.innerHTML = "<h5>Data Preview (First 5 Rows):</h5>";
    resultDiv.appendChild(previewTable);
}

// Analyze data with an enhanced TensorFlow.js model
async function analyzeData(data) {
    const features = data.map(item => [
        item.Loan_Amount,
        item.Interest_Rate,
        item.Income,
        item.Credit_Score
    ]);
    const labels = data.map(item => (item.Risk_Level === 'High' ? 1 : 0));

    const featureTensor = tf.tensor2d(features);
    const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

    // Define a deeper model with dropout layers for regularization
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dropout({ rate: 0.5 })); // Dropout to prevent overfitting
    model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.5 }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); // Sigmoid for binary classification

    // Compile the model with an adjusted learning rate
    model.compile({
        optimizer: tf.train.adam(0.001), // Lower learning rate for more stable training
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(featureTensor, labelTensor, { epochs: 50 });
    showTrainingNotification("Model trained. You can now ask questions about the data.");
}

// Function to show a temporary notification
function showTrainingNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('alert', 'alert-success', 'mt-3');
    notification.innerText = message;

    // Append notification to the body or a specific div
    document.body.appendChild(notification);

    // Remove notification after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Enhanced answer function with NLP-based question parsing
function parseQuestion(question) {
    question = question.toLowerCase();
    if (question.includes("average loan amount")) {
        return calculateAverageLoanAmount();
    } else if (question.includes("total loan amount")) {
        return calculateTotalLoanAmount();
    } else if (question.includes("highest loan amount")) {
        return calculateHighestLoanAmount();
    } else if (question.includes("lowest credit score")) {
        return calculateLowestCreditScore();
    } else if (question.includes("high-risk loans")) {
        return calculateHighRiskLoans();
    } else if (question.includes("low-risk loans")) {
        return calculateLowRiskLoans();
    } else if (question.includes("interest rate above")) {
        const rate = parseFloat(question.match(/(\d+(\.\d+)?)/)[0]);
        return calculateInterestRateAbove(rate);
    } else if (question.includes("how many loans") || question.includes("total number of loans")) {
        return calculateTotalNumberOfLoans();
    } else if (question.includes("portfolio value")) {
        return calculatePortfolioValue();
    }
    return "I'm sorry, I didn't understand the question. Try asking about 'average loan amount' or 'highest loan amount'.";
}

// Main function to answer user questions based on the data
function answerQuestion() {
    const question = document.getElementById('questionInput').value;
    const answer = parseQuestion(question);
    document.getElementById('questionResult').innerText = answer;
}

// Calculation functions
function calculateAverageLoanAmount() {
    const avgLoanAmount = data.reduce((sum, item) => sum + item.Loan_Amount, 0) / data.length;
    return `The average loan amount is $${avgLoanAmount.toFixed(2)}.`;
}

function calculateTotalLoanAmount() {
    const totalLoanAmount = data.reduce((sum, item) => sum + item.Loan_Amount, 0);
    return `The total loan amount is $${totalLoanAmount.toFixed(2)}.`;
}

function calculateHighestLoanAmount() {
    const highestLoanAmount = Math.max(...data.map(item => item.Loan_Amount));
    return `The highest loan amount is $${highestLoanAmount.toFixed(2)}.`;
}

function calculateLowestCreditScore() {
    const lowestCreditScore = Math.min(...data.map(item => item.Credit_Score));
    return `The lowest credit score is ${lowestCreditScore}.`;
}

function calculateHighRiskLoans() {
    const highRiskCount = data.filter(item => item.Risk_Level === 'High').length;
    return `There are ${highRiskCount} high-risk loans in the dataset.`;
}

function calculateLowRiskLoans() {
    const lowRiskCount = data.filter(item => item.Risk_Level === 'Low').length;
    return `There are ${lowRiskCount} low-risk loans in the dataset.`;
}

function calculateInterestRateAbove(threshold) {
    const count = data.filter(item => item.Interest_Rate > threshold).length;
    return `There are ${count} loans with an interest rate above ${threshold}%.`;
}

function calculateTotalNumberOfLoans() {
    return `There are ${data.length} loans in the portfolio.`;
}

function calculatePortfolioValue() {
    const portfolioValue = data.reduce((sum, item) => sum + item.Loan_Amount, 0);
    return `The total value of the portfolio is $${portfolioValue.toFixed(2)}.`;
}

// Function to show a temporary notification as a pop-out at the top of the page
function showTrainingNotification(message) {
    // Create a notification div
    const notification = document.createElement('div');
    notification.classList.add('alert', 'alert-success', 'popout-notification');
    notification.innerText = message;

    // Add styles to position the notification at the top as a pop-out
    notification.style.position = 'fixed';
    notification.style.top = '10px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '1000';
    notification.style.padding = '15px 30px';
    notification.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.borderRadius = '8px';
    notification.style.fontSize = '16px';

    // Append notification to the body
    document.body.appendChild(notification);

    // Remove notification after 8 seconds
    setTimeout(() => {
        notification.remove();
    }, 8000);
}
