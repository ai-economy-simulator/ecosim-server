# AI Economy Simulator

Game Server and AI engine for the project.

## Development Setup

1. Fork and Clone the repository locally.

1. Install `Node.js v20`, preferable using Node Version Manager (`nvm`). After installing `nvm`, you can run `nvm install --lts` to do that. Then, run `nvm use --lts` to switch to the correct version.

1. Run `npm i` to install all the required dependencies.

1. Create a file `.env.development` in the root directory of the project with the following contents. Do get your own OpenAI API Key by creating an account of their platform https://help.openai.com/en/articles/4936850-where-do-i-find-my-api-key

```
PLAYER_CHANCE_LENGTH=5000

OPENAI_API_KEY=<<Your API Key>>

OPENAI_MODEL=gpt-3.5-turbo-1106
OPENAI_RUN_POLLING_INTERVAL=500
OPENAI_RUN_POLLING_TIMEOUT=5000
```

1. Run `npm start`. Once the server starts, open localhost with the correct port in the browser. Most probably, it would be `http://localhost:2567`.

1. Use `http://localhost:2567` for client playground and `http://localhost:2567/colyseus` for monitor.

## Contributing Guidelines

1. Raise PRs only to the `main` branch.

1. There is a pre-commit hook for `prettier`. Please honor it, and report a bug if it does not execute automatically.

1. Resolve all merge conflicts unless states otherwise.

## Special Credits

This project has been created using [⚔️ `colyseus`](https://github.com/colyseus/colyseus) - Multiplayer Framework for Node.js
