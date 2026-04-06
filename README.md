# Creator OS | Artist Business Ecosystem & SaaS Platform

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.4-6DB33F?style=flat-square&logo=spring-boot)
![Keycloak](https://img.shields.io/badge/Keycloak-Latest-EBBB14?style=flat-square&logo=keycloak)
![RabbitMQ](https://img.shields.io/badge/Messaging-RabbitMQ%20%2F%20ServiceBus-FF6600?style=flat-square&logo=rabbitmq)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker)

**Creator OS** is an all-in-one portfolio, management, and growth ecosystem designed specifically for digital and traditional artists. The platform unifies high-resolution galleries, automated commission workflows, social media distribution, and community-driven competitive events into a single, professional interface.

---

## The Vision

The art industry is currently fragmented across multiple apps—Instagram for reach, PayPal for payments, Discord for communication, and various site builders for portfolios. Creator OS solves this friction by providing a centralized SaaS platform where artists can handle their entire business cycle without administrative burnout.

---

## Core Problems Solved

- **Administrative Burnout**: Eliminates the need to juggle 4-5 different applications to manage a single client.
- **Payment Insecurity**: Protects artists from "ghosting" and chargeback scams while ensuring clients receive high-quality work through a secure escrow-like system.
- **Algorithm Fatigue**: Reduces the content creator workload by automating social media distribution.
- **The Discovery Gap**: Uses a gamified, skill-based competition engine to help new artists find an audience based on talent rather than follower counts.

---

## Key Product Features

### Smart Commission Timeline

A visual project management tool that replaces messy DM threads with a milestone-based progress bar.

- **Milestone Gates**: Projects are divided into phases (e.g., Sketch, Lineart, Color). Artists cannot proceed until the client approves the current phase.
- **Integrated Escrow**: Funds are collected upfront and held securely by the platform.
- **Automated Revisions**: The system enforces agreed-upon revision limits and automatically manages billing for extras.
- **Secure Previews**: High-resolution files remain locked until the final balance is cleared.

### Social Media Assembly Hub

A centralized dashboard to combat the workload of cross-platform posting.

- **Single-Post Distribution**: Upload once; the platform optimizes and posts to X, Instagram, and TikTok simultaneously.
- **Conversion Analytics**: Tracks which platforms are actually converting views into paid commissions.

### Customized Showcase Site

Professional, high-performance portfolios hosted under custom subdomains.

- **Live Queue Widget**: Real-time display of current workload and estimated wait times.
- **Contextual Hiring**: "Request a piece in this style" buttons integrated directly into gallery images.

### The Tournament Arena

A growth engine designed to solve the discovery problem through gamified, blind-voted competitions.

- **Blind Voting**: Users vote on artwork without seeing the artist's name, ensuring a fair, skill-based competition.
- **Visibility Boost**: Winners receive homepage placement and cash prizes, bypassing traditional social media algorithms.

---

## Technical Foundation

While focused on the artist experience, Creator OS is built on a robust, enterprise-grade architecture:

### Tech Stack

- **Backend**: Java 17, Spring Boot 3.4
- **Security**: Keycloak (OIDC) with fine-grained Role-Based Access Control (RBAC).
- **Messaging**: Event-driven architecture using RabbitMQ and Azure Service Bus for real-time data synchronization.
- **Persistence**: Hybrid model using PostgreSQL (Relational) and MongoDB (NoSQL) for optimized data retrieval.
- **Infrastructure**: Fully containerized with Docker, utilizing Azure Blob Storage (SAS tokens) for secure asset delivery.

---

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Java 17+
- Maven

### Installation

1. Configure environment variables in the `deployment/` directory.
2. Start the infrastructure:
   ```bash
   docker-compose -f deployment/docker-compose.dev.yaml up -d
   ```
3. Build the custom identity synchronization bridge:
   ```bash
   cd keycloak/spi-user-sync && mvn clean package
   ```
4. Launch the backend API:
   ```bash
   cd Art && mvn spring-boot:run
   ```

---

## Trust & Security

The platform prioritizes authenticity and security through:

- **Anti-Scam Protection**: Platform-mediated dispute resolution.
- **AI Verification**: Requirement for process proofs (timelapses/layered files) in competitions to ensure human-made authenticity.
- **Cloud Archiving**: Automatic high-resolution backups for all completed projects.

---
