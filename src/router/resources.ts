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
  {
    name: 'itineraries',
    list: '/admin/itineraries',
    show: '/admin/itineraries/preview',
    meta: {
      label: 'Lịch trình du lịch',
    },
  },
  {
    name: 'travel-memories',
    list: '/admin/travel-memories',
    create: '/admin/travel-memories/create',
    edit: '/admin/travel-memories/:id/edit',
    show: '/admin/travel-memories/:id',
    meta: {
      label: 'Kỷ niệm chuyến đi',
    },
  },
];
