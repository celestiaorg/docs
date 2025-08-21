import{c as e}from"./chunks/constants.c56ae276.js";import{_ as t,o as c,c as r,O as o,k as n,t as p,a}from"./chunks/framework.6b456e69.js";const E={data(){return{constants:e}}},pn=JSON.parse('{"title":"Wallet integrations with Celestia","description":"How you can add Celestia network parameters to wallets such as Keplr, Leap, and Cosmostation.","frontmatter":{"description":"How you can add Celestia network parameters to wallets such as Keplr, Leap, and Cosmostation.","head":[["meta",{"property":"og:title","content":"Wallet integrations with Celestia | Celestia Docs"}],["meta",{"property":"og:description","content":"How you can add Celestia network parameters to wallets such as Keplr, Leap, and Cosmostation."}]]},"headers":[],"relativePath":"tutorials/wallets.md","filePath":"tutorials/wallets.md","lastUpdated":1748948702000}'),i={class:"vp-code-group vp-adaptive-theme"},y={class:"blocks"},d={class:"language-js vp-adaptive-theme active"},F={class:"shiki github-dark vp-code-dark"},u={class:"line"},m={style:{color:"#9ECBFF"}},C={class:"line"},A={style:{color:"#9ECBFF"}},h={class:"line"},q={style:{color:"#9ECBFF"}},w={class:"shiki github-light vp-code-light"},b={class:"line"},g={style:{color:"#032F62"}},B={class:"line"},k={style:{color:"#032F62"}},D={class:"line"},v={style:{color:"#032F62"}},f={class:"language-js vp-adaptive-theme"},I={class:"shiki github-dark vp-code-dark"},N={class:"line"},P={style:{color:"#9ECBFF"}},R={class:"line"},x={style:{color:"#9ECBFF"}},M={class:"line"},S={style:{color:"#9ECBFF"}},L={class:"shiki github-light vp-code-light"},T={class:"line"},U={style:{color:"#032F62"}},K={class:"line"},j={style:{color:"#032F62"}},_={class:"line"},G={style:{color:"#032F62"}},O={class:"language-js vp-adaptive-theme"},H={class:"shiki github-dark vp-code-dark"},W={class:"line"},V={style:{color:"#9ECBFF"}},J={class:"line"},Q={style:{color:"#9ECBFF"}},Y={class:"line"},X={style:{color:"#9ECBFF"}},z={class:"shiki github-light vp-code-light"},Z={class:"line"},$={style:{color:"#032F62"}},ss={class:"line"},ns={style:{color:"#032F62"}},as={class:"line"},ls={style:{color:"#032F62"}},ps={class:"vp-code-group vp-adaptive-theme"},os={class:"blocks"},es={class:"language-js vp-adaptive-theme active"},ts={class:"shiki github-dark vp-code-dark"},cs={class:"line"},rs={style:{color:"#9ECBFF"}},Es={class:"line"},is={style:{color:"#9ECBFF"}},ys={class:"line"},ds={style:{color:"#9ECBFF"}},Fs={class:"shiki github-light vp-code-light"},us={class:"line"},ms={style:{color:"#032F62"}},Cs={class:"line"},As={style:{color:"#032F62"}},hs={class:"line"},qs={style:{color:"#032F62"}},ws={class:"language-js vp-adaptive-theme"},bs={class:"shiki github-dark vp-code-dark"},gs={class:"line"},Bs={style:{color:"#9ECBFF"}},ks={class:"line"},Ds={style:{color:"#9ECBFF"}},vs={class:"line"},fs={style:{color:"#9ECBFF"}},Is={class:"shiki github-light vp-code-light"},Ns={class:"line"},Ps={style:{color:"#032F62"}},Rs={class:"line"},xs={style:{color:"#032F62"}},Ms={class:"line"},Ss={style:{color:"#032F62"}},Ls={class:"language-js vp-adaptive-theme"},Ts={class:"shiki github-dark vp-code-dark"},Us={class:"line"},Ks={style:{color:"#9ECBFF"}},js={class:"line"},_s={style:{color:"#9ECBFF"}},Gs={class:"line"},Os={style:{color:"#9ECBFF"}},Hs={class:"shiki github-light vp-code-light"},Ws={class:"line"},Vs={style:{color:"#032F62"}},Js={class:"line"},Qs={style:{color:"#032F62"}},Ys={class:"line"},Xs={style:{color:"#032F62"}};function zs(Zs,s,$s,sn,l,nn){return c(),r("div",null,[s[95]||(s[95]=o(`<h1 id="wallet-integrations-with-celestia" tabindex="-1">Wallet integrations with Celestia <a class="header-anchor" href="#wallet-integrations-with-celestia" aria-label="Permalink to &quot;Wallet integrations with Celestia&quot;">​</a></h1><p>This page covers how developers can use Keplr and React to add Celestia network parameters to wallets, and how to add custom networks to Leap and Cosmostation.</p><h2 id="add-celestia-network-parameters-to-keplr-with-react" tabindex="-1">Add Celestia network parameters to Keplr with React <a class="header-anchor" href="#add-celestia-network-parameters-to-keplr-with-react" aria-label="Permalink to &quot;Add Celestia network parameters to Keplr with React&quot;">​</a></h2><p>Before we demonstrate how to export the specific parameters for Celestia&#39;s testnets, we need to create a ReactJS component that allows us to connect directly to Keplr and pass it the network parameters.</p><p>In the following code, we show how you can export a component that detects whether Keplr is installed and sets the network params for it:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-AUGYH" id="tab-rngEEOC" checked="checked"><label for="tab-rngEEOC">Keplr</label></div><div class="blocks"><div class="language-jsx vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// @site/src/components/AddNetworkKeplr.js</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> React </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;react&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> styles </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;./Keplr.module.css&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AddNetworkKeplr</span><span style="color:#E1E4E8;">({ </span><span style="color:#FFAB70;">params</span><span style="color:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">async</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">window.keplr) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">alert</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Please install keplr extension&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (window.keplr.experimentalSuggestChain) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> window.keplr.</span><span style="color:#B392F0;">experimentalSuggestChain</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">            chainId: params.chainId,</span></span>
<span class="line"><span style="color:#E1E4E8;">            chainName: params.chainName,</span></span>
<span class="line"><span style="color:#E1E4E8;">            rpc: params.rpc,</span></span>
<span class="line"><span style="color:#E1E4E8;">            rest: params.rest,</span></span>
<span class="line"><span style="color:#E1E4E8;">            bip44: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinType: </span><span style="color:#79B8FF;">118</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">            bech32Config: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixAccAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixAccPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;pub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixValAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valoper&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixValPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valoperpub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixConsAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valcons&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixConsPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valconspub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">            currencies: [</span></span>
<span class="line"><span style="color:#E1E4E8;">              {</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              },</span></span>
<span class="line"><span style="color:#E1E4E8;">            ],</span></span>
<span class="line"><span style="color:#E1E4E8;">            feeCurrencies: [</span></span>
<span class="line"><span style="color:#E1E4E8;">              {</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                gasPriceStep: {</span></span>
<span class="line"><span style="color:#E1E4E8;">                  low: </span><span style="color:#79B8FF;">0.01</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                  average: </span><span style="color:#79B8FF;">0.02</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                  high: </span><span style="color:#79B8FF;">0.1</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                },</span></span>
<span class="line"><span style="color:#E1E4E8;">              },</span></span>
<span class="line"><span style="color:#E1E4E8;">            ],</span></span>
<span class="line"><span style="color:#E1E4E8;">            stakeCurrency: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">          });</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">catch</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">alert</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Failed to suggest the chain&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">chainId</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> params.chainId;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// Enabling before using the Keplr is recommended.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// This method will ask the user whether to allow access if they haven&#39;t visited this website.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// Also, it will request that the user unlock the wallet if the wallet is locked.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> window.keplr.</span><span style="color:#B392F0;">enable</span><span style="color:#E1E4E8;">(chainId);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">div</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">className</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{styles.center}&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#85E89D;">button</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">className</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{styles.keplrButton} </span><span style="color:#B392F0;">onClick</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{add}&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        Add/switch To {params.chainName}</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#85E89D;">button</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">div</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// @site/src/components/AddNetworkKeplr.js</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> React </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;react&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> styles </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;./Keplr.module.css&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AddNetworkKeplr</span><span style="color:#24292E;">({ </span><span style="color:#E36209;">params</span><span style="color:#24292E;"> }) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">async</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">window.keplr) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">alert</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Please install keplr extension&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (window.keplr.experimentalSuggestChain) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> window.keplr.</span><span style="color:#6F42C1;">experimentalSuggestChain</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">            chainId: params.chainId,</span></span>
<span class="line"><span style="color:#24292E;">            chainName: params.chainName,</span></span>
<span class="line"><span style="color:#24292E;">            rpc: params.rpc,</span></span>
<span class="line"><span style="color:#24292E;">            rest: params.rest,</span></span>
<span class="line"><span style="color:#24292E;">            bip44: {</span></span>
<span class="line"><span style="color:#24292E;">              coinType: </span><span style="color:#005CC5;">118</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">            bech32Config: {</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixAccAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixAccPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;pub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixValAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valoper&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixValPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valoperpub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixConsAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valcons&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixConsPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valconspub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">            currencies: [</span></span>
<span class="line"><span style="color:#24292E;">              {</span></span>
<span class="line"><span style="color:#24292E;">                coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              },</span></span>
<span class="line"><span style="color:#24292E;">            ],</span></span>
<span class="line"><span style="color:#24292E;">            feeCurrencies: [</span></span>
<span class="line"><span style="color:#24292E;">              {</span></span>
<span class="line"><span style="color:#24292E;">                coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                gasPriceStep: {</span></span>
<span class="line"><span style="color:#24292E;">                  low: </span><span style="color:#005CC5;">0.01</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                  average: </span><span style="color:#005CC5;">0.02</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                  high: </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                },</span></span>
<span class="line"><span style="color:#24292E;">              },</span></span>
<span class="line"><span style="color:#24292E;">            ],</span></span>
<span class="line"><span style="color:#24292E;">            stakeCurrency: {</span></span>
<span class="line"><span style="color:#24292E;">              coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">          });</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">alert</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Failed to suggest the chain&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">chainId</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> params.chainId;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// Enabling before using the Keplr is recommended.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// This method will ask the user whether to allow access if they haven&#39;t visited this website.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// Also, it will request that the user unlock the wallet if the wallet is locked.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> window.keplr.</span><span style="color:#6F42C1;">enable</span><span style="color:#24292E;">(chainId);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">div</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">className</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{styles.center}&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#22863A;">button</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">className</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{styles.keplrButton} </span><span style="color:#6F42C1;">onClick</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{add}&gt;</span></span>
<span class="line"><span style="color:#24292E;">        Add/switch To {params.chainName}</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#22863A;">button</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">div</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div></div></div><p>We still need to pass the Celestia network parameters to the <code>AddNetworkKeplr</code> function:</p>`,7)),n("div",i,[s[42]||(s[42]=o('<div class="tabs"><input type="radio" name="group-AQagf" id="tab-FwXMAP_" checked="checked"><label for="tab-FwXMAP_">Mainnet Beta</label><input type="radio" name="group-AQagf" id="tab-9M2fjQC"><label for="tab-9M2fjQC">Mocha</label><input type="radio" name="group-AQagf" id="tab-rGqymmE"><label for="tab-rGqymmE">Arabica</label></div>',1)),n("div",y,[n("div",d,[s[12]||(s[12]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[13]||(s[13]=n("span",{class:"lang"},"js",-1)),n("pre",F,[n("code",null,[s[0]||(s[0]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">MAINNET_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",u,[n("span",m,"  chainId: '"+p(l.constants.mainnetChainId)+"',",1)]),s[1]||(s[1]=a(`
`)),s[2]||(s[2]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Celestia',")],-1)),s[3]||(s[3]=a(`
`)),n("span",C,[n("span",A,"  rpc: '"+p(l.constants.mainnetRpcUrl)+"',",1)]),s[4]||(s[4]=a(`
`)),n("span",h,[n("span",q,"  rest: '"+p(l.constants.mainnetRestUrl)+"'",1)]),s[5]||(s[5]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkKeplr</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">MAINNET_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",w,[n("code",null,[s[6]||(s[6]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">MAINNET_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",b,[n("span",g,"  chainId: '"+p(l.constants.mainnetChainId)+"',",1)]),s[7]||(s[7]=a(`
`)),s[8]||(s[8]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Celestia',")],-1)),s[9]||(s[9]=a(`
`)),n("span",B,[n("span",k,"  rpc: '"+p(l.constants.mainnetRpcUrl)+"',",1)]),s[10]||(s[10]=a(`
`)),n("span",D,[n("span",v,"  rest: '"+p(l.constants.mainnetRestUrl)+"'",1)]),s[11]||(s[11]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkKeplr</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">MAINNET_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])]),n("div",f,[s[26]||(s[26]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[27]||(s[27]=n("span",{class:"lang"},"js",-1)),n("pre",I,[n("code",null,[s[14]||(s[14]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">MOCHA_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",N,[n("span",P,"  chainId: '"+p(l.constants.mochaChainId)+"',",1)]),s[15]||(s[15]=a(`
`)),s[16]||(s[16]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Mocha testnet',")],-1)),s[17]||(s[17]=a(`
`)),n("span",R,[n("span",x,"  rpc: '"+p(l.constants.mochaRpcUrl)+"',",1)]),s[18]||(s[18]=a(`
`)),n("span",M,[n("span",S,"  rest: '"+p(l.constants.mochaRestUrl)+"'",1)]),s[19]||(s[19]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkKeplr</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">MOCHA_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",L,[n("code",null,[s[20]||(s[20]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">MOCHA_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",T,[n("span",U,"  chainId: '"+p(l.constants.mochaChainId)+"',",1)]),s[21]||(s[21]=a(`
`)),s[22]||(s[22]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Mocha testnet',")],-1)),s[23]||(s[23]=a(`
`)),n("span",K,[n("span",j,"  rpc: '"+p(l.constants.mochaRpcUrl)+"',",1)]),s[24]||(s[24]=a(`
`)),n("span",_,[n("span",G,"  rest: '"+p(l.constants.mochaRestUrl)+"'",1)]),s[25]||(s[25]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkKeplr</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">MOCHA_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])]),n("div",O,[s[40]||(s[40]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[41]||(s[41]=n("span",{class:"lang"},"js",-1)),n("pre",H,[n("code",null,[s[28]||(s[28]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">ARABICA_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",W,[n("span",V,"  chainId: '"+p(l.constants.arabicaChainId)+"',",1)]),s[29]||(s[29]=a(`
`)),s[30]||(s[30]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Arabica devnet',")],-1)),s[31]||(s[31]=a(`
`)),n("span",J,[n("span",Q,"  rpc: '"+p(l.constants.arabicaRpcUrl)+"',",1)]),s[32]||(s[32]=a(`
`)),n("span",Y,[n("span",X,"  rest: '"+p(l.constants.arabicaRestUrl)+"'",1)]),s[33]||(s[33]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkKeplr</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">ARABICA_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",z,[n("code",null,[s[34]||(s[34]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkKeplr&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">ARABICA_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",Z,[n("span",$,"  chainId: '"+p(l.constants.arabicaChainId)+"',",1)]),s[35]||(s[35]=a(`
`)),s[36]||(s[36]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Arabica devnet',")],-1)),s[37]||(s[37]=a(`
`)),n("span",ss,[n("span",ns,"  rpc: '"+p(l.constants.arabicaRpcUrl)+"',",1)]),s[38]||(s[38]=a(`
`)),n("span",as,[n("span",ls,"  rest: '"+p(l.constants.arabicaRestUrl)+"'",1)]),s[39]||(s[39]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkKeplr</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">ARABICA_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])])])]),s[96]||(s[96]=o(`<p>Now, we can connect to the network that you would like to use in Keplr wallet.</p><h2 id="add-celestia-network-parameters-to-leap-with-react" tabindex="-1">Add Celestia network parameters to Leap with React <a class="header-anchor" href="#add-celestia-network-parameters-to-leap-with-react" aria-label="Permalink to &quot;Add Celestia network parameters to Leap with React&quot;">​</a></h2><p>Before we demonstrate how to export the specific parameters for Celestia&#39;s testnets, we need to create a ReactJS component that allows us to connect directly to Leap and pass it the network parameters.</p><p>In the following code, we show how you can export a component that detects whether Leap is installed and sets the network params for it:</p><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-_F-rP" id="tab-_WOB7IS" checked="checked"><label for="tab-_WOB7IS">Leap</label></div><div class="blocks"><div class="language-jsx vp-adaptive-theme active"><button title="Copy Code" class="copy"></button><span class="lang">jsx</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// @site/src/components/AddNetworkLeap.js</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> React </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;react&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> styles </span><span style="color:#F97583;">from</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;./Leap.module.css&quot;</span><span style="color:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">default</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">AddNetworkLeap</span><span style="color:#E1E4E8;">({ </span><span style="color:#FFAB70;">params</span><span style="color:#E1E4E8;"> }) {</span></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">async</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">function</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">add</span><span style="color:#E1E4E8;">() {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (</span><span style="color:#F97583;">!</span><span style="color:#E1E4E8;">window.leap) {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#B392F0;">alert</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Please install leap extension&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (window.leap.experimentalSuggestChain) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#F97583;">try</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> window.leap.</span><span style="color:#B392F0;">experimentalSuggestChain</span><span style="color:#E1E4E8;">({</span></span>
<span class="line"><span style="color:#E1E4E8;">            chainId: params.chainId,</span></span>
<span class="line"><span style="color:#E1E4E8;">            chainName: params.chainName,</span></span>
<span class="line"><span style="color:#E1E4E8;">            rpc: params.rpc,</span></span>
<span class="line"><span style="color:#E1E4E8;">            rest: params.rest,</span></span>
<span class="line"><span style="color:#E1E4E8;">            bip44: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinType: </span><span style="color:#79B8FF;">118</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">            bech32Config: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixAccAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixAccPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;pub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixValAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valoper&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixValPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valoperpub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixConsAddr: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valcons&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              bech32PrefixConsPub: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&quot;valconspub&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">            currencies: [</span></span>
<span class="line"><span style="color:#E1E4E8;">              {</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              },</span></span>
<span class="line"><span style="color:#E1E4E8;">            ],</span></span>
<span class="line"><span style="color:#E1E4E8;">            feeCurrencies: [</span></span>
<span class="line"><span style="color:#E1E4E8;">              {</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                gasPriceStep: {</span></span>
<span class="line"><span style="color:#E1E4E8;">                  low: </span><span style="color:#79B8FF;">0.01</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                  average: </span><span style="color:#79B8FF;">0.02</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                  high: </span><span style="color:#79B8FF;">0.1</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">                },</span></span>
<span class="line"><span style="color:#E1E4E8;">              },</span></span>
<span class="line"><span style="color:#E1E4E8;">            ],</span></span>
<span class="line"><span style="color:#E1E4E8;">            stakeCurrency: {</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinDenom: </span><span style="color:#9ECBFF;">&quot;TIA&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinMinimalDenom: </span><span style="color:#9ECBFF;">&quot;utia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinDecimals: </span><span style="color:#79B8FF;">6</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">              coinGeckoId: </span><span style="color:#9ECBFF;">&quot;celestia&quot;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">            },</span></span>
<span class="line"><span style="color:#E1E4E8;">          });</span></span>
<span class="line"><span style="color:#E1E4E8;">        } </span><span style="color:#F97583;">catch</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">          </span><span style="color:#B392F0;">alert</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&quot;Failed to suggest the chain&quot;</span><span style="color:#E1E4E8;">);</span></span>
<span class="line"><span style="color:#E1E4E8;">        }</span></span>
<span class="line"><span style="color:#E1E4E8;">      }</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">chainId</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> params.chainId;</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// Enabling before using the Leap is recommended.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// This method will ask the user whether to allow access if they haven&#39;t visited this website.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#6A737D;">// Also, it will request that the user unlock the wallet if the wallet is locked.</span></span>
<span class="line"><span style="color:#E1E4E8;">      </span><span style="color:#F97583;">await</span><span style="color:#E1E4E8;"> window.leap.</span><span style="color:#B392F0;">enable</span><span style="color:#E1E4E8;">(chainId);</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">  </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> (</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;</span><span style="color:#85E89D;">div</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">className</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{styles.center}&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;</span><span style="color:#85E89D;">button</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">className</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{styles.leapButton} </span><span style="color:#B392F0;">onClick</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{add}&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">        Add/switch To {params.chainName}</span></span>
<span class="line"><span style="color:#E1E4E8;">      &lt;/</span><span style="color:#85E89D;">button</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">    &lt;/</span><span style="color:#85E89D;">div</span><span style="color:#E1E4E8;">&gt;</span></span>
<span class="line"><span style="color:#E1E4E8;">  );</span></span>
<span class="line"><span style="color:#E1E4E8;">}</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// @site/src/components/AddNetworkLeap.js</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> React </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;react&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> styles </span><span style="color:#D73A49;">from</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;./Leap.module.css&quot;</span><span style="color:#24292E;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">default</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">AddNetworkLeap</span><span style="color:#24292E;">({ </span><span style="color:#E36209;">params</span><span style="color:#24292E;"> }) {</span></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">async</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">function</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">add</span><span style="color:#24292E;">() {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (</span><span style="color:#D73A49;">!</span><span style="color:#24292E;">window.leap) {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6F42C1;">alert</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Please install leap extension&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (window.leap.experimentalSuggestChain) {</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#D73A49;">try</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> window.leap.</span><span style="color:#6F42C1;">experimentalSuggestChain</span><span style="color:#24292E;">({</span></span>
<span class="line"><span style="color:#24292E;">            chainId: params.chainId,</span></span>
<span class="line"><span style="color:#24292E;">            chainName: params.chainName,</span></span>
<span class="line"><span style="color:#24292E;">            rpc: params.rpc,</span></span>
<span class="line"><span style="color:#24292E;">            rest: params.rest,</span></span>
<span class="line"><span style="color:#24292E;">            bip44: {</span></span>
<span class="line"><span style="color:#24292E;">              coinType: </span><span style="color:#005CC5;">118</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">            bech32Config: {</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixAccAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixAccPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;pub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixValAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valoper&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixValPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valoperpub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixConsAddr: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valcons&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              bech32PrefixConsPub: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&quot;valconspub&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">            currencies: [</span></span>
<span class="line"><span style="color:#24292E;">              {</span></span>
<span class="line"><span style="color:#24292E;">                coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              },</span></span>
<span class="line"><span style="color:#24292E;">            ],</span></span>
<span class="line"><span style="color:#24292E;">            feeCurrencies: [</span></span>
<span class="line"><span style="color:#24292E;">              {</span></span>
<span class="line"><span style="color:#24292E;">                coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                gasPriceStep: {</span></span>
<span class="line"><span style="color:#24292E;">                  low: </span><span style="color:#005CC5;">0.01</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                  average: </span><span style="color:#005CC5;">0.02</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                  high: </span><span style="color:#005CC5;">0.1</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">                },</span></span>
<span class="line"><span style="color:#24292E;">              },</span></span>
<span class="line"><span style="color:#24292E;">            ],</span></span>
<span class="line"><span style="color:#24292E;">            stakeCurrency: {</span></span>
<span class="line"><span style="color:#24292E;">              coinDenom: </span><span style="color:#032F62;">&quot;TIA&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinMinimalDenom: </span><span style="color:#032F62;">&quot;utia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinDecimals: </span><span style="color:#005CC5;">6</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">              coinGeckoId: </span><span style="color:#032F62;">&quot;celestia&quot;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">            },</span></span>
<span class="line"><span style="color:#24292E;">          });</span></span>
<span class="line"><span style="color:#24292E;">        } </span><span style="color:#D73A49;">catch</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">          </span><span style="color:#6F42C1;">alert</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&quot;Failed to suggest the chain&quot;</span><span style="color:#24292E;">);</span></span>
<span class="line"><span style="color:#24292E;">        }</span></span>
<span class="line"><span style="color:#24292E;">      }</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">chainId</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> params.chainId;</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// Enabling before using the Leap is recommended.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// This method will ask the user whether to allow access if they haven&#39;t visited this website.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#6A737D;">// Also, it will request that the user unlock the wallet if the wallet is locked.</span></span>
<span class="line"><span style="color:#24292E;">      </span><span style="color:#D73A49;">await</span><span style="color:#24292E;"> window.leap.</span><span style="color:#6F42C1;">enable</span><span style="color:#24292E;">(chainId);</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">  </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> (</span></span>
<span class="line"><span style="color:#24292E;">    &lt;</span><span style="color:#22863A;">div</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">className</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{styles.center}&gt;</span></span>
<span class="line"><span style="color:#24292E;">      &lt;</span><span style="color:#22863A;">button</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">className</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{styles.leapButton} </span><span style="color:#6F42C1;">onClick</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{add}&gt;</span></span>
<span class="line"><span style="color:#24292E;">        Add/switch To {params.chainName}</span></span>
<span class="line"><span style="color:#24292E;">      &lt;/</span><span style="color:#22863A;">button</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">    &lt;/</span><span style="color:#22863A;">div</span><span style="color:#24292E;">&gt;</span></span>
<span class="line"><span style="color:#24292E;">  );</span></span>
<span class="line"><span style="color:#24292E;">}</span></span></code></pre></div></div></div><p>We still need to pass the Celestia network parameters to the <code>AddNetworkLeap</code> function:</p>`,6)),n("div",ps,[s[85]||(s[85]=o('<div class="tabs"><input type="radio" name="group-spRyl" id="tab-i6nWBMC" checked="checked"><label for="tab-i6nWBMC">Mainnet Beta</label><input type="radio" name="group-spRyl" id="tab-gtn0qoW"><label for="tab-gtn0qoW">Mocha</label><input type="radio" name="group-spRyl" id="tab-vJJUoog"><label for="tab-vJJUoog">Arabica</label></div>',1)),n("div",os,[n("div",es,[s[55]||(s[55]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[56]||(s[56]=n("span",{class:"lang"},"js",-1)),n("pre",ts,[n("code",null,[s[43]||(s[43]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">MAINNET_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",cs,[n("span",rs,"  chainId: '"+p(l.constants.mainnetChainId)+"',",1)]),s[44]||(s[44]=a(`
`)),s[45]||(s[45]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Celestia',")],-1)),s[46]||(s[46]=a(`
`)),n("span",Es,[n("span",is,"  rpc: '"+p(l.constants.mainnetRpcUrl)+"',",1)]),s[47]||(s[47]=a(`
`)),n("span",ys,[n("span",ds,"  rest: '"+p(l.constants.mainnetRestUrl)+"'",1)]),s[48]||(s[48]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkLeap</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">MAINNET_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",Fs,[n("code",null,[s[49]||(s[49]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">MAINNET_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",us,[n("span",ms,"  chainId: '"+p(l.constants.mainnetChainId)+"',",1)]),s[50]||(s[50]=a(`
`)),s[51]||(s[51]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Celestia',")],-1)),s[52]||(s[52]=a(`
`)),n("span",Cs,[n("span",As,"  rpc: '"+p(l.constants.mainnetRpcUrl)+"',",1)]),s[53]||(s[53]=a(`
`)),n("span",hs,[n("span",qs,"  rest: '"+p(l.constants.mainnetRestUrl)+"'",1)]),s[54]||(s[54]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkLeap</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">MAINNET_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])]),n("div",ws,[s[69]||(s[69]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[70]||(s[70]=n("span",{class:"lang"},"js",-1)),n("pre",bs,[n("code",null,[s[57]||(s[57]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">MOCHA_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",gs,[n("span",Bs,"  chainId: '"+p(l.constants.mochaChainId)+"',",1)]),s[58]||(s[58]=a(`
`)),s[59]||(s[59]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Mocha testnet',")],-1)),s[60]||(s[60]=a(`
`)),n("span",ks,[n("span",Ds,"  rpc: '"+p(l.constants.mochaRpcUrl)+"',",1)]),s[61]||(s[61]=a(`
`)),n("span",vs,[n("span",fs,"  rest: '"+p(l.constants.mochaRestUrl)+"'",1)]),s[62]||(s[62]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkLeap</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">MOCHA_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",Is,[n("code",null,[s[63]||(s[63]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">MOCHA_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",Ns,[n("span",Ps,"  chainId: '"+p(l.constants.mochaChainId)+"',",1)]),s[64]||(s[64]=a(`
`)),s[65]||(s[65]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Mocha testnet',")],-1)),s[66]||(s[66]=a(`
`)),n("span",Rs,[n("span",xs,"  rpc: '"+p(l.constants.mochaRpcUrl)+"',",1)]),s[67]||(s[67]=a(`
`)),n("span",Ms,[n("span",Ss,"  rest: '"+p(l.constants.mochaRestUrl)+"'",1)]),s[68]||(s[68]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkLeap</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">MOCHA_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])]),n("div",Ls,[s[83]||(s[83]=n("button",{title:"Copy Code",class:"copy"},null,-1)),s[84]||(s[84]=n("span",{class:"lang"},"js",-1)),n("pre",Ts,[n("code",null,[s[71]||(s[71]=o(`<span class="line"><span style="color:#F97583;">import</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F97583;">export</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">ARABICA_PARAMS</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> {</span><span style="color:#9ECBFF;">\`{</span></span>
`,6)),n("span",Us,[n("span",Ks,"  chainId: '"+p(l.constants.arabicaChainId)+"',",1)]),s[72]||(s[72]=a(`
`)),s[73]||(s[73]=n("span",{class:"line"},[n("span",{style:{color:"#9ECBFF"}},"  chainName: 'Arabica devnet',")],-1)),s[74]||(s[74]=a(`
`)),n("span",js,[n("span",_s,"  rpc: '"+p(l.constants.arabicaRpcUrl)+"',",1)]),s[75]||(s[75]=a(`
`)),n("span",Gs,[n("span",Os,"  rest: '"+p(l.constants.arabicaRestUrl)+"'",1)]),s[76]||(s[76]=o(`
<span class="line"><span style="color:#9ECBFF;">}\`</span><span style="color:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#E1E4E8;">{&lt;</span><span style="color:#79B8FF;">AddNetworkLeap</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">params</span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;">{</span><span style="color:#79B8FF;">ARABICA_PARAMS</span><span style="color:#E1E4E8;">}/&gt;}</span></span>`,6))])]),n("pre",Hs,[n("code",null,[s[77]||(s[77]=o(`<span class="line"><span style="color:#D73A49;">import</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;@site/src/components/AddNetworkLeap&#39;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#D73A49;">export</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">ARABICA_PARAMS</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> {</span><span style="color:#032F62;">\`{</span></span>
`,6)),n("span",Ws,[n("span",Vs,"  chainId: '"+p(l.constants.arabicaChainId)+"',",1)]),s[78]||(s[78]=a(`
`)),s[79]||(s[79]=n("span",{class:"line"},[n("span",{style:{color:"#032F62"}},"  chainName: 'Arabica devnet',")],-1)),s[80]||(s[80]=a(`
`)),n("span",Js,[n("span",Qs,"  rpc: '"+p(l.constants.arabicaRpcUrl)+"',",1)]),s[81]||(s[81]=a(`
`)),n("span",Ys,[n("span",Xs,"  rest: '"+p(l.constants.arabicaRestUrl)+"'",1)]),s[82]||(s[82]=o(`
<span class="line"><span style="color:#032F62;">}\`</span><span style="color:#24292E;">}</span></span>
<span class="line"></span>
<span class="line"><span style="color:#24292E;">{&lt;</span><span style="color:#005CC5;">AddNetworkLeap</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">params</span><span style="color:#D73A49;">=</span><span style="color:#24292E;">{</span><span style="color:#005CC5;">ARABICA_PARAMS</span><span style="color:#24292E;">}/&gt;}</span></span>`,6))])])])])]),s[97]||(s[97]=n("p",null,"Now, we can connect to the network that you would like to use in Leap wallet.",-1)),s[98]||(s[98]=n("h2",{id:"adding-a-custom-chain-to-leap",tabindex:"-1"},[a("Adding a custom chain to Leap "),n("a",{class:"header-anchor",href:"#adding-a-custom-chain-to-leap","aria-label":'Permalink to "Adding a custom chain to Leap"'},"​")],-1)),s[99]||(s[99]=n("p",null,"If you want to add a custom chain to Leap, you can do so by:",-1)),s[100]||(s[100]=n("ol",null,[n("li",null,"Clicking the Cosmos logo in the top corner of Leap wallet"),n("li",null,'Scrolling down and clicking "Add new chain"')],-1)),s[101]||(s[101]=n("p",null,"You can then add the following parameters:",-1)),n("ul",null,[n("li",null,[s[86]||(s[86]=a("Chain Id: ")),n("code",null,p(l.constants.arabicaChainId),1)]),s[90]||(s[90]=n("li",null,[a("Chain Name: "),n("code",null,"Arabica devnet")],-1)),n("li",null,[s[87]||(s[87]=a("New RPC URL: ")),n("code",null,"https://rpc.celestia-"+p(l.constants.arabicaChainId)+".com/",1)]),n("li",null,[s[88]||(s[88]=a("New REST URL: ")),n("code",null,"https://api.celestia-"+p(l.constants.arabicaChainId)+".com",1)]),s[91]||(s[91]=n("li",null,[a("Address Prefix: "),n("code",null,"celestia")],-1)),s[92]||(s[92]=n("li",null,[a("Native Denom: "),n("code",null,"utia")],-1)),s[93]||(s[93]=n("li",null,[a("Coin Type: "),n("code",null,"118")],-1)),s[94]||(s[94]=n("li",null,[a("Decimals: "),n("code",null,"6")],-1)),n("li",null,[s[89]||(s[89]=a("Block explorer URL (optional): ")),n("code",null,"https://explorer.celestia-"+p(l.constants.arabicaChainId)+".com",1)])]),s[102]||(s[102]=o('<p>Now, click <code>Add chain</code> and you will be able to view your Arabica account balance and transactions in Leap wallet.</p><p>You&#39;ll see that you&#39;re connected to Arabica Devnet.</p><h2 id="adding-a-custom-chain-to-cosmostation" tabindex="-1">Adding a custom chain to Cosmostation <a class="header-anchor" href="#adding-a-custom-chain-to-cosmostation" aria-label="Permalink to &quot;Adding a custom chain to Cosmostation&quot;">​</a></h2><p>Click the hamburger menu icon in the top corner of Cosmostation wallet. Scroll down and click &quot;Add Custom Chain&quot;</p><p>You can then add the following parameters:</p><ul><li>Custom Chain name: <code>Mocha testnet</code></li><li>Rest URL: <code>https://api-mocha.pops.one</code></li><li>New RPC URL: <code>https://rpc-mocha.pops.one</code></li><li>Currency symbol: <code>TIA</code></li><li>Address prefix: <code>celestia</code></li><li>Denom: <code>utia</code></li><li>Symbol image URL (optional): <code>https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/celestiatestnet/images/celestia.svg</code></li><li>Explorer URL (optional): <code>https://mintscan.io/celestia-testnet/</code></li><li>Coin Type: <code>118</code></li><li>Decimals: <code>6</code></li><li>Gas rate Tiny: <code>0.1</code></li><li>Gas rate Low: <code>0.25</code></li><li>Gas rate Average: <code>0.5</code></li></ul><p>Now, click <code>Add a custom chain</code> and you will be able to view your Celestia account balance and transactions in Cosmostation wallet.</p><p>Switch chains to &quot;Mocha testnet&quot; and you&#39;ll see that you&#39;re connected to Celestia&#39;s Mocha testnet!</p>',8))])}const on=t(E,[["render",zs]]);export{pn as __pageData,on as default};
