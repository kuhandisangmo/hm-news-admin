import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../page/login.vue'
import Home from '../page/home.vue'
import PostList from '../page/postList.vue'
import AddPost from '../page/addPost.vue'

// 使用路由
Vue.use(VueRouter)

// 创建路由实例
const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home',
      children: [
        { path: 'post-list', component: PostList, name: 'post-list' },
        { path: 'add-post', component: AddPost, name: 'add-post' }
      ]
    },
    { path: '/login', component: Login, name: 'login' }
  ]
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// 导航守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  // if (to.path !== '/login') {
  //   if (token) {
  //     next()
  //   } else {
  //     router.push('/login')
  //   }
  // } else {
  //   next()
  // }
  if (to.path === '/login' || token) {
    next()
  } else {
    router.push('/login')
  }
})
export default router
