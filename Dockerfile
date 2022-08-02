FROM node:16-alpine

COPY . /app
WORKDIR /app

ENTRYPOINT [ "/app/docker_entrypoint.sh" ]
