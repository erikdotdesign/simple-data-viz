import random
import pandas as pd
import numpy as np
import os

# Output directory
output_dir = "sample_data"
os.makedirs(output_dir, exist_ok=True)

# 1. Bar/Column Chart Data
def generate_bar_data(categories=5):
    df = pd.DataFrame({
        'Category': [f'Category {i+1}' for i in range(categories)],
        'Value': [random.randint(10, 100) for _ in range(categories)]
    })
    df.to_csv(os.path.join(output_dir, "bar_chart_data.csv"), index=False)
    return df

# 2. Line Chart Data (e.g., time series)
def generate_line_data(points=12):
    df = pd.DataFrame({
        'Month': [f'Month {i+1}' for i in range(points)],
        'Sales': np.cumsum(np.random.randint(5, 20, size=points))
    })
    df.to_csv(os.path.join(output_dir, "line_chart_data.csv"), index=False)
    return df

# 3. Pie Chart Data
def generate_pie_data(parts=4):
    labels = [f'Segment {i+1}' for i in range(parts)]
    sizes = np.random.dirichlet(np.ones(parts), size=1)[0] * 100
    df = pd.DataFrame({
        'Segment': labels,
        'Percentage': sizes.round(2)
    })
    df.to_csv(os.path.join(output_dir, "pie_chart_data.csv"), index=False)
    return df

# 4. Scatter Plot Data
def generate_scatter_data(points=50):
    df = pd.DataFrame({
        'X': np.random.uniform(0, 100, size=points),
        'Y': np.random.uniform(0, 100, size=points),
        'Size': np.random.uniform(5, 20, size=points)
    })
    df.to_csv(os.path.join(output_dir, "scatter_chart_data.csv"), index=False)
    return df

# 5. Grouped Column Chart Data (e.g., multiple series per category)
def generate_grouped_bar_data(categories=5, groups=2):
    data = {
        'Category': [f'Category {i+1}' for i in range(categories)]
    }
    for g in range(groups):
        data[f'Group {g+1}'] = [random.randint(10, 100) for _ in range(categories)]
    
    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, "grouped_bar_chart_data.csv"), index=False)
    return df

# Generate all datasets and save to CSV
if __name__ == "__main__":
    print("Generating sample data and writing CSVs to 'sample_data' folder...\n")
    print("Bar Chart:\n", generate_bar_data(), "\n")
    print("Line Chart:\n", generate_line_data(), "\n")
    print("Pie Chart:\n", generate_pie_data(), "\n")
    print("Scatter Chart:\n", generate_scatter_data().head(), "\n")
    print("Grouped Bar Chart:\n", generate_grouped_bar_data(), "\n")