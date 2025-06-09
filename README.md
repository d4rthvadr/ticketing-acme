## Motivation

The Ticketing Microservices project was created to explore and demonstrate the power of microservices architecture in building scalable, resilient, and maintainable applications. By breaking down a complex system into smaller, independent services, this project aims to showcase how modern technologies like Kubernetes, Docker, and event-driven communication can be leveraged to solve real-world problems efficiently.

The project is designed to simulate a ticketing platform where users can create, purchase, and manage tickets for events. It emphasizes best practices in software development, including:

- **Scalability**: Ensuring the system can handle increased load by scaling individual services independently.
- **Resilience**: Building fault-tolerant systems with retry mechanisms.
- **Event-Driven Communication**: Using NATS Streaming to ensure reliable communication between services.
- **Developer Productivity**: Simplifying local development with tools like Skaffold and Docker.

This project serves as a learning resource for developers interested in microservices, distributed systems, and cloud-native application development.

## Technologies Used

This project leverages a modern tech stack to build a scalable, resilient, and developer-friendly microservices architecture:

1. **Docker**: Containerization platform to package and run applications in isolated environments.
2. **Kubernetes**: Orchestrates containerized applications, enabling scaling, self-healing, and efficient resource management.
3. **Kustomize**: Simplifies Kubernetes configuration management with overlays for different environments (e.g., dev, prod).
4. **Next.js**: React framework for building server-rendered and static web applications with ease.
5. **Node.js**: JavaScript runtime for building scalable backend services.
6. **Skaffold**: Automates local Kubernetes development workflows, including building, pushing, and deploying.
7. **Husky**: Git hooks for enforcing code quality and pre-commit checks.
8. **NATS Streaming**: Event streaming system for reliable, event-driven communication between microservices.
9. **Stripe**: Secure payment processing for handling transactions.
10. **GitHub Actions**: CI/CD pipeline for automated testing and deployment.

## Features

- **Authentication**: Secure user authentication and authorization using JWT.
- **Ticket Management**: Create, update, and delete tickets with real-time updates.
- **Order Management**: Place, cancel, and track orders for tickets.
- **Payments Integration**: Secure payment processing with Stripe.
- **Event-Driven Architecture**: Microservices communicate using NATS Streaming for reliable event delivery.
- **Scalability**: Designed to scale horizontally with Kubernetes.
- **Resilience**: Implements retry mechanisms, circuit breakers, and fallback patterns for fault tolerance.
- **CI/CD Pipeline**: Automated testing and deployment using GitHub Actions.
- **Local Development**: Simplified local development with Skaffold and Docker.

## Getting Started

This project is a microservices-based ticketing platform. Follow the steps below to set up the project for local development.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Docker**: For containerization.
2. **Kubernetes**: For orchestrating the microservices.
3. **Skaffold**: For automating Kubernetes workflows.
4. **Node.js**: For running the backend services.
5. **NPM or Yarn**: For managing dependencies.
6. **Kubectl**: For interacting with the Kubernetes cluster.

## Installation (Development)

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/ticketing.git
   cd ticketing
   ```

2. Start the development environment using Skaffold:

   ```bash
   skaffold dev
   ```

3. Access the application:
   - Open your browser and navigate to `http://ticketing.dev` (ensure you have configured your `/etc/hosts` file to map `ticketing.dev` to your local Kubernetes cluster).

## Folder Structure

The repository is organized as follows:

```
/infra
  ├── k8s/                # Base Kubernetes manifests
  ├── k8s-dev/            # Development-specific Kubernetes manifests
  ├── k8s-prod/           # Production-specific Kubernetes manifests

/auth
  ├── src/                # Source code for the auth service
  ├── Dockerfile          # Dockerfile for production
  ├── Dockerfile.dev      # Dockerfile for development

/client
  ├── pages/              # Next.js pages
  ├── components/         # Shared React components
  ├── Dockerfile          # Dockerfile for production
  ├── Dockerfile.dev      # Dockerfile for development

/common
  ├── src/                # Shared code between services

/expiration
  ├── src/                # Source code for the expiration service

/orders
  ├── src/                # Source code for the orders service

/payments
  ├── src/                # Source code for the payments service

/tickets
  ├── src/                # Source code for the tickets service

/nats-tests
  ├── src/                # Test utilities for NATS Streaming
```

## To start local development, run:

```shell
skaffold dev
```

## CI/CD Workflow

This project uses **GitHub Actions** to implement a robust CI/CD pipeline. The pipeline is designed to detect changes in the codebase and automatically apply updates to the appropriate environment (e.g., development or production).

### Key Features of the CI/CD Pipeline

1. **Change Detection**:

   - The pipeline monitors specific paths in the repository (e.g., `infra/k8s/**`, `auth/**`, `client/**`) to detect changes.
   - When changes are pushed to the `main` branch or a pull request is merged, the pipeline is triggered.

2. **Environment-Specific Deployments**:

   - Changes to development-specific files (e.g., `infra/k8s-dev/`) trigger deployments to the development environment.
   - Changes to production-specific files (e.g., `infra/k8s-prod/`) trigger deployments to the production environment.

3. **Automated Kubernetes Manifests Application**:

   - The pipeline uses `kubectl` and `kustomize` to apply Kubernetes manifests for the appropriate environment.
   - For example:
     ```bash
     kubectl apply -k ./infra/k8s/overlays/dev
     kubectl apply -k ./infra/k8s/overlays/prod
     ```

4. **Secrets Management**:

   - Secrets such as `JWT_KEY` and `STRIPE_KEY` are securely stored in GitHub Secrets and applied to the Kubernetes cluster during deployment.

5. **Testing and Validation**:
   - The pipeline includes steps for running unit tests, integration tests, and linting to ensure code quality before deployment.

### Example Workflow

Here’s an example of how the CI/CD pipeline works:

1. A developer pushes changes to the `main` branch.
2. GitHub Actions detects the changes and triggers the pipeline.
3. The pipeline:
   - Runs tests and validations.
   - Applies the changes to the appropriate Kubernetes environment using `kubectl` and `kustomize`.
4. The updated services are deployed, and the application is ready for use.

This CI/CD process ensures that changes are deployed quickly and reliably, reducing manual effort and minimizing downtime.

### Strategies to solve common microservices problems

- Optimistic currency control vs Pessimistic currency control
- Outbox-pattern (Dual-write problem)
- Retry mechanism
- Saga Pattern for distributed transactions
- Fallback pattern
- Retry + circuit breaker pattern
- Bulk-head pattern

## Acknowledgements

This project was made possible thanks to the following tools, libraries, and contributors:

- **Docker**: For providing a robust containerization platform.
- **Kubernetes**: For enabling scalable and resilient orchestration of microservices.
- **Skaffold**: For simplifying local Kubernetes development workflows.
- **NATS Streaming**: For reliable event-driven communication between services.
- **Stripe**: For secure and seamless payment processing.
- **GitHub Actions**: For automating CI/CD pipelines.
- **Open Source Community**: For contributing to the tools and libraries used in this project.
- **Team Members and Collaborators**: For their invaluable contributions and support during development.
