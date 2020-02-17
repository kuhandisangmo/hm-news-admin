<template>
  <div class="login">
    <el-form ref="form" :model="form" label-width="40px">
      <el-form-item label="账号">
        <el-input v-model="form.username" placeholder="请输入账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      if (this.form.username === '') {
        this.$message.error('用户名不能为空')
        return
      }
      if (this.form.password === '') {
        this.$message.error('密码不能为空')
        return
      }
      const res = await this.$axios.post('/login', this.form)
      console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.$message.success('登陆成功')
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        this.$router.push('/')
      } else {
        this.$message.error('用户名或者密码错误')
      }
    },
    reset () {
      this.form.name = ''
      this.form.password = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  .el-form{
    width: 400px;
    padding: 20px;
    margin: 200px auto;
    background-color: #fff;
    overflow: hidden;
    border: 1px solid #ccc;
  }
}
</style>
