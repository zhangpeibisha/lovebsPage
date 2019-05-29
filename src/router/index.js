import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

export const constantRouterMap = [
  {path: '/login', component: () => import('@/views/login/index'), hidden: false},
  {path: '/question/card/edit', component: () => import('@/views/question/card/index'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {title: '首页', icon: 'home'},
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      role: ['MANGER', 'TEACHER', 'STUDENT'],
      meta: {title: '首页', icon: 'home'}
    }]
  }
];


const router = new Router({
  mode: 'hash', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
});

export default router

//异步挂载的路由
//动态需要根据权限加载的路由表
export const asyncRouterMap = [

  {
    path: '/center',
    component: Layout,
    name: 'center',
    meta: {title: '个人信息中心', icon: 'product'},
    role: ['MANGER', 'TEACHER', 'STUDENT'],
    children: [
      {
        path: 'teacher',
        name: 'teacher',
        component: () => import('@/views/center/teacher'),
        meta: {title: '个人中心(老师)', icon: 'home'},
        role: ['TEACHER', 'MANGER']
      },
      {
        path: 'student',
        name: 'student',
        component: () => import('@/views/center/student'),
        role: ['STUDENT'],
        meta: {title: '个人中心(学生)', icon: 'home'}
      }
    ]
  },
  {
    path: '/school',
    component: Layout,
    name: 'student',
    meta: {title: '学校信息', icon: 'product'},
    role: ['MANGER'],
    children: [{
      path: 'faculty',
      name: 'faculty',
      role: ['MANGER'],
      component: () => import('@/views/student/faculty/index'),
      meta: {title: '学院管理', icon: 'product-list'}
    },
      {
        path: 'manager',
        name: 'manager',
        component: () => import('@/views/student/manager/index'),
        meta: {title: '学生管理', icon: 'product-list'},
        role: ['MANGER']
      },

      {
        path: 'profession',
        name: 'profession',
        component: () => import('@/views/student/profession/index'),
        meta: {title: '专业管理', icon: 'product-list'},
        role: ['MANGER']
      },
      {
        path: 'class',
        name: 'class',
        component: () => import('@/views/student/class/index'),
        meta: {title: '班级管理', icon: 'product-list'},
        role: ['MANGER']
      }, {
        path: 'manger',
        name: 'manger',
        component: () => import('@/views/student/teacher/index'),
        meta: {title: '老师列表', icon: 'product-list'},
        role: ['MANGER']
      },
    ]
  }, {
    path: "/task",
    name: "task",
    component: Layout,
    meta: {title: "教学任务", icon: 'example'},
    role: ['MANGER', 'TEACHER', 'STUDENT'],
    children: [
      {
        path: 'course',
        name: 'course',
        component: () => import('@/views/student/course/index'),
        meta: {title: '课程信息', icon: 'product-list'},
        role: ['MANGER']
      }, {
        path: 'teachTask',
        name: 'course',
        component: () => import('@/views/task/teachCourse/index'),
        meta: {title: '教学任务', icon: 'product-list'},
        role: ['TEACHER', 'MANGER', 'STUDENT']
      },
      {
        path: 'reply',
        name: 'reply',
        component: () => import('@/views/question/card/edit'),
        meta: {title: '回答评教表', icon: 'product-list'},
        hidden: true,
        role: ['STUDENT']
      },{
        path: 'view',
        name: 'view',
        component: () => import('@/views/question/card/view'),
        meta: {title: '查看评教表', icon: 'product-list'},
        hidden: true,
        role: ['MANGER', 'TEACHER','STUDENT']
      }
    ]
  },
  {
    path: "/rbac",
    name: "rbac",
    component: Layout,
    meta: {title: "权限管理", icon: 'example'},
    role: ['MANGER'],
    children: [{
      path: 'resource',
      name: 'resource',
      component: () => import('@/views/rbac/resource/resourceList'),
      meta: {title: '资源列表', icon: 'product-list'}
    }, {
      path: 'role',
      name: '/role',
      component: () => import('@/views/rbac/resource/roleList'),
      meta: {title: '角色列表', icon: 'product-list'}
    }
    ]
  },
  {
    path: '/questionnaire',
    component: Layout,
    name: 'questionnaire',
    meta: {title: '教学质量评测', icon: 'product'},
    role: ['MANGER', 'TEACHER'],
    children: [
      {
        path: 'create',
        name: 'create',
        component: () => import('@/views/question/card/create'),
        meta: {title: '创建评教表', icon: 'product-list'},
        role: ['MANGER']
      }, {
        path: 'listView',
        name: 'listView',
        component: () => import('@/views/question/list/index'),
        meta: {title: '评教表列表', icon: 'product-add'},
        role: ['MANGER']
      }, {
        path: 'statisticsScore',
        name: 'statisticsScore',
        component: () => import('@/views/question/statistics/index'),
        meta: {title: '查询统计信息', icon: 'product-add'},
        role: ['MANGER', 'TEACHER'],
        hidden: true
      }
    ],
  },
  {path: '/404', component: () => import('@/views/404'), hidden: true},
  {path: '*', redirect: '/404', hidden: true},

];
