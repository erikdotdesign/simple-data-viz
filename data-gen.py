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
    df.to_csv(os.path.join(f"{output_dir}/bar", f"{preset}.csv"), index=False)
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
    df.to_csv(os.path.join(f"{output_dir}/line", f"{preset}.csv"), index=False)
    return df

# 3. Pie Chart Data
def generate_pie_data(parts=4, preset="random"):
    labels = [f'Segment {i+1}' for i in range(parts)]

    if preset == "balanced":
        sizes = np.random.normal(loc=100 / parts, scale=1, size=parts)
        sizes = (sizes / sizes.sum()) * 100
        sizes = np.round(sizes, 2)
    elif preset == "dominant":
        sizes = np.array([60] + [40 / (parts - 1)] * (parts - 1))
    elif preset == "long-tail":
        # Use sorted Dirichlet distribution, skewed to favor the head
        alpha = np.linspace(5, 1, parts)
        raw = np.random.dirichlet(alpha)
        sizes = np.round(np.sort(raw)[::-1] * 100, 2)
    elif preset == "binary":
        sizes = np.array([70, 30] + [0] * (parts - 2))[:parts]
    else:
        sizes = np.random.dirichlet(np.ones(parts), size=1)[0] * 100

    df = pd.DataFrame({
        'Segment': labels,
        'Percentage': sizes[:parts]
    })
    df.to_csv(os.path.join(f"{output_dir}/pie", f"{preset}.csv"), index=False)
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
    df.to_csv(os.path.join(f"{output_dir}/scatter", f"{preset}.csv"), index=False)
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
    df.to_csv(os.path.join(f"{output_dir}/grouped-bar", f"{preset}.csv"), index=False)
    return df

# 6. Stacked Bar Chart Data
def generate_stacked_bar_data(categories=5, series=3, preset="random"):
    data = { 'Category': [f'Category {i+1}' for i in range(categories)] }

    for s in range(series):
        if preset == "uptrend":
            base = np.linspace(10, 50 + 10 * s, categories)
        elif preset == "downtrend":
            base = np.linspace(50 + 10 * s, 10, categories)
        elif preset == "flat":
            base = np.full(categories, 30)
        elif preset == "dominant":
            # One series grows, others stay small
            base = np.linspace(10, 100, categories) if s == 0 else np.full(categories, 10)
        elif preset == "shifting":
            # Shuffle weights per category
            base = np.random.randint(10, 50, categories)
        else:
            base = np.random.randint(5, 50, categories)

        noise = np.random.normal(0, 3, categories)
        data[f'Series {s+1}'] = np.clip(base + noise, 1, None).round(2)

    df = pd.DataFrame(data)
    df.to_csv(os.path.join(f"{output_dir}/stacked-bar", f"{preset}.csv"), index=False)
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
    df.to_csv(os.path.join(f"{output_dir}/area", f"{preset}.csv"), index=False)
    return df

# 8. Candlestick Chart Data
def generate_candlestick_data(days=30, preset="random"):
    dates = pd.date_range(end=pd.Timestamp.today(), periods=days).strftime('%Y-%m-%d')
    data = []

    current_price = 100
    for i in range(days):
        if preset == "uptrend":
            # Mostly positive, but ~20% chance of negative change
            change = np.random.normal(1.5, 1) if np.random.rand() > 0.2 else np.random.normal(-1, 0.5)
        elif preset == "downtrend":
            # Mostly negative, but ~20% chance of positive change
            change = np.random.normal(-1.5, 1) if np.random.rand() > 0.2 else np.random.normal(1, 0.5)
        elif preset == "flat":
            change = np.random.normal(0, 0.5)
        else:  # random
            change = np.random.normal(0, 1.5)

        open_price = current_price
        close_price = open_price + change
        high = max(open_price, close_price) + np.random.uniform(0.5, 2)
        low = min(open_price, close_price) - np.random.uniform(0.5, 2)

        data.append({
            'Date': dates[i],
            'Open': round(open_price, 2),
            'High': round(high, 2),
            'Low': round(low, 2),
            'Close': round(close_price, 2)
        })

        current_price = close_price

    df = pd.DataFrame(data)
    df.to_csv(os.path.join(f"{output_dir}/candlestick", f"{preset}.csv"), index=False)
    return df

def generate_radar_chart_data(categories=6, series=3, preset="random"):
    category_labels = [f'Dimension {i+1}' for i in range(categories)]
    data = {'Metric': category_labels}

    for s in range(series):
        if preset == "generalist":
            values = np.full(categories, 70) + np.random.normal(0, 5, categories)
        elif preset == "specialist":
            values = np.random.randint(30, 60, categories)
            spike_index = np.random.randint(0, categories)
            values[spike_index] = np.random.randint(90, 100)
        elif preset == "balanced":
            values = np.random.normal(loc=70, scale=3, size=categories)
        elif preset == "polarized":
            values = np.random.choice([20, 100], size=categories)
        else:  # "random" or unknown
            values = np.random.randint(0, 100, categories)

        data[f'Series {s+1}'] = np.round(np.clip(values, 0, 100), 2)

    df = pd.DataFrame(data)
    output_path = os.path.join(f"{output_dir}/radar", f"{preset}.csv")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    return df

