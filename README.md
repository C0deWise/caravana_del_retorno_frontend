## Getting Started
### Node.js
In order to run next.js applications is necessary node.js with npm:
- Download here [node.js](https://nodejs.org/en/download/).
- Don't forget add it to the path during installation.
- Version min 20.9.0

You can also use [nvm](https://github.com/nvm-sh/nvm) to manage node versions:
- Install nvm: `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash`
- Install node: `nvm install 20.9.0`
- Use node: `nvm use 20.9.0`

### Dependencies
To install for first time the dependencies run:
```bash
npm install
```

### Start server
Once dependencies installed, to decrypt the .env file and startup the server run:
```bash
npm run dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the webpage.
