<script>
export default {
  name: 'Article',
  data() {
    return {
      form: {
        title: '',
        status: '',
        author: '',
        category: '',
        date: ''
      }
    }
  }
}
</script>

<template>
  <div class="article">
    <el-container>
      <el-header>
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="请输入标题" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择状态" size="mini">
              <el-option label="草稿" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="form.author" placeholder="请输入作者" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="form.category" placeholder="请选择分类" size="mini">
              <el-option label="前端" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="form.date"
              type="date range"
              size="mini"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </el-header>
      <el-main></el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">

</style>
