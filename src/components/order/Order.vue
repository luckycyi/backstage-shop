<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索输入框 -->
      <el-input
        placeholder="请输入搜索内容"
        v-model="searchData"
        style="width: 400px;"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="searchFrom"
        ></el-button>
      </el-input>

      <!-- 订单数据列表 -->
      <el-table :data="orderDataFrom" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="350px">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="order_pay" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay === '0'"
              >未付款</el-tag
            >
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="180px">
          <template slot-scope="scope">
            {{ scope.row.create_time | format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editAmend(scope.row)"
            ></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="expressAmend"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="pageInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑修改页 -->
    <el-dialog
      title="提示"
      :visible.sync="showEditFrom"
      width="50%"
      @close="closeDataFrom"
    >
      <el-form
        ref="addressFormRulos"
        :rules="addressRules"
        :model="addressFrom"
        label-width="100px"
      >
        <el-form-item label="订单编号" prop="order_number">
          <el-input v-model="addressFrom.order_number"></el-input>
        </el-form-item>
        <el-form-item label="是否发货" prop="is_send">
          <el-select
            v-model="addressFrom.is_send"
            placeholder="请选择发货状态"
            style="width: 100%;"
          >
            <el-option label="未发货" value="0"> </el-option
            ><el-option label="已发货" value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式" prop="order_pay">
          <el-select
            v-model="addressFrom.order_pay"
            placeholder="是否已付款"
            style="width: 100%;"
          >
            <el-option label="未支付" value="0"> </el-option
            ><el-option label="支付宝" value="1"> </el-option
            ><el-option label="微信" value="2"> </el-option>
            <el-option label="银行卡" value="3"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品价格" prop="order_price">
          <el-input type="number" v-model="addressFrom.order_price"></el-input>
        </el-form-item>
        <el-form-item label="是否付款" prop="pay_status">
          <el-select
            v-model="addressFrom.pay_status"
            placeholder="是否已付款"
            style="width: 100%;"
          >
            <el-option label="未付款" value="0"> </el-option
            ><el-option label="已付款" value="1"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressFrom.address1"
            :options="cityData"
            @change="clickHandleChange"
            style="width: 100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressFrom.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="showEditFrom = false">取 消</el-button>
        <el-button type="primary" @click="editDataFrom">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流页面 -->
    <el-dialog title="物流进度" :visible.sync="logisticsShow" width="50%">
      <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in dataLogistics"
          :key="index"
          :timestamp="dataLogistics.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
// 导入省市县数据
import cityData from './citydata'

export default {
  data() {
    return {
      // 订单搜索条件
      pageInfo: {
        // 搜索条件
        query: 'zx',
        // 当前页码
        pagenum: 1,
        // 每页数据条数
        pagesize: 10
      },
      // 数据总数
      total: 0,
      // 当前页面数据列表数组
      orderDataFrom: [],
      // 按键搜索框双向绑定对象
      searchData: '',
      // 修改页面显示隐藏
      showEditFrom: false,
      // 省市县三级数据
      cityData,
      // 修改表单数据对象
      addressFrom: {
        is_send: 0,
        order_pay: 0,
        order_price: 0,
        order_number: '',
        pay_status: 0,
        address1: [],
        address2: ''
      },
      // 表单id
      cataId: '',
      // 物流页面显示
      logisticsShow: false,
      // 物流数据
      dataLogistics: [],
      // 表单验证规则
      addressRules: {
        address1: [{ required: true, message: '省市区/县', trigger: 'blur' }],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getOrderData()
  },
  methods: {
    // 获取数据
    async getOrderData() {
      const { data: res } = await this.$http.get('orders', {
        params: this.pageInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据列表失败!')
      }
      this.orderDataFrom = res.data.goods
      this.total = res.data.total
      console.log(res)
    },
    // 搜索
    searchFrom() {
      console.log('ok')
      this.pageInfo.query = this.searchData
      this.getOrderData()
    },
    // 监听 pagesize
    handleSizeChange(page) {
      this.pageInfo.pagesize = page
      this.getOrderData()
    },
    // 监听 pagenum
    handleCurrentChange(size) {
      this.pageInfo.pagenum = size
      this.getOrderData()
    },
    // 编辑页面
    editAmend(val) {
      this.cataId = val.order_id
      this.addressFrom.is_send = val.is_send
      this.addressFrom.order_pay = val.order_pay
      this.addressFrom.order_price = val.order_price
      this.addressFrom.order_number = val.order_number
      this.addressFrom.pay_status = val.is_send
      this.showEditFrom = true
    },
    // 编辑页面确认提交
    editDataFrom() {
      this.$refs.addressFormRulos.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整的表单!')
        const { data: res } = await this.$http.put(
          'orders/' + this.cataId,
          this.addressFrom
        )
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.getOrderData()
        this.showEditFrom = false
      })
    },
    // 级联选择器改变时
    clickHandleChange() {
      console.log(this.addressFrom.address1)
    },
    // 编辑窗口关闭事件
    closeDataFrom() {
      this.$refs.addressFormRulos.resetFields()
      this.addressFrom.is_send = 0
      this.addressFrom.order_pay = 0
      this.addressFrom.order_price = 0
      this.addressFrom.order_number = ''
      this.addressFrom.pay_status = 0
      this.addressFrom.address1 = []
      this.addressFrom.address2 = ''
    },
    // 物流页面
    async expressAmend() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流失败!')
      console.log(res)
      this.$message.success(res.meta.message)
      this.dataLogistics = res.data
      this.logisticsShow = true
    }
  }
}
</script>

<style lang="less" scoped></style>
