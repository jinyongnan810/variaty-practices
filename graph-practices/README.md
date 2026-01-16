# Graph Practices

Data visualization examples using Python, focusing on histograms and data distribution charts.

## Technologies

- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **matplotlib** - Data visualization library

## Key Practices

### Histogram with Custom Bins
```python
import matplotlib.pyplot as plt
import numpy as np

# Create custom bins
bins = np.linspace(0, 100, 21)  # 20 bins from 0 to 100
values, bins, patches = ax.hist(df['value'], bins=bins, color='skyblue', alpha=0.7)
```

### Adding Value Labels to Bars
```python
for i in range(len(bins)-1):
    count = values[i]
    ax.text((bins[i] + bins[i+1]) / 2, count, str(count),
            ha='center', va='bottom')
```

### Adding Bar Borders
```python
for i in range(len(bins)-1):
    count = values[i]
    ax.add_patch(plt.Rectangle(
        (bins[i], 0), bins[i+1]-bins[i], count,
        edgecolor='black', facecolor='none', lw=1
    ))
```

### Annotating Max/Min Values with Arrows
```python
ax.annotate('Max', xy=(x, max_value), xytext=(x+1, max_value+1),
            arrowprops=dict(facecolor='orange', shrink=0.05))
```

### Setting Custom X-axis Labels
```python
ax.set_xticks(bins)
ax.set_xticklabels([f'{int(b)}' for b in bins], rotation=45)
```

## Tips

- Use `figsize=(18, 6)` for wide charts
- `alpha=0.7` makes overlapping elements visible
- Use `np.linspace()` for evenly spaced bin edges
- Add annotations for highlighting important data points
- Rotate x-axis labels with `rotation=45` for better readability

## Files

- `histgram.ipynb` - Histogram visualization examples
- `values.ipynb` - Data value analysis and charts

## Setup

```bash
pip install pandas numpy matplotlib jupyter

# Run Jupyter
jupyter notebook
```
