---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
titleTemplate: ':title'

hero:
  name: "Celestia"
  text: "The first modular blockchain network"
  tagline: Celestia is a modular consensus and data network, built to enable anyone to easily deploy their own blockchain with minimal overhead.
  image:
    src: /modular.svg
    alt: Celestia
  actions:
    - theme: brand
      text: Run a Node
      link: /developers/node-tutorial
    - theme: alt
      text: Introduction
      link: /developers/test-page

features:
  - title: Build
    details: Deploy your own blockchain in minutes, as easily as a smart contract
    # link: /reference/about#why-celestia
    icon: 🏗️
  - title: Scale
    details: Access the dynamic scaling unlocked by data availability sampling, where scale increases with the number of users
    link: https://celestia.org/glossary/data-availability-sampling/
    icon: 📈
  - title: Customize
    details: Create applications using your favorite VM or define your own
    # link: /reference/about
    icon: ⚙️
  - title: Sovereign
    details: Build sovereign rollups, a new type of self-governing blockchain with minimal platform risk
    link: https://celestia.org/glossary/sovereign-rollup/
    icon: 🏰
---
