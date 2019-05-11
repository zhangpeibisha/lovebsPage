import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import Center from '../views/center/student'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
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
        meta: {title: '个人', icon: 'home'}
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
    }]
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
        meta: {title: '问卷编辑', icon: 'product-add'}
      }
    ]
  },
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

