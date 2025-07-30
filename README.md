# 🐳 Run the Application with Docker Compose (Microservices)
This project uses a microservices architecture with multiple NestJS apps (e.g., auth, reservations, payments, etc.) and shared infrastructure like MongoDB or RabbitMQ. To run the entire system, use Docker Compose.
# ⚠️ Remember to run this in LINUX or WSL2


# 🚀 Start all services

```bash
$ docker compose up --build
```

This command will:
1. Build all apps under apps/

2. Start each microservice in a separate container

3. Start infrastructure services (e.g., MongoDB)

4. Connect everything in a shared Docker network


# 🛑 Stop all services
```bash 
$ docker compose down
```

This stops and removes all containers, networks, and volumes created by docker compose.
# 🚀 Start in detached mode
```bash 
$ docker compose up -d
```
# 🐳 Rebuild containers on change
```bash 
$ docker compose up --build
```
# 📄 View logs from all services
```bash 
$ docker compose logs -f
```
# 🧱 Example: docker-compose.yml

# ⚠️ Before jumping into these steps above, make sure your docker-compose.yml is correctly configured for all microservices and shared dependencies.
Here is an example docker-compose.yml setup for a NestJS monorepo:
```bash
services:
  reservations:
    build:
      context: .
      dockerfile: ./apps/reservations/Dockerfile
      target: development
    command: pnpm run start:dev reservations
    ports:
      - '3000:3000'
    volumes:
      - .:/usr/src/app
  auth:
    build:
      context: .
      dockerfile: ./apps/auth/Dockerfile
      target: development
    command: pnpm run start:dev auth
    ports:
      - '3001:3001'
    volumes:
      - .:/usr/src/app
  mongo:
    image: mongo
```