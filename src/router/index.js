import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import User from '../components/user/User.vue'
// import Welcome from '../components/user/Welcome.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
// import Goods from '../components/goods/Goods.vue'
// import Params from '../components/goods/Params.vue'
// import Categories from '../components/goods/Categories.vue'
// import Add from '../components/goods/Add.vue'
// import Order from '../components/order/Order.vue'
// import Orders from '../components/report/Reports.vue'
// 路由懒加载
const Home = () => import(
  /* webpackChunkName: "login-home-welcome" */
  '../components/Home.vue')
const Login = () => import(
  /* webpackChunkName: "login-home-welcome" */
  '../components/Login.vue')
const User = () => import(
  /* webpackChunkName: "shop-power" */
  '../components/user/User.vue')
const Welcome = () => import(
  /* webpackChunkName: "login-home-welcome" */
  '../components/user/Welcome.vue')
const Rights = () => import(
  /* webpackChunkName: "shop-power" */
  '../components/power/Rights.vue')
const Roles = () => import(
  /* webpackChunkName: "shop-power" */
  '../components/power/Roles.vue')
const Goods = () => import(
  /* webpackChunkName: "shop-goods" */
  '../components/goods/Goods.vue')
const Params = () => import(
  /* webpackChunkName: "shop-goods" */
  '../components/goods/Params.vue')
const Categories = () => import(
  /* webpackChunkName: "Shop-Cate" */
  '../components/goods/Categories.vue')
const Add = () => import(
  /* webpackChunkName: "Shop-Cate" */
  '../components/goods/Add.vue')
const Order = () => import(
  /* webpackChunkName: "shop-order" */
  '../components/order/Order.vue')
const Orders = () => import(
  /* webpackChunkName: "shop-order" */
  '../components/report/Reports.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: User
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/params',
          component: Params
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/add',
          component: Add
        },
        {
          path: '/orders',
          component: Order
        },
        {
          path: '/reports',
          component: Orders
        }
      ]
    }
  ]
})

// 挂载路由导航
// to 代表需要跳转的路由 from 代表从哪个路径来 next()放行 next('/login)强制跳转
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
