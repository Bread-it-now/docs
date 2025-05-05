// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'BreadItNow Docs',
  tagline: '빵잇나우의 개발 문서입니다.',
  favicon: 'img/favicon.png',

  url: 'https://Bread-it-now.github.io',
  baseUrl: '/docs/',
  organizationName: 'Bread-it-now', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

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
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/Bread-it-now/docs/tree/main/dev-docs/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
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
        {to: '/blog', label: '블로그', position: 'left'},
        {
          type: 'docSidebar',
          sidebarId: 'introduction',
          position: 'left',
          label: '소개',
        },
        {
          type: 'docSidebar',
          sidebarId: 'document',
          position: 'left',
          label: '문서',
        },
        {
          href: 'https://github.com/Bread-it-now/docs',
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
              label: 'Introduction',
              to: '/docs/intro',
            },
          ],
        },
        {
          title: '더 보기',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Bread-it-now',
            },
          ],
        },
        {
          title: '문의하기',
          items: [
            {
              label: '문의하기 구글폼',
              href: 'https://forms.gle/hBkNvLrKqBqijvv78 ',
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
