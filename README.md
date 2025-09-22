# Movies Rentals API

A Node.js microservice that provides rental management functionality for a movies application. This service handles movie rental operations and integrates with a catalog service to provide enriched rental data.

## Overview

The Movies Rentals API is built with modern technologies and follows cloud-native best practices:

- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js 5.x
- **Database**: MongoDB 8.0
- **Deployment**: Kubernetes with Helm charts
- **Development**: Hot-reload with nodemon

## Features

- **Rental Management**: Create and retrieve movie rentals
- **Data Enrichment**: Integrates with catalog service to provide detailed movie information
- **Health Monitoring**: Built-in health check endpoints
- **Persistent Storage**: MongoDB with persistent volume support
- **Production Ready**: Resource limits, health checks, and proper error handling

## API Endpoints

- `GET /rentals/healthz` - Health check endpoint
- `GET /rentals` - Retrieve all rentals with enriched movie data
- `POST /rent` - Create a new movie rental

## Architecture

![Architecture diagram](images/app.png)

The service follows a microservices architecture pattern where:
- Each service handles a specific domain (rentals, catalog)
- Services communicate via HTTP APIs  
- Shared database per service pattern
- Kubernetes-native deployment and scaling

![Partial dev environment](images/partial.png)

![Divert](images/divert.png)

## Technology Stack

- **Application**: Node.js with Express framework
- **Database**: MongoDB with official Docker image
- **Orchestration**: Kubernetes with Helm charts
- **Development**: Okteto for cloud-native development
- **Monitoring**: Built-in health checks and logging

