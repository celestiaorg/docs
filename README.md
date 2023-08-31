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

## Versioning 1️⃣

In order to version the docs site and API docs in their entirety, you will need to do a few things.

1. change into the `docs/` repository
2. Replace `v0.11.0-rc9` with your desired version of `celestia-node`.
Then, run the following to create a new version of the documentation:

```bash
yarn docusaurus docs:version your-new-version
```

3. In `docs/src/theme/Navbar/Content/index.js` add your new version to line 55:

Change this:

```js
const versions = ['v0.11.0-rc8', 'Next'];
```

To this:

```js
const versions = ['your-new-version', 'v0.11.0-rc8', 'Next'];
```

4. Do the same thing in `docs/src/theme/Navbar/MobileSidebar/PrimaryMenu/index.js` on line 24:

```js
const versions = ['your-new-version', 'v0.11.0-rc8', 'Next']; 
```

5. Next, in your newly released version, you'll need to update the API page and links.

In `docs/versioned_docs/your-new-version/developers/node-api.md`, edit line 11:

```md
can be found [here](/api/next).
```

Change the above to:

```md
can be found [here](/api/your-new-version).
```

6. In the `docs/versioned_docs/your-new-version/developers/node-tutorial.mdx` page,

Change this:

```md
## RPC CLI guide

This section of the tutorial will teach you how to interact with a
Celestia node's
[RPC (Remote Procedure Call) API](/api/next).

[...]

Read more about shares in the [Celestia Specs](/api/next/#share).
```

To this:

```md
## RPC CLI guide

This section of the tutorial will teach you how to interact with a
Celestia node's
[RPC (Remote Procedure Call) API](/api/your-new-version).

[...]

Read more about shares in the [Celestia Specs](/api/your-new-version/#share).
```

7. Change the path in the `docs/versioned_docs/version-v0.11.0-rc8-arabica-improvements/developers/overview.md` page.

Change this:

```md
* An overview of [the Celestia node API](../../developers/node-api/)
  * [Node API docs](/api/next)
  * How to use the [Celestia node RPC API](../../developers/node-tutorial/)
```

To this:

```md
* An overview of [the Celestia node API](../../developers/node-api/)
  * [Node API docs](/api/your-new-version)
  * How to use the [Celestia node RPC API](../../developers/node-tutorial/)
```

8. Next, change the linked API in `docs/versioned_sidebars/version-your-new-version-sidebars.json`

Change this:

```json
        {
          "type": "link",
          "label": "Celestia Node API",
          "href": "/api/next"
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

Paste that into `docs/src/pages/api/next.js` and remove the first line of output from the terminal. Save the file as `docs/src/pages/api/your-new-version.js`.

Now, modify the filename of `docs/src/openrpc-spec/openrpc-next.json` to
`docs/src/openrpc-spec/openrpc-your-new-version.json` and create a placeholder for
the next version at `docs/src/openrpc-spec/openrpc-next.json`.

10. Duplicate `docs/src/pages/api/next.js` and change the name of the new version to `docs/src/pages/api/your-new-version.js`. Change the import in the newly named file to what you created above:

```js
    import(`@site/src/openrpc-spec/openrpc-your-new-version.json`)
```

11. Start your newly versioned site to reflect the latest versioning changes!