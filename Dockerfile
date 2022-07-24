FROM alpine:latest as developer
WORKDIR /container
ENV TZ "Pacific/Auckland"
RUN apk add --update nodejs npm
RUN apk add --update npm



FROM alpine:latest as builder
RUN apk add --update nodejs npm
RUN apk add --update npm
WORKDIR /container
COPY . /container/
RUN npm install
RUN node --max-old-space-size=8192
ENV TZ "Pacific/Auckland"
RUN npm run build

FROM alpine:latest as deployer
ARG VERSION
ENV VERSION $VERSION
ARG BUILD_NUMBER
ENV BUILD_NUMBER $BUILD_NUMBER
ARG GIT_COMMIT
ENV GIT_COMMIT $GIT_COMMIT
ENV TZ "Pacific/Auckland"
RUN apk add --update nodejs
COPY --from=builder /container ./
EXPOSE 80
RUN chmod +x startup.sh
CMD ["/bin/ash", "./startup.sh"]
