<script>
export default {
  name: 'Category',
  data() {
    return {
      formInline: {
        name: ''
      }
    }
  }
}
</script>

<template>
  <div class="category">
    <el-container>
      <el-header>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="名称">
            <el-input v-model="formInline.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button @click="onSubmit">重置</el-button>
          </el-form-item>
        </el-form>
        <el-row>
          <el-button type="primary" icon="el-icon-plus" @click="onSubmit">新增</el-button>
          <el-button type="primary" icon="el-icon-edit" @click="onSubmit">修改</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="onSubmit">删除</el-button>
          <el-button type="primary" icon="el-icon-download" @click="onSubmit">导出</el-button>
        </el-row>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.category{
  .el-container{
    padding: 20px;
  }
}
</style>
