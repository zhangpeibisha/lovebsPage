<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="getList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="问卷标题/问卷内容"></el-input>
          </el-form-item>
          <el-form-item label="问卷名称：">
            <el-input style="width: 203px" v-model="listQuery.questionName" placeholder="问卷名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>问卷模板数据</span>
      <el-button
        class="btn-add"
        @click="teacher = {
       };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="studentTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>

        <el-table-column label="题目" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">{{scope.row.descritption}}</template>
        </el-table-column>
        <el-table-column label="作者" align="center">
          <template slot-scope="scope">{{scope.row.author.name}}</template>
        </el-table-column>
        <el-table-column label="作者手机号码" align="center">
          <template slot-scope="scope">{{scope.row.author.correspondence.phone}}</template>
        </el-table-column>
        <el-table-column label="作者邮箱号码" align="center">
          <template slot-scope="scope">{{scope.row.author.correspondence.email}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createtime}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini" @click="viewQuestion(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import {
  findQuireQuestion
} from "@/api/question";

const defaultListQuery = {
  query: null,
  word: null,
  blurry: false,
  page: 1,
  limit: 5
};
export default {
  name: "studentList",
  data() {
    return {
      editSkuInfo: {
        dialogVisible: false,
        keyword: null
      },
      operateType: null,
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      total: null,
      listLoading: true,
      selectProductCateValue: null,
      multipleSelection: [],
      editDialog: false,
      dialogTitle: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.query = "where 1 = 1";
      this.listQuery.keyword
        ? (this.listQuery.query +=
            ` and (title like '%${this.listQuery.keyword}%' or descritption like '%${this.listQuery.keyword}%' `
        +
            `or content like '%${this.listQuery.keyword}%')`)
        : "";
      this.listQuery.questionName
        ? (this.listQuery.query += ` and title = '${
          this.listQuery.questionName
          }'`)
        : "";
      findQuireQuestion(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.data;
        this.total = response.data.data.total;
        console.log("获取到的数据为：",response)
      });
    },
    handleSizeChange(val) {
      this.listQuery.page = 1;
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    viewQuestion(questionId){
      console.log("获取到的问卷id为："+questionId);
      this.$router.push({
        path: "/questionnaire/view",
        query: {
          evaluationId: questionId
        }
      })
    }
  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>


