<script>
import axios from 'axios'
import { BASE_URL, TOKEN } from '@/config/config'

export default {
  name: 'Category',
  data() {
    return {
      queryForm: {
        name: ''
      },
      queryFormVisible: true,
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogForm: {
        name: '',
        code: ''
      },
      dialogMode: 'INSERT',
      dialogVisible: false,
      dialogRules: {
        name: [
          { required: true, message: '名称不能为空', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.listCategoryApi()
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    sizeChangeHandler(val) {
      console.log(`pageSize: ${val}`)
      this.pageSize = val
      this.listCategoryApi()
    },
    currentChangeHandler(val) {
      console.log(`currentPage: ${val}`)
      this.currentPage = val
      this.listCategoryApi()
    },
    queryHandler(mode) {
      if (mode === 'RESET') {
        this.queryForm = this.$options.data().queryForm
        this.$refs.queryForm.resetFields()
        console.log(this.queryForm)
      }
      this.listCategoryApi()
    },
    listCategoryApi() {
      const params = JSON.parse(JSON.stringify(this.queryForm))
      params.pageNum = this.currentPage
      params.pageSize = this.pageSize
      axios({
        url: BASE_URL + '/blog/category/list',
        method: 'GET',
        headers: {
          Authorization: TOKEN
        },
        params: params
      }).then(res => {
        // 异步请求成功后调用回调函数，callback
        const data = res.data
        if (data.code !== 200) {
          this.$message.error(data.msg)
          return
        }
        this.tableData = data.rows
        this.total = data.total
      })
    },
    getCategoryApi(id) {
      console.log(id)
      return new Promise((resolve, reject) => {
        axios({
          url: BASE_URL + '/blog/category/' + id,
          method: 'GET',
          headers: {
            Authorization: TOKEN
          }
        }).then(res => {
          const data = res.data
          if (data.code !== 200) {
            this.$message.error(data.msg)
            reject()
          }
          resolve(data.data)
          // eslint-disable-next-line handle-callback-err
        }).catch(err => {
          this.$message.error('查询失败')
          reject()
        })
      })
    },
    insertHandler() {
      this.dialogMode = 'INSERT'
      this.dialogVisible = true
      this.resetDialogForm()
    },
    updateHandler(data) {
      console.log(data)
      this.dialogMode = 'UPDATE'
      this.dialogVisible = true
      this.resetDialogForm(data)
    },
    deleteHandler(id) {
      console.log(id)
      axios({
        url: BASE_URL + '/blog/category/' + id,
        method: 'DELETE',
        headers: {
          Authorization: TOKEN
        }
      }).then(res => {
        const data = res.data
        console.log(data)
        if (data.code !== 200) {
          this.$message.error(data.msg)
          return
        }
        this.$message.success('删除成功')
        this.listCategoryApi()
      })
    },
    batchDeleteHandler() {
      const ids = this.multipleSelection.map(item => item.id)
      console.log(ids)
      this.deleteHandler(ids.join(','))
    },
    exportHandler(data) {
      console.log(data)
    },
    editNoticeApi() {
      axios({
        url: BASE_URL + '/blog/category',
        method: this.dialogMode === 'INSERT' ? 'POST' : 'PUT',
        headers: {
          Authorization: TOKEN
        },
        data: this.dialogForm
      }).then(res => {
        const data = res.data
        if (data.code !== 200) {
          this.$message.error(data.msg)
          return
        }
        // 短路运算符
        this.$message.success(data.msg || '新增成功')
        this.listCategoryApi()
        // eslint-disable-next-line handle-callback-err
      }).catch(err => {
        this.$message.error('操作失败')
      }).finally(() => {
        this.dialogVisible = false
      })
    },
    dialogSubmitHandler() {
      this.$refs.dialogForm.validate((flag, obj) => {
        if (!flag) {
          return false
        }
        this.editNoticeApi()
      })
    },
    resetDialogForm(data) {
      console.log(this.$options.data())
      // 手动重置
      this.dialogForm = this.$options.data().dialogForm
      // 延时执行 callback 回头来调用
      this.$nextTick(() => {
        // element ui重置
        this.$refs.dialogForm.resetFields()
        this.$refs.dialogForm.clearValidate()
        if (this.dialogMode === 'UPDATE') {
          // 表格数据
          // this.dialogForm = JSON.parse(JSON.stringify(data)), 注意深拷贝浅拷贝
          // 后端接口数据
          this.getCategoryApi(data.id).then(res => {
            console.log(res)
            this.dialogForm = res
          })
        }
      })
    }
  }
}
</script>

<template>
  <div class="category">
    <div class="head">
      <el-form v-show="queryFormVisible" ref="queryForm" :inline="true" :model="queryForm">
        <el-form-item label="名称" label-width="68px">
          <el-input v-model="queryForm.name" placeholder="请输入名称" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="queryHandler">搜索</el-button>
          <el-button size="mini" icon="el-icon-refresh" @click="queryHandler('RESET')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main">
      <div class="row">
        <div class="row-left">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="insertHandler">新增</el-button>
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="multipleSelection.length!==1" @click="updateHandler(multipleSelection[0])">修改</el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multipleSelection.length===0" @click="batchDeleteHandler">删除</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="exportHandler">导出</el-button>
        </div>
        <div class="row-right">
          <el-button icon="el-icon-search" circle size="mini" @click="queryFormVisible=!queryFormVisible"></el-button>
          <el-button icon="el-icon-refresh" circle size="mini" @click="queryHandler"></el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            align="center">
          </el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            align="center">
          </el-table-column>
          <el-table-column
            prop="code"
            label="编码"
            align="center">
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-edit" size="mini" @click="updateHandler(scope.row)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" size="mini" @click="deleteHandler(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page">
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          :current-page="currentPage"
          :total="total"
          :page-size="pageSize"
          layout="->, total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandler"
          @current-change="currentChangeHandler">
        </el-pagination>
      </div>
      <el-dialog :title="dialogMode==='INSERT'?'添加分类管理':'修改分类管理'" :visible.sync="dialogVisible">
        <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
          <el-form-item label="名称" prop="name" label-width="80px">
            <el-input v-model="dialogForm.name" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="编码" prop="code" label-width="80px">
            <el-input v-model="dialogForm.code" placeholder="请输入编码"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogSubmitHandler">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped lang="scss">
.category{
  padding: 20px;
  .main{
    padding: 0;
    .row{
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .page{
      padding: 20px 0;
    }
  }
}
</style>
