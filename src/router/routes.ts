import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/main-layout.vue'),
    children: [
      { path: '/auth', component: () => import('pages/auth-page.vue') },
      { path: '/requests', component: () => import('pages/requests-page.vue') },
      { path: '/success-messages', component: () => import('pages/sucess-messages-page.vue') },
      {
        path: '/worked-out-messages',
        component: () => import('pages/worked-out-messages-page.vue'),
      },
      { path: '/requests/edit/:id', component: () => import('pages/request-edit-page.vue') },
      { path: '/requests/add', component: () => import('pages/request-add-page.vue') },
      { path: '', redirect: '/requests' },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/error-not-found.vue'),
  },
];

export default routes;
