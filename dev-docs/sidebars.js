/**
 * @type {import('@docusaurus/plugin-content-docs').SidebarsConfig}
 */
const sidebars = {
  introduction: [
    {
      type: 'doc',
      id: 'intro',
      label: '개요',
    },
    {
      type: 'category',
      label: '사용 가이드',
      items: ['introduction/usage/getting-started'],
    },
    {
      type: 'category',
      label: '시스템 아키텍처',
      items: ['introduction/architecture/system-design'],
    },
    {
      type: 'doc',
      label: '핵심 기능에 대한 사용 가이드',
      id: 'usage-guide/useage-guide',
    },
  ],
  document: [
    {
      type: 'category',
      label: 'Design',
      items: ['document/design/index'],
    },
    {
      type: 'category',
      label: 'Frontend',
      items: ['document/frontend/index'],
    },
    {
      type: 'category',
      label: 'Backend',
      items: [
        'document/backend/index',
        {
          type: 'category',
          label: '리팩토링',
          items: [
            'document/backend/refactoring/guide',
            'document/backend/refactoring/ddd-develop-guide',
          ],
        },
      ],
    },
  ],
};

export default sidebars;
