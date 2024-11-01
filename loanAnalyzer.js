// Function to fill the question input with a canned question
function fillQuestion(question) {
    document.getElementById('questionInput').value = question;
}

let data = []; // Store uploaded data globally for analysis

// Parse and preprocess data
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
            document.getElementById('analysisResult').innerText = "Data uploaded. Starting analysis...";
            await analyzeData(data);
        }
    });
}

// Analyze data with TensorFlow.js
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

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
    model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
    });

    await model.fit(featureTensor, labelTensor, { epochs: 50 });
    document.getElementById('analysisResult').innerText = "Model trained. You can now ask questions about the data.";

    const predictions = model.predict(featureTensor);
    predictions.array().then(array => {
        displayResults(array, data);
    });
}

// Display results
function displayResults(predictions, data) {
    const resultDiv = document.getElementById('analysisResult');
    resultDiv.innerHTML = "<h5>Loan Analysis Results:</h5>";
    
    data.forEach((item, index) => {
        const risk = predictions[index][0] > 0.5 ? "High Risk" : "Low Risk";
        resultDiv.innerHTML += `Loan ID: ${item.ID} - ${risk}<br>`;
    });
}

// Helper functions for each type of question
function calculateAverageLoanAmount() {
    const avgLoanAmount = data.reduce((sum, item) => sum + item.Loan_Amount, 0) / data.length;
    return `The average loan amount is $${avgLoanAmount.toFixed(2)}.`;
}

function calculateHighRiskLoans() {
    const highRiskCount = data.filter(item => item.Risk_Level === 'High').length;
    return `There are ${highRiskCount} high-risk loans in the dataset.`;
}

function calculateLowRiskLoans() {
    const lowRiskCount = data.filter(item => item.Risk_Level === 'Low').length;
    return `There are ${lowRiskCount} low-risk loans in the dataset.`;
}

function calculateAverageCreditScore() {
    const avgCreditScore = data.reduce((sum, item) => sum + item.Credit_Score, 0) / data.length;
    return `The average credit score is ${avgCreditScore.toFixed(0)}.`;
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

function calculateTotalIncome() {
    const totalIncome = data.reduce((sum, item) => sum + item.Income, 0);
    return `The total income of all borrowers is $${totalIncome.toFixed(2)}.`;
}

function calculateInterestRateAbove5Percent() {
    const highInterestCount = data.filter(item => item.Interest_Rate > 5).length;
    return `There are ${highInterestCount} loans with an interest rate above 5%.`;
}

// Main function to answer user questions based on the data
function answerQuestion() {
    const question = document.getElementById('questionInput').value.toLowerCase();
    let answer = '';

    // Mapping keywords to functions
    const questionMap = {
        "average loan amount": calculateAverageLoanAmount,
        "high-risk loans": calculateHighRiskLoans,
        "low-risk loans": calculateLowRiskLoans,
        "average credit score": calculateAverageCreditScore,
        "total loan amount": calculateTotalLoanAmount,
        "highest loan amount": calculateHighestLoanAmount,
        "lowest credit score": calculateLowestCreditScore,
        "total income": calculateTotalIncome,
        "interest rate above 5%": calculateInterestRateAbove5Percent
    };

    // Find the right function to call based on keywords in the question
    for (const [key, func] of Object.entries(questionMap)) {
        if (question.includes(key)) {
            answer = func();
            break;
        }
    }

    // Default message if no question matches
    if (!answer) {
        answer = "I'm sorry, I didn't understand the question. Try asking about 'average loan amount' or 'highest loan amount'.";
    }

    document.getElementById('questionResult').innerText = answer;
}

