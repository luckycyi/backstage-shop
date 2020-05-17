<template>
  <div id="app">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 面包屑导航 -->
    <el-card>
      <!-- 添加用户按钮 -->
      <el-button type="primary" size="small" @click="rolesShow = true"
        >添加管理员</el-button
      >

      <!-- 权限列表成员 -->
      <el-table :data="rolesFrom" border stripe>
        <!-- 成员权限树展示 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['vcenter', i1 === 0 ? 'tabTop' : '', 'tabBottom']"
              v-for="(item, i1) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5"
                ><div class="grid-content bg-purple">
                  <el-tag
                    size="medium"
                    closable
                    @close="removeTags(scope.row, item.id)"
                    >{{ item.authName }}</el-tag
                  >
                  <i class="el-icon-caret-right"></i></div
              ></el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row
                  :class="['vcenter', i2 === 0 ? '' : 'tabTop']"
                  v-for="(item1, i2) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="7"
                    ><div class="grid-content bg-purple">
                      <el-tag
                        type="success"
                        size="medium"
                        closable
                        @close="removeTags(scope.row, item1.id)"
                        >{{ item1.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i></div
                  ></el-col>
                  <!-- 三级权限 -->
                  <el-col :span="17"
                    ><el-tag
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      closable
                      type="warning"
                      class="tags"
                      @close="removeTags(scope.row, item2.id)"
                    >
                      {{ item2.authName }}
                    </el-tag></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 列表项目 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editDataList(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="del(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="authorityData(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户表 -->
    <el-dialog
      title="提示"
      :visible.sync="rolesShow"
      width="50%"
      @close="clearFrom"
    >
      <el-form
        :model="rolesData"
        :rules="rolesRules"
        ref="rolesDataForm"
        label-width="90px"
        width="100%"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="rolesData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="rolesData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rolesShow = false">取 消</el-button>
        <el-button type="primary" @click="rolesPut">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑修改用户表 -->
    <el-dialog
      title="提示"
      :visible.sync="editrolesShow"
      width="50%"
      @close="editClearFrom"
    >
      <el-form
        :model="editData"
        :rules="rolesRules"
        ref="editDataForm"
        label-width="90px"
        width="100%"
      >
        <el-form-item label="角色名称:" prop="roleName">
          <el-input v-model="editData.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
          <el-input v-model="editData.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editrolesShow = false">取 消</el-button>
        <el-button type="primary" @click="editRolesPut">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限列表 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="setRightClose"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        :props="defaultProps"
        default-expand-all
        :default-checked-keys="defkey"
        ref="treeRef"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="authorityDataList">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户列表成员对象
      rolesFrom: [],
      // 添加列表的显示和隐藏
      rolesShow: false,
      // 编辑页面显示隐藏
      editrolesShow: false,
      // 分配权限页面显示隐藏
      dialogVisible: false,
      // 添加用户数据对象
      rolesData: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑用户对象
      editData: {
        roleName: '',
        roleDesc: ''
      },
      // 分配权限的数据列表
      rightsList: [],
      // 默认选中权限Id
      defkey: [],
      // 编辑对象ID
      roleId: '',
      // 分配权限的Id
      pointId: '',
      // 权限分配配置
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 表单验证规则
      rolesRules: {
        // 验证用户名是否合法
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 2,
            max: 5,
            message: '用户名长度在 2 到 5个字符',
            trigger: 'blur'
          }
        ],
        // 验证密码是否合法
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.rolesDateFrom()
  },
  methods: {
    // 获取所有列表对象
    async rolesDateFrom() {
      const { data: res } = await this.$http.get('roles')
      this.rolesFrom = res.data
    },

    // 删除对应权限
    async removeTags(row, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.error('取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      )
      if (res.meta.status !== 200) return this.$message.error('权限删除失败')
      this.$message.success(res.meta.msg)
      row.children = res.data
    },
    // 添加用户
    rolesPut() {
      this.$refs.rolesDataForm.validate(async vaild => {
        if (!vaild) return
        const { data: res } = await this.$http.post('roles', this.rolesData)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.rolesShow = false
        this.rolesDateFrom()
      })
    },
    // 监听添加表单关闭事件
    clearFrom() {
      this.$refs.rolesDataForm.resetFields()
    },
    // 监听编辑表单关闭事件
    editClearFrom() {
      this.$refs.editDataForm.resetFields()
    },
    // 编辑表单页面
    async editDataList(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      this.editData.roleName = res.data.roleName
      this.editData.roleDesc = res.data.roleDesc
      this.roleId = res.data.roleId
      this.editrolesShow = true
    },
    // 提交编辑页面更新
    editRolesPut() {
      const that = this
      this.$refs.editDataForm.validate(async vaild => {
        if (!vaild) return this.$message.error('更新失败！')
        const { data: res } = await this.$http.put(
          'roles/' + that.roleId,
          this.editData
        )
        if (res.meta.status !== 200) return this.$message.error('更新失败!')
        this.$message.success(res.meta.msg)
        this.editrolesShow = false
        this.rolesDateFrom()
      })
    },
    // 删除管理成员
    async del(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.error('取消删除')
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除数据失败！')
      this.$message.success(res.meta.msg)
      this.rolesDateFrom()
    },
    // 分配权限
    async authorityData(row) {
      this.pointId = row.id
      // 获取所有权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      this.$message.success(res.meta.msg)
      this.rightsList = res.data
      this.getLeafKeys(row, this.defkey)
      this.dialogVisible = true
    },
    // 获取默认选项的id
    getLeafKeys(node, arr) {
      if (!node.children) return arr.push(node.id)
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 更新分配权限的数据对象
    async authorityDataList() {
      // getCheckedKeys获取一二级权限id getHalfCheckedKeys获取三级权限id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const {
        data: res
      } = await this.$http.post(`roles/${this.pointId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败!')
      this.$message.success(res.meta.msg)
      this.rolesDateFrom()
      this.dialogVisible = false
    },
    // 监听权限列表关闭后事件
    setRightClose() {
      this.defkey = []
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin-top: 7px;
}
.tabBottom {
  border-bottom: 1px solid #eee;
}
.tabTop {
  border-top: 1px solid #eee;
}
.tags {
  margin-right: 7px;
}
</style>
