<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加商品信息提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 状态步骤条 -->
      <el-steps :active="activeName - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 表单 -->
      <el-form
        :model="addRuleForm"
        :rules="addFromRules"
        ref="ruleForm"
        label-width="100px"
        :label-position="'top'"
      >
        <!-- Tabs标签页 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeName"
          @tab-click="addHandleClick"
          :before-leave="beforeLeave"
        >
          <el-tab-pane name="0" label="基本信息">
            <el-form-item label="活动名称" prop="goods_name">
              <el-input v-model="addRuleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                type="number"
                v-model="addRuleForm.goods_price"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                type="number"
                v-model="addRuleForm.goods_weight"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addRuleForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addRuleForm.goods_cat"
                :options="addDataList"
                :props="cascadeList"
                @change="cascadeClick"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="1" label="商品参数">
            <!-- 参数项 -->
            <el-form-item
              :label="item.attr_name"
              v-for="item in parameterList"
              :key="item.attr_id"
            >
              <!-- 选中项目复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item1"
                  v-for="(item1, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="2" label="商品属性">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyDataFrom"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane name="3" label="商品图片">
            <el-upload
              :action="baseUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
              :on-success="handleAvatarSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane name="4" label="商品内容">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addRuleForm.goods_introduce"> </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btns" @click="addBtnData"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
      <img :src="previewPath" class="preverImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤选中栏
      activeName: 0,
      // 商品表单双向绑定对象
      addRuleForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // 分类数据
      addDataList: [],
      // 级联选择配置数据
      cascadeList: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 商品动态参数数组
      parameterList: [],
      // 商品静态参数对象
      onlyDataFrom: [],
      // 图片上传URL
      baseUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片请求头
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览显示隐藏
      dialogVisible: false,
      // 预览路径
      previewPath: '',
      // 表单验证规则
      addFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          {
            min: 2,
            max: 10,
            message: '参数长度在 2 到 10个字符',
            trigger: 'blur'
          }
        ],
        goods_price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.addDataClass()
  },
  methods: {
    // 获取商品分类数据
    async addDataClass() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) this.$message.error('获取分类数据失败！')
      this.$message.success('获取数据成功！')
      this.addDataList = res.data
    },
    // 级联选择器选择时输出
    cascadeClick() {
      if (this.addRuleForm.goods_cat.length !== 3) {
        return (this.addRuleForm.goods_cat = [])
      }
    },
    // tabs 被选中时触发事件
    async addHandleClick() {
      if (this.activeName === '1') {
        // 获取当前商品参数
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败！')
        }
        this.$message.success('获取商品参数成功！')
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.parameterList = res.data
      } else if (this.activeName === '2') {
        // 获取静态商品属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败！')
        }
        this.$message.success(res.meta.msg)
        this.onlyDataFrom = res.data
      }
    },
    // tabs 切换之前的事件
    beforeLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addRuleForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 只能上传图片
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG or NPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG || (isPNG && isLt2M)
    },
    // 图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.dialogVisible = true
    },
    // handleRemove图片删除事件
    handleRemove(file) {
      const delPath = file.response.data.tmp_path
      const i = this.addRuleForm.pics.findIndex(item => {
        return item.pic === delPath
      })
      this.addRuleForm.pics.splice(i, 1)
    },
    // 图片上传成功后
    handleAvatarSuccess(response) {
      const picInfo = { pic: response.data.tmp_path }
      this.addRuleForm.pics.push(picInfo)
    },
    // 添加商品
    addBtnData() {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整的表单!')
        // 因为表单双向绑定需要goods_cat 为数组，这里转化为字符串会冲突，所以进行深拷贝
        const form = _.cloneDeep(this.addRuleForm)
        form.goods_cat = form.goods_cat.join(',')
        // 商品动态参数
        this.parameterList.forEach(item => {
          const configInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addRuleForm.attrs.push(configInfo)
        })
        form.attrs = this.addRuleForm.attrs
        // 静态属性参数
        this.onlyDataFrom.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addRuleForm.attrs.push(newInfo)
        })
        form.attrs = this.addRuleForm.attrs

        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功!')
        this.$router.push('goods')
      })
    }
  },
  computed: {
    // 获取商品分类三级的id
    cateId() {
      if (this.addRuleForm.goods_cat.length === 3) {
        return this.addRuleForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.preverImg {
  width: 100%;
}
.btns {
  margin-top: 15px;
}
</style>
