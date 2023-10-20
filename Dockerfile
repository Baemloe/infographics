FROM openjdk:17-alpine
ARG JAR_FILE=infographic-0.2.6.jar
WORKDIR app/
COPY infer /app
ENTRYPOINT ["java","-jar","infographic-0.2.6.jar"]
ENV DB_HOST=localhost
ENV DB_PORT=3306
ENV DB_NAME=infograpic
ENV DB_USER=root
ENV DB_PASSWORD=passs