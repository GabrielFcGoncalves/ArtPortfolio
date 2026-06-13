# Stage 1: Build the SPI
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /workspace/spi
# Be sure to copy from the new spi-user-sync directory
COPY spi-user-sync/pom.xml .
COPY spi-user-sync/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Keycloak image
FROM quay.io/keycloak/keycloak:26.4

# Copy compiled SPI provider
COPY --from=builder /workspace/spi/target/*-jar-with-dependencies.jar /opt/keycloak/providers/user-sync-spi.jar

# --- CRITICAL MISSING STEP ---
# This tells Keycloak to scan the providers folder and register your SPI
RUN /opt/keycloak/bin/kc.sh build

# Copy realm imports (doing this after build is fine)
COPY imports /opt/keycloak/data/import

# Set entrypoint command
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]