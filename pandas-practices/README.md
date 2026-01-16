# Pandas Practices

Comprehensive pandas examples covering data manipulation, analysis, visualization, and common operations.

## Technologies

- **pandas** - Data manipulation and analysis library
- **numpy** - Numerical computing
- **matplotlib** - Data visualization
- **scipy** - Scientific computing (statistics)

## Key Practices

### Data I/O
```python
# Read CSV with datetime parsing
df = pd.read_csv('data.csv', parse_dates=['date'], index_col='date')

# Write to various formats
df.to_csv('output.csv', index=True)
df.to_parquet('output.parquet')
```

### Column Selection
```python
# Multiple methods
df[['col1', 'col2']]           # By column names
df.loc[:, ['col1', 'col2']]    # loc with column names
df.iloc[:, [0, 1, 2]]          # iloc with indices
```

### Row Filtering
```python
# Single condition
df[df['season'] == 1]

# Multiple conditions (use & and |)
df[(df['season'] == 1) & (df['temp'] > 0.5)]

# Null handling
df[df['temp'].notnull()]
df[df['temp'].isnull()]
```

### Sorting
```python
# Single column
df.sort_values(by='temp', ascending=False)

# Multiple columns
df.sort_values(by=['cnt', 'temp'], ascending=[True, False])
```

### GroupBy and Aggregation
```python
# Basic aggregation
df.groupby('season')['cnt'].mean()

# Multiple aggregations
df.groupby(['device', 'metric']).agg(
    Avg_Value=('Value', 'mean'),
    Sum_Value2=('Value2', 'sum'),
    Custom=('Value', lambda x: (x * df.loc[x.index, 'Value2']).sum())
)
```

### GroupBy with Apply (Complex Calculations)
```python
def complex_calculation(group):
    weighted_avg = (group['value'] * group['value2']).sum() / group['value2'].sum()
    value_range = group['value'].max() - group['value'].min()
    return pd.Series({'Weighted_Avg': weighted_avg, 'Value_Range': value_range})

result = df.groupby(['device', 'metric']).apply(complex_calculation, include_groups=False)
```

### Time Series Resampling
```python
# Monthly mean
df.resample('ME').mean()

# Monthly mean for specific column
df.resample('ME')['cnt'].mean().plot(kind='bar')
```

### Merging DataFrames
```python
# Inner/Outer joins
pd.merge(df1, df2, left_on='id', right_on='customer_id', how='inner')

# With indicator to track source
df_merged = df.merge(settings_df, on=['device', 'metric'], how='left', indicator=True)
df_with_match = df_merged[df_merged['_merge'] == 'both']
```

### Pivot Tables
```python
# Wide format
pivot_df = df.pivot(index='Date', columns='City', values='Temperature')

# Revert pivot (melt)
original_df = pivot_df.reset_index().melt(id_vars='Date', var_name='City', value_name='Temperature')
```

### Detecting Duplicates
```python
key_columns = ['device', 'metric', 'timestamp']
duplicated_mask = new_df.set_index(key_columns).index.isin(df.set_index(key_columns).index)
duplicates = new_df[duplicated_mask]
```

### Handling Nulls
```python
df = df.fillna(0)       # Fill with value
df = df.dropna()        # Drop rows with nulls
df = df.bfill()         # Backward fill
df = df.ffill()         # Forward fill
```

### Useful Statistics
```python
df['col'].unique()       # Unique values
df['col'].nunique()      # Count of unique values
df['col'].value_counts() # Frequency counts
df['col'].mode()         # Most frequent value
df.corr()                # Correlation matrix
df['col'].quantile(0.99) # Percentile
```

### NumPy einsum (Bonus)
```python
import numpy as np
a = np.array([[1, 2], [3, 4]])
b = np.array([[5, 6], [7, 8]])
result = np.einsum('ij,jk->ik', a, b)  # Matrix multiplication
```

## Tips

- Use `parse_dates` parameter when reading CSVs with dates
- Set datetime column as index for easy resampling
- Use `inplace=True` sparingly - prefer reassignment
- `loc` is label-based, `iloc` is position-based
- Always use parentheses around conditions when combining with `&` or `|`
- Use `indicator=True` in merge to debug join issues

## Setup

```bash
pip install pandas numpy matplotlib scipy jupyter

# Run Jupyter
jupyter notebook
```
