# Polars Practices

Examples of using Polars - a fast DataFrame library written in Rust with Python bindings.

## Technologies

- **Polars** - High-performance DataFrame library
- **pandas** - For comparison and interop
- **numpy** - Numerical operations
- **PyArrow** - Parquet file I/O

## Key Practices

### Basic DataFrame Operations
```python
import polars as pl
import datetime as dt

df = pl.DataFrame({
    "name": ["Alice", "Bob"],
    "birthdate": [dt.date(1997, 1, 10), dt.date(1985, 2, 15)],
    "weight": [57.9, 72.5],
    "height": [1.56, 1.77],
})
```

### I/O Operations
```python
# CSV
df.write_csv("data.csv")
df = pl.read_csv("data.csv")

# Parquet
df.write_parquet("data.parquet")
df = pl.read_parquet("data.parquet")

# Pandas interop
pandas_df = df.to_pandas()
df = pl.from_pandas(pandas_df)
```

### Select Columns (Expressions)
```python
result = df.select(
    pl.col("name"),
    pl.col("birthdate").dt.year().alias("birth_year"),
    (pl.col("weight") / (pl.col("height") ** 2)).alias("bmi"),
    (pl.col("weight", "height") * 0.95).round(2).name.suffix("-5%"),
)
```

### Add New Columns
```python
df = df.with_columns([
    pl.col("birthdate").dt.year().alias("birth_year"),
    (pl.col("weight") / (pl.col("height") ** 2)).alias("bmi"),
])
```

### Filter Rows
```python
# Multiple conditions (comma = AND)
result = df.filter(
    pl.col("weight") > 70,
    pl.col("height") > 1.7,
)
```

### GroupBy and Aggregate
```python
result = df.group_by(
    (pl.col("birthdate").dt.year() // 10 * 10).alias("decade"),
    maintain_order=True,
).agg(
    pl.len().alias("sample_size"),
    pl.col("weight").mean().round(2).alias("avg_weight"),
    pl.col("height").max().alias("tallest"),
)
```

### GroupBy with Custom Function (map_groups)
```python
def custom_calculation(group: pl.DataFrame) -> pl.DataFrame:
    return pl.DataFrame({
        "decade": group["decade"],
        "bmi_mean": (group["weight"] / (group["height"] ** 2)).mean(),
    })

result = df.group_by("decade").map_groups(custom_calculation)
```

### Join DataFrames
```python
result = df.join(df2, on="name", how="left")
```

### Concatenate DataFrames
```python
result = pl.concat([df1, df2], how="vertical")
```

### Lazy API (Deferred Execution)
```python
# Load lazily
lazy_df = pl.read_parquet("data.parquet", use_pyarrow=True).lazy()

# Chain operations (not executed yet)
lazy_result = lazy_df.filter(pl.col("value") > 10).with_columns(
    (pl.col("value") * 2).alias("doubled")
)

# Execute
result = lazy_result.collect()
```

### Working with Partitioned Parquet Files
```python
# Save per partition
def save_partitioned(df: pl.DataFrame, base_dir: str):
    for device in df.select("device").unique().to_series().to_list():
        device_df = df.filter(pl.col("device") == device)
        device_df.write_parquet(f"{base_dir}/{device}.parquet")

# Load specific partitions
def load_devices(devices, base_dir):
    dfs = [pl.read_parquet(f"{base_dir}/{d}.parquet") for d in devices]
    return pl.concat(dfs)
```

## Performance Comparison (Polars vs Pandas)

| Operation | Polars | Pandas |
|-----------|--------|--------|
| DataFrame creation (4M rows) | ~1.7s | ~2.0s |
| GroupBy + Apply (100k groups) | ~8.7s | ~14.2s |

## Tips

- Use `maintain_order=True` in `group_by()` to preserve row order
- Use Lazy API for complex pipelines - Polars optimizes the query plan
- `pl.col("a", "b")` selects multiple columns at once
- Use `.alias()` to rename columns in expressions
- `.name.suffix()` adds suffix to column names
- Polars is faster than pandas for large datasets
- Avoid `.map_groups()` when possible - use expressions for better performance

## Setup

```bash
pip install polars pyarrow jupyter

# Run Jupyter
jupyter notebook
```
