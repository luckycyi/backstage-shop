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
      <!-- 添加商品内容 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="inputValue"
            @change="searchData"
            clearable
            @clear="searchData"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchData"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="skipAddFrom">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表表格 -->
      <el-table :data="goodsDataForm" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="50px"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="80px"
        ></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px">
          <template slot-scope="scope">
            {{ scope.row.add_time | format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="editShow(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="delShow(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="goodsSizeChange"
        @current-change="goodsCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="goodsList.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑修改页面 -->
    <el-dialog title="修改商品参数" :visible.sync="editShowFrom" width="50%">
      <!-- 表单 -->
      <el-form
        :model="editFromData"
        :rules="updataRules"
        ref="updataRuleForm"
        label-width="120px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editFromData.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input type="number" v-model="editFromData.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input
            type="number"
            v-model="editFromData.goods_weight"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input
            type="number"
            v-model="editFromData.goods_number"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editShowFrom = false">取 消</el-button>
        <el-button type="primary" @click="updataFrom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 添加输入框双向绑定对象
      inputValue: '',
      // 获取当前页面商品参数列表数据数组
      goodsDataForm: [],
      // 商品列表查询参数配置
      goodsList: {
        // 搜素关键词
        query: '',
        // 当前的页码
        pagenum: 1,
        // 每页的数据条数
        pagesize: 10
      },
      // 数据总条数
      total: 0,
      // 编辑页面的显示
      editShowFrom: false,
      // 编辑页面对象
      editFromData: {},
      // 表单验证
      updataRules: {
        goods_name: [
          { required: true, message: '商品名称', trigger: 'blur' },
          {
            min: 2,
            max: 100,
            message: '参数长度在 2 到 100个字符',
            trigger: 'blur'
          }
        ],
        goods_price: [{ required: true, message: '商品名称', trigger: 'blur' }],
        goods_weight: [
          { required: true, message: '商品名称', trigger: 'blur' }
        ],
        goods_number: [{ required: true, message: '商品名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品参数列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.goodsList
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败')
      }
      this.$message.success('获取数控列表成功!')
      this.goodsDataForm = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 监听 pagenum 变化
    goodsSizeChange(val) {
      this.goodsList.pagesize = val
      this.getGoodsList()
    },
    // 监听 pagesize 变化
    goodsCurrentChange(val) {
      this.goodsList.pagenum = val
      this.getGoodsList()
    },
    // 搜索按钮事件
    searchData() {
      this.goodsList.query = this.inputValue
      this.getGoodsList()
    },
    // 编辑页面显示
    editShow(row) {
      this.editFromData = row
      this.editShowFrom = true
    },
    // 删除商品
    async delShow(row) {
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
      const { data: res } = await this.$http.delete('goods/' + row.goods_id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败！')
      this.$message.success(res.meta.msg)
      this.getGoodsList()
    },
    // 编辑页面提交
    updataFrom() {
      this.$refs.updataRuleForm.validate(async valid => {
        if (!valid) return this.$message.error('修改商品参数失败！')
        const { data: res } = await this.$http.put(
          `goods/${this.editFromData.goods_id}`,
          {
            goods_name: this.editFromData.goods_name,
            goods_price: this.editFromData.goods_price,
            goods_number: this.editFromData.goods_number,
            goods_weight: this.editFromData.goods_weight,
            goods_cat: '1,2,3'
          }
        )
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message.success('修改成功!')
        // res.data.add_time = new Date().getTime()
        // console.log(res)
        this.getGoodsList()
        this.editShowFrom = false
      })
    },
    // 监听编辑页面关闭
    clearClose() {
      this.$refs.ruleFormLogin.resetFields()
    },
    // 添加按钮跳转到添加页面
    skipAddFrom() {
      this.$router.push('/add')
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 15px;
}
.el-table {
  margin-top: 15px;
  font-size: 12px;
}
.el-table td,
.el-table th.is-leaf {
  text-align: center;
}
</style>