# Generate all datasets and save to CSV
if __name__ == "__main__":
    print("Generating sample data and writing CSVs to 'sample_data' folder...\n")
    # Bar charts
    print("Uptrend Bar Chart:\n", generate_bar_data(preset="uptrend"), "\n")
    print("Downtrend Bar Chart:\n", generate_bar_data(preset="downtrend"), "\n")
    print("Flat Bar Chart:\n", generate_bar_data(preset="flat"), "\n")
    print("Random Bar Chart:\n", generate_bar_data(preset="random"), "\n")
    # Line charts
    print("Uptrend Line Chart:\n", generate_line_data(preset="uptrend"), "\n")
    print("Downtrend Line Chart:\n", generate_line_data(preset="downtrend"), "\n")
    print("Flat Line Chart:\n", generate_line_data(preset="flat"), "\n")
    print("Random Line Chart:\n", generate_line_data(preset="random"), "\n")
    # Pie charts
    print("Balanced Pie Chart:\n", generate_pie_data(preset="balanced"), "\n")
    print("Dominant Pie Chart:\n", generate_pie_data(preset="dominant"), "\n")
    print("Long Tail Pie Chart:\n", generate_pie_data(preset="long-tail"), "\n")
    print("Binary Pie Chart:\n", generate_pie_data(parts=2, preset="binary"), "\n")
    print("Random Pie Chart:\n", generate_pie_data(preset="random"), "\n")
     # Scatter charts
    print("Uptrend Scatter Chart:\n", generate_scatter_data(preset="uptrend").head(), "\n")
    print("Downtrend Scatter Chart:\n", generate_scatter_data(preset="downtrend").head(), "\n")
    print("Flat Scatter Chart:\n", generate_scatter_data(preset="flat").head(), "\n")
    print("Random Scatter Chart:\n", generate_scatter_data(preset="random").head(), "\n")
    # Grouped charts
    print("Uptrend Grouped Bar Chart:\n", generate_grouped_bar_data(preset="uptrend"), "\n")
    print("Downtrend Grouped Bar Chart:\n", generate_grouped_bar_data(preset="downtrend"), "\n")
    print("Flat Grouped Bar Chart:\n", generate_grouped_bar_data(preset="flat"), "\n")
    print("Random Grouped Bar Chart:\n", generate_grouped_bar_data(preset="random"), "\n")
    # Stacked charts
    print("Uptrend Stacked Bar Chart:\n", generate_stacked_bar_data(preset="uptrend"), "\n")
    print("Downtrend Stacked Bar Chart:\n", generate_stacked_bar_data(preset="downtrend"), "\n")
    print("Flat Stacked Bar Chart:\n", generate_stacked_bar_data(preset="flat"), "\n")
    print("Dominant Series Stacked Bar Chart:\n", generate_stacked_bar_data(preset="dominant"), "\n")
    print("Shifting Composition Stacked Bar Chart:\n", generate_stacked_bar_data(preset="shifting"), "\n")
    print("Random Stacked Bar Chart:\n", generate_stacked_bar_data(preset="random"), "\n")
    # Area charts
    print("Uptrend Area Chart:\n", generate_area_chart_data(preset="uptrend"), "\n")
    print("Downtrend Area Chart:\n", generate_area_chart_data(preset="downtrend"), "\n")
    print("Flat Area Chart:\n", generate_area_chart_data(preset="flat"), "\n")
    print("Random Area Chart:\n", generate_area_chart_data(preset="random"), "\n")
    # Candlestick chart
    print("Uptrend Candlestick Chart:\n", generate_candlestick_data(preset="uptrend").head(), "\n")
    print("Downtrend Candlestick Chart:\n", generate_candlestick_data(preset="downtrend").head(), "\n")
    print("Flat Candlestick Chart:\n", generate_candlestick_data(preset="flat").head(), "\n")
    print("Random Candlestick Chart:\n", generate_candlestick_data(preset="random").head(), "\n")
    # Radar chart
    print("Generalist Radar Chart:\n", generate_radar_chart_data(preset="generalist"), "\n")
    print("Specialist Radar Chart:\n", generate_radar_chart_data(preset="specialist"), "\n")
    print("Balanced Radar Chart:\n", generate_radar_chart_data(preset="balanced"), "\n")
    print("Polarized Radar Chart:\n", generate_radar_chart_data(preset="polarized"), "\n")
    print("Random Radar Chart:\n", generate_radar_chart_data(preset="random"), "\n")