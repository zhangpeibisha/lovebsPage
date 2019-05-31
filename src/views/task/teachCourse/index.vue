<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="findTeachCourseList()" type="primary" size="small">查询结果</el-button>
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
          <el-form-item label="学年：">
            <el-select v-model="listQuery.year" placeholder="请选择">
              <el-option
                v-for="item in schoolYear"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期：">
            <el-select v-model="listQuery.semester" placeholder="请选择">
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
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入教学任务
      </el-button>
      <el-button class="btn-add" size="mini" type="success" @click="showUploadStudentScore=true">上传学生课程分数</el-button>
    </el-card>


    <el-dialog
      title="上传教学任务"
      :visible.sync="showImportTask"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        :on-success="uploadTaskSuccess"
        :on-error="uploadTaskError"
        :action='uploadUrl'
        multiple
        headers="{'Content-Type':'application/x-www-form-urlencoded'}"
        name="teachTask">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showImportTask = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="上传学生学习成绩"
      :visible.sync="showUploadStudentScore"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        :on-success="uploadTaskSuccess"
        :on-error="uploadTaskError"
        :action='uploadStudentScoreUrl'
        multiple
        headers="{'Content-Type':'application/x-www-form-urlencoded'}"
        name="teachCourScore">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showUploadStudentScore = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="table-container">
      <el-table
        :data="teachCourseList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
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
        <el-table-column label="评教得分" align="center">
          <template slot-scope="scope">{{scope.row.teachScore}}</template>
        </el-table-column>
        <el-table-column label="操作" style="width: 600px">
          <template slot-scope="scope">
            <!--老师和管理员查看内容-->
            <el-button size="mini" @click="viewTeachTaskQuestion(scope.row)">评教卷</el-button>
            <!--学生填写评教-->
            <el-button size="mini" @click="answerSheet(scope.row)">评教</el-button>
            <el-button size="mini" @click="viewTeachTaskQuestionAnswer(scope.row)">查看回答</el-button>
            <el-button size="mini" @click="viewStatisticsScore(scope.row)">查看统计得分</el-button>
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
  import {uploadTeachTaskUrl, uploadTeachCourScore} from '@/config/config'

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
        roles: [],
        total: 0,
        showImportTask: false,
        uploadUrl: uploadTeachTaskUrl,
        uploadStudentScoreUrl: uploadTeachCourScore,
        showUploadStudentScore: false
      };
    },
    created() {
      this.findTeachCourseList();
      this.userRole();
      this.selectSchoolYearList();
    },
    methods: {
      findTeachCourseList() {
        fetchListAll(this.listQuery).then(res => {
          console.log("获取到教学任务", res);
          this.teachCourseList = res.data.data;
          this.total = res.data.total;
        })
      },
      selectSchoolYearList() {
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
      }, uploadTaskSuccess() {
        this.selectSchoolYearList();
        this.findTeachCourseList();
        this.$message({
          message: '教学任务上传成功',
          type: 'success'
        });
      }, uploadTaskError() {
        this.$message({
          message: '教学任务上传失败',
          type: 'error'
        });
      }, viewTeachTaskQuestion(row) {
        console.log("获取到的信息为：", row);
        console.log("获取到的信息为,发布评教卷id：", row.publishQuestionnaireId);
        console.log("获取到的信息为,评教卷id：", row.questionnaireId);
        this.$router.push({
          path: "/task/view",
          query: {
            evaluationId: row.questionnaireId
          }
        })
      },
      viewTeachTaskQuestionAnswer(row) {
        this.$router.push({
          path: "/task/view",
          query: {
            publishId: row.publishQuestionnaireId
          }
        })
      }
      , answerSheet(row) {
        this.$router.push({
          path: "/task/reply",
          query: {
            publishEvaluationId: row.publishQuestionnaireId
          }
        })
      }, viewStatisticsScore(row) {
        this.$router.push({
          path: "/task/statisticsScore",
          query: {
            publishEvaluationId: row.publishQuestionnaireId
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


