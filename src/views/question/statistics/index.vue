<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>评教表详细统计-{{title}}</span>
      <el-button
        class="btn-add" type="success" @click="showRankList=true" size="mini">查看学院排名
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showAdviseList=true" size="mini">查看学生意见
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showConfig=true" size="mini">查看概要
      </el-button>
    </el-card>

    <el-dialog title="评卷表概要" :visible.sync="showConfig">
      <el-form>
        <el-form-item label="总分">
          <el-input v-model="questionConfig.totalScore" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="平均分">
          <el-input v-model="questionConfig.avgScore" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划人数">
          <el-input v-model="questionConfig.shouldAnswer" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="回答人数">
          <el-input v-model="questionConfig.realityAnswer" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="黑名单配置数量">
          <el-input v-model="questionConfig.blackNumber" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showConfig = false">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="topicTitle" :visible.sync="showOptionStatistics">
      <el-table :data="optionStatistics"
                style="width: 100%"
                border>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column align="center" label="选项分数">
          <template slot-scope="scope">{{scope.row.score}}</template>
        </el-table-column>
        <el-table-column align="center" label="选择人数">
          <template slot-scope="scope">{{scope.row.chooseOfNumber}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="学生建议" :visible.sync="showAdviseList">
      <el-table :data="questionConfig.adviseList"
                style="width: 100%"
                border>
        <el-table-column align="center" label="标题">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column align="center" label="建议">
          <template slot-scope="scope">{{scope.row.advice}}</template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <div class="table-container">
      <el-table
        :data="topicStatistics"
        style="width: 100%"
        border
        max-height="350">
        <el-table-column label="标题" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="总分" align="center">
          <template slot-scope="scope">{{scope.row.totalScore}}</template>
        </el-table-column>
        <el-table-column label="平均分" align="center">
          <template slot-scope="scope">{{scope.row.avgScore}}</template>
        </el-table-column>
        <el-table-column label="选择人数" align="center">
          <template slot-scope="scope">{{scope.row.chooseOfNumber}}</template>
        </el-table-column>
        <el-table-column label="操作" style="width: 600px" fixed="right">
          <template slot-scope="scope">
            <!--老师和管理员查看内容-->
            <el-button size="mini" @click="viewOptionStatistics(scope.row)">选项统计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <el-dialog title="学院排名统计" :visible.sync="showRankList">
      <el-form :model="queryRank">
        <el-form-item label="学院">
          <el-select
            v-model="queryRank.facultyId"
            placeholder="请选择学院"
            clearable
            filterable>
            <el-option
              v-for="item in faculty"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学年">
          <el-select
            v-model="queryRank.year"
            placeholder="请选择学年"
            clearable
            filterable>
            <el-option
              v-for="item in schoolYear"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="学期">
          <el-select
            v-model="queryRank.semester"
            placeholder="请选择学期"
            clearable
            filterable>
            <el-option
              v-for="item in semester"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRankList = false">取 消</el-button>
        <el-button type="primary" @click="viewRank">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import store from '@/store'
  import {statisticsScore} from '@/api/question'
  import {findSchoolYearList} from '@/api/task'
  import {findUserFaculty} from '@/api/faculty'

  export default {
    name: "statistics",
    data() {
      return {
        roles: [],
        topicStatistics: [],
        questionConfig: {},
        optionStatistics: [],
        adviseList: [],
        showAdviseList: false,
        showConfig: false,
        showOptionStatistics: false,
        title: '重庆理工大学',
        publishId: 0,
        topicTitle: '',
        showRankList: false,
        schoolYear: [2019, 2018],
        semester: [{
          name: '第一学期',
          type: 'FIRST'
        }, {
          name: '第二学期',
          type: 'SECOND'
        }],
        faculty: [],
        queryRank: {}
      };
    },
    created() {
      this.findStatisticsScore();
      this.userRole();
      this.selectSchoolYearList();
      this.findUserFaculty();
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
      findUserFaculty() {
        findUserFaculty().then(res => {
          console.log("获取用户学院信息", res);
          console.log("获取用户学院信息====", res.data);
          if (res.data && res.data !== null) {
            res.data.forEach(data => {
              if (data && data !== null) {
                this.faculty.push(data);
              }
            })
          }
        })
      },
      viewOptionStatistics(row) {
        this.optionStatistics = row.optionStatistics;
        this.topicTitle = row.title;
        this.showOptionStatistics = true;
      }, findStatisticsScore() {
        // 从路由中获取的参数
        this.publishId = this.$route.query.publishEvaluationId;
        statisticsScore(this.publishId).then(res => {
          this.topicStatistics = res.data.topicStatistics;
          this.questionConfig = res.data;
          this.title = res.data.title;
          if (!this.topicStatistics) {
            this.$message('该评教卷还未有学生回答');
          }
        })
      }, selectSchoolYearList() {
        findSchoolYearList().then(res => {
          console.log("获取到的学年信息未", res);
          this.schoolYear = res.data;
        })
      }, viewRank() {
        this.showRankList = false;
        this.$router.push({
          path: "/task/rank",
          query: this.queryRank
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


