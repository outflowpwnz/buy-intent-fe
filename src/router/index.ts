import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useUserStore } from 'src/stores/user-store';
import { useGeneralStore } from 'src/stores/general-store';
import { useQuasar } from 'quasar';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const $q = useQuasar();
    const generalStore = useGeneralStore();
    const userStore = useUserStore();

    if (generalStore.isInitialLoading) {
      $q.loading.show();
      await userStore.checkAuth();
      $q.loading.hide();
      generalStore.setIsInitialLoading(false);
    }

    const isToPathAuth = to.path === '/auth';

    if (userStore.isAuth) {
      if (isToPathAuth) {
        next({ path: '/' });
      } else {
        next();
      }
    } else if (!isToPathAuth) {
      next({ path: '/auth' });
    } else {
      next();
    }
  });

  return Router;
});
