import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store/index';

// Layouts
import DefaultLayout from '@/layouts/Default';
import AuthenticateLayout from '@/layouts/Authenticate';

import Home from '@/views/Home';
import Drive from '@/views/Drive/Index';

Vue.use(VueRouter);

const routes = [
  {
    path: '',
    component: DefaultLayout,
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        name: 'Home',
        props: true,
        component: Home,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () =>
          import(/* webpackChunkName: "profile" */ '@/views/Profile.vue'),
      },
      {
        path: 'drive/:folderId?',
        name: 'Drive',
        props: true,
        component: () =>
          import(/* webpackChunkName: "drive" */ '@/views/Drive/Index.vue'),
      },
    ],
  },
  {
    path: '',
    component: AuthenticateLayout,
    meta: {
      requiresAuth: false,
    },
    children: [
      {
        path: '/login',
        name: 'Login',
        component: () =>
          import(
            /* webpackChunkName: "login" */ '@/views/Authenticate/Login.vue'
          ),
      },
      {
        path: '/signup',
        name: 'SignUp',
        component: () =>
          import(
            /* webpackChunkName: "signup" */ '@/views/Authenticate/SignUp.vue'
          ),
      },
      {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () =>
          import(
            /* webpackChunkName: "forgot-password" */ '@/views/Authenticate/ForgotPassword.vue'
          ),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!store.getters['auth/isLoggedIn']) {
      next({
        name: 'Login',
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
    next();
  } else {
    next();
  }
});

export default router;
