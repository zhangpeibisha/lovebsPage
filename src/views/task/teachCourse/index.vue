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
          @selection-change="handleSelectionChange"
          size="small"
        >重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item label="学年：">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in schoolYear"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期：">
            <el-select v-model="value" placeholder="请选择">
              <el-option
                v-for="item in semester"
                :key="item.type"
                :label="item.name"
                :value="item.type">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>教学任务</span>
      <el-button
        class="btn-add" type="success" @click="handleDelete()" size="mini">导入课程任务
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="teachCourseList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="课程名字" align="center">
          <template slot-scope="scope">{{scope.row.course.name}}</template>
        </el-table-column>
        <el-table-column label="授课老师" align="center">
          <template slot-scope="scope">{{scope.row.teacher.name}}</template>
        </el-table-column>
        <el-table-column label="授课时间（周）" align="center">
          <template slot-scope="scope">{{scope.row.startWeek}}-{{scope.row.endWeek}}</template>
        </el-table-column>
        <el-table-column label="学年" align="center">
          <template slot-scope="scope">{{scope.row.year}}</template>
        </el-table-column>
        <el-table-column label="学期" align="center">
          <template slot-scope="scope">{{scope.row.semester}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center">
          <template slot-scope="scope">{{scope.row.startTime}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center">
          <template slot-scope="scope">{{scope.row.endTime}}</template>
        </el-table-column>
        <el-table-column label="操作" style="width: 600px">
          <template slot-scope="scope">

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
  import store from '@/store'
  import {fetchListAll, findSchoolYearList} from '@/api/task'


  const defaultListQuery = {
    year: null,
    semester: null,
    page: 1,
    limit: 5
  };

  export default {
    name: "teachCourse",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        teachCourseList: [],
        schoolYear: [2019, 2018],
        semester: [{
          name: '第一学期',
          type: 'FIRST'
        }, {
          name: '第二学期',
          type: 'SECOND'
        }],
        listLoading: false,
        roles: [],
        total: 0
      };
    },
    created() {
      this.findTeachCourseList();
      this.userRole();
      this.selctSchoolYearList();
    },
    methods: {
      findTeachCourseList() {
        fetchListAll(this.listQuery).then(res => {
          console.log("获取到教学任务", res);
          this.teachCourseList = res.data.data;
          this.total = res.data.total;
        })
      },
      selctSchoolYearList() {
        findSchoolYearList().then(res => {
          console.log("获取到的学年信息未", res);
          this.schoolYear = res.data;
        })
      },
      handleSelectionChange() {

      }, userRole() {
        const user = store.state.user;
        console.log("主页用户信息获取到：", user);
        const roles = user.roles;
        this.insertRole(roles);
        console.log("主页角色信息获取到：", this.roles);
      }, insertRole(roles) {
        if (roles) {
          roles.forEach(res => {
            this.roles.push(res.name);
          })
        }
      }, handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
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


