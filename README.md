# Kairos

Kairos is a modern, open-source read-later application that helps users save,
organize, and efficiently consume online content. The name "Kairos" comes from
the ancient Greek word for "the right, opportune moment" – perfectly capturing
our goal of helping users read content when the time is right for them.

## 🎯 Core Features

### Content Management

- Save articles with one click
- Automatic content extraction and cleaning
- Offline reading support
- Reading progress tracking
- Article highlighting and annotations
- Custom tagging system

### Smart Reading

- Distraction-free reading mode
- Estimated reading time
- Reading progress synchronization
- Automatic bookmark placement
- Cross-device syncing

### Organization

- Custom reading lists
- Tag-based organization
- Search and filtering
- Archive management

## 🏗 Architecture & Tech Stack

### Backend
- Deno + Hono for REST API
- PostgreSQL database
- BullMQ for job processing
- Mozilla Readability for content extraction

### Frontend
- Web client (**TBD**)
- React Native mobile app
- Offline-first with local storage

### Infrastructure
- Docker containers
- Docker Compose orchestration
- GitHub Actions CI/CD

## 🚀 Getting Started

### Prerequisites

- Deno 2 or higher
- Docker and Docker Compose
- Node.js 18+ (for mobile development)
- PostgreSQL 15

### Quick Start

```bash
# Clone the repository
git clone https://github.com/kairosreader/kairos.git && cd kairos

# Set up environment variables
cp .env.example .env

# Install dependencies
deno install --allow-scripts

# Start development
deno task docker:build
```

### Local Development Services

| Service | URL |
|---------|-----|
| Web App | http://localhost/ |
| SMTP Dashboard | http://localhost:4436/ |
| API Documentation | http://localhost/api/swagger |
| Database Dashboard | https://local.drizzle.studio/ |
| Auth Admin UI | http://localhost:8080/identities |

### API Testing Guide

To authenticate API requests:

1. Sign up at http://localhost
2. Verify your email on http://localhost:4436
3. Open browser developer tools
4. Go to the Application tab
5. Select "Cookies"
6. Copy the value of `ory_kratos_session`
7. Go to the API documentation at http://localhost/api/swagger
8. Authorize with the copied session token

## 📦 Deployment

Deploy with a single command using Docker Compose:
```bash
docker compose up -d
```

This will start all necessary services and set up the entire application stack.

## 🤝 Contributing

Kairos is open to contributions. Here's how you can help:

1. **Code Contributions**
   - Fork the repository
   - Create a feature branch
   - Submit a pull request

2. **Bug Reports**
   - Use the issue tracker
   - Include reproduction steps
   - Provide system information

3. **Documentation**
   - Improve README
   - Add code comments
   - Create usage examples

## 📄 License

---

Kairos is released under the MIT License. Feel free to use, modify, and
distribute as needed.

---

Built with ❤️ using **Deno**
