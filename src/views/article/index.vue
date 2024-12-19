<script>
import {
  delArticle,
  editArticle,
  getArticle, getArticleCategoryApi,
  getArticleList,
  getArticleStateApi
} from '@/api/article'
import category from '@/views/category/index.vue'

export default {
  name: 'Article',
  data() {
    return {
      queryForm: {
        title: undefined,
        state: undefined,
        author: undefined,
        category: undefined,
        publishTimeBegin: undefined,
        publishTimeEnd: undefined
      },
      multipleSelection: [],
      queryFormVisible: true,
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogForm: {
        title: '',
        content: '',
        state: '',
        author: '',
        categoryId: '',
        publishTime: ''
      },
      dialogMode: 'INSERT',
      dialogVisible: false,
      dialogRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        author: [
          { required: true, message: '作者不能为空', trigger: 'blur' }
        ]
      },
      stateList: undefined,
      categoryList: undefined
    }
  },
  created() {
    this.getStateType()
    this.getCategoryType()
    this.listArticleApi()
  },
  methods: {
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    sizeChangeHandler(val) {
      console.log(`pageSize: ${val}`)
      this.pageSize = val
      this.listArticleApi()
    },
    currentChangeHandler(val) {
      console.log(`currentPage: ${val}`)
      this.currentPage = val
      this.listArticleApi()
    },
    queryHandler(mode) {
      if (mode === 'RESET') {
        this.queryForm = this.$options.data().queryForm
        this.$refs.queryForm.resetFields()
        console.log(this.queryForm)
      }
      this.listArticleApi()
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
      delArticle(id).then(res => {
        const data = res.data
        console.log(data)
        this.$message.success('删除成功')
        this.listArticleApi()
      })
    },
    batchDeleteHandler() {
      const ids = this.multipleSelection.map(item => item.id)
      console.log(ids)
      this.deleteHandler(ids.join(','))
    },
    exportHandler() {
      window.open('http://localhost:9528/dev-api/blog/article/export')
    },
    editArticleApi() {
      editArticle(this.dialogMode, this.dialogForm).then(res => {
        console.log('edit:' + res)
        this.listArticleApi()
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
        this.editArticleApi()
      })
    },
    resetDialogForm(data) {
      console.log(this.$options.data())
      this.dialogForm = this.$options.data().dialogForm
      this.$nextTick(() => {
        this.$refs.dialogForm.resetFields()
        this.$refs.dialogForm.clearValidate()
        if (this.dialogMode === 'UPDATE') {
          this.getArticleApi(data.id).then(res => {
            console.log(res)
            this.dialogForm = res
          })
        }
      })
    },
    getArticleApi(id) {
      console.log(id)
      return new Promise((resolve, reject) => {
        getArticle(id).then(res => {
          console.log(res)
          resolve(res.data)
        }).catch(() => {
          this.$message.error('查询失败')
          reject()
        })
      })
    },
    listArticleApi() {
      const params = JSON.parse(JSON.stringify(this.queryForm))
      params.pageNum = this.currentPage
      params.pageSize = this.pageSize
      getArticleList(params).then(res => {
        console.log(res)
        this.tableData = res.data.rows
        this.total = res.data.total
      })
    },
    getStateType() {
      getArticleStateApi().then(res => {
        this.stateList = res.data
      })
    },
    getCategoryType() {
      getArticleCategoryApi().then(res => {
        this.categoryList = res.data
      })
    },
    getCategoryName(id) {
      const category = this.categoryList.find(item => item.id === id)
      return category ? category.name : ''
    }
  }
}
</script>

<template>
  <div class="article">
    <div class="head">
      <el-form v-show="queryFormVisible" ref="query form" :model="queryForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="queryForm.title" placeholder="请输入标题" size="mini" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.state" placeholder="请选择状态" size="mini">
            <el-option
              v-for="(item,index) in stateList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="queryForm.author" placeholder="请输入作者" size="mini" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="queryForm.category" placeholder="请选择分类" size="mini">
            <el-option
              v-for="(item,index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="queryForm.publishTimeBegin"
            clearable
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始日期"
          />
          -
          <el-date-picker
            v-model="queryForm.publishTimeEnd"
            clearable
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="queryHandler">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="queryHandler('RESET')">重置</el-button>
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
            prop="title"
            label="标题"
            align="center"
          />
          <el-table-column
            prop="content"
            label="内容"
            align="center"
          />
          <el-table-column
            prop="state"
            label="状态"
            align="center"
          >
            <template slot-scope="scope">
              {{ stateList[scope.row.state].name }}
            </template>
          </el-table-column>
          <el-table-column
            prop="author"
            label="作者"
            align="center"
          />
          <el-table-column
            prop="categoryId"
            label="分类"
            align="center"
          >
            <template slot-scope="scope">
              {{ getCategoryName(scope.row.categoryId) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="publishTime"
            label="发布时间"
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
    </div>
    <el-dialog :title="dialogMode==='INSERT'?'添加文章管理':'修改文章管理'" :visible.sync="dialogVisible">
      <el-form ref="dialogForm" :model="dialogForm" :rules="dialogRules">
        <el-form-item label="标题" prop="title" label-width="80px">
          <el-input v-model="dialogForm.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content" label-width="80px">
          <quill-editor v-model="dialogForm.content" />
        </el-form-item>
        <el-form-item label="状态" prop="state" label-width="80px">
          <el-select v-model="dialogForm.state" placeholder="请选择状态">
            <el-option
              v-for="(item,index) in stateList"
              :key="index"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="作者" prop="author" label-width="80px">
          <el-input v-model="dialogForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="分类" prop="category" label-width="80px">
          <el-select v-model="dialogForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="(item,index) in categoryList"
              :key="index"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime" label-width="80px">
          <el-date-picker
            v-model="dialogForm.publishTime"
            type="date"
            placeholder="请选择日期"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogSubmitHandler">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.article{
  padding: 20px;
  .head{
    .el-form{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
    }
    .el-form-item{
      margin: 0 10px 10px 0;
    }
  }
  .row{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .page{
    padding: 20px 0;
  }
}
</style>
