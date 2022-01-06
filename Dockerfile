FROM node:16.13.1

RUN npm install --unsafe-perm --force -g yarn && \
  yarn global add lerna@4.0.0 && \
  yarn global add @apollo/rover && \
  chmod +x /usr/local/bin/yarn

WORKDIR /app
ADD ./ /app

RUN ls -lsa

ENTRYPOINT lerna clean -y && \
  lerna bootstrap && \
  lerna run dev --stream