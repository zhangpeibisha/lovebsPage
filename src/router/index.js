import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import Cookies from 'js-cookie'
Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Center from '../views/center/student'

const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: false},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {path: '/question/card/edit', component: () => import('@/views/question/card/index'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {title: '首页', icon: 'home'},
    children: [{
      path: '/home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    },
      {
        path: '/teacherCenter',
        name: 'teacherCenter',
        component: () => import('@/views/center/teacher'),
        meta: {title: '个人中心', icon: 'home'}
        // hidden: true
      },
      {
        path: '/studentCenter',
        name: 'studentCenter',
        component: () => import('@/views/center/student'),
        meta: {title: '个人中心', icon: 'home'}
        // hidden: true
      }
    ]
  },
  {
    path: '/student',
    component: Layout,
    redirect: '/student/manager',
    name: 'student',
    meta: {title: '学生', icon: 'product'},
    children: [{
      path: 'faculty',
      name: 'faculty',
      component: () => import('@/views/student/faculty/index'),
      meta: {title: '学院管理', icon: 'product-list'}
    },
      {
        path: 'manager',
        name: 'manager',
        component: () => import('@/views/student/manager/index'),
        meta: {title: '学生管理', icon: 'product-list'}
      },

      {
        path: 'profession',
        name: 'profession',
        component: () => import('@/views/student/profession/index'),
        meta: {title: '专业管理', icon: 'product-list'}
      },


      {
        path: 'class',
        name: 'class',
        component: () => import('@/views/student/class/index'),
        meta: {title: '班级管理', icon: 'product-list'}
      }
    ]
  },
  {
    path: "/teacher",
    name: "teacher",
    component: Layout,
    alwaysShow: true,
    meta: {title: "老师管理", icon: 'example'},
    hidden: false,
    children: [
      {
        path: 'manger',
        name: 'manger',
        component: () => import('@/views/student/teacher/index'),
        meta: {title: '老师列表', icon: 'example.svg'},
        hidden: false
      },
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/student/course/index'),
        meta: {title: '课程列表', icon: 'example.svg'},
        hidden: false
      }
    ]
  },
  {
    path: "/rbac",
    name: "rbac",
    component: Layout,
    alwaysShow: true,
    meta: {title: "资源管理", icon: 'example'},
    hidden: false,
    children: [
      {
        path: 'resourceList',
        name: 'resourceList',
        component: () => import('@/views/rbac/resource/resourceList'),
        meta: {title: '资源列表', icon: 'example.svg'},
        hidden: false
      }
      ,
      {
        path: 'roleList',
        name: 'roleList',
        component: () => import('@/views/rbac/resource/roleList'),
        meta: {title: '角色列表', icon: 'example.svg'}
      }
    ]
  },
  {path: '*', redirect: '/404', hidden: true},

  {
    path: '/questionnaire',
    component: Layout,
    // redirect: '/Questionnaire/Establish',
    alwaysShow: true,
    name: 'questionnaire',
    meta: {title: '问卷调查', icon: 'product'},
    children: [
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/question/card/create'),
        meta: {title: '创建问卷', icon: 'product-add'}
      },
      {
        path: 'view',
        name: 'view',
        component: () => import('@/views/question/card/view'),
        meta: {title: '问卷查看', icon: 'product-add'}
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/question/card/edit'),
        meta: {title: '问卷回答', icon: 'product-add'}
      }, {
        path: 'listView',
        name: 'listView',
        component: () => import('@/views/question/list/index'),
        meta: {title: '问卷列表', icon: 'product-add'}
      }
    ]
  },
]
const router =  new Router({
  mode: 'hash', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
});
const TOKEN_KEY = "SESSION";
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return true
}
/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  // const routePermissionJudge = (list) => {
  //   return list.some(item => {
  //     if (item.children && item.children.length) {
  //       return routePermissionJudge(item.children)
  //     } else if (item.name === name) {
  //       return hasAccess(access, item)
  //     }
  //   })
  // }
  // return routePermissionJudge(routes)
  routes.splice(3,1);
  console.log("name:",name);
  return true;
}
/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
const title = '毕业设计题目征集系统'
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}


export const getRouteTitleHandled = (route) => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}
export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}
const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, constantRouterMap)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}
const LOGIN_PAGE_NAME = 'login'
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken();
  console.log(to)
  if (!token && (to.name !== LOGIN_PAGE_NAME && to.fullPath != "/login") ) {
    console.log(11111)
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
    // next() // 跳转
  } else 
  if (!token && (to.name === LOGIN_PAGE_NAME || to.fullPath === "/login")) {
    console.log(22222)
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  }
   else if (token &&  (to.name === LOGIN_PAGE_NAME || to.fullPath === "/login")) {
    console.log(3333)
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    // if (store.state.user.hasGetInfo) {
    //   console.log(4444)
    //   turnTo(to, store.state.user.access, next)
    // } else {
      console.log(55555)
      // store.dispatch('getInfo').then(user => {
      //   user = {
      //     access : "student"
      //   }
      //   console.log("info",user)
      //   // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      //   turnTo(to, user.access, next)
      // }).catch(() => {
      //   setToken('')
      //   next({
      //     name: 'login'
      //   })
      // })
      let user = {
        access : "student"
      }
      console.log("info",user)
      // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      turnTo(to, user.access, next)
    // }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router

