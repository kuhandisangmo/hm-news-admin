<template>
  <div class="post-list">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
        <el-breadcrumb-item>文章列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table
      :data="postList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="序号"
        width="50"
        :index="indexMethod">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题"
        width="400">
      </el-table-column>
      <el-table-column
        prop="user.nickname"
        label="作者"
        width="180">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template v-slot="{row}">{{row.create_date | time}}</template>
      </el-table-column>
      <el-table-column
        prop="cover[0].url"
        label="封面">
        <template v-slot="{row}">
            <img :src="$fixUrl(row.cover[0].url)" alt="">
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template v-slot="{row}">
            <el-button @click="edit(row.id)">编辑</el-button>
            <el-button type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--
      分页组件:
      layout:用于指定分页的展示内容
      backfround:可以添加分页按钮的背景色
      total:用于指定数据总条数
      page-size:用于指定每页显示的条数
      :current-page:用于指定当前页是第几页
      @current-change:当前页发生改变的时候会触发
      :page-sizes = "[100,200]"用于指定每页的条数
     -->
    <el-pagination
      background
      :page-size="pageSize"
      :current-page="pageIndex"
      :page-sizes="[3, 6, 10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 获取数据列表
      postList: [],
      // 第几页
      pageIndex: 1,
      // 每页条数
      pageSize: 3,
      // 总条数
      total: 0
    }
  },
  created () {
    this.getPostList()
  },
  methods: {
    async getPostList () {
      const res = await this.$axios.get('/post', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data, total } = res.data
      if (statusCode === 200) {
        this.postList = data
        this.total = total
      }
      console.log(data)
    },
    handleCurrentChange (val) {
      console.log(val)
      this.pageIndex = val
      // 重新渲染
      this.getPostList()
    },
    handleSizeChange (val) {
      // 如果每页显示的条数发生改变,应该从第一页重新开始渲染
      this.pageIndex = 1
      this.pageSize = val
      this.getPostList()
    },
    // 控制序号
    indexMethod (index) {
      // 序号前面加上前面页数的总条数
      return (this.pageIndex - 1) * this.pageSize + index + 1
    },
    edit (id) {
      console.log(id)
      // 跳转到编辑页面
      this.$router.push({
        name: 'add-post',
        params: {
          id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-list{
    .el-table{
        margin-top: 40px;
        img{
            width: 150px;
            height: 100px;
            object-fit: cover;
        }
    }
    .el-pagination{
      margin-top: 10px;
    }
}
</style>
