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

## API documentation versioning

In order to version the API docs, you will need to do a few things.

1. change into the `docs/` repository

2. Replace `your-new-version` with your desired version of `celestia-node`.

3. In `docs/src/theme/Navbar/Content/index.js` add your new version to line 55:

Change this:

```js
const versions = ["v0.11.0-rc8"];
```

To this:

```js
const versions = ["your-new-version", "v0.11.0-rc8"];
```

4. Do the same thing in `docs/src/theme/Navbar/MobileSidebar/PrimaryMenu/index.js` on line 24:

```js
const versions = ["your-new-version", "v0.11.0-rc8"];
```

5. Next, you'll need to update the API page and links.

In `docs/developers/node-api.md`, edit line 11:

```md
can be found [here](/api/v0.11.0-rc8).
```

Change the above to:

```md
can be found [here](/api/your-new-version).
```

6. In the `docs/developers/node-tutorial.mdx` page,

Change this:

```md
## RPC CLI guide

This section of the tutorial will teach you how to interact with a
Celestia node's
[RPC (Remote Procedure Call) API](/api/v0.11.0-rc8).
```

To this:

```md
## RPC CLI guide

This section of the tutorial will teach you how to interact with a
Celestia node's
[RPC (Remote Procedure Call) API](/api/your-new-version).
```

7. Change the path in the `docs/developers/overview.md` page.

Change this:

```md
- [Node API docs](/api/v0.11.0-rc8)
```

To this:

```md
- [Node API docs](/api/your-new-version)
```

8. Next, change the linked API in `sidebars.js`

Change this:

```json
        {
          "type": "link",
          "label": "Celestia Node API",
          "href": "/api/v0.11.0-rc8"
        },
```

To this:

```json
        {
          "type": "link",
          "label": "Celestia Node API",
          "href": "/api/your-new-version"
        },
```

9. Lastly, generate or copy the final openrpc.json for the version that you are using.

```bash
git clone https://github.com/celestia-node.git
cd celestia-node
git checkout tags/your-new-version
make openrpc-gen | pbcopy
```

Paste that into `docs/src/openrpc-spec/openrpc-your-new-version.json`
and remove the first line of output from the terminal.

10. Duplicate `docs/src/pages/api/v0.11.0-rc8.js` and change the name of the new version to `docs/src/pages/api/your-new-version.js`. Change the import in the newly named file to what you created above:

```js
import(`@site/src/openrpc-spec/openrpc-your-new-version.json`);
```

11. Lastly, update the `docs/learn/submit-data.md` to reflect the new version:

Change this:

```md
### RPC to a celestia-node

Using the JSON RPC API, submit data using the following methods:

- [blob.Submit](/api/v0.11.0-rc8/#blob.Submit)
- [state.SubmitPayForBlob](/api/v0.11.0-rc8/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](/api/v0.11.0-rc8).
```

To this:

```md
### RPC to a celestia-node

Using the JSON RPC API, submit data using the following methods:

- [blob.Submit](/api/your-new-version/#blob.Submit)
- [state.SubmitPayForBlob](/api/your-new-version/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](/api/your-new-version).
```

11. Lastly, update the `docs/learn/submit-data.md` to reflect the new version:

Change this:

```md
### RPC to a celestia-node

Using the JSON RPC API, submit data using the following methods:

* [blob.Submit](/api/v0.11.0-rc8/#blob.Submit)
* [state.SubmitPayForBlob](/api/v0.11.0-rc8/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](/api/v0.11.0-rc8).
```

To this:

```md
### RPC to a celestia-node

Using the JSON RPC API, submit data using the following methods:

* [blob.Submit](/api/your-new-version/#blob.Submit)
* [state.SubmitPayForBlob](/api/your-new-version/#state.SubmitPayForBlob)

Learn more in the [celestia-node API docs](/api/your-new-version).
```

12. Start your newly versioned site to reflect the latest versioning changes!
