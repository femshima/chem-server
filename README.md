# chem-server

Dockerizing computer chemistry

## Prerequisites

- A linux computer to execute calculation(Server)
  - Required: Docker
  - GAMESS docker image takes a few gigabytes of storage
  - note: If you don't use Intel CPU, the calculation may be unstable.
- A windows computer to order calculation(Client)
  - Required: Node.js(16 or 18), pnpm

## Setup(Server)

These steps are for the computer where the actual calculation is done.

1. Clone this repository
1. Build computer chemistry softwares
   - GAMESS: See [Setup GAMESS](#setup-gamess)
1. Go to `server`

   ```bash
   cd ./server
   ```

1. Create `.env` and write `API_KEY`

   ```bash
   nano .env
   ```

   ```conf
   API_KEY=keyboard_cat
   ```

   - note 1: The `API_KEY` is transferred without encryption. Do not trust the authentication. DO NOT EXPOSE THIS SERVER TO THE INTERNET.
   - note 2: Use random string instead of `keyboard_cat`.

1. Run `docker compose up -d`

   ```bash
   docker compose up -d
   ```

## Setup GAMESS

1. Get GAMESS source code for linux, and place it under `./gamess`(it should look like `./gamess/gamess-current.tar.gz`)
1. Get latest OpenBLAS source code, and place it under `./gamess`(it should look like `./gamess/OpenBLAS-0.3.21.tar.gz`)
1. Build docker image(This will take few minutes, depending on your machine spec)

   ```bash
   docker build gamess -t gamess --build-arg OPENBLAS=<The version of OpenBLAS you want to use(for example, 0.3.21)>
   ```

## Setup(Client)

1. Clone this repository
1. Go to `client`

   ```bash
   cd ./client
   ```

1. Create `.env` and write `API_KEY` and `API_ENDPOINT`.
   `API_KEY` should be same as you set in the server,
   and `API_ENDPOINT` is the url to your server.

   ```bash
   nano .env
   ```

   ```conf
   API_KEY=keyboard_cat
   API_ENDPOINT=http://192.168.1.5:3000
   ```

1. Run `pnpm build`

   ```bash
   pnpm build
   ```

1. Setup your calculation script to use `./client/rungms.bat` instead of the actual `rungms`
1. If this doesn't work, please check your server's firewall settings, etc.
