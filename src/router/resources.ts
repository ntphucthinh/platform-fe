import type { ResourceProps } from '@refinedev/core';

export const resources: ResourceProps[] = [
  {
    name: 'dashboard',
    list: '/',
    meta: {
      label: 'Tong quan',
    },
  },
  {
    name: 'users',
    list: '/users/list',
    create: '/users/create',
    edit: '/users/edit/:id',
    meta: {
      label: 'Nguoi dung',
    },
  },
];
