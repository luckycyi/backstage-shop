<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../../public/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" size="small" @click="loginOut">退出</el-button>
    </el-header>
    <!-- 主体页面 -->
    <el-container>
      <!-- 左侧边栏 区域-->
      <el-aside
        :width="isCollapse ? '60px' : '200px'"
        style="user-select:none;"
      >
        <!-- 收缩按键 -->
        <div class="toggle_button" @click="toggleCollapse">|||</div>

        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="rgb(51, 55, 68)"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单区域 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 菜单图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 菜单列表名称 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单区域 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!-- 菜单列表名称 -->
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右主体区域 -->
      <el-main>
            <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    //   销毁 token 退出登录
    loginOut() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    // 获取左侧边栏数据
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      //   获取列表数据状态
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 折叠菜单栏
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存激活状态，让链接光标常亮
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created() {
    // 页面加载完之前获取列表数据
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
  .el-button {
    margin-right: 20px;
  }
}
.el-aside {
  background-color: rgb(51, 55, 68);
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  width: 100%;
  background-color: #4a5064;
  text-align: center;
  font-size: 10px;
  color: #fff;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
