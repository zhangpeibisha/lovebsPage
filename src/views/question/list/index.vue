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
        >重置
        </el-button>
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
      >添加
      </el-button>
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
        <el-table-column label="操作" style="width: 20%">
          <template slot-scope="scope">
            <el-button
              size="mini" @click="viewQuestion(scope.row.id)">查看
            </el-button>
            <el-button
              size="mini" @click="publishQuestionConfig(scope.row)">发布问卷
            </el-button>
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


    <!--配置问卷发布信息-->
    <el-dialog title="发布问卷配置" :visible.sync="publishQuestionVisible">
      <el-form :model="publishInfo">
        <el-form-item label="问卷名字" :label-width="formLabelWidth">
          <el-input v-model="chooseQuestion.title" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择课程" :label-width="formLabelWidth">
          <el-select
            v-model="courseIds"
            multiple
            filterable
            reserve-keyword
            remote
            default-first-option
            :remote-method="queryCourse"
            :loading="courseLoding"
            placeholder="请选择课程">
            <el-option
              v-for="item in courseInfo"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择时间" :label-width="formLabelWidth">
          <div class="block">
            <el-date-picker
              value-format="timestamp"
              v-model="answerTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始答卷时间"
              end-placeholder="结束答卷时间">
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="为什么发布" :label-width="formLabelWidth">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入内容"
            v-model="publishDescription">
          </el-input>
        </el-form-item>
        <el-form-item label="黑名单数量" :label-width="formLabelWidth">
          <el-input-number v-model="blackNumber" @change="handleBlackNumberChange"
                           :min="0" :max="5" label="不计入统计分学生数量"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="publishQuestionVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitPublishQuestionConfig">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import {
    findQuireQuestion
  } from "@/api/question";
  import {
    findCourseList
  } from "@/api/course";
  import {
    publishQuestionnaireByCourseIds
  } from "@/api/question"

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
        dialogTitle: "",
        publishInfo: {},
        formLabelWidth: '120px',
        // 弹出发布框
        publishQuestionVisible: false,
        // 回答时间
        answerTime: '',
        // 选中的课程id
        courseIds: [],
        // 返回所有的课程信息
        courseInfo: [],
        chooseQuestion: {},
        courseLoding: false,
        publishDescription: '',
        blackNumber: 0,
        submitPublishQuestionConfigQuery: {}
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
          this.total = response.data.total;
          console.log("获取到的数据为：", response)
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
      viewQuestion(questionId) {
        console.log("获取到的问卷id为：" + questionId);
        this.$router.push({
          path: "/questionnaire/view",
          query: {
            evaluationId: questionId
          }
        })
      }, publishQuestionConfig(questionId) {
        this.publishQuestionVisible = true;
        this.chooseQuestion = questionId;
        console.log("获取到选中的问卷信息", questionId)
      },
      submitPublishQuestionConfig() {
        console.log("获取到时间", this.answerTime);
        console.log("获取到课程", this.courseIds);
        console.log("获取到时间", this.answerTime[0], this.answerTime[1]);
        this.publishQuestionVisible = false;

        if (!this.courseIds && this.courseIds.length == 0){
          this.$message({
            message: '请选择课程',
            type: 'warning'
          });
          return;
        }
        var courseIdsStr = '';
        this.courseIds.forEach(row => {
           courseIdsStr += row + ",";
        });

        this.submitPublishQuestionConfigQuery.courseIds = courseIdsStr;
        this.submitPublishQuestionConfigQuery.questionnaireId = this.chooseQuestion.id;
        this.submitPublishQuestionConfigQuery.description = this.publishDescription;
        this.submitPublishQuestionConfigQuery.startRespondTime = this.answerTime[0];
        this.submitPublishQuestionConfigQuery.endRespondTime = this.answerTime[1];
        this.submitPublishQuestionConfigQuery.blacks = this.blackNumber;

        publishQuestionnaireByCourseIds(this.submitPublishQuestionConfigQuery).then(res=>{
          console.log("返回结果为",res);
        })
      }, queryCourse(query) {
        console.log("获取的查询参数为", query);
        this.listQuery.keyword = query;
        this.listQuery.quire = "and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire +=
          ` and (name like '%${this.listQuery.keyword}%' or coding like '%${this.listQuery.keyword}%' `
          +
          `or description like '%${this.listQuery.keyword}%')`)
          : "";
        this.listQuery.limit = 15;
        this.courseInfo = [];
        this.courseLoding = true;
        findCourseList(this.listQuery).then(result => {
          console.log("获取到的返回结果", result)
          if (result.data.data) {
            result.data.data.forEach(row => {
              this.courseInfo.push(row);
            })
          }
          this.courseLoding = false;
        })
      }, handleBlackNumberChange(value) {
        console.log("获取改变的数字", value)
      }
    },
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


