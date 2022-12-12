---
sidebar_label: Full Stack Modular Blockchain Development Guide
---

# Full Stack Modular Blockchain Development Guide

This guide will introduce you to
[modular blockchains](../concepts/how-celestia-works/introduction.md) like
Celestia, explain their benefits, and show you how to build a full stack
modular dapp with React, Vite, RainbowKit, Celestia, and Foundry.

Current blockchain architectures are not scalable and face challenges
around accessibility. In order for blockchains and web3 to reach mass
adoption, these challenges must be addressed.

Blockchains have evolved over time from application-specific networks like
Bitcoin to shared smart contract platforms like Ethereum. This guide will
cover how to build dapps on these newer, shared platforms.

If you're interested in learning more about modular blockchains, or are new
to the Celestia ecosystem, we recommend you read the
[Build Modular](./build-modular.md) page first.

## Getting started

Now that you’ve had an overview of what Celestia is, let’s start building!

The execution environment that we’ll be leveraging today is Ethermint, an
EVM-compatible testnet that you will run locally for this tutorial.

### Pre-requisites

- [Node.js](https://github.com/nvm-sh/nvm)
- [Foundry](https://github.com/foundry-rs/foundry)
- [Infura account](https://infura.io/) (for uploading files to IPFS)
- [A Celestia Light Node running](./node-tutorial.mdx) (to post PFDs from your
rollup)
- [Ethermint Tutorial](./ethermint.md) (for running your own Ethermint rollup &
deploying your smart contract)
- [MetaMask wallet](https://metamask.io) (for connecting to your Ethermint Rollup)

### Project setup

To get started, create a new Foundry project:

```bash
forge init celestia-dapp
cd celestia-dapp
```

Foundry has created an example smart contract located at `src/Contract.sol`.

#### Updating the contract and tests

Let's update the contracts to include a basic blog example. Create a new file
in the `src` directory named `Contract.sol` with the following code:

<!-- markdownlint-disable MD013 -->
```solidity title="src/Contract.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

pragma solidity ^0.8.0;

contract Blog {
    string public name;
    address public owner;

    uint private _postId;

    struct Post {
      uint id;
      string title;
      string content;
      bool published;
    }
    /* mappings can be seen as hash tables */
    /* here we create lookups for posts by id and posts by ipfs hash */
    mapping(uint => Post) private idToPost;
    mapping(string => Post) private hashToPost;

    /* events facilitate communication between smart contractsand their user interfaces  */
    /* i.e. we can create listeners for events in the client and also use them in The Graph  */
    event PostCreated(uint id, string title, string hash);
    event PostUpdated(uint id, string title, string hash, bool published);

    /* when the blog is deployed, give it a name */
    /* also set the creator as the owner of the contract */
    constructor(string memory _name) {
        name = _name;
        owner = msg.sender;
    }

    /* updates the blog name */
    function updateName(string memory _name) public {
        name = _name;
    }

    /* transfers ownership of the contract to another address */
    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }

    /* fetches an individual post by the content hash */
    function fetchPost(string memory hash) public view returns(Post memory){
      return hashToPost[hash];
    }

    /* creates a new post */
    function createPost(string memory title, string memory hash) public onlyOwner {
        _postId = _postId + 1;
        Post storage post = idToPost[_postId];
        post.id = _postId;
        post.title = title;
        post.published = true;
        post.content = hash;
        hashToPost[hash] = post;
        emit PostCreated(_postId, title, hash);
    }

    /* updates an existing post */
    function updatePost(uint postId, string memory title, string memory hash, bool published) public onlyOwner {
        Post storage post =  idToPost[postId];
        post.title = title;
        post.published = published;
        post.content = hash;
        idToPost[postId] = post;
        hashToPost[hash] = post;
        emit PostUpdated(post.id, title, hash, published);
    }

    /* fetches all posts */
    function fetchPosts() public view returns (Post[] memory) {
        uint itemCount = _postId;

        Post[] memory posts = new Post[](itemCount);
        for (uint i = 0; i < itemCount; i++) {
            uint currentId = i + 1;
            Post storage currentItem = idToPost[currentId];
            posts[i] = currentItem;
        }
        return posts;
    }

    /* this modifier means only the contract owner can */
    /* invoke the function */
    modifier onlyOwner() {
      require(msg.sender == owner);
    _;
  }
}
```
<!-- markdownlint-enable MD013 -->

Next, let's create a test for this contract.

Open `test/Contract.t.sol` and update the code with the following:

```solidity title="test/Contract.t.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "src/Contract.sol";

contract ContractTest is Test {
    Blog blog;

    function setUp() public {
        blog = new Blog("Celestia Blog");
    }

    function testCreatePost() public {
        blog.createPost("My first post", "12345");
        Blog.Post[] memory posts = blog.fetchPosts();
        assertEq(posts.length, 1);
    }

    function testUpdatePost() public {
        blog.createPost("My first post", "12345");
        blog.updatePost(1, "My second post", "12345", true);
        Blog.Post memory updatedPost = blog.fetchPost("12345");
        assertEq(updatedPost.title, "My second post");
    }

    function testFetchPosts() public {
        Blog.Post[] memory posts = blog.fetchPosts();
        assertEq(posts.length, 0);
        blog.createPost("My first post", "12345");
        posts = blog.fetchPosts();
        assertEq(posts.length, 1);
    }

    function testOnlyOwner() public {
        blog.createPost("My first post", "12345");
        address bob = address(0x1);
        vm.startPrank(bob);
        vm.expectRevert();
        blog.updatePost(1, "My second post", "12345", true);
    }
}
```

Foundry uses [Dappsys Test](https://book.getfoundry.sh/reference/ds-test.html)
to provide basic logging and assertion functionality. It's included in the Forge
Standard Library.

Here, we are using `assertEq` to assert equality. You can view all of the
assertion functions available [here](https://book.getfoundry.sh/reference/ds-test.html?highlight=log_int#asserting).

#### Running the test

We can now run our tests to make sure our contract is working properly:

```bash
forge test -vv
```

#### Updating the deployment script

Now that we've tested the contract, let's try deploying it locally using
[Solidity Scripting](https://book.getfoundry.sh/tutorials/solidity-scripting.html).

To do so, update the deloyment script at `script/Contracts.s.sol` with the
following code:

```solidity title="script/Contracts.s.sol"
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {Blog} from "src/Contract.sol";

contract ContractScript is Script {
    function setUp() public {}

    function run() public {
        vm.startBroadcast();
        new Blog("Celestia Blog");
        vm.stopBroadcast();
    }
}
```

Now we can use this script to deploy our smart contract to either a live or test
network.

#### Deploying locally

Next start Anvil, the local testnet:

```bash
anvil --port 9545
```

Once started, Anvil will give you a local RPC endpoint as well as a handful of
Private Keys and Accounts that you can use.

We can now use the local RPC along with one of the private keys to deploy locally:

```bash
forge script script/Contract.s.sol:ContractScript --fork-url \
http://localhost:9545 --private-key $PRIVATE_KEY --broadcast
```

Once the contract has been deployed locally, Anvil will log out the contract address.

**Take a note of this local contract address as we’ll be using it later in the
frontend application.**

Next, set the contract address as an environment variable:

```bash
export CONTRACT_ADDRESS=<contract-address>
```

We can then test sending transactions to it with `cast send`.

```bash
cast send $CONTRACT_ADDRESS \
"createPost(string,string)" "my first post" "12345" \
--private-key $PRIVATE_KEY
```

We can then perform read operations with `cast call`:

```bash
cast call $CONTRACT_ADDRESS "fetchPosts()"
```

Once the contract is deployed successfully, **take a note of the contract
address as we’ll also be needing it in just a moment when we test the live contract**.

### Deploying to the Ethermint Sovereign Rollup

First, we will need to follow the setup from the [Ethermint tutorial](./ethermint).

> It is required that you complete [dependency setup](./ethermint-dependencies)
and [RollKit installation](http://localhost:3000/developers/rollmint-on-ethermint)
and
[Instantiating and Ethermint rollup](http://localhost:3000/developers/instantiate-ethermint).

Now that we've deployed and tested locally, we can deploy to our
Ethermint chain.

First, we will need to export the private key generated by
the ethermint `init.sh` script:

```bash
PRIVATE_KEY=$(ethermintd keys unsafe-export-eth-key mykey --keyring-backend test)
```

> NOTE: Here, the key name from `init.sh` is `mykey` but you can modify
  the `init.sh` to change the name of your key.

Now, we can start deploying the smart contract to our Ethermint chain.

To do so, run the following script in the `celestia-dapp` directory:

```bash
forge script script/Contract.s.sol:ContractScript \
--rpc-url http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
```

Set the contract address in the output as the `CONTRACT_ADDRESS` variable:

```bash
export CONTRACT_ADDRESS=<new-contract-address>
```

Once the contract has been deployed to the Ethermint rollup, we can
use `cast send` to test sending transactions to it:

```bash
cast send $CONTRACT_ADDRESS \
"createPost(string,string)" "my first post" "12345" \
--rpc-url http://localhost:8545 --private-key $PRIVATE_KEY
```

We can then perform read operations with `cast call`:

```bash
cast call $CONTRACT_ADDRESS "fetchPosts()" --rpc-url http://localhost:8545
```

### Building the frontend

For the frontend project, we’ll be using the following libraries and frameworks:

[React](https://reactjs.org/) - JavaScript library for building user interfaces

[Vite](https://vitejs.dev/) - Project generator / rapid development tool for
modern web projects

[Rainbowkit](https://www.rainbowkit.com/) - Easy and beautifl library to connect
a wallets

[WAGMI](https://github.com/wagmi-dev/wagmi) - 20+ hooks for working with
wallets, ENS, contracts, transactions, signing, etc

In the root of the Foundry project, create a new Next.js application using [Vite](https://vitejs.dev/):

```jsx
yarn create vite

? Project name: › frontend
? Select a framework › React
? Select a variant > JavaScript
```

Next, copy the ABI that was created by Foundry into the `frontend` directory so
that we can have it later (or manually copy it into a file named `Blog.json` in
the `frontend` directory):

```bash
cp out/Contract.sol/Blog.json frontend/
```

Now, change into the `frontend` directory and install the `node_modules`:

```jsx
cd frontend
npm install
```

#### Configuring environment variables

Next we need to configure the environment variables for the Infura project ID
and secret.

Create a file named `.env.local` in the `app` directory and add the following
configuration with your own credentials:

```env title="frontend/.env.local"
VITE_INFURA_ID=your-project-api-key
VITE_INFURA_SECRET=your-project-api-key-secret
```

Now that the project is created, let’s install the additional dependencies using
either **NPM**, **Yarn**, or **PNPM**:

```jsx
npm install @rainbow-me/rainbowkit wagmi ethers ipfs-http-client react-markdown
```

### Configuring the entrypoint

Next we’ll update the entrypoint at `src/main.jsx`.

The main things we’re doing here have to do with the configuration of Rainbowkit
so that we can have a nice way for the user to connect their wallet.

Rainbowkit also allows a customizable array of network providers, so we’re
creating a new network configuration for `Ethermint`.

```tsx title="frontend/src/main.jsx"
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

/* create configuration for Ethermint testnet */
const ethermint = {
  id: 9000,
  name: 'Evmos Testnet',
  network: 'Evmos Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Evmos Testnet',
    symbol: 'tEVMOS',
  },
  rpcUrls: {
    default: 'http://159.65.252.178:8545/'
  }
};

const { chains, provider } = configureChains(
  [ethermint],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Celestia App',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

const containerStyle = {
  width: '900px',
  margin: '0 auto'
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <div style={containerStyle}>
        <App />
      </div>
    </RainbowKitProvider>
  </WagmiConfig>
)
```

### Creating and reading posts

Now that the the base configuration is set up we’ll create a view that allows
users to create and view posts.

We’ll be using IPFS to upload the content of the post, then anchoring the hash
of the post on chain. When we retrieve the post, we can then read the value from
IPFS to view the post.

Update App.jsx with the following code:

<!-- markdownlint-disable MD013 -->
```tsx title="frontend/src/App.jsx"
import { useState, useEffect } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers'
import { create } from 'ipfs-http-client'
import { Buffer } from 'buffer'
import Blog from '../Blog.json'

/* configure authorization for Infura and IPFS */
const auth =
    'Basic ' + Buffer.from(import.meta.env.VITE_INFURA_ID + ':' + import.meta.env.VITE_INFURA_SECRET).toString('base64');
    
/* create an IPFS client */
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
      authorization: auth,
  },
});

const contractAddress = "your-ethermint-contract-address"

function App() {
  useEffect(() => {
    fetchPosts()
  }, [])
  const [viewState, setViewState] = useState('view-posts')
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  /* when the component loads, useEffect will call this function */
  async function fetchPosts() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const contract = new ethers.Contract(contractAddress, Blog.abi, provider)
    let data = await contract.fetchPosts()
    /* once the data is returned from the network we map over it and */
    /* transform the data into a more readable format  */
    data = data.map(d => ({
      content: d['content'],
      title: d['title'],
      published: d['published'],
      id: d['id'].toString(),
    }))

    /* we then fetch the post content from IPFS and add it to the post objects */
    data = await Promise.all(data.map(async d => {
      const endpoint = `https://infura-ipfs.io/ipfs/${d.content}`
      const options = {
        mode: 'no-cors',
      }
      const response = await fetch(endpoint, options)
      const value = await response.text()
      d.postContent = value
      return d
    }))

    setPosts(data)
  }

  async function createPost() {
    const added = await client.add(content)
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()

    const contract = new ethers.Contract(contractAddress, Blog.abi, signer)
    const tx = await contract.createPost(title, added.path)
    await tx.wait()
    setViewState('view-posts')
  }

  function toggleView(value) {
    setViewState(value)
    if (value === 'view-posts') {
      fetchPosts()
    }
  }
  
  return (
    <div style={outerContainerStyle}>
      <div style={innerContainerStyle}>
      <h1>Modular Rollup Blog</h1>
      <h3 style={{ justifyContent: 'right', textAlign: 'right'}}>Connect your Ethereum wallet to begin ✨</h3>
      <div style={buttonContainerStyle}>
      <ConnectButton />
      </div>
      <div style={buttonContainerStyle}>
        <button onClick={() => toggleView('view-posts')} style={buttonStyle}>View Posts</button>
        <button  onClick={() => toggleView('create-post')} style={buttonStyle}>Create Post</button>
      </div>
      {
        viewState === 'view-posts' && (
          <div>
            <div style={postContainerStyle}>
            <h1>Posts</h1>
            {
              posts.map((post, index) => (
                <div key={index}>
                  <h2>{post.title}</h2>
                  <button style={{ fontSize: '16px' }} onClick={() => window.open(`https://infura-ipfs.io/ipfs/${post.content}`)}>Read on IPFS</button>
                  <p style={mbidStyle}>GMID: {post.id}</p>
                </div>
              ))
            }
          </div>
          </div>
        )
      }
      {
        viewState === 'create-post' && (
          <div style={formContainerStyle}>
              <h2>Create Post</h2>
              <input
                placeholder='Title'
                onChange={e => setTitle(e.target.value)}
                style={inputStyle}
              />
              <textarea
                placeholder='Content'
                onChange={e => setContent(e.target.value)}
                style={inputStyle}
              />
              <button onClick={createPost}>Create Post</button>
          </div>
        )
      }
      </div>
    </div>
  )
}

const outerContainerStyle = {
  width: '100vw',
  height: '100vh',
  padding: '50px 0px'
}

const innerContainerStyle = {
  width: '90%',
  maxWidth: '800px',
  margin: '0 auto',
}

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}

const inputStyle = {
  width: '400px',
  marginBottom: '10px',
  padding: '10px',
  height: '40px',
}

const postContainerStyle = {
  margin: '0 auto',
  padding: '1em',
  width: '90%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
}

const mbidStyle = {
  fontSize: '10px',
  textAlign: 'start',
}

const buttonStyle = {
  marginTop: 15,
  marginRight: 5,
  border: '1px solid rgba(255, 255, 255, .2)'
}

const buttonContainerStyle = {
  marginTop: 15,
  marginRight: 5,
  display: 'flex',
  justifyContent: 'right',
}

export default App
```
<!-- markdownlint-enable MD013 -->

### Testing it out on Ethermint

Now we’re ready to run the app.

Right now, the app is configured to be using `localhost:8545` using the
Ethermint rollup we're running with RollKit.

First, you'll need to install [MetaMask](https://metamask.io).

To use the test account, you will need to import the private key from Ethermint
to MetaMask. First, run the following command:

```bash
PRIVATE_KEY=$(ethermintd keys unsafe-export-eth-key mykey --keyring-backend test)
&& echo $PRIVATE_KEY | pbcopy
```

Now, [import the private key to MetaMask](https://metamask.zendesk.com/hc/en-us/articles/360015489331-How-to-import-an-account#h_01G01W07NV7Q94M7P1EBD5BYM4)
and switch to that account.

Next, run the React application:

```bash
npm run dev
```

Next, let’s run it on your Ethermint rollup.

To do so, first update the `contractAddress` variable with the contract address
deployed to Ethermint:

```jsx
/* src/App.jsx */
const contractAddress = "your-ethermint-contract-address"
```

When you run the app, you should now be connected to and using the Ethermint rollup.
