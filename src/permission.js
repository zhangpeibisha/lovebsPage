import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import {constantRouterMap} from '@/router/index'

const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      const roles = store.state.user.roles;
      console.log("roles111111",roles);
      console.log("roles222222",store.getters.roles);
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log("路由拉取用户数据为：",res);
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/login' })
          })
        })
      } else {
        turnTo(to,roles,next)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done() // 结束Progress
});


/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routers) => {
  console.log("name",name,"access",access,"routers",routers);
  access = 'S';
  let c = (obj) => {
    if ( typeof obj.role=== typeof []) {
      if (obj.role.includes(access)) {
        if (obj.children) {
          obj.children.forEach(child => c(child));
        }
        obj.hidden = false;
      } else {
        obj.hidden = true;
      }
    }
  };
  routers.forEach(a => c(a));
  console.log(routers);
  return true;
};

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, constantRouterMap)) next();// 有权限，可访问
  else next({replace: true, name: 'error_401'}) // 无权限，重定向到401页面
};
