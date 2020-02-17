<template>
  <div class="home">
    <el-container>
      <el-aside width="200px">
        <div class="logo">黑马头条</div>
        <!--
          element ui 导航栏中提动力默认高亮的属性
          default-active 根据地址栏的变化,来确认高亮的导航即可
         -->
        <el-menu
          background-color="#000"
          text-color="#ccc "
          active-text-color="#ffd04b"
          router
          :default-active="$route.path">
          <el-menu-item index="/post-list">
            <i class="el-icon-menu"></i>
            <span slot="title">文章列表</span>
          </el-menu-item>
          <el-menu-item index="/add-post">
            <i class="el-icon-setting"></i>
            <span slot="title">发布文章</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <img :src="$axios.defaults.baseURL+user.head_img" alt="">
          <div class="name">{{user.nickname}}</div>
          <a href="javascrip:;" @click="logout">退出</a>
        </el-header>
        <el-main>
          <!-- 嵌套路由的出口 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  methods: {
    async logout () {
      // 弹出一个提示框
      try {
        await this.$confirm('您确定要退出本系统么?', '提示', { type: 'warning' })
        // 点击了确定
        this.$message.success('退出成功')
        // 删除保存的登录信息
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        // 跳转到登录页
        this.$router.push('/login')
      } catch {
        // 点击取消
        this.$message.info('取消退出')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.home{
    position: absolute;
    width: 100%;
    height: 100%;
    .el-container {
    height: 100%;
  }
   .el-header{
     display:flex;
     align-items: center;
     justify-content: flex-end;
    background-color: #333333;
    color: #ccc;
    text-align: center;
    line-height: 60px;
    img{
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
    }
    .name{
      padding-left: 10px;
      padding-right: 10px;
      color: #ccc;
    }
    a{
      text-decoration: none;
    }
  }

  .el-aside {
    background-color: #000;
    color: #ccc;
    text-align: center;
    .logo{
      height: 60px;
      line-height: 60px;
      font-weight: 700;
    }
  }

  .el-main {
    background-color: #F2F2F2;
    color: #ccc;
    text-align: centesr;
  }
}
</style>
