<template>
  <div class="block">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }"
        ><a href="javascript:;">用户管理</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 页面主体 -->

    <el-card class="box-card">
      <!-- 添加用户区域 -->
      <el-row :gutter="10">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querInfo.query"
            @clear="getTableData"
            clearable
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getTableData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" size="small" @click="addUserShow = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格渲染用户列表区域 -->
      <el-table :data="tableData" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="upData(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row)"
            ></el-button>
            <!-- 权限分配按钮 -->
            <el-tooltip content="分配角色" placement="top">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户表单 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserShow"
      width="50%"
      @close="addUserClose"
      center
    >
      <el-form
        :model="addFrom"
        :rules="addRules"
        ref="addForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addFrom.username"
            :disabled="updataChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserShow = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户表单 -->
    <el-dialog
      title="修改用户"
      :visible.sync="updataShow"
      width="50%"
      @close="updataUserClose"
      center
    >
      <el-form
        :model="editFrom"
        :rules="addRules"
        ref="updataForm"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="editFrom.username"
            :disabled="updataChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="editFrom.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFrom.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editFrom.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updataShow = false">取 消</el-button>
        <el-button type="primary" @click="updataUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 角色权限分配 -->
    <el-dialog
      title="提示"
      ref="setClearData"
      :visible.sync="userDialogVisible"
      width="50%"
      @close="setClearData"
    >
      <el-form label-width="100px" :model="labelPosition">
        <el-form-item label="当前用户">
          <el-input v-model="labelPosition.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前角色">
          <el-input v-model="labelPosition.role_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色">
          <el-select v-model="roleListId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    // 邮箱验证的正则
    const checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

      if (value === '') {
        cb(new Error('请输入邮箱'))
      } else {
        if (regEmail.test(value)) return cb()
        cb(new Error('请输入合法的邮箱'))
      }
    }
    // 验证手机号码的正则
    const checkModel = (rule, value, cb) => {
      const regMobile = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
      if (value === '') {
        cb(new Error('请输入手机号'))
      } else {
        if (regMobile.test(value)) return cb()
        cb(new Error('请输入合法的手机号码'))
      }
    }
    return {
      total: 0,
      updataChange: false,
      // 获取用户列表的参数对象
      querInfo: {
        //   查询关键字
        query: '',
        //   查询页码
        pagenum: 1,
        //   每页的数据条
        pagesize: 2
      },
      // 获取的用户数据
      tableData: [],
      // 控制添加表单的显示和隐藏
      addUserShow: false,
      // 修改表单的显示隐藏
      updataShow: false,
      // 添加用户的数据对象
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 修改数据对象
      editFrom: {},
      // 权限弹窗显示隐藏
      userDialogVisible: false,
      // 权限列表数据
      labelPosition: {},
      // 获取所有角色对象
      roleList: {},
      // 权限角色选择id值
      roleListId: '',
      // 表单验证规则
      addRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          {
            validator: checkModel,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // 获取查询数据
    async getTableData() {
      const { data: res } = await this.$http.get('users', {
        params: this.querInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.tableData = res.data.users
      this.total = res.data.total
    },
    // 用户状态的改变后更新
    async userStateChange(value) {
      // 更新数据
      const { data: res } = await this.$http.put(
        `users/${value.id}/state/${value.mg_state}`
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新用户状态成功！')
    },
    // 每页渲染多少条数据
    handleSizeChange(newSize) {
      this.querInfo.pagesize = newSize
      this.getTableData()
    },
    // 给定页面后重新渲染页面
    handleCurrentChange(newPage) {
      this.querInfo.pagenum = newPage
      this.getTableData()
    },
    // 删除管理员
    async del(val) {
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
      const { data: res } = await this.$http.delete('users/' + val.id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      const page = Math.ceil((this.total - 1) / this.querInfo.pagesize)
      // 重新渲染
      this.handleCurrentChange(page)
    },
    // 监听添加列表关闭后清除提示警告
    addUserClose() {
      this.$refs.addForm.resetFields()
    },
    // 关闭修改事件监听
    updataUserClose() {
      this.$refs.updataForm.resetFields()
    },
    // 添加用户列表数据
    addUser(val) {
      // 先验证表单数据格式是否正确，正确返回true 错误false
      this.$refs.addForm.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('users', this.addFrom)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加用户成功')
        // 将添加表单隐藏
        this.addUserShow = false
        // 刷新列表，重新渲染
        this.getTableData()
      })
    },
    // 修改数据
    async upData(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.updataShow = true
      this.updataChange = true
      this.editFrom = res.data
    },
    // 提交修改用户数据
    updataUser() {
      this.$refs.updataForm.validate(async val => {
        if (!val) return this.$message.error('数据错误,请重新填写')
        // 发起数据修改提交命令
        const { data: res } = await this.$http.put(
          'users/' + this.editFrom.id,
          {
            email: this.editFrom.email,
            mobile: this.editFrom.mobile
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        // 关闭对话框
        this.updataShow = false
        // 刷新列表，重新渲染
        this.getTableData()
        // 提示修改成功
        this.$message.success('更新成功！')
      })
    },
    // 权限角色数据获取
    async setRole(row) {
      this.labelPosition = row
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')
      this.roleList = res.data
      this.userDialogVisible = true
    },
    // 更新角色数据
    async saveRoleInfo() {
      if (!this.roleListId) return this.$message.error('请选择要分配的对象')
      const { data: res } = await this.$http.put(
        `users/${this.labelPosition.id}/role`,
        {
          rid: this.roleListId
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getTableData()
      this.userDialogVisible = false
    },
    // 监听分配权限表单关闭后事件
    setClearData() {
      this.roleListId = ''
      this.labelPosition = {}
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 10px;
  .el-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
}
.el-pagination {
  margin-top: 10px;
}
</style>
