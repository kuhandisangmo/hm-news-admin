<template>
  <div class="add-post">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>发布文章</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 发布内容 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="form.title" placeholder="请输入文章标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <vue-editor v-model="form.content"></vue-editor>
      </el-form-item>
      <el-form-item label="栏目">
        <el-checkbox-group v-model="form.categories">
          <el-checkbox v-for="item in categoryList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="封面">
        <el-upload
          :action="$axios.defaults.baseURL + '/upload'"
          list-type="picture-card"
          :headers="headers"
          :on-success="handleSuccess"
          :on-remove="handleRemove"
          :file-list="this.form.cover">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">文章</el-radio>
          <el-radio :label="2">视频</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="publish">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  // 注册局部组件
  components: {
    VueEditor
  },
  data () {
    return {
      form: {
        title: '',
        content: '',
        categories: [],
        cover: [],
        type: 1
      },
      // 修改页面跳转过来的ID
      postId: '',
      // 栏目列表
      categoryList: [],
      // 请求头
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  created () {
    // 获取文章id
    this.postId = this.$route.params.id
    console.log(this.postId)
    this.getCategoryList()
    // 如果是编辑文章,需要数据回显
    if (this.postId) {
      // 发送请求,获取文章的详细信息
      this.getPostDetail(this.postId)
    }
  },
  methods: {
    async getCategoryList () {
      const res = await this.$axios.get('/category')
      // console.log(res)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        // 过滤掉头条
        this.categoryList = data.filter(item => item.id !== 999)
      }
    },
    async getPostDetail (id) {
      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        console.log(data)
        // this.form如果是新增的,那么什么数据都木有,如果是修改,this.form就应该有默认值
        // data中的categories是有问题的,data中categories[{id:1, name: 'zs'}]， 希望的是 [1,2,3]
        data.categories = data.categories.map(item => {
          return item.id
        })
        // 对cover进行处理
        data.cover.forEach(item => {
          item.url = this.$fixUrl(item.url)
        })
        data.content = data.content.replace(/<div/g, '<p')
        data.content = data.content.replace(/<\/div>/g, '</p>')
        this.form = data
      }
    },
    async publish () {
      // 获取所有上传的信息,病修改数据格式保证正确上传
      // 对栏目数据需要处理由于双向绑定的,所以不能直接用form.categories修改需要重新定义一个变量
      const data = { ...this.form }
      data.categories = this.form.categories.map(item => {
        return { id: item }
      })
      console.log(data)

      // 做一个是否有ID的判断,没有ID就是添加,有ID就是修改编辑
      let url
      if (this.postId) {
        url = `/post_update/${this.postId}`
      } else {
        url = '/post'
      }
      // 判断cover长度,必须有一张封面
      if (this.form.cover.length < 1) {
        return
      }
      // 修改完数据可以发送发布请求
      const res = await this.$axios.post(url, data, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      console.log(res)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$router.push('post-list')
        this.$message.success(message)
      }
    },
    handleSuccess (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        this.form.cover.push({
          id: data.id,
          url: this.$axios.defaults.baseURL + data.url
        })
      }
    },
    handleRemove (file) {
      console.log(file)
      // 删除cover中对应的那个file文件
      this.form.cover = this.form.cover.filter(item => item.id !== file.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.add-post{
  .el-form{
    margin-top: 40px;
    .quillWrapper{
      background-color: #fff;
      // 深度选择器 scss 用::v-deep css用 >>>
      ::v-deep .ql-container{
        height: 300px;
      }
    }
  }
}
</style>
