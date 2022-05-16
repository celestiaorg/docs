// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const docs = require('./sidebars');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Celestia Docs',
  tagline: '',
  url: 'https://docs.celestia.org',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'celestiaorg', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  deploymentBranch: 'gh-pages',
  scripts: [{src: 'https://plausible.celestia.org/js/plausible.js', defer: true, 'data-domain': 'docs.celestia.org'}],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          routeBasePath: "/",
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/celestia-logo.png',
      metadata: [{name: 'twitter:card', content: 'summary'}],
      navbar: {
        title: 'Celestia Docs',
        logo: {
          alt: 'Celestia Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            to: '/nodes/overview',
            position: 'left',
            label: 'Run A Node',
          },
          {
            to: '/developers/overview',
            position: 'left',
            label: 'Developers',
          },
          {
            to: '/community/overview',
            position: 'left',
            label: 'Community',
          },
          {
            href: 'https://github.com/celestiaorg/docs',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Run A Node',
                to: '/nodes/overview',
              },
              {
                label: 'Developers',
                to: '/developers/overview',
              },
              {
                label: 'Community',
                to: '/community/overview'
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                href: 'https://discord.com/invite/je7UVpDuDu',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/CelestiaOrg',
              },
              {
                label: 'Forum',
                href: 'https://forum.celestia.org/',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/celestiaorg/docs',
              },
              {
                label: 'Website',
                href: 'https://celestia.org/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Celestia Org Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
