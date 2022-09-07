# Full Stack Modular Blockchain Development with Celestia

In this guide you’ll learn what modular blockchains like Celestia are, their benefits, and how they work. We’ll then build a full stack modular dapp with React, Vite, Rainbowkit, Celestia, and Foundry.

*The final codebase for this project is located [here](https://github.com/dabit3/full-stack-modular-blockchain-development).*

# Scalability challenges

Blockchain architectures as they exist today are inherently not scalable.

To scale, blockchains must increase the number of transactions they can process while still remaining performant and decentralized (enabling average users to verify the chain).

High and unstable gas costs are also prohibitive for a large number of use cases, preventing many users around the world from participating in web3 or interacting with dapps.

For blockchains and web3 to reach mass adoption, challenges around both scalability and accessibility have to be solved.

## Evolution of blockchains

Blockchains have evolved over time from application-specific networks like Bitcoin to shared smart contract platforms like Ethereum, which allow developers to deploy their own applications with business logic and state, without having to bootstrap their own blockchain from scratch.

# Modular blockchains

What we're seeing happen now is another paradigm shift. We're moving away from monolithic designs to modular designs, where execution is separated from data availability and consensus (like Eth2 and Celestia).

Most blockchain architectures today are *monolithic* - they are responsible for all four core functions of a blockchain:

- ***Execution*** - executing transactions that update the state correctly. Thus, execution must ensure that only valid transactions are executed, i.e., transactions that result in valid state machine transitions.
- ***Settlement*** - an environment for execution layers to verify proofs, resolve fraud disputes, and bridge between other execution layers.
- ***Consensus*** - agreeing on the order of the transactions.
- **[Data Availability**](https://coinmarketcap.com/alexandria/article/what-is-data-availability) (DA) - making the transaction data available. Note that execution, settlement, and consensus require DA.

*Modular blockchains decouple these functions among multiple specialized layers, and only specialize in only a few functions, rather than all of them.*

## Scalability

Modular blockchains achieve scalability in a few different ways.

### Block size

At Celestia’s center is a core mathematical primitive: [data availability sampling.](https://twitter.com/nickwh8te/status/1559977957195751424) 

Data Availability Sampling enables Celestia Light Nodes to provide almost the same security guarantees as a full node. As the light node count increases, the block size can be increased linearly to its growth.

Now the only limit for block size (throughput) is the number of light nodes in the network.

This primitive allows Celestia to be *the first blockchain that can scale its block size with the number of users*.

### Specialization

Because of the decoupling of functionality, each layer can specialize in one or many of the core functions of a blockchain.

This allows each layer to focus on becoming the most optimal at its use case without the limitations of the requirement of interoperability with other layers.

When the components become modular, those using or building the system don’t have to know or care about everything. They only have to care about a subset of the features. Specialization is the way to ensure maximum focus, performance, and capacity.

### Resource Pricing

By decoupling consensus from execution, Celestia can have much more efficient resource pricing than monolithic chains. Transactions published to the network can be charged purely based on the size of the data being submitted.

State growth and historical data are treated separately in Celestia. Celestia only stores historical data from rollups (measured and paid in bytes), while rollups handle and meter their own state execution.

This enables completely separate fee markets for execution and data availability, allowing fundamentally orthogonal resources to be priced by the market independently, resulting in more accurate and flexible pricing.

This means that spikes of higher throughput in one environment cannot affect another, separate layer.

## Shared execution and monolithic blockchains

Most blockchains share execution with countless other applications and users of those applications.

![Screen Shot 2022-08-15 at 3.33.06 PM.png](/img/shared-execution.png)

If you compare this to how scalability is achieved in the traditional tech stack, where applications have their own servers or run their own "serverless" infrastructure that spins up a dedicated execution environment / container specifically for that individual application, the bottleneck becomes pretty clear.

Scalability can typically be achieved in [two ways - horizontal and vertical scaling](https://stackoverflow.com/questions/11707879/difference-between-scaling-horizontally-and-vertically-for-databases#answer-11715598).

Applications on traditional tech infrastructure can handle tens of millions of interactions per second by scaling both horizontally as well as vertically, while blockchains have struggled to reach thousands of transactions per second while still remaining decentralized.

In addition to scaling the protocol itself (vertical), Celestia enables horizontal scalability. Developers can launch their own application-specific chains as rollups, similar to how [Cosmos Zones](https://v1.cosmos.network/resources/faq) enable developers to deploy their own application-specific blockchains.

Modular blockchains are a paradigm shift in blockchain design that aim to solve the challenges around both scalability as well as accessibility, opening the door to a larger number of use cases, and ultimately enabling web3 to reach mass adoption.

# Building on Celestia

There are a handful of ways developers can build on Celestia.

## Smart contracts

The easiest way to get started will be to deploy a smart contract to a rollup chain already running on Celestia.

The barrier to entry is low in that you can use your existing skillet without having to learn anything new.

You can write any language and use any execution environment you’d like, including Solidity or Vyper and the EVM or Cosmos and Go.

*This is the approach we’ll be taking in this guide.*

## Sovereign rollups

One of the most powerful value propositions of Celestia is the idea of [Sovereign Chains](https://blog.celestia.org/sovereign-rollup-chains/).

Rollups on Ethereum are effectively ‘baby chains’ to Ethereum because Ethereum is responsible for validating their transactions. This makes them tightly linked.

Celestia enables a new type of rollup: sovereign rollup chains. These are independent chains that are similar to an independent L1.

## **Execution Layers**

Unlike Ethereum, Celestia has no enshrined settlement layer built in. Instead, there will be various settlement layers available to enable developers to easily deploy their own rollup or application-specific chain to Celestia.

## Celestiums (Ethereum)

[Celestiums](https://blog.celestia.org/celestiums/) allow developers to deploy a to a rollup using Celestia as DA and Ethereum as settlement.

Ethereum rollups batch data from multiple transactions into a single transaction. This rollup transaction data (calldata) is posted to Ethereum but not executed directly.

A Celestium is an L2 chain that uses Ethereum for settlement plus dispute resolution, and  Celestia for data availability.

This provides high throughput data availability for Ethereum L2s with a higher level of security than other off-chain data availability techniques.

# Getting started

Now that you’ve had an overview of what Celestia is, let’s start building!

The execution environment that we’ll be leveraging today is Troy, an EVM-compatible testnet deployed to Celestia.

**Pre-requisites**

- [Node.js](https://github.com/nvm-sh/nvm)
- [Foundry](https://github.com/foundry-rs/foundry)
- Tokens from the Troy testnet faucet (Insert link)
- [Infura account](https://infura.io/) (for uploading files to IPFS)

## Project setup

To get started, create a new Foundry project:

```bash
forge init celestia-app
cd celestia-app
```

Foundry has created an example smart contract located at `src/Contract.sol`.

### Updating the contract and tests

Let's update the contracts to include a basic counter example. Create a new file in the `src` directory named `Counter.sol` and add the following code:

```solidity
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

Next, let's create a test for this contract.

Open `test/Contract.T.Sol` and update the code with the following:

```solidity
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

Foundry uses [Dappsys Test](https://book.getfoundry.sh/reference/ds-test.html) to provide basic logging and assertion functionality. It's included in the Forge Standard Library.

Here, we are using `assertEq` to assert equality. You can view all of the assertion functions available [here](https://book.getfoundry.sh/reference/ds-test.html?highlight=log_int#asserting).

### Running the test

We can now run our tests to make sure our contract is working properly:

```bash
forge test -vv
```

### Updating the deployment script

Now that we've tested the contract, let's try deploying it locally using [Solidity Scripting](https://book.getfoundry.sh/tutorials/solidity-scripting.html).

To do so, update the deloyment script at `script/Contracts.s.sol` with the following code:

```solidity
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

Now we can use this script to deploy our smart contract to either a live or test network.

### Deploying locally

Next start Anvil, the local testnet:

```bash
anvil
```

Once started, Anvil will give you a local RPC endpoint as well as a handful of Private Keys and Accounts that you can use.

We can now use the local RPC along with one of the private keys to deploy locally:

```bash
forge script script/Contract.s.sol:ContractScript --fork-url \
http://localhost:8545 --private-key $PRIVATE_KEY --broadcast
```

Once the contract has been deployed locally, Anvil will log out the contract address.

**Take a note of this local contract address as we’ll be using it later in the frontend application.**

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

```
cast call $CONTRACT_ADDRESS "fetchPosts()"
```

### Deploying to Troy

Now that we've deployed and tested locally, we can deploy to the Celestia Troy testnet.

> Be sure to be using the private key for the account which holds the test
tokens requested from the faucet.
> 

To do so, run the following script:

```
forge script script/Contract.s.sol:ContractScript \
--rpc-url http://35.208.160.145:8545 --private-key $PRIVATE_KEY --broadcast
```

Once the contract is deployed successfully, **take a note of the contract address as we’ll also be needing it in just a moment when we test the live contract**.

## Building the frontend

For the frontend project, we’ll be using the following libraries and frameworks:

[React](https://reactjs.org/) - JavaScript library for building user interfaces

[Vite](https://vitejs.dev/) - Project generator / rapid development tool for modern web projects

[Rainbowkit](https://www.rainbowkit.com/) - Easy and beautifl library to connect a wallets

[WAGMI](https://github.com/wagmi-dev/wagmi) - 20+ hooks for working with wallets, ENS, contracts, transactions, signing, etc

In the root of the Foundry project, create a new Next.js application using [Vite](https://vitejs.dev/):

```jsx
yarn create vite

? Project name: › app
? Select a framework › React
? Select a variant > JavaScript
```

Next, copy the ABI that was created by Foundry into the app directory so that we can have it later (or manually copy it into a file named `Blog.json` in the `app` directory):

```bash
cp out/Contract.sol/Blog.json app/
```

Now, change into the `app` directory and install the `node_modules`:

```jsx
cd app
npm install
```

Now that the project is created, let’s install the additional dependencies using either **NPM**, **Yarn**, or **PNPM**:

```jsx
npm install @rainbow-me/rainbowkit wagmi ethers ipfs-http-client react-markdown
```

### Configuring environment variables

Next we need to configure the environment variables for the Infura project ID and secret.

Create a file named `.env.local` in the `app` directory and add the following configuration with your own credentials:

```jsx
VITE_INFURA_ID=your-project-id
VITE_INFURA_SECRET=your-project-secret
```

## Configuring the entrypoint

Next we’ll update the entrypoint at `src/main.jsx`.

The main things we’re doing here have to do with the configuration of Rainbowkit so that we can have a nice way for the user to connect their wallet.

Rainbowkit also allows a customizable array of network providers, so we’re creating a new network configuration for `Troy` and including it in the array along with `localhost`.

```jsx 
/* src/index.jsx */
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
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

/* create configuration for Troy testnet */
const troy = {
  id: 69420,
  name: 'Troy',
  network: 'troy',
  nativeCurrency: {
    decimals: 18,
    name: 'Troy',
    symbol: 'TROY',
  },
  rpcUrls: {
    default: 'http://35.208.160.145:8545/'
  }
};

const { chains, provider } = configureChains(
  [chain.localhost, troy],
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

## Creating and reading posts

Now that the the base configuration is set up we’ll create a view that allows users to create and view posts.

We’ll be using IPFS to upload the content of the post, then anchoring the hash of the post on chain. When we retrieve the post, we can then read the value from IPFS to view the post.

Update App.jsx with the following code:

```jsx
/* src/App.jsx */
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

const contractAddress = "your-local-contract-addresss"

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
      id: d['id'].toString()
    }))

    /* we then fetch the post content from IPFS and add it to the post objects */
    data = await Promise.all(data.map(async d => {
      const endpoint = `https://infura-ipfs.io/ipfs/${d.content}`
      const response = await fetch(endpoint)
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
      <ConnectButton />
      <div>
        <button onClick={() => toggleView('view-posts')} style={buttonStyle}>View Posts</button>
        <button  onClick={() => toggleView('create-post')} style={buttonStyle}>Create Post</button>
      </div>
      {
        viewState === 'view-posts' && (
          <div style={postContainerStyle}>
            <h2>Posts</h2>
            {
              posts.map((post, index) => (
                <div key={index}>
                  <h4>{post.title}</h4>
                  <ReactMarkdown>
                   {post.postContent}
                  </ReactMarkdown>
                </div>
              ))
            }
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
  width: '900px',
  margin: '0 auto',
}

const formContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
}

const inputStyle = {
  width: '400px',
  marginBottom: '10px',
  padding: '10px',
}

const postContainerStyle = {}

const buttonStyle = {
  marginTop: 15,
  marginRight: 5,
  border: '1px solid rgba(255, 255, 255, .2)'
}

export default App
```

## Testing it out locally

Now we’re ready to run the app.

Right now, the app is configured to be using `[localhost](http://localhost)` using the test account created by Foundry and Anvil.

To use the test account, import the first private key given to you in the output when you ran the `anvil` command. This will be the account from which the program was deployed.

Once you’ve imported the account, switch your wallet to `[localhost](http://localhost).`

Next, run the React application:

```bash
npm run dev
```

## Testing it out on Troy

Next, let’s run it on Troy testnet.

To do so, first update the `contractAddress` variable with the contract address deployed to Troy:

```jsx
/* src/App.jsx */
const contractAddress = "your-troy-contract-address"
```

Next, swap your wallet connect to the Troy testnet.

When you run the app, you should now be connected to and using the Troy testnet. 

## Next ste