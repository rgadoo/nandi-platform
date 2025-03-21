## Stage 1: Build with Maven
FROM maven:3.8.5-openjdk-17 as build

WORKDIR /app

# Copy the project files
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn package -DskipTests

## Stage 2: Run with JRE
FROM registry.access.redhat.com/ubi8/openjdk-17:latest

WORKDIR /deployments

# Copy the jar from the build stage
COPY --from=build /app/target/quarkus-app/lib/ ./lib/
COPY --from=build /app/target/quarkus-app/*.jar ./
COPY --from=build /app/target/quarkus-app/app/ ./app/
COPY --from=build /app/target/quarkus-app/quarkus/ ./quarkus/

# Set environment variables
ENV JAVA_OPTS="-Dquarkus.http.host=0.0.0.0 -Dquarkus.http.port=9080 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

# Expose the application port
EXPOSE 9080

# Run the application
ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ] 