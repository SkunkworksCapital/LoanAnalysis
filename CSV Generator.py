import pandas as pd
import random
from faker import Faker

# Initialize Faker and define sample data parameters
fake = Faker()
num_samples = 200

# Generate sample data
data = {
    "ID": [i+1 for i in range(num_samples)],
    "Borrower_Name": [fake.name() for _ in range(num_samples)],
    "Loan_Amount": [round(random.uniform(5000, 500000), 2) for _ in range(num_samples)],
    "Interest_Rate": [round(random.uniform(1.5, 10.0), 2) for _ in range(num_samples)],
    "Income": [round(random.uniform(20000, 200000), 2) for _ in range(num_samples)],
    "Credit_Score": [random.randint(300, 850) for _ in range(num_samples)],
    "Risk_Level": [random.choice(["High", "Low"]) for _ in range(num_samples)]
}

# Create DataFrame and save to CSV
sample_df = pd.DataFrame(data)
sample_df.to_csv("sample_loan_data.csv", index=False)
