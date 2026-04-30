<<<<<<< HEAD
# Disaster Relief Resource Allocation
### Greedy vs Dynamic Programming — Interactive Visualizer

---

## Project Overview

A complete interactive web application that demonstrates and compares two algorithmic approaches for distributing limited disaster relief resources across multiple affected regions.

**Problem**: Given limited resources (food, water, medicine) and multiple affected regions with varying urgency, population, and distance, how do we allocate resources to maximize total relief impact?

---

## File Structure

```
disaster-relief-project/
│
├── index.html              # Main HTML entry point
│
├── css/
│   └── style.css           # Complete dark-theme stylesheet
│
├── js/
│   ├── data.js             # Region dataset (mutable at runtime)
│   ├── algorithms.js       # Greedy + DP algorithm implementations
│   ├── ui.js               # DOM rendering helpers
│   ├── charts.js           # Chart.js visualization module
│   └── main.js             # App entry point / orchestrator
│
└── README.md               # This file
```

---

## Algorithms

### 1. Greedy — O(n log n)

**Strategy**: Sort regions by `impact / resources` ratio (efficiency), then greedily pick the most efficient region until capacity is exhausted.

```
for each region (sorted by impact/resource ratio, descending):
    if region.resources <= remaining_capacity:
        select region
        remaining_capacity -= region.resources
```

**Pros**: Fast, simple, good for real-time crisis decisions  
**Cons**: May miss globally optimal combinations

---

### 2. Dynamic Programming — 0/1 Knapsack — O(n × W)

**Strategy**: Build a 2D table where `dp[i][w]` = maximum impact achievable using the first `i` regions with capacity `w`. Trace back the table to find which regions were selected.

```
for i in 1..n:
    for w in 0..W:
        dp[i][w] = dp[i-1][w]                           # don't take
        if weight[i] <= w:
            dp[i][w] = max(dp[i][w], dp[i-1][w-weight[i]] + value[i])  # take
```

**Pros**: Always finds the globally optimal solution  
**Cons**: O(n × W) time and space — slower for large inputs

---

## Impact Function

```
Impact = (Urgency × Population) / Distance
```

| Parameter  | Meaning                                         |
|------------|--------------------------------------------------|
| Urgency    | Crisis severity score (1–10)                    |
| Population | Thousands of people affected                    |
| Distance   | km from supply centre (delivery difficulty)     |

---

## Features

- **Live allocation** — adjust resource capacity and active region count with sliders
- **Add custom regions** — fill in the form to add your own regions at runtime
- **Remove regions** — click ✕ next to any row
- **Three chart views** — Impact comparison, Per-region scores, Resource utilization
- **Execution trace** — step-by-step logs of both algorithms
- **Winner banner** — shows percentage gain of DP over Greedy

---

## How to Run

Simply open `index.html` in any modern browser. No build step, no dependencies to install — just a static web app that fetches Chart.js from a CDN.

```bash
# With Python
python -m http.server 8080
# Then visit http://localhost:8080

# Or just double-click index.html in your file manager
```

---

## Complexity Comparison

| Aspect           | Greedy       | Dynamic Programming |
|------------------|--------------|---------------------|
| Strategy         | Local optima | Global optima       |
| Time             | O(n log n)   | O(n × W)            |
| Space            | O(n)         | O(n × W)            |
| Result           | Suboptimal*  | Always optimal      |
| Use case         | Speed-critical| Planning phase     |

*Greedy is optimal for the **fractional** knapsack, but not the **0/1** knapsack.

---

## Key Insight

> "Greedy algorithms make locally optimal decisions step-by-step. Dynamic Programming considers all possible subsets and guarantees the globally optimal solution — at the cost of higher time and space complexity."

---

## Real-World Applications

- Disaster management systems (NDMA, FEMA)
- NGO resource planning
- Emergency logistics optimization
- Military supply distribution
- Humanitarian aid allocation

---

*Built with vanilla JavaScript + Chart.js. No frameworks required.*
=======
# disaster-relief-optimizer
A web-based system that compares Greedy and Dynamic Programming algorithms to optimize disaster relief resource allocation. Includes real-time visualization, hybrid approach, and performance analysis.
>>>>>>> 45e95b7db515feff4a0916e4df72b1f69cf92e48
