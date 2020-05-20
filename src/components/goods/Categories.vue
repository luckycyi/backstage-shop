<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加按钮 -->
      <div slot="header">
        <el-button type="primary" size="small" @click="shwoForm"
          >添加分类</el-button
        >
      </div>

      <!-- 商品分类列表 -->
      <tree-table
        :data="cateList"
        :columns="columnsData"
        :show-index="true"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="cates" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: green"
          ></i>
          <i class="el-icon-success" v-else style="color: red"></i>
        </template>

        <!-- 排序 -->
        <template slot="isok" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="success" v-else>三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="btns" slot-scope="scope">
          <el-button
            size="small"
            icon="el-icon-edit"
            type="primary"
            @click="editCateForm(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="small"
            icon="el-icon-delete"
            type="danger"
            @click="delCateForm(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类用户 -->
    <el-dialog
      title="提示"
      :visible.sync="showVisible"
      width="50%"
      @close="cateClose"
    >
      <el-form
        label-width="80px"
        :rules="rulesForm"
        :model="formLabelAlign"
        ref="addCateFrom"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="formLabelAlign.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="selectData"
            :props="cascaderProps"
            @change="putHandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showVisible = false">取 消</el-button>
        <el-button type="primary" @click="addClassData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑页面 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="showEditVisible"
      width="50%"
      @close="editCateClose"
    >
      <el-form
        label-width="110px"
        :model="inputData"
        :rules="rulesForm"
        ref="editCateFrom"
      >
        <el-form-item label="新分类名称：" prop="cat_name">
          <el-input v-model="inputData.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditVisible = false">取 消</el-button>
        <el-button type="primary" @click="putClassData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 分类数据
      cateList: [],
      // 树形结构 列 配置
      columnsData: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'cates'
        },
        {
          label: '排序',
          type: 'template',
          template: 'isok'
        },
        {
          label: '操作',
          type: 'template',
          template: 'btns'
        }
      ],
      // 分页数据查询对象
      queryInfo: {
        // 查询分类数据 (包括一二三级)
        type: 3,
        // 当前页码
        pagenum: 1,
        // 每页多少条数据
        pagesize: 5
      },
      // 数据总条数
      total: 0,
      // 添加表单显示隐藏
      showVisible: false,
      // 添加数据对象
      formLabelAlign: {
        // 父级分类ID
        cat_pid: 0,
        // 分类名称
        cat_name: '',
        // 分类等级
        cat_level: 0
      },
      // 表单校验规则
      rulesForm: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户名长度在 2 到 5个字符',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类选择数据对象
      selectData: [],
      // 分类选择绑定对象
      selectKeys: [],
      // 级联选择器配置数据对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 编辑页面的显示隐藏
      showEditVisible: false,
      // 编辑分类双向绑定
      inputData: {
        cat_name: ''
      },
      // 编辑页面ID
      editId: ''
    }
  },
  created() {
    this.getCateList()
  },
  inject: ['reload'],
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.$message.success('获取数据成功！')
      this.total = res.data.total
      this.cateList = res.data.result
    },
    // 每页数据
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },
    // 当前页码
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },
    // 添加表单的显示隐藏
    async shwoForm() {
      this.getAllData()
      this.showVisible = true
    },
    // 获取分类所有数据
    async getAllData() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.selectData = res.data
    },
    // 选中项改变事件
    putHandleChange() {
      // selectKeys中储存着id数据
      if (this.selectKeys.length > 0) {
        this.formLabelAlign.cat_pid = this.selectKeys[
          this.selectKeys.length - 1
        ]
        this.formLabelAlign.cat_level = this.selectKeys.length
      } else {
        this.formLabelAlign.cat_pid = 0
        this.formLabelAlign.cat_level = 0
      }
    },
    // 提交分类数据
    addClassData() {
      this.$refs.addCateFrom.validate(async vaild => {
        if (!vaild) return this.$message.error('请输入分类名称')
        const { data: res } = await this.$http.post(
          'categories',
          this.formLabelAlign
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getCateList()
        this.showVisible = false
      })
    },
    // 监听添加表单关闭事件，重置表单
    cateClose() {
      this.$refs.addCateFrom.resetFields()
      this.selectKeys = []
      this.formLabelAlign.cat_pid = 0
      this.formLabelAlign.cat_level = 0
    },
    // 监听编辑表单关闭事件，重置表单
    editCateClose() {
      this.$refs.editCateFrom.resetFields()
    },
    // 编辑分类
    editCateForm(row) {
      this.editId = row.cat_id
      this.showEditVisible = true
    },
    // 删除分类
    async delCateForm(row) {
      const confirmResult = await this.$confirm(
        '是否确认删除该用户 ?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.error('已取消删除')
      const { data: res } = await this.$http.delete('categories/' + row.cat_id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      if (row.cat_level === 0) {
        const page = Math.ceil((this.total - 1) / this.queryInfo.pagesize)
        return this.handleCurrentChange(page)
      }
      // console.log(this.queryInfo.pagenum)
      // this.reload()
      this.getCateList()
    },
    // 提交新分类
    putClassData() {
      this.$refs.editCateFrom.validate(async valid => {
        if (!valid) return this.$message.error('请填写分类名称!')
        const { data: res } = await this.$http.put(
          'categories/' + this.editId,
          this.inputData
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('更新成功')
        this.getCateList()
        this.showEditVisible = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
</style>
