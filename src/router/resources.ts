import type { ResourceProps } from '@refinedev/core';

export const resources: ResourceProps[] = [
  {
    name: 'dashboard',
    list: '/admin/dashboard',
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
  {
    name: 'homestay',
    list: '/admin/homestay',
    meta: {
      label: 'Homestay',
    },
  },
];
