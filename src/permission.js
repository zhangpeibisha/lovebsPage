import router from './router'
import store from './store'
import {Message} from 'element-ui'
import {getToken} from '@/utils/auth' // 验权
import {constantRouterMap, asyncRouterMap} from '@/router/index'

const whiteList = ['/login']; // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log("before===>to", to, "from===>", from, "next==>", next);
  if (getToken()) {
    if (to.path === '/login') {
      next({path: '/home'});
    }else if (to.path === '//home'){
      next({path: '/home'});
    }
    else {
      const aysnRouter = store.state.user.aysnRouter;
      if (store.getters.roles.length === 0 || !aysnRouter) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          console.log("路由拉取用户数据为：", res);
          const aysnRouter = canTurnTo(to, res.roles, asyncRouterMap);
          store.state.user.aysnRouter = aysnRouter;
          if (aysnRouter) {
            aysnRouter.forEach(res => {
              constantRouterMap.push(res);
            })
          }
          console.log("获取到的路由为：", aysnRouter);
          router.addRoutes(aysnRouter);
          next();
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '账号/密码错误');
            next({path: '/login'})
          })
        })
      } else {
        console.log("路由信息：", aysnRouter);
        console.log("constantRouterMap路由信息：", constantRouterMap);
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login');
    }
  }
});

router.afterEach(() => {

});


/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routers) => {
  console.log("开始", "name=>", name, "access=>", access, "routers=>", routers);
  if (!access) {
    return [];
  }
  const roles = [];
  access.forEach(role => {
    roles.push(role.name);
  });

  const tempRouters = routers.filter(v => {
    if (hasPermission(roles, v)) {
      if (v.children && v.children.length > 0) {
        v.children = v.children.filter(child => {
          if (hasPermission(roles, child)) {
            return child
          }
          return false;
        });
        return v
      } else {
        return v
      }
    }
    return false;
  });
  console.log("结束", "name=>", name, "access=>", access, "routers=>", routers);
  return tempRouters;
};

function hasPermission(roles, route) {
  console.log("判断权限,角色==", roles, "路由===", route);
  if (route.role) {
    return roles.some(role => route.role.indexOf(role) >= 0)
  } else {
    return true
  }
}
