# dotenvx Practice

Practice project for using [dotenvx](https://dotenvx.com/docs) - a better dotenv with encryption support.

## Technologies

- **dotenvx** - Environment variable management with encryption
- **Django** - Python web framework (demo application)

## Key Features

### Environment Encryption
dotenvx encrypts your `.env` files so you can safely commit them to git:
- `.env.dev` - Development environment (encrypted)
- `.env.prod` - Production environment (encrypted)
- `.env.keys` - Encryption keys (keep secret!)

### Multi-Environment Support
Separate environment files for different stages:
```bash
# Run with development environment
dotenvx run -f .env.dev -- python manage.py runserver

# Run with production environment
dotenvx run -f .env.prod -- python manage.py runserver
```

## Tips

- **Never commit `.env.keys`** - Contains decryption keys
- Use `dotenvx encrypt` to encrypt existing `.env` files
- Use `dotenvx decrypt` to decrypt for local editing
- Integrate with CI/CD by storing keys as secrets

## Basic Usages

Check out [Makefile](./Makefile)

## Resources

- [CI Integration (GitHub Actions)](https://dotenvx.com/docs/cis/github-actions)
- [Docker Integration](https://dotenvx.com/docs/platforms/docker)

## Setup

```bash
# Install dotenvx
brew install dotenvx/brew/dotenvx

# Run the Django app with encrypted env
dotenvx run -f .env.dev -- python manage.py runserver
```
