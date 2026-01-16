# JSON Schema Practices

Examples of JSON Schema validation in Python using the `jsonschema` library.

## Technologies

- **jsonschema** - JSON Schema validation library for Python
- **Python** - Programming language

## Key Practices

### Basic Schema Definition
```python
from jsonschema import validate, ValidationError

schema = {
    "type": "object",
    "properties": {
        "name": {"type": "string", "minLength": 1},
        "age": {"type": "number", "minimum": 0},
        "email": {"type": "string", "format": "email"},
        "is_active": {"type": "boolean"}
    },
    "required": ["name", "age"],
    "additionalProperties": False
}
```

### Common Validation Rules

| Rule | Description |
|------|-------------|
| `type` | Data type (string, number, object, array, boolean, null) |
| `minLength` / `maxLength` | String length constraints |
| `minimum` / `maximum` | Number range constraints |
| `pattern` | Regex pattern matching |
| `enum` | Allowed values list |
| `format` | Built-in formats (email, date, uuid, etc.) |
| `required` | Required properties list |
| `additionalProperties` | Allow/disallow extra properties |

### UUID Pattern Validation
```python
"id": {
    "type": "string",
    "pattern": r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
}
```

### Nested Object Validation
```python
"address": {
    "type": "object",
    "properties": {
        "street": {"type": "string", "minLength": 1},
        "city": {"type": "string", "minLength": 1}
    },
    "required": ["street", "city"],
    "additionalProperties": False
}
```

### Array Validation
```python
schema = {
    "type": "array",
    "items": {"$ref": "#/definitions/person"}
}
```

### Using $ref for Reusable Definitions
```python
schema = {
    "type": "array",
    "items": {"$ref": "#/definitions/person"},
    "definitions": {
        "person": {
            "type": "object",
            "properties": {...}
        },
        "address": {
            "type": "object",
            "properties": {...}
        }
    }
}
```

### Validation with Error Handling
```python
try:
    validate(instance=data, schema=schema)
    print("Valid data")
except ValidationError as e:
    print("Validation error:", e.message)
```

## Tips

- Use `$ref` for reusable schema components
- Set `additionalProperties: False` to catch typos in property names
- Use `enum` for restricting values to a specific set
- Combine multiple validations (e.g., `type` + `pattern` + `minLength`)
- The `format` keyword provides semantic validation (email, uri, date-time)

## Setup

```bash
pip install jsonschema jupyter

# Run Jupyter
jupyter notebook
```
