import{_ as s,o as n,c as a,Q as l}from"./chunks/framework.51d6c45b.js";const o="/img/blobstream/blobstream-square.png",p="/img/blobstream/blobstream-commitment-diagram.png",m=JSON.parse('{"title":"Blobstream proofs queries","description":"Learn how to query the inclusion proofs used in Blobstream","frontmatter":{"description":"Learn how to query the inclusion proofs used in Blobstream","head":[["meta",{"name":"og:title","content":"Blobstream proofs queries | Celestia Docs"},{"name":"og:description","content":false}]]},"headers":[],"relativePath":"developers/blobstream-proof-queries.md","filePath":"developers/blobstream-proof-queries.md","lastUpdated":1708613425000}'),e={name:"developers/blobstream-proof-queries.md"},t=l('<h1 id="blobstream-proofs-queries" tabindex="-1">Blobstream proofs queries <a class="header-anchor" href="#blobstream-proofs-queries" aria-label="Permalink to &quot;Blobstream proofs queries&quot;">​</a></h1><h2 id="prerequisites" tabindex="-1">Prerequisites <a class="header-anchor" href="#prerequisites" aria-label="Permalink to &quot;Prerequisites&quot;">​</a></h2><ul><li>Access to a Celestia <a href="./../nodes/consensus-node">consensus full node</a> RPC endpoint (or full node). The node doesn&#39;t need to be a validating node in order for the proofs to be queried. A full node is enough.</li></ul><h2 id="overview-of-the-proof-queries" tabindex="-1">Overview of the proof queries <a class="header-anchor" href="#overview-of-the-proof-queries" aria-label="Permalink to &quot;Overview of the proof queries&quot;">​</a></h2><p>To prove the inclusion of PayForBlobs (PFB) transactions, blobs or shares, committed to in a Celestia block, we use the Celestia consensus node&#39;s RPC to query for proofs that can be verified in a rollup settlement contract via Blobstream. In fact, when a PFB transaction is included in a block, it gets separated into a PFB transaction (without the blob), and the actual data blob that it carries. These two are split into shares, which are the low level constructs of a Celestia block, and saved to the corresponding Celestia block. Learn more about shares in the <a href="https://celestiaorg.github.io/celestia-app/specs/shares.html" target="_blank" rel="noreferrer">shares specs</a>.</p><p>The two diagrams below summarize how a single share, which can contain a PFB transaction, or a part of the rollup data that was posted using a PFB, is committed to in Blobstream.</p><p>The share is highlighted in green. <code>R0</code>, <code>R1</code> etc, represent the respective row and column roots, the blue and pink gradients are erasure encoded data. More details on the square layout can be found <a href="https://github.com/celestiaorg/celestia-app/blob/v1.1.0/specs/src/specs/data_square_layout.md" target="_blank" rel="noreferrer">in the data square layout</a> and <a href="https://github.com/celestiaorg/celestia-app/blob/v1.1.0/specs/src/specs/data_structures.md#erasure-coding" target="_blank" rel="noreferrer">data structures</a> portion of the specs.</p><h3 id="the-celestia-square" tabindex="-1">The Celestia square <a class="header-anchor" href="#the-celestia-square" aria-label="Permalink to &quot;The Celestia square&quot;">​</a></h3><p><img src="'+o+'" alt="Square"></p><h3 id="the-commitment-scheme" tabindex="-1">The commitment scheme <a class="header-anchor" href="#the-commitment-scheme" aria-label="Permalink to &quot;The commitment scheme&quot;">​</a></h3><p><img src="'+p+`" alt="Blobstream Commitment Diagram"></p><p>So to prove inclusion of a share to a Celestia block, we use Blobstream as a source of truth. Currently, we will be using the Blobstream X implementation of Blobstream, more information on Blobstream X can be found in <a href="./blobstream#blobstream-x">the overview</a>. In a nutshell, Blobstream X attests to the data posted to Celestia in the Blobstream X contract via verifying a zk-proof of the headers of a batch of Celestia blocks. Then, it keeps reference of that batch of blocks using the merkleized commitment of their <code>(dataRoot, height)</code> resulting in a <code>data root tuple root</code>. Check the above diagram which shows:</p><ul><li>0: those are the shares, that when unified, contain the PFB or the rollup data blob.</li><li>1: the row and column roots are the namespace merkle tree roots over the shares. More information on the NMT in the <a href="https://celestiaorg.github.io/celestia-app/specs/data_structures.html?highlight=namespace%20merkle#namespace-merkle-tree" target="_blank" rel="noreferrer">NMT specs</a>. These commit to the rows and columns containing the above shares.</li><li>2: the data roots: which are the binary merkle tree commitment over the row and column roots. This means that if you can prove that a share is part of a row, using a namespace merkle proof. Then prove that this row is committed to by the data root. Then you can be sure that that share was published to the corresponding block.</li><li>3: in order to batch multiple blocks into the same commitment, we create a commitment over the <code>(dataRoot, height)</code> tuple for a batch of blocks, which results in a data root tuple root. It&#39;s this commitment that gets stored in the Blobstream X smart contract.</li></ul><p>So, if we&#39;re able to prove that a share is part of a row, then that row is committed to by a data root. Then, prove that that data root along with its height is committed to by the data root tuple root, which gets saved to the Blobstream X contract, we can be sure that that share was committed to in the corresponding Celestia block.</p><p>In this document, we will provide details on how to query the above proofs, and how to adapt them to be sent to a rollup contract for verification.</p><h2 id="hands-on-demonstration" tabindex="-1">Hands-on demonstration <a class="header-anchor" href="#hands-on-demonstration" aria-label="Permalink to &quot;Hands-on demonstration&quot;">​</a></h2><p>This part will provide the details of proof generation, and the way to make the results of the proofs queries ready to be consumed by the target rollup contract.</p><div class="tip custom-block"><p class="custom-block-title">NOTE</p><p>For the go client snippets, make sure to have the following replaces in your <code>go.mod</code>:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// go.mod</span></span>
<span class="line"><span style="color:#E1E4E8;">    github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">cosmos</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">cosmos</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">sdk </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">celestiaorg</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">cosmos</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">sdk v1.</span><span style="color:#79B8FF;">18.3</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">sdk</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">v0.</span><span style="color:#79B8FF;">46.14</span></span>
<span class="line"><span style="color:#E1E4E8;">    github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">gogo</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">protobuf </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">regen</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">network</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">protobuf v1.</span><span style="color:#79B8FF;">3.3</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">alpha.regen.</span><span style="color:#79B8FF;">1</span></span>
<span class="line"><span style="color:#E1E4E8;">    github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">syndtr</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">goleveldb </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">syndtr</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">goleveldb v1.</span><span style="color:#79B8FF;">0.1</span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">0.20210819022825</span><span style="color:#F97583;">-</span><span style="color:#FDAEB7;font-style:italic;">2ae1ddf74ef7</span></span>
<span class="line"><span style="color:#E1E4E8;">    github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">tendermint</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">tendermint </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> github.com</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">celestiaorg</span><span style="color:#F97583;">/</span><span style="color:#E1E4E8;">celestia</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">core v1.</span><span style="color:#79B8FF;">32.0</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">tm</span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;">v0.</span><span style="color:#79B8FF;">34.29</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// go.mod</span></span>
<span class="line"><span style="color:#24292E;">    github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">cosmos</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">cosmos</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">sdk </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">celestiaorg</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">cosmos</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">sdk v1.</span><span style="color:#005CC5;">18.3</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">sdk</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">v0.</span><span style="color:#005CC5;">46.14</span></span>
<span class="line"><span style="color:#24292E;">    github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">gogo</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">protobuf </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">regen</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">network</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">protobuf v1.</span><span style="color:#005CC5;">3.3</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">alpha.regen.</span><span style="color:#005CC5;">1</span></span>
<span class="line"><span style="color:#24292E;">    github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">syndtr</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">goleveldb </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">syndtr</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">goleveldb v1.</span><span style="color:#005CC5;">0.1</span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">0.20210819022825</span><span style="color:#D73A49;">-</span><span style="color:#B31D28;font-style:italic;">2ae1ddf74ef7</span></span>
<span class="line"><span style="color:#24292E;">    github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">tendermint</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">tendermint </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> github.com</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">celestiaorg</span><span style="color:#D73A49;">/</span><span style="color:#24292E;">celestia</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">core v1.</span><span style="color:#005CC5;">32.0</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">tm</span><span style="color:#D73A49;">-</span><span style="color:#24292E;">v0.</span><span style="color:#005CC5;">34.29</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">)</span></span></code></pre></div><p>Also, make sure to update the versions to match the latest <code>github.com/celestiaorg/cosmos-sdk</code> and <code>github.com/celestiaorg/celestia-core</code> versions.</p></div><h3 id="_1-data-root-inclusion-proof" tabindex="-1">1. Data root inclusion proof <a class="header-anchor" href="#_1-data-root-inclusion-proof" aria-label="Permalink to &quot;1. Data root inclusion proof&quot;">​</a></h3><p>To prove the data root is committed to by the Blobstream X smart contract, we will need to provide a Merkle proof of the data root tuple to a data root tuple root. This can be created using the <a href="https://github.com/celestiaorg/celestia-core/blob/c3ab251659f6fe0f36d10e0dbd14c29a78a85352/rpc/client/http/http.go#L492-L511" target="_blank" rel="noreferrer"><code>data_root_inclusion_proof</code></a> query.</p><p>This <a href="https://github.com/celestiaorg/celestia-core/blob/793ece9bbd732aec3e09018e37dc31f4bfe122d9/rpc/openapi/openapi.yaml#L1045-L1093" target="_blank" rel="noreferrer">endpoint</a> allows querying a data root to data root tuple root proof. It takes a block <code>height</code>, a starting block, and an end block, then it generates the binary Merkle proof of the <code>DataRootTuple</code>, corresponding to that <code>height</code>, to the <code>DataRootTupleRoot</code> which is committed to in the Blobstream X contract.</p><p>The endpoint can be queried using the golang client:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">context</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">fmt</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">os</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	ctx </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#79B8FF;">Background</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	trpc, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> http.</span><span style="color:#79B8FF;">New</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;tcp://localhost:26657&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;/websocket&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(err)</span></span>
<span class="line"><span style="color:#E1E4E8;">		os.</span><span style="color:#79B8FF;">Exit</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">Start</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(err)</span></span>
<span class="line"><span style="color:#E1E4E8;">		os.</span><span style="color:#79B8FF;">Exit</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	dcProof, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">DataRootInclusionProof</span><span style="color:#E1E4E8;">(ctx, </span><span style="color:#79B8FF;">15</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">10</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">20</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(err)</span></span>
<span class="line"><span style="color:#E1E4E8;">		os.</span><span style="color:#79B8FF;">Exit</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(dcProof.Proof.</span><span style="color:#79B8FF;">String</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">context</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">fmt</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">os</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	ctx </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> context.</span><span style="color:#005CC5;">Background</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	trpc, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> http.</span><span style="color:#005CC5;">New</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;tcp://localhost:26657&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;/websocket&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(err)</span></span>
<span class="line"><span style="color:#24292E;">		os.</span><span style="color:#005CC5;">Exit</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">Start</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(err)</span></span>
<span class="line"><span style="color:#24292E;">		os.</span><span style="color:#005CC5;">Exit</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	dcProof, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">DataRootInclusionProof</span><span style="color:#24292E;">(ctx, </span><span style="color:#005CC5;">15</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">10</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">20</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(err)</span></span>
<span class="line"><span style="color:#24292E;">		os.</span><span style="color:#005CC5;">Exit</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(dcProof.Proof.</span><span style="color:#005CC5;">String</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="full-example-of-proving-that-a-celestia-block-was-committed-to-by-blobstream-x-contract" tabindex="-1">Full example of proving that a Celestia block was committed to by Blobstream X contract <a class="header-anchor" href="#full-example-of-proving-that-a-celestia-block-was-committed-to-by-blobstream-x-contract" aria-label="Permalink to &quot;Full example of proving that a Celestia block was committed to by Blobstream X contract&quot;">​</a></h3><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">context</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">fmt</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/celestiaorg/celestia-app/pkg/square</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/accounts/abi/bind</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">ethcmn</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/common</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/ethclient</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">blobstreamxwrapper</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/succinctlabs/blobstreamx/bindings</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/crypto/merkle</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">math/big</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">os</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">verify</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(err)</span></span>
<span class="line"><span style="color:#E1E4E8;">		os.</span><span style="color:#79B8FF;">Exit</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">verify</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	ctx </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#79B8FF;">Background</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// start the tendermint RPC client</span></span>
<span class="line"><span style="color:#E1E4E8;">	trpc, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> http.</span><span style="color:#79B8FF;">New</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;tcp://localhost:26657&quot;</span><span style="color:#E1E4E8;">, </span><span style="color:#9ECBFF;">&quot;/websocket&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">Start</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the PayForBlob transaction that contains the published blob</span></span>
<span class="line"><span style="color:#E1E4E8;">	tx, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">Tx</span><span style="color:#E1E4E8;">(ctx, []</span><span style="color:#79B8FF;">byte</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;tx_hash&quot;</span><span style="color:#E1E4E8;">), </span><span style="color:#79B8FF;">true</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the block containing the PayForBlob transaction</span></span>
<span class="line"><span style="color:#E1E4E8;">	blockRes, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">Block</span><span style="color:#E1E4E8;">(ctx, </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">tx.Height)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// the PayForBlob transaction</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// since BlobstreamX emits events when new batches are submitted,</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// we will query the events</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#E1E4E8;">	ethClient, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethclient.</span><span style="color:#79B8FF;">Dial</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">defer</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// use the BlobstreamX contract binding</span></span>
<span class="line"><span style="color:#E1E4E8;">	wrapper, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamxwrapper.</span><span style="color:#79B8FF;">NewBlobstreamX</span><span style="color:#E1E4E8;">(ethcmn.</span><span style="color:#79B8FF;">HexToAddress</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;contract_Address&quot;</span><span style="color:#E1E4E8;">), ethClient)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	LatestBlockNumber, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">BlockNumber</span><span style="color:#E1E4E8;">(context.</span><span style="color:#79B8FF;">Background</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	eventsIterator, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> wrapper.</span><span style="color:#79B8FF;">FilterDataCommitmentStored</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">bind.FilterOpts{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Context: ctx,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Start: LatestBlockNumber </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">90000</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">			End: </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">LatestBlockNumber,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> event </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamXDataCommitmentStored</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Next</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">		e </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> eventsIterator.Event</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(e.StartBlock) </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> tx.Height </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> tx.Height </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(e.EndBlock) {</span></span>
<span class="line"><span style="color:#E1E4E8;">			event </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamXDataCommitmentStored{</span></span>
<span class="line"><span style="color:#E1E4E8;">				ProofNonce:     e.ProofNonce,</span></span>
<span class="line"><span style="color:#E1E4E8;">				StartBlock:     e.StartBlock,</span></span>
<span class="line"><span style="color:#E1E4E8;">				EndBlock:       e.EndBlock,</span></span>
<span class="line"><span style="color:#E1E4E8;">				DataCommitment: e.DataCommitment,</span></span>
<span class="line"><span style="color:#E1E4E8;">			}</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">break</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Error</span><span style="color:#E1E4E8;">(); err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> event </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> fmt.</span><span style="color:#79B8FF;">Errorf</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;couldn&#39;t find range containing the transaction height&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the block data root inclusion proof to the data root tuple root</span></span>
<span class="line"><span style="color:#E1E4E8;">	dcProof, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">DataRootInclusionProof</span><span style="color:#E1E4E8;">(ctx, </span><span style="color:#79B8FF;">uint64</span><span style="color:#E1E4E8;">(tx.Height), event.StartBlock, event.EndBlock)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// verify that the data root was committed to by the BlobstreamX contract</span></span>
<span class="line"><span style="color:#E1E4E8;">	committed, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">VerifyDataRootInclusion</span><span style="color:#E1E4E8;">(ctx, wrapper, event.ProofNonce.</span><span style="color:#79B8FF;">Uint64</span><span style="color:#E1E4E8;">(), </span><span style="color:#79B8FF;">uint64</span><span style="color:#E1E4E8;">(tx.Height), blockRes.Block.DataHash, dcProof.Proof)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> committed {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;data root was committed to by the BlobstreamX contract&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	} </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;data root was not committed to by the BlobstreamX contract&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">VerifyDataRootInclusion</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">	_ context.Context,</span></span>
<span class="line"><span style="color:#E1E4E8;">	blobstreamXwrapper </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamX,</span></span>
<span class="line"><span style="color:#E1E4E8;">	nonce </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	height </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	dataRoot []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	proof merkle.Proof,</span></span>
<span class="line"><span style="color:#E1E4E8;">) (</span><span style="color:#F97583;">bool</span><span style="color:#E1E4E8;">, </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">	tuple </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamxwrapper.DataRootTuple{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Height:   big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(height)),</span></span>
<span class="line"><span style="color:#E1E4E8;">		DataRoot: </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">[</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">)(dataRoot),</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([][</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, aunt </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">[</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">)(aunt)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	wrappedProof </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamxwrapper.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">		SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Key:       big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Index),</span></span>
<span class="line"><span style="color:#E1E4E8;">		NumLeaves: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Total),</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	valid, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamXwrapper.</span><span style="color:#79B8FF;">VerifyAttestation</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">bind.CallOpts{},</span></span>
<span class="line"><span style="color:#E1E4E8;">		big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(nonce)),</span></span>
<span class="line"><span style="color:#E1E4E8;">		tuple,</span></span>
<span class="line"><span style="color:#E1E4E8;">		wrappedProof,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">false</span><span style="color:#E1E4E8;">, err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> valid, </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">context</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">fmt</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/celestiaorg/celestia-app/pkg/square</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/accounts/abi/bind</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">ethcmn</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/common</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/ethclient</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">blobstreamxwrapper</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/succinctlabs/blobstreamx/bindings</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/crypto/merkle</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">math/big</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">os</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">verify</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(err)</span></span>
<span class="line"><span style="color:#24292E;">		os.</span><span style="color:#005CC5;">Exit</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">verify</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">error</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	ctx </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> context.</span><span style="color:#005CC5;">Background</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// start the tendermint RPC client</span></span>
<span class="line"><span style="color:#24292E;">	trpc, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> http.</span><span style="color:#005CC5;">New</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;tcp://localhost:26657&quot;</span><span style="color:#24292E;">, </span><span style="color:#032F62;">&quot;/websocket&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">Start</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the PayForBlob transaction that contains the published blob</span></span>
<span class="line"><span style="color:#24292E;">	tx, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">Tx</span><span style="color:#24292E;">(ctx, []</span><span style="color:#005CC5;">byte</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;tx_hash&quot;</span><span style="color:#24292E;">), </span><span style="color:#005CC5;">true</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the block containing the PayForBlob transaction</span></span>
<span class="line"><span style="color:#24292E;">	blockRes, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">Block</span><span style="color:#24292E;">(ctx, </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">tx.Height)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// the PayForBlob transaction</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// since BlobstreamX emits events when new batches are submitted,</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// we will query the events</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#24292E;">	ethClient, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethclient.</span><span style="color:#005CC5;">Dial</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">defer</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// use the BlobstreamX contract binding</span></span>
<span class="line"><span style="color:#24292E;">	wrapper, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamxwrapper.</span><span style="color:#005CC5;">NewBlobstreamX</span><span style="color:#24292E;">(ethcmn.</span><span style="color:#005CC5;">HexToAddress</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;contract_Address&quot;</span><span style="color:#24292E;">), ethClient)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	LatestBlockNumber, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">BlockNumber</span><span style="color:#24292E;">(context.</span><span style="color:#005CC5;">Background</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	eventsIterator, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> wrapper.</span><span style="color:#005CC5;">FilterDataCommitmentStored</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">bind.FilterOpts{</span></span>
<span class="line"><span style="color:#24292E;">			Context: ctx,</span></span>
<span class="line"><span style="color:#24292E;">			Start: LatestBlockNumber </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">90000</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">			End: </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">LatestBlockNumber,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> event </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamXDataCommitmentStored</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Next</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">		e </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> eventsIterator.Event</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(e.StartBlock) </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> tx.Height </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> tx.Height </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(e.EndBlock) {</span></span>
<span class="line"><span style="color:#24292E;">			event </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamXDataCommitmentStored{</span></span>
<span class="line"><span style="color:#24292E;">				ProofNonce:     e.ProofNonce,</span></span>
<span class="line"><span style="color:#24292E;">				StartBlock:     e.StartBlock,</span></span>
<span class="line"><span style="color:#24292E;">				EndBlock:       e.EndBlock,</span></span>
<span class="line"><span style="color:#24292E;">				DataCommitment: e.DataCommitment,</span></span>
<span class="line"><span style="color:#24292E;">			}</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">break</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Error</span><span style="color:#24292E;">(); err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> event </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> fmt.</span><span style="color:#005CC5;">Errorf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;couldn&#39;t find range containing the transaction height&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the block data root inclusion proof to the data root tuple root</span></span>
<span class="line"><span style="color:#24292E;">	dcProof, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">DataRootInclusionProof</span><span style="color:#24292E;">(ctx, </span><span style="color:#005CC5;">uint64</span><span style="color:#24292E;">(tx.Height), event.StartBlock, event.EndBlock)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// verify that the data root was committed to by the BlobstreamX contract</span></span>
<span class="line"><span style="color:#24292E;">	committed, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">VerifyDataRootInclusion</span><span style="color:#24292E;">(ctx, wrapper, event.ProofNonce.</span><span style="color:#005CC5;">Uint64</span><span style="color:#24292E;">(), </span><span style="color:#005CC5;">uint64</span><span style="color:#24292E;">(tx.Height), blockRes.Block.DataHash, dcProof.Proof)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> committed {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;data root was committed to by the BlobstreamX contract&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	} </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;data root was not committed to by the BlobstreamX contract&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">VerifyDataRootInclusion</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">	_ context.Context,</span></span>
<span class="line"><span style="color:#24292E;">	blobstreamXwrapper </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamX,</span></span>
<span class="line"><span style="color:#24292E;">	nonce </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	height </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	dataRoot []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	proof merkle.Proof,</span></span>
<span class="line"><span style="color:#24292E;">) (</span><span style="color:#D73A49;">bool</span><span style="color:#24292E;">, </span><span style="color:#D73A49;">error</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">	tuple </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamxwrapper.DataRootTuple{</span></span>
<span class="line"><span style="color:#24292E;">		Height:   big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(height)),</span></span>
<span class="line"><span style="color:#24292E;">		DataRoot: </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">)(dataRoot),</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([][</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, aunt </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">[</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">)(aunt)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	wrappedProof </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamxwrapper.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#24292E;">		SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">		Key:       big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Index),</span></span>
<span class="line"><span style="color:#24292E;">		NumLeaves: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Total),</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	valid, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamXwrapper.</span><span style="color:#005CC5;">VerifyAttestation</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">bind.CallOpts{},</span></span>
<span class="line"><span style="color:#24292E;">		big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(nonce)),</span></span>
<span class="line"><span style="color:#24292E;">		tuple,</span></span>
<span class="line"><span style="color:#24292E;">		wrappedProof,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">false</span><span style="color:#24292E;">, err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> valid, </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><h3 id="_2-transaction-inclusion-proof" tabindex="-1">2. Transaction inclusion proof <a class="header-anchor" href="#_2-transaction-inclusion-proof" aria-label="Permalink to &quot;2. Transaction inclusion proof&quot;">​</a></h3><p>To prove that a rollup transaction is part of the data root, we will need to provide two proofs: (1) a namespace Merkle proof of the transaction to a row root. This could be done via proving the shares that contain the transaction to the row root using a namespace Merkle proof. (2) And, a binary Merkle proof of the row root to the data root.</p><p>These proofs can be generated using the <a href="https://github.com/celestiaorg/celestia-core/blob/c3ab251659f6fe0f36d10e0dbd14c29a78a85352/rpc/client/http/http.go#L526-L543" target="_blank" rel="noreferrer"><code>ProveShares</code></a> query.</p><p>This <a href="https://github.com/celestiaorg/celestia-core/blob/793ece9bbd732aec3e09018e37dc31f4bfe122d9/rpc/core/tx.go#L175-L213" target="_blank" rel="noreferrer">endpoint</a> allows querying a shares proof to row roots, then a row roots to data root proofs. It takes a block <code>height</code>, a starting share index and an end share index which define a share range. Then, two proofs are generated:</p><ul><li>An NMT proof of the shares to the row roots</li><li>A binary Merkle proof of the row root to the data root</li></ul><div class="tip custom-block"><p class="custom-block-title">NOTE</p><p>If the share range spans multiple rows, then the proof can contain multiple NMT and binary proofs.</p></div><p>The endpoint can be queried using the golang client:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">	sharesProof, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">ProveShares</span><span style="color:#E1E4E8;">(ctx, </span><span style="color:#79B8FF;">15</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">...</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">	sharesProof, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">ProveShares</span><span style="color:#24292E;">(ctx, </span><span style="color:#005CC5;">15</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">0</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">...</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span></code></pre></div><h2 id="converting-the-proofs-to-be-usable-in-the-daverifier-library" tabindex="-1">Converting the proofs to be usable in the <code>DAVerifier</code> library <a class="header-anchor" href="#converting-the-proofs-to-be-usable-in-the-daverifier-library" aria-label="Permalink to &quot;Converting the proofs to be usable in the \`DAVerifier\` library&quot;">​</a></h2><p>Smart contracts that use the <code>DAVerifier</code> library takes the following proof format:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters to prove that some shares, which were posted to</span></span>
<span class="line"><span style="color:#6A737D;">/// the Celestia network, were committed to by the BlobstreamX smart contract.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">SharesProof</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The shares that were committed to.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes</span><span style="color:#E1E4E8;">[] data;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The shares proof to the row roots. If the shares span multiple rows, we will have multiple nmt proofs.</span></span>
<span class="line"><span style="color:#E1E4E8;">    NamespaceMerkleMultiproof[] shareProofs;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The namespace of the shares.</span></span>
<span class="line"><span style="color:#E1E4E8;">    Namespace namespace;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The rows where the shares belong. If the shares span multiple rows, we will have multiple rows.</span></span>
<span class="line"><span style="color:#E1E4E8;">    NamespaceNode[] rowRoots;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The proofs of the rowRoots to the data root.</span></span>
<span class="line"><span style="color:#E1E4E8;">    BinaryMerkleProof[] rowProofs;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The proof of the data root tuple to the data root tuple root that was posted to the BlobstreamX contract.</span></span>
<span class="line"><span style="color:#E1E4E8;">    AttestationProof attestationProof;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters needed to verify that a data root tuple</span></span>
<span class="line"><span style="color:#6A737D;">/// was committed to, by the BlobstreamX smart contract, at some specif nonce.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AttestationProof</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the attestation nonce that commits to the data root tuple.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> tupleRootNonce;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the data root tuple that was committed to.</span></span>
<span class="line"><span style="color:#E1E4E8;">    DataRootTuple tuple;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the binary Merkle proof of the tuple to the commitment.</span></span>
<span class="line"><span style="color:#E1E4E8;">    BinaryMerkleProof proof;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters to prove that some shares, which were posted to</span></span>
<span class="line"><span style="color:#6A737D;">/// the Celestia network, were committed to by the BlobstreamX smart contract.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">SharesProof</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The shares that were committed to.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes</span><span style="color:#24292E;">[] data;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The shares proof to the row roots. If the shares span multiple rows, we will have multiple nmt proofs.</span></span>
<span class="line"><span style="color:#24292E;">    NamespaceMerkleMultiproof[] shareProofs;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The namespace of the shares.</span></span>
<span class="line"><span style="color:#24292E;">    Namespace namespace;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The rows where the shares belong. If the shares span multiple rows, we will have multiple rows.</span></span>
<span class="line"><span style="color:#24292E;">    NamespaceNode[] rowRoots;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The proofs of the rowRoots to the data root.</span></span>
<span class="line"><span style="color:#24292E;">    BinaryMerkleProof[] rowProofs;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The proof of the data root tuple to the data root tuple root that was posted to the BlobstreamX contract.</span></span>
<span class="line"><span style="color:#24292E;">    AttestationProof attestationProof;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters needed to verify that a data root tuple</span></span>
<span class="line"><span style="color:#6A737D;">/// was committed to, by the BlobstreamX smart contract, at some specif nonce.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AttestationProof</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the attestation nonce that commits to the data root tuple.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> tupleRootNonce;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the data root tuple that was committed to.</span></span>
<span class="line"><span style="color:#24292E;">    DataRootTuple tuple;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the binary Merkle proof of the tuple to the commitment.</span></span>
<span class="line"><span style="color:#24292E;">    BinaryMerkleProof proof;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>To construct the <code>SharesProof</code>, we will need the proof that we queried above, and it goes as follows:</p><h3 id="data" tabindex="-1"><code>data</code> <a class="header-anchor" href="#data" aria-label="Permalink to &quot;\`data\`&quot;">​</a></h3><p>This is the raw shares that were submitted to Celestia in the <code>bytes</code> format. If we take the example blob that was submitted in the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L64-L65" target="_blank" rel="noreferrer"><code>RollupInclusionProofs.t.sol</code></a>, we can convert it to bytes using the <code>abi.encode(...)</code> as done for <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L384-L402" target="_blank" rel="noreferrer">this variable</a>. This can be gotten from the above result of the <a href="#2-transaction-inclusion-proof">transaction inclusion proof</a> query in the field <code>data</code>.</p><h3 id="shareproofs" tabindex="-1"><code>shareProofs</code> <a class="header-anchor" href="#shareproofs" aria-label="Permalink to &quot;\`shareProofs\`&quot;">​</a></h3><p>This is the shares proof to the row roots. These can contain multiple proofs if the shares containing the blob span across multiple rows. To construct them, we will use the result of the <a href="#2-transaction-inclusion-proof">transaction inclusion proof</a> section.</p><p>While the <code>NamespaceMerkleMultiproof</code> being:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Namespace Merkle Tree Multiproof structure. Proves multiple leaves.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">NamespaceMerkleMultiproof</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The beginning key of the leaves to verify.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> beginKey;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The ending key of the leaves to verify.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> endKey;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// List of side nodes to verify and calculate tree.</span></span>
<span class="line"><span style="color:#E1E4E8;">    NamespaceNode[] sideNodes;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Namespace Merkle Tree Multiproof structure. Proves multiple leaves.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NamespaceMerkleMultiproof</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The beginning key of the leaves to verify.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> beginKey;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The ending key of the leaves to verify.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> endKey;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// List of side nodes to verify and calculate tree.</span></span>
<span class="line"><span style="color:#24292E;">    NamespaceNode[] sideNodes;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>So, we can construct the <code>NamespaceMerkleMultiproof</code> with the following mapping:</p><ul><li><p><code>beginKey</code> in the Solidity struct <strong>==</strong> <code>start</code> in the query response</p></li><li><p><code>endKey</code> in the Solidity struct <strong>==</strong> <code>end</code> in the query response</p></li><li><p><code>sideNodes</code> in the Solidity struct <strong>==</strong> <code>nodes</code> in the query response</p></li><li><p>The <code>NamespaceNode</code>, which is the type of the <code>sideNodes</code>, is defined as follows:</p></li></ul><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Namespace Merkle Tree node.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">NamespaceNode</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Minimum namespace.</span></span>
<span class="line"><span style="color:#E1E4E8;">    Namespace min;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Maximum namespace.</span></span>
<span class="line"><span style="color:#E1E4E8;">    Namespace max;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Node value.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes32</span><span style="color:#E1E4E8;"> digest;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Namespace Merkle Tree node.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">NamespaceNode</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Minimum namespace.</span></span>
<span class="line"><span style="color:#24292E;">    Namespace min;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Maximum namespace.</span></span>
<span class="line"><span style="color:#24292E;">    Namespace max;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Node value.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes32</span><span style="color:#24292E;"> digest;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>So, we construct a <code>NamespaceNode</code> via taking the values from the <code>nodes</code> field in the query response, we convert them from base64 to <code>hex</code>, then we use the following mapping:</p><ul><li><code>min</code> == the first 29 bytes in the decoded value</li><li><code>max</code> == the second 29 bytes in the decoded value</li><li><code>digest</code> == the remaining 32 bytes in the decoded value</li></ul><p>The <code>min</code> and <code>max</code> are <code>Namespace</code> type which is:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> A representation of the Celestia-app namespace ID and its version.</span></span>
<span class="line"><span style="color:#6A737D;">/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Namespace</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The namespace version.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes1</span><span style="color:#E1E4E8;"> version;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The namespace ID.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes28</span><span style="color:#E1E4E8;"> id;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> A representation of the Celestia-app namespace ID and its version.</span></span>
<span class="line"><span style="color:#6A737D;">/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Namespace</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The namespace version.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes1</span><span style="color:#24292E;"> version;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The namespace ID.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes28</span><span style="color:#24292E;"> id;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>So, to construct them, we separate the 29 bytes in the decoded value to:</p><ul><li>first byte: <code>version</code></li><li>remaining 28 bytes: <code>id</code></li></ul><p>An example of doing this can be found in the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L465-L477" target="_blank" rel="noreferrer">RollupInclusionProofs.t.sol</a> test.</p><p>A golang helper that can be used to make this conversion is as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toNamespaceMerkleMultiProofs</span><span style="color:#E1E4E8;">(proofs []</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">tmproto.NMTProof) []client.NamespaceMerkleMultiproof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	shareProofs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceMerkleMultiproof, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proofs))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, proof </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proofs {</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceNode, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proof.Nodes))</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> j, node </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proof.Nodes {</span></span>
<span class="line"><span style="color:#E1E4E8;">			sideNodes[j] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#79B8FF;">toNamespaceNode</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">		shareProofs[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> client.NamespaceMerkleMultiproof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			BeginKey:  big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(proof.Start)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			EndKey:    big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(proof.End)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> shareProofs</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">minNamespace</span><span style="color:#E1E4E8;">(innerNode []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">:</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">maxNamespace</span><span style="color:#E1E4E8;">(innerNode []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">29</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">30</span><span style="color:#E1E4E8;">:</span><span style="color:#79B8FF;">57</span><span style="color:#E1E4E8;">] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toNamespaceNode</span><span style="color:#E1E4E8;">(node []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.NamespaceNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">	minNs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">minNamespace</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">	maxNs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">maxNamespace</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> digest [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> node[</span><span style="color:#79B8FF;">58</span><span style="color:#E1E4E8;">:] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		digest[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.NamespaceNode{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Min:    </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">minNs,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Max:    </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">maxNs,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Digest: digest,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toNamespaceMerkleMultiProofs</span><span style="color:#24292E;">(proofs []</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">tmproto.NMTProof) []client.NamespaceMerkleMultiproof {</span></span>
<span class="line"><span style="color:#24292E;">	shareProofs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceMerkleMultiproof, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proofs))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, proof </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proofs {</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceNode, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proof.Nodes))</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> j, node </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proof.Nodes {</span></span>
<span class="line"><span style="color:#24292E;">			sideNodes[j] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">toNamespaceNode</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">		shareProofs[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> client.NamespaceMerkleMultiproof{</span></span>
<span class="line"><span style="color:#24292E;">			BeginKey:  big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(proof.Start)),</span></span>
<span class="line"><span style="color:#24292E;">			EndKey:    big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(proof.End)),</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> shareProofs</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">minNamespace</span><span style="color:#24292E;">(innerNode []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">:</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">maxNamespace</span><span style="color:#24292E;">(innerNode []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">29</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">:</span><span style="color:#005CC5;">57</span><span style="color:#24292E;">] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toNamespaceNode</span><span style="color:#24292E;">(node []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.NamespaceNode {</span></span>
<span class="line"><span style="color:#24292E;">	minNs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">minNamespace</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">	maxNs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">maxNamespace</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> digest [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> node[</span><span style="color:#005CC5;">58</span><span style="color:#24292E;">:] {</span></span>
<span class="line"><span style="color:#24292E;">		digest[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.NamespaceNode{</span></span>
<span class="line"><span style="color:#24292E;">		Min:    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">minNs,</span></span>
<span class="line"><span style="color:#24292E;">		Max:    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">maxNs,</span></span>
<span class="line"><span style="color:#24292E;">		Digest: digest,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>with <code>proofs</code> being <code>sharesProof.ShareProofs</code>.</p><h3 id="namespace" tabindex="-1"><code>namespace</code> <a class="header-anchor" href="#namespace" aria-label="Permalink to &quot;\`namespace\`&quot;">​</a></h3><p>Which is the namespace used by the rollup when submitting data to Celestia. As described above, it can be constructed as follows:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> A representation of the Celestia-app namespace ID and its version.</span></span>
<span class="line"><span style="color:#6A737D;">/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">Namespace</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The namespace version.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes1</span><span style="color:#E1E4E8;"> version;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The namespace ID.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes28</span><span style="color:#E1E4E8;"> id;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> A representation of the Celestia-app namespace ID and its version.</span></span>
<span class="line"><span style="color:#6A737D;">/// See: https://celestiaorg.github.io/celestia-app/specs/namespace.html</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">Namespace</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The namespace version.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes1</span><span style="color:#24292E;"> version;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The namespace ID.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes28</span><span style="color:#24292E;"> id;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Via taking the <code>namespace</code> value from the <code>prove_shares</code> query response, decoding it from base64 to hex, then:</p><ul><li>first byte: <code>version</code></li><li>remaining 28 bytes: <code>id</code></li></ul><p>An example can be found in the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L488" target="_blank" rel="noreferrer">RollupInclusionProofs.t.sol</a> test.</p><p>A method to convert to namespace, provided that the namespace size is 29, is as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">namespace</span><span style="color:#E1E4E8;">(namespaceID []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> namespaceID[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> namespaceID[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">:] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">namespace</span><span style="color:#24292E;">(namespaceID []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> namespaceID[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> namespaceID[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">:] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>with <code>namespace</code> being <code>sharesProof.NamespaceID</code>.</p><h3 id="rowroots" tabindex="-1"><code>rowRoots</code> <a class="header-anchor" href="#rowroots" aria-label="Permalink to &quot;\`rowRoots\`&quot;">​</a></h3><p>Which are the roots of the rows where the shares containing the Rollup data are localised.</p><p>In golang, the proof can be converted as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toRowRoots</span><span style="color:#E1E4E8;">(roots []bytes.HexBytes) []client.NamespaceNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">	rowRoots </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceNode, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(roots))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, root </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> roots {</span></span>
<span class="line"><span style="color:#E1E4E8;">		rowRoots[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#79B8FF;">toNamespaceNode</span><span style="color:#E1E4E8;">(root.</span><span style="color:#79B8FF;">Bytes</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> rowRoots</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toRowRoots</span><span style="color:#24292E;">(roots []bytes.HexBytes) []client.NamespaceNode {</span></span>
<span class="line"><span style="color:#24292E;">	rowRoots </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceNode, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(roots))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, root </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> roots {</span></span>
<span class="line"><span style="color:#24292E;">		rowRoots[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">toNamespaceNode</span><span style="color:#24292E;">(root.</span><span style="color:#005CC5;">Bytes</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> rowRoots</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>with <code>roots</code> being <code>sharesProof.RowProof.RowRoots</code>.</p><h3 id="rowproofs" tabindex="-1"><code>rowProofs</code> <a class="header-anchor" href="#rowproofs" aria-label="Permalink to &quot;\`rowProofs\`&quot;">​</a></h3><p>These are the proofs of the rows to the data root. They are of type <code>BinaryMerkleProof</code>:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Merkle Tree Proof structure.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">BinaryMerkleProof</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// List of side nodes to verify and calculate tree.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes32</span><span style="color:#E1E4E8;">[] sideNodes;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The key of the leaf to verify.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> key;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// The number of leaves in the tree</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> numLeaves;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Merkle Tree Proof structure.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">BinaryMerkleProof</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// List of side nodes to verify and calculate tree.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes32</span><span style="color:#24292E;">[] sideNodes;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The key of the leaf to verify.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> key;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// The number of leaves in the tree</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> numLeaves;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>To construct them, we take the response of the <code>prove_shares</code> query, and do the following mapping:</p><ul><li><code>key</code> in the Solidity struct <strong>==</strong> <code>index</code> in the query response</li><li><code>numLeaves</code> in the Solidity struct <strong>==</strong> <code>total</code> in the query response</li><li><code>sideNodes</code> in the Solidity struct <strong>==</strong> <code>aunts</code> in the query response</li></ul><p>The type of the <code>sideNodes</code> is a <code>bytes32</code>.</p><p>An example can be found in the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L479-L484" target="_blank" rel="noreferrer">RollupInclusionProofs.t.sol</a> test.</p><p>A golang helper to convert the row proofs is as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toRowProofs</span><span style="color:#E1E4E8;">(proofs []</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">merkle.Proof) []client.BinaryMerkleProof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	rowProofs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.BinaryMerkleProof, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proofs))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, proof </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proofs {</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">( [][</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> j, sideNode </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> bzSideNode [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> k, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> sideNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">				bzSideNode[k] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">			}</span></span>
<span class="line"><span style="color:#E1E4E8;">			sideNodes[j] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> bzSideNode</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;"> 		rowProofs[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Key:       big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Index),</span></span>
<span class="line"><span style="color:#E1E4E8;">			NumLeaves: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Total),</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toRowProofs</span><span style="color:#24292E;">(proofs []</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">merkle.Proof) []client.BinaryMerkleProof {</span></span>
<span class="line"><span style="color:#24292E;">	rowProofs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.BinaryMerkleProof, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proofs))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, proof </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proofs {</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">( [][</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> j, sideNode </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> bzSideNode [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> k, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> sideNode {</span></span>
<span class="line"><span style="color:#24292E;">				bzSideNode[k] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">			}</span></span>
<span class="line"><span style="color:#24292E;">			sideNodes[j] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bzSideNode</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;"> 		rowProofs[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">			Key:       big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Index),</span></span>
<span class="line"><span style="color:#24292E;">			NumLeaves: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Total),</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>with <code>proofs</code> being <code>sharesProof.RowProof.Proofs</code>.</p><h3 id="attestationproof" tabindex="-1"><code>attestationProof</code> <a class="header-anchor" href="#attestationproof" aria-label="Permalink to &quot;\`attestationProof\`&quot;">​</a></h3><p>This is the proof of the data root to the data root tuple root, which is committed to in the Blobstream X contract:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters needed to verify that a data root tuple</span></span>
<span class="line"><span style="color:#6A737D;">/// was committed to, by the BlobstreamX smart contract, at some specif nonce.</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AttestationProof</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the attestation nonce that commits to the data root tuple.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> tupleRootNonce;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the data root tuple that was committed to.</span></span>
<span class="line"><span style="color:#E1E4E8;">    DataRootTuple tuple;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// the binary Merkle proof of the tuple to the commitment.</span></span>
<span class="line"><span style="color:#E1E4E8;">    BinaryMerkleProof proof;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> Contains the necessary parameters needed to verify that a data root tuple</span></span>
<span class="line"><span style="color:#6A737D;">/// was committed to, by the BlobstreamX smart contract, at some specif nonce.</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AttestationProof</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the attestation nonce that commits to the data root tuple.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> tupleRootNonce;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the data root tuple that was committed to.</span></span>
<span class="line"><span style="color:#24292E;">    DataRootTuple tuple;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// the binary Merkle proof of the tuple to the commitment.</span></span>
<span class="line"><span style="color:#24292E;">    BinaryMerkleProof proof;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><ul><li><code>tupleRootNonce</code>: the nonce at which Blobstream X committed to the batch containing the block containing the data.</li><li><code>tuple</code>: the <code>DataRootTuple</code> of the block:</li></ul><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@notice</span><span style="color:#6A737D;"> A tuple of data root with metadata. Each data root is associated</span></span>
<span class="line"><span style="color:#6A737D;">///  with a Celestia block height.</span></span>
<span class="line"><span style="color:#6A737D;">/// </span><span style="color:#F97583;">@dev</span><span style="color:#6A737D;"> \`availableDataRoot\` in</span></span>
<span class="line"><span style="color:#6A737D;">///  https://github.com/celestiaorg/celestia-specs/blob/master/src/specs/data_structures.md#header</span></span>
<span class="line"><span style="color:#F97583;">struct</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">DataRootTuple</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Celestia block height the data root was included in.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Genesis block is height = 0.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// First queryable block is height = 1.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">uint256</span><span style="color:#E1E4E8;"> height;</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// Data root.</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">bytes32</span><span style="color:#E1E4E8;"> dataRoot;</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@notice</span><span style="color:#6A737D;"> A tuple of data root with metadata. Each data root is associated</span></span>
<span class="line"><span style="color:#6A737D;">///  with a Celestia block height.</span></span>
<span class="line"><span style="color:#6A737D;">/// </span><span style="color:#D73A49;">@dev</span><span style="color:#6A737D;"> \`availableDataRoot\` in</span></span>
<span class="line"><span style="color:#6A737D;">///  https://github.com/celestiaorg/celestia-specs/blob/master/src/specs/data_structures.md#header</span></span>
<span class="line"><span style="color:#D73A49;">struct</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">DataRootTuple</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Celestia block height the data root was included in.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Genesis block is height = 0.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// First queryable block is height = 1.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">uint256</span><span style="color:#24292E;"> height;</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// Data root.</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">bytes32</span><span style="color:#24292E;"> dataRoot;</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>which comprises a <code>dataRoot</code>, i.e. the block containing the Rollup data data root, and the <code>height</code> which is the <code>height</code> of that block.</p><ul><li><code>proof</code>: the <code>BinaryMerkleProof</code> of the data root tuple to the data root tuple root. Constructing it is similar to constructing the row roots to data root proof in the <a href="#rowproofs">rowProofs</a> section.</li></ul><p>An example can be found in the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/3a552d8f7bfbed1f3175933260e6e440915d2da4/src/lib/verifier/test/RollupInclusionProofs.t.sol#L488" target="_blank" rel="noreferrer">RollupInclusionProofs.t.sol</a> test.</p><p>A golang helper to create an attestation proof:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toAttestationProof</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">	nonce </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	height </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	blockDataRoot [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#E1E4E8;">) client.AttestationProof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">( [][</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Aunts))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, sideNode </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> dataRootInclusionProof.Aunts {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> bzSideNode [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> k, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> sideNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">			bzSideNode[k] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> bzSideNode</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> client.AttestationProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">		TupleRootNonce: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(nonce)),</span></span>
<span class="line"><span style="color:#E1E4E8;">		Tuple:          client.DataRootTuple{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Height:   big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(height)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			DataRoot: blockDataRoot,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Proof:          client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Key:       big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Index),</span></span>
<span class="line"><span style="color:#E1E4E8;">			NumLeaves: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Total),</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toAttestationProof</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">	nonce </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	height </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	blockDataRoot [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#24292E;">) client.AttestationProof {</span></span>
<span class="line"><span style="color:#24292E;">	sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">( [][</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(dataRootInclusionProof.Aunts))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, sideNode </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> dataRootInclusionProof.Aunts {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> bzSideNode [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> k, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> sideNode {</span></span>
<span class="line"><span style="color:#24292E;">			bzSideNode[k] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bzSideNode</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> client.AttestationProof{</span></span>
<span class="line"><span style="color:#24292E;">		TupleRootNonce: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(nonce)),</span></span>
<span class="line"><span style="color:#24292E;">		Tuple:          client.DataRootTuple{</span></span>
<span class="line"><span style="color:#24292E;">			Height:   big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(height)),</span></span>
<span class="line"><span style="color:#24292E;">			DataRoot: blockDataRoot,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		Proof:          client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">			Key:       big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(dataRootInclusionProof.Index),</span></span>
<span class="line"><span style="color:#24292E;">			NumLeaves: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(dataRootInclusionProof.Total),</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>with the <code>nonce</code> being the attestation nonce, which can be retrieved using <code>BlobstreamX</code> contract events. Check below for an example. And <code>height</code> being the Celestia Block height that contains the rollup data, along with the <code>blockDataRoot</code> being the data root of the block height. Finally, <code>dataRootInclusionProof</code> is the Celestia block data root inclusion proof to the data root tuple root that was queried in the begining of this page.</p><p>If the <code>dataRoot</code> or the <code>tupleRootNonce</code> is unknown during the verification:</p><ul><li><code>dataRoot</code>: can be queried using the <code>/block?height=15</code> query (<code>15</code> in this example endpoint), and taking the <code>data_hash</code> field from the response.</li><li><code>tupleRootNonce</code>: can be retried via querying the <code>BlobstreamXDataCommitmentStored</code> events from the BlobstreamX contract and looking for the nonce attesting to the corresponding data. An example:</li></ul><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains the PayForBlob transaction</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// since BlobstreamX emits events when new batches are submitted, we will query the events</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#E1E4E8;">	ethClient, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethclient.</span><span style="color:#79B8FF;">Dial</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">defer</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// use the BlobstreamX contract binding</span></span>
<span class="line"><span style="color:#E1E4E8;">	wrapper, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamxwrapper.</span><span style="color:#79B8FF;">NewBlobstreamX</span><span style="color:#E1E4E8;">(ethcmn.</span><span style="color:#79B8FF;">HexToAddress</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;contract_Address&quot;</span><span style="color:#E1E4E8;">), ethClient)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	LatestBlockNumber, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">BlockNumber</span><span style="color:#E1E4E8;">(ctx)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	eventsIterator, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> wrapper.</span><span style="color:#79B8FF;">FilterDataCommitmentStored</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">bind.FilterOpts{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Context: ctx,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Start: LatestBlockNumber </span><span style="color:#F97583;">-</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">90000</span><span style="color:#E1E4E8;">, </span><span style="color:#6A737D;">// 90000 can be replaced with the range of EVM blocks to look for the events in</span></span>
<span class="line"><span style="color:#E1E4E8;">			End: </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">LatestBlockNumber,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> event </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamXDataCommitmentStored</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Next</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">		e </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> eventsIterator.Event</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(e.StartBlock) </span><span style="color:#F97583;">&lt;=</span><span style="color:#E1E4E8;"> tx.Height </span><span style="color:#F97583;">&amp;&amp;</span><span style="color:#E1E4E8;"> tx.Height </span><span style="color:#F97583;">&lt;</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(e.EndBlock) {</span></span>
<span class="line"><span style="color:#E1E4E8;">			event </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamXDataCommitmentStored{</span></span>
<span class="line"><span style="color:#E1E4E8;">				ProofNonce:     e.ProofNonce,</span></span>
<span class="line"><span style="color:#E1E4E8;">				StartBlock:     e.StartBlock,</span></span>
<span class="line"><span style="color:#E1E4E8;">				EndBlock:       e.EndBlock,</span></span>
<span class="line"><span style="color:#E1E4E8;">				DataCommitment: e.DataCommitment,</span></span>
<span class="line"><span style="color:#E1E4E8;">			}</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">break</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Error</span><span style="color:#E1E4E8;">(); err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> eventsIterator.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> event </span><span style="color:#F97583;">==</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> fmt.</span><span style="color:#79B8FF;">Errorf</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;couldn&#39;t find range containing the block height&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains the PayForBlob transaction</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// since BlobstreamX emits events when new batches are submitted, we will query the events</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#24292E;">	ethClient, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethclient.</span><span style="color:#005CC5;">Dial</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">defer</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// use the BlobstreamX contract binding</span></span>
<span class="line"><span style="color:#24292E;">	wrapper, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamxwrapper.</span><span style="color:#005CC5;">NewBlobstreamX</span><span style="color:#24292E;">(ethcmn.</span><span style="color:#005CC5;">HexToAddress</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;contract_Address&quot;</span><span style="color:#24292E;">), ethClient)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	LatestBlockNumber, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">BlockNumber</span><span style="color:#24292E;">(ctx)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	eventsIterator, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> wrapper.</span><span style="color:#005CC5;">FilterDataCommitmentStored</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">bind.FilterOpts{</span></span>
<span class="line"><span style="color:#24292E;">			Context: ctx,</span></span>
<span class="line"><span style="color:#24292E;">			Start: LatestBlockNumber </span><span style="color:#D73A49;">-</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">90000</span><span style="color:#24292E;">, </span><span style="color:#6A737D;">// 90000 can be replaced with the range of EVM blocks to look for the events in</span></span>
<span class="line"><span style="color:#24292E;">			End: </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">LatestBlockNumber,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> event </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamXDataCommitmentStored</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Next</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">		e </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> eventsIterator.Event</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(e.StartBlock) </span><span style="color:#D73A49;">&lt;=</span><span style="color:#24292E;"> tx.Height </span><span style="color:#D73A49;">&amp;&amp;</span><span style="color:#24292E;"> tx.Height </span><span style="color:#D73A49;">&lt;</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(e.EndBlock) {</span></span>
<span class="line"><span style="color:#24292E;">			event </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamXDataCommitmentStored{</span></span>
<span class="line"><span style="color:#24292E;">				ProofNonce:     e.ProofNonce,</span></span>
<span class="line"><span style="color:#24292E;">				StartBlock:     e.StartBlock,</span></span>
<span class="line"><span style="color:#24292E;">				EndBlock:       e.EndBlock,</span></span>
<span class="line"><span style="color:#24292E;">				DataCommitment: e.DataCommitment,</span></span>
<span class="line"><span style="color:#24292E;">			}</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">break</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Error</span><span style="color:#24292E;">(); err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> eventsIterator.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> event </span><span style="color:#D73A49;">==</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> fmt.</span><span style="color:#005CC5;">Errorf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;couldn&#39;t find range containing the block height&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span></code></pre></div><h3 id="listening-for-new-data-commitments" tabindex="-1">Listening for new data commitments <a class="header-anchor" href="#listening-for-new-data-commitments" aria-label="Permalink to &quot;Listening for new data commitments&quot;">​</a></h3><p>For listening for new <code>BlobstreamXDataCommitmentStored</code> events, sequencers can use the <code>WatchDataCommitmentStored</code> as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#E1E4E8;">    ethClient, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethclient.</span><span style="color:#79B8FF;">Dial</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;evm_rpc&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">defer</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">    blobstreamWrapper, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamxwrapper.</span><span style="color:#79B8FF;">NewBlobstreamXFilterer</span><span style="color:#E1E4E8;">(ethcmn.</span><span style="color:#79B8FF;">HexToAddress</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;contract_address&quot;</span><span style="color:#E1E4E8;">), ethClient)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    eventsChan </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">chan</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">blobstreamxwrapper.BlobstreamXDataCommitmentStored, </span><span style="color:#79B8FF;">100</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    subscription, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> blobstreamWrapper.</span><span style="color:#79B8FF;">WatchDataCommitmentStored</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">bind.WatchOpts{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Context: ctx,</span></span>
<span class="line"><span style="color:#E1E4E8;">        },</span></span>
<span class="line"><span style="color:#E1E4E8;">	    eventsChan,</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">defer</span><span style="color:#E1E4E8;"> subscription.</span><span style="color:#79B8FF;">Unsubscribe</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">select</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	    </span><span style="color:#F97583;">case</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&lt;-</span><span style="color:#E1E4E8;">ctx.</span><span style="color:#79B8FF;">Done</span><span style="color:#E1E4E8;">():</span></span>
<span class="line"><span style="color:#E1E4E8;">		    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> ctx.</span><span style="color:#79B8FF;">Err</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">case</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&lt;-</span><span style="color:#E1E4E8;">subscription.</span><span style="color:#79B8FF;">Err</span><span style="color:#E1E4E8;">():</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">case</span><span style="color:#E1E4E8;"> event </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&lt;-</span><span style="color:#E1E4E8;">eventsChan:</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#6A737D;">// process the event</span></span>
<span class="line"><span style="color:#E1E4E8;">		    fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(event)</span></span>
<span class="line"><span style="color:#E1E4E8;">	    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292E;">    ethClient, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethclient.</span><span style="color:#005CC5;">Dial</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;evm_rpc&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">defer</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">    blobstreamWrapper, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamxwrapper.</span><span style="color:#005CC5;">NewBlobstreamXFilterer</span><span style="color:#24292E;">(ethcmn.</span><span style="color:#005CC5;">HexToAddress</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;contract_address&quot;</span><span style="color:#24292E;">), ethClient)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    eventsChan </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">chan</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">blobstreamxwrapper.BlobstreamXDataCommitmentStored, </span><span style="color:#005CC5;">100</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    subscription, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> blobstreamWrapper.</span><span style="color:#005CC5;">WatchDataCommitmentStored</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">bind.WatchOpts{</span></span>
<span class="line"><span style="color:#24292E;">			Context: ctx,</span></span>
<span class="line"><span style="color:#24292E;">        },</span></span>
<span class="line"><span style="color:#24292E;">	    eventsChan,</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">defer</span><span style="color:#24292E;"> subscription.</span><span style="color:#005CC5;">Unsubscribe</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">select</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	    </span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;-</span><span style="color:#24292E;">ctx.</span><span style="color:#005CC5;">Done</span><span style="color:#24292E;">():</span></span>
<span class="line"><span style="color:#24292E;">		    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> ctx.</span><span style="color:#005CC5;">Err</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;-</span><span style="color:#24292E;">subscription.</span><span style="color:#005CC5;">Err</span><span style="color:#24292E;">():</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">case</span><span style="color:#24292E;"> event </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&lt;-</span><span style="color:#24292E;">eventsChan:</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#6A737D;">// process the event</span></span>
<span class="line"><span style="color:#24292E;">		    fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(event)</span></span>
<span class="line"><span style="color:#24292E;">	    }</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span></code></pre></div><p>Then, new proofs can be created as documented above using the new data commitments contained in the received events.</p><h3 id="example-rollup-that-uses-the-daverifier" tabindex="-1">Example rollup that uses the DAVerifier <a class="header-anchor" href="#example-rollup-that-uses-the-daverifier" aria-label="Permalink to &quot;Example rollup that uses the DAVerifier&quot;">​</a></h3><p>An example rollup that uses the DAVerifier can be as simple as:</p><div class="language-solidity vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">solidity</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">pragma</span><span style="color:#E1E4E8;"> </span><span style="color:#85E89D;">solidity</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">^0.8.22</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> {</span><span style="color:#B392F0;">DAVerifier</span><span style="color:#E1E4E8;">} </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;@blobstream/lib/verifier/DAVerifier.sol&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> {</span><span style="color:#B392F0;">IDAOracle</span><span style="color:#E1E4E8;">} </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;@blobstream/IDAOracle.sol&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">contract</span><span style="color:#B392F0;"> SimpleRollup</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    IDAOracle bridge;</span></span>
<span class="line"><span style="color:#E1E4E8;">    ...</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">submitFraudProof</span><span style="color:#E1E4E8;">(</span><span style="color:#F97583;">SharesProof</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">memory</span><span style="color:#E1E4E8;"> _sharesProof, </span><span style="color:#79B8FF;">bytes32</span><span style="color:#E1E4E8;"> _root) </span><span style="color:#F97583;">public</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// (1) verify that the data is committed to by BlobstreamX contract</span></span>
<span class="line"><span style="color:#E1E4E8;">        (</span><span style="color:#79B8FF;">bool</span><span style="color:#E1E4E8;"> committedTo, DAVerifier.ErrorCodes err) </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> DAVerifier.</span><span style="color:#B392F0;">verifySharesToDataRootTupleRoot</span><span style="color:#E1E4E8;">(bridge, _sharesProof, _root);</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">committedTo) {</span></span>
<span class="line"><span style="color:#E1E4E8;">            </span><span style="color:#F97583;">revert</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;the data was not committed to by Blobstream&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// (2) verify that the data is part of the rollup block</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// (3) parse the data</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// (4) verify invalid state transition</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#6A737D;">// (5) effects</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">pragma</span><span style="color:#24292E;"> </span><span style="color:#22863A;">solidity</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">^0.8.22</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> {</span><span style="color:#6F42C1;">DAVerifier</span><span style="color:#24292E;">} </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;@blobstream/lib/verifier/DAVerifier.sol&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> {</span><span style="color:#6F42C1;">IDAOracle</span><span style="color:#24292E;">} </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;@blobstream/IDAOracle.sol&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">contract</span><span style="color:#6F42C1;"> SimpleRollup</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    IDAOracle bridge;</span></span>
<span class="line"><span style="color:#24292E;">    ...</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">submitFraudProof</span><span style="color:#24292E;">(</span><span style="color:#D73A49;">SharesProof</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">memory</span><span style="color:#24292E;"> _sharesProof, </span><span style="color:#005CC5;">bytes32</span><span style="color:#24292E;"> _root) </span><span style="color:#D73A49;">public</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// (1) verify that the data is committed to by BlobstreamX contract</span></span>
<span class="line"><span style="color:#24292E;">        (</span><span style="color:#005CC5;">bool</span><span style="color:#24292E;"> committedTo, DAVerifier.ErrorCodes err) </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> DAVerifier.</span><span style="color:#6F42C1;">verifySharesToDataRootTupleRoot</span><span style="color:#24292E;">(bridge, _sharesProof, _root);</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">committedTo) {</span></span>
<span class="line"><span style="color:#24292E;">            </span><span style="color:#D73A49;">revert</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;the data was not committed to by Blobstream&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// (2) verify that the data is part of the rollup block</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// (3) parse the data</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// (4) verify invalid state transition</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#6A737D;">// (5) effects</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>Then, you can submit the fraud proof using golang as follows:</p><div class="language-go vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">go</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#F97583;">package</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">context</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">fmt</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/celestiaorg/celestia-app/pkg/square</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/celestiaorg/celestia-app/x/qgb/client</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/accounts/abi/bind</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">ethcmn</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/common</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/ethereum/go-ethereum/ethclient</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">blobstreamxwrapper</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/succinctlabs/blobstreamx/bindings</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/crypto/merkle</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/libs/bytes</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#B392F0;">tmproto</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/proto/tendermint/types</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">github.com/tendermint/tendermint/types</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">math/big</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#9ECBFF;">&quot;</span><span style="color:#B392F0;">os</span><span style="color:#9ECBFF;">&quot;</span></span>
<span class="line"><span style="color:#E1E4E8;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">main</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">verify</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		fmt.</span><span style="color:#79B8FF;">Println</span><span style="color:#E1E4E8;">(err)</span></span>
<span class="line"><span style="color:#E1E4E8;">		os.</span><span style="color:#79B8FF;">Exit</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">verify</span><span style="color:#E1E4E8;">() </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	ctx </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> context.</span><span style="color:#79B8FF;">Background</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// check the first section for this part of the implementation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains the PayForBlob transaction</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// since Blobstream X emits events when new batches are submitted, we will query the events</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#E1E4E8;">	ethClient, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> ethclient.</span><span style="color:#79B8FF;">Dial</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">defer</span><span style="color:#E1E4E8;"> ethClient.</span><span style="color:#79B8FF;">Close</span><span style="color:#E1E4E8;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// check the first section for this part of the implementation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// now we will create the shares proof to be verified by the SimpleRollup</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// contract that uses the DAVerifier library</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// get the proof of the shares containing the blob to the data root</span></span>
<span class="line"><span style="color:#E1E4E8;">	sharesProof, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> trpc.</span><span style="color:#79B8FF;">ProveShares</span><span style="color:#E1E4E8;">(ctx, </span><span style="color:#79B8FF;">16</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">uint64</span><span style="color:#E1E4E8;">(blobShareRange.Start), </span><span style="color:#79B8FF;">uint64</span><span style="color:#E1E4E8;">(blobShareRange.End))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// use the SimpleRollup contract binding to submit to it a fraud proof</span></span>
<span class="line"><span style="color:#E1E4E8;">	simpleRollupWrapper, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> client.</span><span style="color:#79B8FF;">NewWrappers</span><span style="color:#E1E4E8;">(ethcmn.</span><span style="color:#79B8FF;">HexToAddress</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;contract_Address&quot;</span><span style="color:#E1E4E8;">), ethClient)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// submit the fraud proof containing the share data that had the invalid state transition for example</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// along with its proof</span></span>
<span class="line"><span style="color:#E1E4E8;">	err </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">submitFraudProof</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">		ctx,</span></span>
<span class="line"><span style="color:#E1E4E8;">		simpleRollupWrapper,</span></span>
<span class="line"><span style="color:#E1E4E8;">		sharesProof,</span></span>
<span class="line"><span style="color:#E1E4E8;">		event.ProofNonce.</span><span style="color:#79B8FF;">Uint64</span><span style="color:#E1E4E8;">(),</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#79B8FF;">uint64</span><span style="color:#E1E4E8;">(tx.Height),</span></span>
<span class="line"><span style="color:#E1E4E8;">		dcProof.Proof,</span></span>
<span class="line"><span style="color:#E1E4E8;">		blockRes.Block.DataHash,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">submitFraudProof</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">	ctx context.Context,</span></span>
<span class="line"><span style="color:#E1E4E8;">	simpleRollup </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Wrappers,</span></span>
<span class="line"><span style="color:#E1E4E8;">	sharesProof types.ShareProof,</span></span>
<span class="line"><span style="color:#E1E4E8;">	nonce </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	height </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#E1E4E8;">	dataRoot []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">error</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> blockDataRoot [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> dataRoot[</span><span style="color:#79B8FF;">58</span><span style="color:#E1E4E8;">:] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		blockDataRoot[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	tx, err </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> simpleRollup.</span><span style="color:#79B8FF;">SubmitFraudProof</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">bind.TransactOpts{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Context: ctx,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		client.SharesProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Data:             sharesProof.Data,</span></span>
<span class="line"><span style="color:#E1E4E8;">			ShareProofs:      </span><span style="color:#79B8FF;">toNamespaceMerkleMultiProofs</span><span style="color:#E1E4E8;">(sharesProof.ShareProofs),</span></span>
<span class="line"><span style="color:#E1E4E8;">			Namespace:        </span><span style="color:#F97583;">*</span><span style="color:#79B8FF;">namespace</span><span style="color:#E1E4E8;">(sharesProof.NamespaceID),</span></span>
<span class="line"><span style="color:#E1E4E8;">			RowRoots:         </span><span style="color:#79B8FF;">toRowRoots</span><span style="color:#E1E4E8;">(sharesProof.RowProof.RowRoots),</span></span>
<span class="line"><span style="color:#E1E4E8;">			RowProofs:        </span><span style="color:#79B8FF;">toRowProofs</span><span style="color:#E1E4E8;">(sharesProof.RowProof.Proofs),</span></span>
<span class="line"><span style="color:#E1E4E8;">			AttestationProof: </span><span style="color:#79B8FF;">toAttestationProof</span><span style="color:#E1E4E8;">(nonce, height, blockDataRoot, dataRootInclusionProof),</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		blockDataRoot,</span></span>
<span class="line"><span style="color:#E1E4E8;">	)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> err </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">nil</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> err</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#6A737D;">// wait for transaction</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toAttestationProof</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">	nonce </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	height </span><span style="color:#F97583;">uint64</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	blockDataRoot [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#E1E4E8;">) client.AttestationProof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">( [][</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Aunts))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, sideNode </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> dataRootInclusionProof.Aunts {</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> bzSideNode [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> k, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> sideNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">			bzSideNode[k] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> bzSideNode</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> client.AttestationProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">		TupleRootNonce: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(nonce)),</span></span>
<span class="line"><span style="color:#E1E4E8;">		Tuple:          client.DataRootTuple{</span></span>
<span class="line"><span style="color:#E1E4E8;">			Height:   big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(height)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			DataRoot: blockDataRoot,</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Proof:          client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Key:       big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Index),</span></span>
<span class="line"><span style="color:#E1E4E8;">			NumLeaves: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(dataRootInclusionProof.Total),</span></span>
<span class="line"><span style="color:#E1E4E8;">		},</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toRowRoots</span><span style="color:#E1E4E8;">(roots []bytes.HexBytes) []client.NamespaceNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">	rowRoots </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceNode, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(roots))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, root </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> roots {</span></span>
<span class="line"><span style="color:#E1E4E8;">		rowRoots[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#79B8FF;">toNamespaceNode</span><span style="color:#E1E4E8;">(root.</span><span style="color:#79B8FF;">Bytes</span><span style="color:#E1E4E8;">())</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> rowRoots</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toRowProofs</span><span style="color:#E1E4E8;">(proofs []</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">merkle.Proof) []client.BinaryMerkleProof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	rowProofs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.BinaryMerkleProof, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proofs))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, proof </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proofs {</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">( [][</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> j, sideNode </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> bzSideNode [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">			</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> k, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> sideNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">				bzSideNode[k] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">			}</span></span>
<span class="line"><span style="color:#E1E4E8;">			sideNodes[j] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> bzSideNode</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;"> 		rowProofs[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">			Key:       big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Index),</span></span>
<span class="line"><span style="color:#E1E4E8;">			NumLeaves: big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(proof.Total),</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toNamespaceMerkleMultiProofs</span><span style="color:#E1E4E8;">(proofs []</span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">tmproto.NMTProof) []client.NamespaceMerkleMultiproof {</span></span>
<span class="line"><span style="color:#E1E4E8;">	shareProofs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceMerkleMultiproof, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proofs))</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, proof </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proofs {</span></span>
<span class="line"><span style="color:#E1E4E8;">		sideNodes </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">make</span><span style="color:#E1E4E8;">([]client.NamespaceNode, </span><span style="color:#79B8FF;">len</span><span style="color:#E1E4E8;">(proof.Nodes))</span></span>
<span class="line"><span style="color:#E1E4E8;">		</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> j, node </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> proof.Nodes {</span></span>
<span class="line"><span style="color:#E1E4E8;">			sideNodes[j] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">*</span><span style="color:#79B8FF;">toNamespaceNode</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">		shareProofs[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> client.NamespaceMerkleMultiproof{</span></span>
<span class="line"><span style="color:#E1E4E8;">			BeginKey:  big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(proof.Start)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			EndKey:    big.</span><span style="color:#79B8FF;">NewInt</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">int64</span><span style="color:#E1E4E8;">(proof.End)),</span></span>
<span class="line"><span style="color:#E1E4E8;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#E1E4E8;">		}</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> shareProofs</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">minNamespace</span><span style="color:#E1E4E8;">(innerNode []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">:</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">maxNamespace</span><span style="color:#E1E4E8;">(innerNode []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">29</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> innerNode[</span><span style="color:#79B8FF;">30</span><span style="color:#E1E4E8;">:</span><span style="color:#79B8FF;">57</span><span style="color:#E1E4E8;">] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">toNamespaceNode</span><span style="color:#E1E4E8;">(node []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.NamespaceNode {</span></span>
<span class="line"><span style="color:#E1E4E8;">	minNs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">minNamespace</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">	maxNs </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">maxNamespace</span><span style="color:#E1E4E8;">(node)</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> digest [</span><span style="color:#79B8FF;">32</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> node[</span><span style="color:#79B8FF;">58</span><span style="color:#E1E4E8;">:] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		digest[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.NamespaceNode{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Min:    </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">minNs,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Max:    </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">maxNs,</span></span>
<span class="line"><span style="color:#E1E4E8;">		Digest: digest,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">func</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">namespace</span><span style="color:#E1E4E8;">(namespaceID []</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">*</span><span style="color:#E1E4E8;">client.Namespace {</span></span>
<span class="line"><span style="color:#E1E4E8;">	version </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> namespaceID[</span><span style="color:#79B8FF;">0</span><span style="color:#E1E4E8;">]</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">var</span><span style="color:#E1E4E8;"> id [</span><span style="color:#79B8FF;">28</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">for</span><span style="color:#E1E4E8;"> i, b </span><span style="color:#F97583;">:=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">range</span><span style="color:#E1E4E8;"> namespaceID[</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">:] {</span></span>
<span class="line"><span style="color:#E1E4E8;">		id[i] </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> b</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">	</span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">&amp;</span><span style="color:#E1E4E8;">client.Namespace{</span></span>
<span class="line"><span style="color:#E1E4E8;">		Version: [</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">]</span><span style="color:#F97583;">byte</span><span style="color:#E1E4E8;">{version},</span></span>
<span class="line"><span style="color:#E1E4E8;">		Id:      id,</span></span>
<span class="line"><span style="color:#E1E4E8;">	}</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#D73A49;">package</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">context</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">fmt</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/celestiaorg/celestia-app/pkg/square</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/celestiaorg/celestia-app/x/qgb/client</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/accounts/abi/bind</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">ethcmn</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/common</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/ethereum/go-ethereum/ethclient</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">blobstreamxwrapper</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/succinctlabs/blobstreamx/bindings</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/crypto/merkle</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/libs/bytes</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6F42C1;">tmproto</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/proto/tendermint/types</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/rpc/client/http</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">github.com/tendermint/tendermint/types</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">math/big</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#032F62;">&quot;</span><span style="color:#6F42C1;">os</span><span style="color:#032F62;">&quot;</span></span>
<span class="line"><span style="color:#24292E;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">main</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">verify</span><span style="color:#24292E;">()</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		fmt.</span><span style="color:#005CC5;">Println</span><span style="color:#24292E;">(err)</span></span>
<span class="line"><span style="color:#24292E;">		os.</span><span style="color:#005CC5;">Exit</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">verify</span><span style="color:#24292E;">() </span><span style="color:#D73A49;">error</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	ctx </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> context.</span><span style="color:#005CC5;">Background</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// check the first section for this part of the implementation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the nonce corresponding to the block height that contains the PayForBlob transaction</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// since Blobstream X emits events when new batches are submitted, we will query the events</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// and look for the range committing to the blob</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// first, connect to an EVM RPC endpoint</span></span>
<span class="line"><span style="color:#24292E;">	ethClient, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> ethclient.</span><span style="color:#005CC5;">Dial</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;evm_rpc_endpoint&quot;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">defer</span><span style="color:#24292E;"> ethClient.</span><span style="color:#005CC5;">Close</span><span style="color:#24292E;">()</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// ...</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// check the first section for this part of the implementation</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// now we will create the shares proof to be verified by the SimpleRollup</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// contract that uses the DAVerifier library</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// get the proof of the shares containing the blob to the data root</span></span>
<span class="line"><span style="color:#24292E;">	sharesProof, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> trpc.</span><span style="color:#005CC5;">ProveShares</span><span style="color:#24292E;">(ctx, </span><span style="color:#005CC5;">16</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">uint64</span><span style="color:#24292E;">(blobShareRange.Start), </span><span style="color:#005CC5;">uint64</span><span style="color:#24292E;">(blobShareRange.End))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// use the SimpleRollup contract binding to submit to it a fraud proof</span></span>
<span class="line"><span style="color:#24292E;">	simpleRollupWrapper, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> client.</span><span style="color:#005CC5;">NewWrappers</span><span style="color:#24292E;">(ethcmn.</span><span style="color:#005CC5;">HexToAddress</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;contract_Address&quot;</span><span style="color:#24292E;">), ethClient)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// submit the fraud proof containing the share data that had the invalid state transition for example</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// along with its proof</span></span>
<span class="line"><span style="color:#24292E;">	err </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">submitFraudProof</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">		ctx,</span></span>
<span class="line"><span style="color:#24292E;">		simpleRollupWrapper,</span></span>
<span class="line"><span style="color:#24292E;">		sharesProof,</span></span>
<span class="line"><span style="color:#24292E;">		event.ProofNonce.</span><span style="color:#005CC5;">Uint64</span><span style="color:#24292E;">(),</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#005CC5;">uint64</span><span style="color:#24292E;">(tx.Height),</span></span>
<span class="line"><span style="color:#24292E;">		dcProof.Proof,</span></span>
<span class="line"><span style="color:#24292E;">		blockRes.Block.DataHash,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">submitFraudProof</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">	ctx context.Context,</span></span>
<span class="line"><span style="color:#24292E;">	simpleRollup </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Wrappers,</span></span>
<span class="line"><span style="color:#24292E;">	sharesProof types.ShareProof,</span></span>
<span class="line"><span style="color:#24292E;">	nonce </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	height </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#24292E;">	dataRoot []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">) </span><span style="color:#D73A49;">error</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> blockDataRoot [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> dataRoot[</span><span style="color:#005CC5;">58</span><span style="color:#24292E;">:] {</span></span>
<span class="line"><span style="color:#24292E;">		blockDataRoot[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	tx, err </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> simpleRollup.</span><span style="color:#005CC5;">SubmitFraudProof</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">bind.TransactOpts{</span></span>
<span class="line"><span style="color:#24292E;">			Context: ctx,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		client.SharesProof{</span></span>
<span class="line"><span style="color:#24292E;">			Data:             sharesProof.Data,</span></span>
<span class="line"><span style="color:#24292E;">			ShareProofs:      </span><span style="color:#005CC5;">toNamespaceMerkleMultiProofs</span><span style="color:#24292E;">(sharesProof.ShareProofs),</span></span>
<span class="line"><span style="color:#24292E;">			Namespace:        </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">namespace</span><span style="color:#24292E;">(sharesProof.NamespaceID),</span></span>
<span class="line"><span style="color:#24292E;">			RowRoots:         </span><span style="color:#005CC5;">toRowRoots</span><span style="color:#24292E;">(sharesProof.RowProof.RowRoots),</span></span>
<span class="line"><span style="color:#24292E;">			RowProofs:        </span><span style="color:#005CC5;">toRowProofs</span><span style="color:#24292E;">(sharesProof.RowProof.Proofs),</span></span>
<span class="line"><span style="color:#24292E;">			AttestationProof: </span><span style="color:#005CC5;">toAttestationProof</span><span style="color:#24292E;">(nonce, height, blockDataRoot, dataRootInclusionProof),</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		blockDataRoot,</span></span>
<span class="line"><span style="color:#24292E;">	)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> err </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">nil</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> err</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#6A737D;">// wait for transaction</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toAttestationProof</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">	nonce </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	height </span><span style="color:#D73A49;">uint64</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	blockDataRoot [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">	dataRootInclusionProof merkle.Proof,</span></span>
<span class="line"><span style="color:#24292E;">) client.AttestationProof {</span></span>
<span class="line"><span style="color:#24292E;">	sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">( [][</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(dataRootInclusionProof.Aunts))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, sideNode </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> dataRootInclusionProof.Aunts {</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> bzSideNode [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> k, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> sideNode {</span></span>
<span class="line"><span style="color:#24292E;">			bzSideNode[k] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bzSideNode</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> client.AttestationProof{</span></span>
<span class="line"><span style="color:#24292E;">		TupleRootNonce: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(nonce)),</span></span>
<span class="line"><span style="color:#24292E;">		Tuple:          client.DataRootTuple{</span></span>
<span class="line"><span style="color:#24292E;">			Height:   big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(height)),</span></span>
<span class="line"><span style="color:#24292E;">			DataRoot: blockDataRoot,</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">		Proof:          client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">			Key:       big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(dataRootInclusionProof.Index),</span></span>
<span class="line"><span style="color:#24292E;">			NumLeaves: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(dataRootInclusionProof.Total),</span></span>
<span class="line"><span style="color:#24292E;">		},</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toRowRoots</span><span style="color:#24292E;">(roots []bytes.HexBytes) []client.NamespaceNode {</span></span>
<span class="line"><span style="color:#24292E;">	rowRoots </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceNode, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(roots))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, root </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> roots {</span></span>
<span class="line"><span style="color:#24292E;">		rowRoots[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">toNamespaceNode</span><span style="color:#24292E;">(root.</span><span style="color:#005CC5;">Bytes</span><span style="color:#24292E;">())</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> rowRoots</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toRowProofs</span><span style="color:#24292E;">(proofs []</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">merkle.Proof) []client.BinaryMerkleProof {</span></span>
<span class="line"><span style="color:#24292E;">	rowProofs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.BinaryMerkleProof, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proofs))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, proof </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proofs {</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">( [][</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proof.Aunts))</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> j, sideNode </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;">  </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proof.Aunts {</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> bzSideNode [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">			</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> k, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> sideNode {</span></span>
<span class="line"><span style="color:#24292E;">				bzSideNode[k] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">			}</span></span>
<span class="line"><span style="color:#24292E;">			sideNodes[j] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> bzSideNode</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;"> 		rowProofs[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> client.BinaryMerkleProof{</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">			Key:       big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Index),</span></span>
<span class="line"><span style="color:#24292E;">			NumLeaves: big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(proof.Total),</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toNamespaceMerkleMultiProofs</span><span style="color:#24292E;">(proofs []</span><span style="color:#D73A49;">*</span><span style="color:#24292E;">tmproto.NMTProof) []client.NamespaceMerkleMultiproof {</span></span>
<span class="line"><span style="color:#24292E;">	shareProofs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceMerkleMultiproof, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proofs))</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, proof </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proofs {</span></span>
<span class="line"><span style="color:#24292E;">		sideNodes </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">make</span><span style="color:#24292E;">([]client.NamespaceNode, </span><span style="color:#005CC5;">len</span><span style="color:#24292E;">(proof.Nodes))</span></span>
<span class="line"><span style="color:#24292E;">		</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> j, node </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> proof.Nodes {</span></span>
<span class="line"><span style="color:#24292E;">			sideNodes[j] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">*</span><span style="color:#005CC5;">toNamespaceNode</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">		shareProofs[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> client.NamespaceMerkleMultiproof{</span></span>
<span class="line"><span style="color:#24292E;">			BeginKey:  big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(proof.Start)),</span></span>
<span class="line"><span style="color:#24292E;">			EndKey:    big.</span><span style="color:#005CC5;">NewInt</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">int64</span><span style="color:#24292E;">(proof.End)),</span></span>
<span class="line"><span style="color:#24292E;">			SideNodes: sideNodes,</span></span>
<span class="line"><span style="color:#24292E;">		}</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> shareProofs</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">minNamespace</span><span style="color:#24292E;">(innerNode []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">:</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">maxNamespace</span><span style="color:#24292E;">(innerNode []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">29</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> innerNode[</span><span style="color:#005CC5;">30</span><span style="color:#24292E;">:</span><span style="color:#005CC5;">57</span><span style="color:#24292E;">] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">toNamespaceNode</span><span style="color:#24292E;">(node []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.NamespaceNode {</span></span>
<span class="line"><span style="color:#24292E;">	minNs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">minNamespace</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">	maxNs </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">maxNamespace</span><span style="color:#24292E;">(node)</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> digest [</span><span style="color:#005CC5;">32</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> node[</span><span style="color:#005CC5;">58</span><span style="color:#24292E;">:] {</span></span>
<span class="line"><span style="color:#24292E;">		digest[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.NamespaceNode{</span></span>
<span class="line"><span style="color:#24292E;">		Min:    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">minNs,</span></span>
<span class="line"><span style="color:#24292E;">		Max:    </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">maxNs,</span></span>
<span class="line"><span style="color:#24292E;">		Digest: digest,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">func</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">namespace</span><span style="color:#24292E;">(namespaceID []</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">*</span><span style="color:#24292E;">client.Namespace {</span></span>
<span class="line"><span style="color:#24292E;">	version </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> namespaceID[</span><span style="color:#005CC5;">0</span><span style="color:#24292E;">]</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">var</span><span style="color:#24292E;"> id [</span><span style="color:#005CC5;">28</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">for</span><span style="color:#24292E;"> i, b </span><span style="color:#D73A49;">:=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">range</span><span style="color:#24292E;"> namespaceID[</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">:] {</span></span>
<span class="line"><span style="color:#24292E;">		id[i] </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> b</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">	</span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">&amp;</span><span style="color:#24292E;">client.Namespace{</span></span>
<span class="line"><span style="color:#24292E;">		Version: [</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">]</span><span style="color:#D73A49;">byte</span><span style="color:#24292E;">{version},</span></span>
<span class="line"><span style="color:#24292E;">		Id:      id,</span></span>
<span class="line"><span style="color:#24292E;">	}</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div><p>For the step (2), check the <a href="https://github.com/celestiaorg/blobstream-contracts/blob/master/docs/inclusion-proofs.md" target="_blank" rel="noreferrer">rollup inclusion proofs documentation</a> for more information.</p><h2 id="conclusion" tabindex="-1">Conclusion <a class="header-anchor" href="#conclusion" aria-label="Permalink to &quot;Conclusion&quot;">​</a></h2><p>After creating all the proofs, and verifying them:</p><ol><li>Verify inclusion proof of the transaction to Celestia data root</li><li>Prove that the data root tuple is committed to by the Blobstream X smart contract</li></ol><p>We can be sure that the data was published to Celestia, and then rollups can proceed with their normal fraud proving mechanism.</p><div class="tip custom-block"><p class="custom-block-title">NOTE</p><p>The above proof constructions are implemented in Solidity, and may require different approaches in other programming languages.</p></div>`,109),c=[t];function r(E,y,i,d,F,h){return n(),a("div",null,c)}const b=s(e,[["render",r]]);export{m as __pageData,b as default};
