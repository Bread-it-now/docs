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
      type: 'doc',
      label: '사용 가이드',
      id: 'introduction/getting-started/usage-guide',
    },
    {
      type: 'category',
      label: '브랜드 아이덴티티',
      items: [
        'introduction/brand-identity/logo',
        'introduction/brand-identity/color',
        'introduction/brand-identity/design-tone',
        'introduction/brand-identity/ux-writing',
        'introduction/brand-identity/summary',
      ],
    },
    {
      type: 'category',
      label: '시스템 아키텍처',
      items: [
        'introduction/architecture/system-design',
        'introduction/architecture/tech-stack',
      ],
    },
  ],
  document: [
{
  type: 'category',
  label: 'Design',
  items: [
    {
      type: 'category',
      label: '디자인 시스템',
      items: [
        'document/design/design-system/overview',
        'document/design/design-system/color-system',
        'document/design/design-system/typography',
        'document/design/design-system/input',
        'document/design/design-system/button',
        'document/design/design-system/thumbnail',
        'document/design/design-system/illustration',
      ],
    },
    'document/design/UT',
  ],
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
