<script>
import { delCategory, editCategory, getCategory, getCategoryList } from '@/api/category'

export default {
  name: 'Category',
  data() {
    return {
      queryForm: {
        name: undefined
      },
      queryFormVisible: true,
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogForm: {
        id: '',
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
      }
      this.listCategoryApi()
    },
    insertHandler() {
      this.dialogMode = 'INSERT'
      this.dialogVisible = true
      this.resetDialogForm()
    },
    updateHandler(data) {
      this.dialogMode = 'UPDATE'
      this.dialogVisible = true
      this.resetDialogForm(data)
    },
    deleteHandler(id) {
      delCategory(id).then(res => {
        console.log(res)
        this.$message.success('删除成功')
        this.listCategoryApi()
      })
    },
    batchDeleteHandler() {
      const ids = this.multipleSelection.map(item => item.id)
      this.deleteHandler(ids.join(','))
    },
    exportHandler() {
      window.open('http://localhost:9528/dev-api/blog/category/export')
    },
    editCategoryApi() {
      editCategory(this.dialogMode, this.dialogForm).then(res => {
        console.log('edit:' + res)
        this.listCategoryApi()
      }).catch(err => {
        if (err.code === 'ECONNABORTED') {
          this.$message.error('请求超时')
        } else {
          this.$message.error('操作失败')
        }
      }).finally(() => {
        this.dialogVisible = false
      })
    },
    dialogSubmitHandler() {
      this.$refs.dialogForm.validate((flag, obj) => {
        if (!flag) {
          return false
        }
        this.editCategoryApi()
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
          this.getCategoryApi(data.id).then(res => {
            this.dialogForm = JSON.parse(JSON.stringify(res))
          }).catch(err => {
            console.error('Failed to fetch category data:', err)
          })
        }
      })
    },
    getCategoryApi(id) {
      return new Promise((resolve, reject) => {
        getCategory(id).then(res => {
          console.log(res)
          resolve(res.data)
        }).catch(() => {
          this.$message.error('查询失败')
          reject()
        })
      })
    },
    listCategoryApi() {
      const params = JSON.parse(JSON.stringify(this.queryForm))
      params.pageNum = this.currentPage
      params.pageSize = this.pageSize
      getCategoryList(params).then(res => {
        console.log(res) // 打印响应数据
        this.tableData = res.data.rows
        this.total = res.data.total
      }).catch(error => {
        console.error('Error fetching list:', error) // 打印错误信息
        this.$message.error('An error occurred while fetching the list.')
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
          <el-input v-model="queryForm.name" placeholder="请输入名称" size="mini" />
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
          <el-button icon="el-icon-search" circle size="mini" @click="queryFormVisible=!queryFormVisible" />
          <el-button icon="el-icon-refresh" circle size="mini" @click="queryHandler" />
        </div>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="id"
            label="ID"
            align="center"
          />
          <el-table-column
            prop="name"
            label="名称"
            align="center"
          />
          <el-table-column
            prop="code"
            label="编码"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
          >
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
          @current-change="currentChangeHandler"
        />
      </div>
      <el-dialog :title="dialogMode==='INSERT'?'添加分类管理':'修改分类管理'" :visible.sync="dialogVisible">
        <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
          <el-form-item label="名称" prop="name" label-width="80px">
            <el-input v-model="dialogForm.name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="编码" prop="code" label-width="80px">
            <el-input v-model="dialogForm.code" placeholder="请输入编码" />
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
