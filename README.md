# Celestia Docs Page

Celestia Docs is built using [Docusaurus 2](https://docusaurus.io), a modern static website generator.
Learn more in the
[Docusaurus Documentation](https://docusaurus.io/docs).

## Installation 🛠️

```sh
yarn
```

## Local Development 🖥️

```sh
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build 👷‍♀️

```sh
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Lint 🔎

```sh
yarn lint-check
```

This command checks for wrong formatting in `.md` and `.mdx` files using Prettier.

## Format 📝

```sh
npx lint-staged
```

This command will format `.md` and `.mdx` files with Prettier that are in staging area.

Please note that `npx lint-staged` only works for the files that are in the
staging area. If a file is not formatted and not in the staging area, you will
need to add the unformatted file to the staging area first using `git add <file>`,
then you can run `npx lint-staged`. This command will then format the files that are in the staging area.

## Deployment 🚀

Using SSH:

```sh
USE_SSH=true yarn deploy
```

Not using SSH:

```sh
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
