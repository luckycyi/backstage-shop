<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像图片 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>

      <!-- 登录组件 -->
      <el-form :model="loginForm" label-width="0px" ref="ruleFormLogin" :rules="rulesLogin" class="login-form">
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" size="mini" @click="login">登录</el-button>
          <el-button type="info" size="mini" @click="resetLoginFrom">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单绑定的数据对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      rulesLogin: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginFrom() {
      this.$refs.ruleFormLogin.resetFields()
    },
    login() {
      this.$refs.ruleFormLogin.validate(async valid => {
        if (!valid) return
        // 获取登录后返回数据
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) this.Message.error('登录失败')
        this.$message.success('登录成功')

        // 登录成功后，设置token,进行后续的路由登录状态判断
        window.sessionStorage.setItem('token', res.data.token)

        // 使用编程式导航跳转到主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  position: absolute;
  border-radius: 10px;
  padding: 10px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.avatar_box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  img {
    width: 100%;
    height: 100%;
  }
}
.login-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
