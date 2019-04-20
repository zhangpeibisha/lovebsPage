import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

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
  {path: '/login', component: () => import('@/views/login/index'), hidden: true},
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: {title: '首页', icon: 'home'}
    }]
  },
  {
    path: '/pms',
    component: Layout,
    redirect: '/pms/product',
    alwaysShow: true,
    name: 'pms',
    meta: {title: '学生', icon: 'product'},
    children: [{
      path: 'product',
      name: 'product',
      component: () => import('@/views/pms/product/index'),
      meta: {title: '学生管理', icon: 'product-list'}
    },
      {
        path: 'addProduct',
        name: 'addProduct',
        component: () => import('@/views/student/manager/index'),
        meta: {title: '问卷数据', icon: 'product-add'}
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
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

