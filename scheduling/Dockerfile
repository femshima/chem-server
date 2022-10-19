FROM node:18-bullseye-slim AS builder

WORKDIR /app
RUN npm i -g pnpm

COPY ./*.* ./

RUN sed '/prepare/d' -i package.json
RUN pnpm i --frozen-lockfile

COPY ./src ./src
RUN pnpm build


FROM node:18-bullseye-slim AS runner

RUN apt-get update \
    && apt-get install -y \
      ca-certificates \
      curl \
      gnupg \
      lsb-release \
    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg \
    && echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update \
    && apt-get install -y docker-ce-cli \
    && apt-get -y clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=builder /app/dist/main.cjs main.js

CMD ["node", "main.js"]
