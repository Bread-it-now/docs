/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  default: [
    {
      type: 'doc',
      id: 'intro',
      label: '개요',
    },
    {
      type: 'category',
      label: '사용 가이드',
      items: ['usage/getting-started'],
    },
    {
      type: 'category',
      label: '시스템 아키텍처',
      items: ['architecture/system-design'],
    },
  ],
};

export default sidebars;