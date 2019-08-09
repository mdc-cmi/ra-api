FROM node:12.3-alpine
LABEL maintainer=tkunch@rebbix.com

ENV BUILD_PACKAGES="build-base python" \
    DEV_PACKAGES="mysql-dev" \
    RUN_PACKAGES="bash ffmpeg" \
    ROOT_DIR="/build"

RUN apk --update --upgrade --no-cache add $BUILD_PACKAGES $DEV_PACKAGES $RUN_PACKAGES && rm -rf /var/cache/apk*
RUN mkdir -p $ROOT_DIR
WORKDIR $ROOT_DIR

COPY package.json  ./
RUN npm install --build-from-source

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; then npm install --global nodemon; fi

#RUN apk del $BUILD_PACKAGES

COPY . .

ENV HTTP_HOST=0.0.0.0 \
    HTTP_PORT=3000 \
    NODE_PATH=$ROOT_DIR

EXPOSE 3000
CMD ["node", "run.js"]
