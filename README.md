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
- Reading statistics

## 🏗 Technical Architecture

Kairos is built as a modern monorepo using Deno, featuring:

### Backend

- **API Server**: RESTful API built with Hono
- **Content Processor**: Async article processing worker
- **Database**: PostgreSQL for reliable data storage
- **Caching**: **(TBD)** for performance optimization
- **Message Queue**: BullMQ for reliable content processing

### Frontend

- **Web Client**: Built with **(TBD)** framework
- **Mobile App**: Cross-platform app using React Native
- **Offline Support**: Local storage and sync capabilities

### Infrastructure

- Containerized with Docker
- Easy deployment with Docker Compose
- Scalable microservices architecture

## 🔧 Technical Stack

### Backend

- **Runtime**: Deno
- **API Framework**: Hono
- **Database**: PostgreSQL
- **Cache**: **(TBD)**
- **Queue**: BullMQ
- **Content Processing**: Mozilla Readability

### Frontend

- **Web**: **(TBD)** framework
- **Mobile**: React Native
- **State Management**: Built-in React hooks
- **Styling**: **(TBD)**

### Infrastructure

- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **CI/CD**: GitHub Actions
- **Monitoring**: Built-in health checks **(TBD)**

## 🚀 Getting Started

### Prerequisites

- Deno 2 or higher
- Docker and Docker Compose
- Node.js 18+ (for mobile development)
- PostgreSQL 15

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/kairos.git

# Start infrastructure
docker-compose up -d

# Install dependencies
deno install --allow-scripts

# Start development
deno task dev
```

## 📦 Deployment

Kairos can be deployed in several ways:

1. **Docker Compose** (Recommended for small deployments)
   - Single command setup
   - Includes all necessary services
   - Automatic service discovery

2. **Manual** (For custom setups)
   - Flexible configuration
   - Custom service integration
   - Fine-grained control

## 🤝 Contributing

Kairos is open source and welcomes contributions. Here's how you can help:

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
