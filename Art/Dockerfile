# Stage 1: Build the JAR from source
FROM maven:3.9.6-eclipse-temurin-21 AS compiler
WORKDIR /compiler
# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Extract the JAR (Builder)
FROM bellsoft/liberica-openjre-debian:25-cds AS builder
WORKDIR /builder
# Pull the JAR from the previous 'build' stage
COPY --from=compiler /compiler/target/*.jar application.jar
RUN java -Djarmode=tools -jar application.jar extract --layers --destination extracted

# Stage 3: Runtime
FROM bellsoft/liberica-openjre-debian:25-cds
WORKDIR /application
COPY --from=builder /builder/extracted/dependencies/ ./
COPY --from=builder /builder/extracted/spring-boot-loader/ ./
COPY --from=builder /builder/extracted/snapshot-dependencies/ ./
COPY --from=builder /builder/extracted/application/ ./

# Ensure the JAR folder content or JAR itself is available for the training run
COPY --from=builder /builder/application.jar ./

# Execute the CDS training run using the 'cds' profile
RUN java -Dspring.profiles.active=cds \
    -XX:ArchiveClassesAtExit=application.jsa \
    -Dspring.context.exit=onRefresh \
    -jar application.jar

ENTRYPOINT ["java", "-XX:SharedArchiveFile=application.jsa", "-jar", "application.jar"]