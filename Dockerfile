FROM node:16

# setup okteto message
COPY bashrc /root/.bashrc

WORKDIR /src

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
CMD ["yarn", "start"]
