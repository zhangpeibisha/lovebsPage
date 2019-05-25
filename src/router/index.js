import Vue from 'vue'
import Router from 'vue-router'

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

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        turnTo(to, user.access, next)
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router

