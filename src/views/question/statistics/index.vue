<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>评教表详细统计-{{title}}</span>
      <el-button
        class="btn-add" type="success" @click="showAdviseList=true" size="mini">查看学生意见
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showConfig=true" size="mini">查看概要
      </el-button>
    </el-card>


    <el-dialog title="评卷表概要" :visible.sync="showConfig">
      <el-form >
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
        <el-table-column align="center" label="选项">
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
        border>
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
        <el-table-column label="操作" style="width: 600px">
          <template slot-scope="scope">
            <!--老师和管理员查看内容-->
            <el-button size="mini" @click="viewOptionStatistics(scope.row)">选项统计</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>


  </div>
</template>
<script>
  import store from '@/store'
  import {statisticsScore} from '@/api/question'

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
        topicTitle: ''
      };
    },
    created() {
      this.findStatisticsScore();
      this.userRole();
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
      }, viewOptionStatistics(row) {
        this.optionStatistics = row.optionStatistics;
        this.topicTitle = row.title;
        this.showOptionStatistics = true;
      }, findStatisticsScore() {
        // 从路由中获取的参数
        this.publishId = this.$route.query.publishEvaluationId;
        statisticsScore(this.publishId).then(res => {
          this.topicStatistics = res.data.topicStatistics;
          this.questionConfig = res.data;
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


