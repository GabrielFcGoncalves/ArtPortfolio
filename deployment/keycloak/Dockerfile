FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /workspace/spi

COPY spi-user-sync/pom.xml .
COPY spi-user-sync/src ./src
RUN mvn clean package -DskipTests

FROM quay.io/keycloak/keycloak:26.4

COPY --from=builder /workspace/spi/target/*-jar-with-dependencies.jar /opt/keycloak/providers/user-sync-spi.jar

RUN /opt/keycloak/bin/kc.sh build

COPY imports /opt/keycloak/data/import

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]