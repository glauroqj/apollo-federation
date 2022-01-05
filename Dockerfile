FROM node:16.13.1-alpine

WORKDIR /app

RUN npm install --unsafe-perm --force -g yarn && \
  yarn global add lerna@4.0.0 && \
  chmod +x /usr/local/bin/yarn

# RUN ls -la

ENTRYPOINT lerna clean -y && \
  lerna bootstrap && \
  lerna run dev --parallel