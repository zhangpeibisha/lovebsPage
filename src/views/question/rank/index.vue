<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>{{rank.facultyName}}-{{rank.year}}学年-{{rank.semester}}</span>
    </el-card>

    <div class="table-container">
      <el-table
        :data="rankList"
        style="width: 100%"
        border
        max-height="250">
        <el-table-column
          type="index"
          width="50"
          label="排序">
        </el-table-column>
        <el-table-column label="教学号" align="center">
          <template slot-scope="scope">{{scope.row.teachCourseId}}</template>
        </el-table-column>
        <el-table-column label="平均分" align="center">
          <template slot-scope="scope">{{scope.row.avgScore}}</template>
        </el-table-column>
        <el-table-column label="课程" align="center">
          <template slot-scope="scope">{{scope.row.courseName}}</template>
        </el-table-column>
        <el-table-column label="老师" align="center">
          <template slot-scope="scope">{{scope.row.teacherName}}</template>
        </el-table-column>
        <el-table-column label="操作" style="width: 600px">
          <template slot-scope="scope">
            <!--老师和管理员查看内容-->
            <el-button size="mini" @click="viewStatistics(scope.row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


  </div>
</template>
<script>
  import store from '@/store'
  import {findRankByFacultyAndYearAndSemester} from '@/api/question'

  export default {
    name: "statistics",
    data() {
      return {
        roles: [],
        rank: {},
        rankList: []
      };
    },
    created() {
      this.userRole();
      this.findRankInfo();
    },
    methods: {
      userRole() {
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
      },
      findRankInfo() {
        const query = {};
        // 学院id
        query.facultyId = this.$route.query.facultyId;
        query.year = this.$route.query.year;
        query.semester = this.$route.query.semester;
        findRankByFacultyAndYearAndSemester(query).then(res => {
           this.rank = res.data;
           this.rankList = this.rank.rank;
        })
      },
      viewStatistics(row) {
        this.$router.push({
          path: "/task/statisticsScore",
          query: {
            publishEvaluationId: row.publishQuestionId
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


