import random
import pandas as pd
import numpy as np
import os

# Output directory
output_dir = "sample_data"
os.makedirs(output_dir, exist_ok=True)

# 1. Bar/Column Chart Data
def generate_bar_data(categories=5, preset="random"):
    labels = [f'Category {i+1}' for i in range(categories)]

    if preset == "uptrend":
        values = np.linspace(10, 100, categories) + np.random.normal(0, 5, categories)
    elif preset == "downtrend":
        values = np.linspace(100, 10, categories) + np.random.normal(0, 5, categories)
    elif preset == "flat":
        values = np.full(categories, 50) + np.random.normal(0, 3, categories)
    else:  # random
        values = [random.randint(10, 100) for _ in range(categories)]

    df = pd.DataFrame({
        'Category': labels,
        'Value': np.round(values, 2)
    })
    df.to_csv(os.path.join(output_dir, f"{preset}_bar_chart_data.csv"), index=False)
    return df

# 2. Line Chart Data (e.g., time series)
def generate_line_data(points=12, preset="random"):
    if preset == "uptrend":
        y = np.linspace(10, 100, points) + np.random.normal(0, 5, points)
    elif preset == "downtrend":
        y = np.linspace(100, 10, points) + np.random.normal(0, 5, points)
    elif preset == "flat":
        y = np.full(points, 50) + np.random.normal(0, 3, points)
    else:
        y = np.cumsum(np.random.randint(5, 20, size=points))

    df = pd.DataFrame({
        'Month': [f'Month {i+1}' for i in range(points)],
        'Sales': y.round(2)
    })
    df.to_csv(os.path.join(output_dir, f"{preset}_line_chart_data.csv"), index=False)
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
def generate_scatter_data(points=50, preset="random"):
    if preset == "uptrend":
        x = np.linspace(0, 100, points)
        y = x + np.random.normal(0, 10, points)
    elif preset == "downtrend":
        x = np.linspace(0, 100, points)
        y = 100 - x + np.random.normal(0, 10, points)
    elif preset == "flat":
        x = np.linspace(0, 100, points)
        y = np.full(points, 50) + np.random.normal(0, 5, points)
    else:
        x = np.random.uniform(0, 100, size=points)
        y = np.random.uniform(0, 100, size=points)

    df = pd.DataFrame({
        'X': x.round(2),
        'Y': y.round(2),
        'Size': np.random.uniform(5, 20, size=points).round(1)
    })
    df.to_csv(os.path.join(output_dir, f"{preset}_scatter_chart_data.csv"), index=False)
    return df

# 5. Grouped Column Chart Data (e.g., multiple series per category)
def generate_grouped_bar_data(categories=5, groups=3, preset="random"):
    data = {
        'Category': [f'Category {i+1}' for i in range(categories)]
    }

    for g in range(groups):
        if preset == "uptrend":
            values = np.linspace(10, 100, categories) + np.random.normal(0, 5, categories)
        elif preset == "downtrend":
            values = np.linspace(100, 10, categories) + np.random.normal(0, 5, categories)
        elif preset == "flat":
            values = np.full(categories, 50) + np.random.normal(0, 3, categories)
        else:
            values = [random.randint(10, 100) for _ in range(categories)]
        data[f'Group {g+1}'] = np.round(values)

    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, f"{preset}_grouped_bar_chart_data.csv"), index=False)
    return df

# 6. Stacked Bar Chart Data
def generate_stacked_bar_data(categories=5, series=3):
    data = {
        'Category': [f'Category {i+1}' for i in range(categories)]
    }
    for s in range(series):
        data[f'Series {s+1}'] = [random.randint(5, 50) for _ in range(categories)]

    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, "stacked_bar_chart_data.csv"), index=False)
    return df

# 7. Area Chart Data
def generate_area_chart_data(points=12, series=3, preset="random"):
    time = [f'Month {i+1}' for i in range(points)]
    data = { 'Month': time }

    for s in range(series):
        if preset == "uptrend":
            y = np.linspace(10, 100, points) + np.random.normal(0, 3, points)
        elif preset == "downtrend":
            y = np.linspace(100, 10, points) + np.random.normal(0, 3, points)
        elif preset == "flat":
            y = np.full(points, 50) + np.random.normal(0, 2, points)
        else:
            y = np.cumsum(np.random.randint(5, 15, size=points))

        data[f'Series {s+1}'] = y.round(2)

    df = pd.DataFrame(data)
    df.to_csv(os.path.join(output_dir, f"{preset}_area_chart_data.csv"), index=False)
    return df

# Generate all datasets and save to CSV
if __name__ == "__main__":
    print("Generating sample data and writing CSVs to 'sample_data' folder...\n")
    # Bar charts
    print("Uptrend Bar Chart:\n", generate_bar_data(preset="uptrend"), "\n")
    print("Downtrend Bar Chart:\n", generate_bar_data(preset="downtrend"), "\n")
    print("Flat Bar Chart:\n", generate_bar_data(preset="flat"), "\n")
    # Line charts
    print("Uptrend Line Chart:\n", generate_line_data(preset="uptrend"), "\n")
    print("Downtrend Line Chart:\n", generate_line_data(preset="downtrend"), "\n")
    print("Flat Line Chart:\n", generate_line_data(preset="flat"), "\n")
    # Pie charts
    print("Pie Chart:\n", generate_pie_data(), "\n")
     # Scatter charts
    print("Uptrend Scatter Chart:\n", generate_scatter_data(preset="uptrend").head(), "\n")
    print("Downtrend Scatter Chart:\n", generate_scatter_data(preset="downtrend").head(), "\n")
    print("Flat Scatter Chart:\n", generate_scatter_data(preset="flat").head(), "\n")
    # Grouped charts
    print("Uptrend Grouped Bar Chart:\n", generate_grouped_bar_data(preset="uptrend"), "\n")
    print("Downtrend Grouped Bar Chart:\n", generate_grouped_bar_data(preset="downtrend"), "\n")
    print("Flat Grouped Bar Chart:\n", generate_grouped_bar_data(preset="flat"), "\n")
    # Stacked charts
    print("Stacked Bar Chart:\n", generate_stacked_bar_data(), "\n")
    # Area charts
    print("Uptrend Area Chart:\n", generate_area_chart_data(preset="uptrend"), "\n")
    print("Downtrend Area Chart:\n", generate_area_chart_data(preset="downtrend"), "\n")
    print("Flat Area Chart:\n", generate_area_chart_data(preset="flat"), "\n")