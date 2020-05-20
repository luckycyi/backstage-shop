<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 注意 -->
      <el-alert
        title="注意：只允许为第三季分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类 -->
      <el-row>
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="seleteId"
            :options="options"
            :props="cascaderPar"
            @change="paramsHandleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 参数属性 -->
      <el-tabs v-model="activeDataFrom" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="small"
            :disabled="btnShow"
            @click="showAddTable = true"
            >添加参数</el-button
          >
          <!-- 参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag 标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!-- 输入框 -->
                <el-input
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputTag(scope.row)"
                  @blur="handleInputTag(scope.row)"
                  style="width: 100px;"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else size="small" @click="showTagInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDelDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <!-- 添加按钮 -->
          <el-button
            type="primary"
            size="small"
            :disabled="btnShow"
            @click="showAddTable = true"
            >添加参数</el-button
          >
          <!-- 参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- tag 标签 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteClose(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <!-- 输入框 -->
                <el-input
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputTag(scope.row)"
                  @blur="handleInputTag(scope.row)"
                  style="width: 100px;"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button v-else size="small" @click="showTagInput"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="showDelDialog(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 -->
    <el-dialog
      :title="titleText"
      :visible.sync="showAddTable"
      width="50%"
      @close="addCateClose"
    >
      <el-form
        label-width="110px"
        :model="addFrom"
        :rules="addRulesForm"
        ref="addCateFrom"
      >
        <el-form-item label="参数名称：" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showAddTable = false">取 消</el-button>
        <el-button type="primary" @click="addClassData">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑参数 -->
    <el-dialog
      :title="titleText"
      :visible.sync="editShowData"
      width="50%"
      @close="editCateClose"
    >
      <el-form
        label-width="110px"
        :model="editFrom"
        :rules="addRulesForm"
        ref="editCateFrom"
      >
        <el-form-item label="参数名称：" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editShowData = false">取 消</el-button>
        <el-button type="primary" @click="editClassData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择配置参数
      cascaderPar: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      // 渲染的数据数组
      options: [],
      // 级联选择器双向绑定选中ID数组
      seleteId: [],
      // 被激活的页面
      activeDataFrom: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态参数数据
      onlyTableData: [],
      // 添加表单的显示
      showAddTable: false,
      // 添加参数双向绑定对象
      addFrom: {
        attr_name: ''
      },
      // 编辑参数显示隐藏
      editShowData: false,
      // 编辑参数双向绑定对象
      editFrom: {},
      // 描述标签输入显示隐藏
      inputVisible: false,
      // tag标签数组
      tagArr: [],
      // 描述标签输入框双向绑定参数
      inputValue: '',
      // 表单验证规则
      addRulesForm: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '参数长度在 2 到 5个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getAllClass()
  },
  methods: {
    // 获取所有分类数据
    async getAllClass() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.options = res.data
    },
    // 级联选择器发生变化时，触发
    paramsHandleChange() {
      this.getManyDate()
    },
    // 选中页面触发
    handleClick() {
      this.getManyDate()
    },
    // 获取动态参数数据
    async getManyDate() {
      if (this.seleteId.length !== 3) {
        this.seleteId = []
        this.manyTableData = []
        this.onlyTableData = []
        return null
      }
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeDataFrom }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败!')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
      })
      if (this.activeDataFrom === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 参数编辑
    async showEditDialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeDataFrom
          }
        }
      )
      if (res.meta.status !== 200) return this.$message.error('获取数据失败')
      this.editFrom = res.data
      this.editShowData = true
    },
    // 提交参数表单
    editClassData() {
      this.$refs.editCateFrom.validate(async valid => {
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
          {
            attr_name: this.editFrom.attr_name,
            attr_sel: this.activeDataFrom
          }
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败')
        this.$message.success('修改成功')
        this.getManyDate()
        this.editShowData = false
      })
    },
    // 修改表单关闭清空
    editCateClose() {
      this.$refs.editCateFrom.resetFields()
      this.editFrom = {}
    },
    // 参数删除
    async showDelDialog(id) {
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
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功!')
      this.getManyDate()
    },
    // 监听添加表单关闭事件
    addCateClose() {
      this.$refs.addCateFrom.resetFields()
    },
    // 添加表单提交
    addClassData() {
      this.$refs.addCateFrom.validate(async valid => {
        if (!valid) return this.$message.error('请输入参数名称！')
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeDataFrom
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加失败!')
        this.$message.success('添加成功!')
        this.getManyDate()
        this.showAddTable = false
      })
    },
    // 删除tag标签描述
    deleteClose(row, i) {
      row.attr_vals.splice(i, 1)
      this.saveFrom(row)
    },
    // 标签添加按钮
    showTagInput() {
      this.inputVisible = true
      // 进入自动获取问遍焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本市去焦点或者按下按键
    handleInputTag(row) {
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      row.attr_vals.push(this.inputValue)
      this.inputValue = ''
      this.inputVisible = false
      this.saveFrom(row)
    },
    // 保存tag标签的修改
    async saveFrom(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('修改参数失败!')
      this.$message.success(res.meta.msg)
    }
  },
  computed: {
    // 只有三级参数才能显示添加键
    btnShow() {
      if (this.seleteId.length !== 3) {
        return true
      }
      return false
    },
    // 获取三级参数
    cateId() {
      if (this.seleteId.length === 3) {
        return this.seleteId[2]
      }
      return null
    },
    // 动态计算标题
    titleText() {
      if (this.activeDataFrom === 'many') {
        return '动态参数'
      }
      return '静态参数'
    }
  }
}
</script>

<style lang="less" scoped>
.el-tabs {
  margin-top: 15px;
}
.el-tag {
  margin-right: 7px;
}
</style>
