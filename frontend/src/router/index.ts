import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',

      name: 'DnDBattleSimulator',
      component: HomeView,
    },

  ],
});
router.beforeEach((to, from) => {
  document.title = to.name ?? 'Default Title'
})
export default router;
