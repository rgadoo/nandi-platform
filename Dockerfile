FROM maven:3.8.5-openjdk-17 as build
WORKDIR /app
COPY pom.xml .
COPY src ./src
COPY config ./config
RUN mvn package -DskipTests

FROM registry.access.redhat.com/ubi8/openjdk-17:latest
WORKDIR /deployments
COPY --from=build /app/target/quarkus-app/lib/ ./lib/
COPY --from=build /app/target/quarkus-app/*.jar ./
COPY --from=build /app/target/quarkus-app/app/ ./app/
COPY --from=build /app/target/quarkus-app/quarkus/ ./quarkus/
COPY --from=build /app/config/application.properties ./config/application.properties

ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"
ENV JAVA_OPTIONS="-Dquarkus.config.locations=file:/deployments/config/application.properties"

EXPOSE 8080
ENTRYPOINT [ "/opt/jboss/container/java/run/run-java.sh" ] 