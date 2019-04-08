<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="handleSearchList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置</el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item label="学号：">
            <el-input style="width: 203px" v-model="listQuery.studentId" placeholder="学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="学院：">
              <el-select v-model="listQuery.facultyId" placeholder="请选择学院" clearable>
              <el-option
                v-for="item in facultyList"
                :key="item.coding"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：">
            <el-select v-model="listQuery.professionId" placeholder="请选择专业" clearable>
              <el-option
                v-for="item in professionList"
                :key="item.coding"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>学生数据</span>
      <el-button class="btn-add" @click="handleAddProduct()" size="mini">添加</el-button>
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
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="学号">
                <span>{{ props.row.studentId }}</span>
              </el-form-item>
              <el-form-item label="姓名">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="手机">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="邮件">
                <span>{{ props.row.email }}</span>
              </el-form-item>
              <el-form-item label="学院">
                <span>{{ props.row.class.profession.faculty.name }}</span>
              </el-form-item>
              <el-form-item label="专业">
                <span>{{ props.row.class.profession.name }}</span>
              </el-form-item>
              <el-form-item label="指导员">
                <span>指导员</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img style="height: 80px;width:80px;" :src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column label="学号" align="center">
          <template slot-scope="scope">{{scope.row.studentId}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="专业" align="center">
          <template slot-scope="scope">{{scope.row.class.profession.name}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchList } from "@/api/student";

const defaultListQuery = {
  keyword: null,
  pageNum: 1,
  pageSize: 5,
  studentId: null,
  name: null,
  professionId: null,
  facultyId: null
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
      facultyList: [],
      professionList: []
    };
  },
  created() {
    this.getList();
    this.getProfessionList();
    this.getFacultyList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data;
        this.total = 1;
      });
    },
    getProfessionList(code) {
        this.professionList = [{
            coding: '09',
            name: '网络工程'
        }]
    },
    getFacultyList() {
        this.facultyList = [
            {
                code: '03',
                name: '计算机'
            }
        ]
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePublishStatusChange(index, row) {
      let ids = [];
      ids.push(row.id);
      this.updatePublishStatus(row.publishStatus, ids);
    },
    handleResetSearch() {
      this.selectProductCateValue = [];
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleDelete(index, row) {
      this.$confirm("是否要进行删除操作?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ids = [];
        ids.push(row.id);
        this.updateDeleteStatus(1, ids);
      });
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


