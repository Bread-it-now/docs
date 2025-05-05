// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BreadItNow Dev Docs',
  tagline: 'BreadItNow 개발 문서',
  favicon: 'img/favicon.ico',

  url: 'https://Bread-it-now.github.io',
  baseUrl: '/docs/',
  organizationName: 'Bread-it-now', // Usually your GitHub org/user name.
  projectName: 'BreadItNow_Docs', // Usually your repo name.

  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'BreadItNow',
      logo: {
        alt: 'BreadItNow Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'default',
          position: 'left',
          label: '문서',
        },
        {
          href: 'https://github.com/Bread-it-now/BreadItNow_Docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '문서',
          items: [
            {
              label: '프로젝트 소개',
              to: '/',
            },
          ],
        },
        {
          title: '더 보기',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/Bread-it-now/BreadItNow_Docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Bread-it-now`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  },
};

export default config;
