<template>
  <div class="personleCenter">
    <p class="mine">我的个人主页</p>
    <el-container>
      <el-aside width="200px">
        <img :src="userInfo.imageUrl" />
      </el-aside>
      <el-main>
        <p>姓名：{{userInfo.name}}</p>
        <p>学号：{{userInfo.studentId}}</p>
        <p>电话：{{userInfo.phone}}</p>
        <p>邮箱：{{userInfo.email}}</p>
      </el-main>
    </el-container>

    <el-tabs v-model="activeName"
             @tab-click="handleClick">

      <el-tab-pane :label="'待查看问卷'+'('+pendingIds.length+')'"
                   name="first">

        <el-table :data="pendingList"
                  style="width: 100%">

          <el-table-column label="创建时间"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.startRespondTime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="更新时间"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.endRespondTime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="描述"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.description}}</span>
            </template>
          </el-table-column>

          <el-table-column label="老师名"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.questionnaire.author.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini"
                         @click="answerSheet(scope.$index, scope.row)">答卷</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="查看课程">
        <el-table :data="courseList"
                  style="width: 100%">

          <el-table-column label="课程名"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="授课老师"
                           width="140">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.teacherName}}</span>
            </template>
          </el-table-column>

          <el-table-column label="学年"
                           width="80">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.academicYear}}</span>
            </template>
          </el-table-column>

          <el-table-column label="学期"
                           width="140">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.semester}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程开始时间"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程结束时间"
                           width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作"
                           width="150">
            <template slot-scope="scope">
              <el-button size="mini"
                         @click="handleView(scope.$index, scope.row)">评教</el-button>
              <el-button size="mini"
                         @click="answerSheet(scope.$index, scope.row)">查分</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="选课">
        <el-row>
          <el-button @click="chooseCourse"
                     type="success"
                     plain>选课</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="修改个人信息">
        <div class="stu-info">
          <div class="info-row">
            <span>学号：</span><span>{{userInfo.studentId}}</span>
          </div>
          <div class="info-row">
            <span>姓名：</span><span>{{userInfo.name}}</span>
          </div>
          <div class="info-row">
            <span>邮件：</span><span>{{userInfo.email}}</span>
          </div>
          <div class="info-row">
            <span>电话：</span><span>{{userInfo.phone}}</span>
          </div>
        </div>
        <el-button type="primary"
                   @click="dialogTitle = '修改个人信息';editDialog = true">修改信息</el-button>
        <el-button type="primary"
                   @click="editPassDia = true">修改密码</el-button>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :title="dialogTitle"
               :visible.sync="editDialog"
               width="30%">
      <el-form label-width="80px">
        <el-form-item label="学号">
          <el-input disabled
                    :value="userInfo.studentId"></el-input>
        </el-form-item>
        <el-form-item label="姓名：">
          <el-input :value="userInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：">
          <el-input :value="userInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="电话：">
          <el-input :value="userInfo.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="updateUserInfo()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="修改密码"
               :visible.sync="editPassDia"
               width="30%">
      <el-form label-width="80px" >
        <el-form-item label="原密码">
          <el-input type="text" v-model="passMsg.old" name="old"></el-input>
        </el-form-item>
        <el-form-item label="新密码：">
          <el-input type="text" v-model="passMsg.new" name="new"></el-input>
        </el-form-item>
        <el-form-item label="确定新密码：">
          <el-input type="text" v-model="passMsg.new1" name="new1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="editPassDia = false">取 消</el-button>
        <el-button type="primary"
                   @click="editPass()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { findUserInfo, findPublishInfoByids, timestampToTime } from '@/api/center';
  import { Message } from 'element-ui';

  export default {
    data() {
      return {
        userInfo: {},
        pendingIds: [],
        checkedIds: [],
        completeIds: [],
        pendingList: [],
        checkedList: [],
        completeList: [],
        activeName: 'first',
        courseList: [
          {
            id: 0,
            name: '计算机网络',
            teacherName: '周敏',
            academicYear: '2018',
            semester: '第一学期',
            startTime: '2018-03-02',
            endTime: '2018-06-30'
          }
        ],
        dialogTitle: '',
        editDialog: false,
        editPassDia:false,
        passMsg:{
          old: '',
          new: '',
          new1: ''
        }
      };
    },
    created() {
      this.findUserInfo()
    },
    methods: {
      findUserInfo() {
        findUserInfo().then((res) => {
          var userInfo = res.data.userInfo;
          this.userInfo = userInfo;
          var userTask = userInfo.task;
          var userQuestionTask = userTask.qnaireTask;
          if (userTask && userQuestionTask) {
            console.log("数据进来", userTask, userQuestionTask);
            this.configUserTask(userQuestionTask);
          } else {
            console.log("数据没有进来", userTask, userQuestionTask);
          }
        })
      },
      configUserTask(userQuestionTask) {
        var userQuestionPendingTask = userQuestionTask.pendingDetail;
        var userQuestionCheckTask = userQuestionTask.checkedDetail;
        var userQuestionCompleteTask = userQuestionTask.completeDetail;

        this.findQuestionTaskIds(userQuestionPendingTask, this.pendingIds, this.pendingList);
        this.findQuestionTaskIds(userQuestionCheckTask, this.checkedIds, this.checkedList);
        this.findQuestionTaskIds(userQuestionCompleteTask, this.completeIds, this.completeList);
      },
      findQuestionTaskIds(task, idsArr, detailArr) {
        if (task) {
          task.forEach(row => {
            idsArr.push(row.id);
          });
          console.log("====获取到的id为:", idsArr);
          findPublishInfoByids(idsArr).then(res => {
            var resData = res.data;
            if (resData) {
              resData.forEach(row => {
                detailArr.push(row);
              });
            }
          });
        }
      },
      // 学生查看问卷信息
      handleView(index, row) {
        console.log("查看问卷点击了", index, row);
        this.$router.push({
          path: "/questionnaire/view",
          query: {
            publishId: row.id
          }
        })
      },
      chooseCourse() {
        console.log("点击选课========")
        this.$router.push({
          path: "/teacher/course",
        });
      },
      answerSheet(index, row) {
        this.$router.push({
          path: "/questionnaire/edit",
          query: {
            publishEvaluationId: row.id
          }
        })
      },
      handleClick(tab, event) {
        console.log(tab, event);
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        console.log(index, row);
      },
      onSubmit() {
        console.log('submit!');
      },
      // todo 
      updateUserInfo() {
        let userInfo = this.userInfo;
      },
      editPass() {
        
      }
    }
  };
</script>

<style scoped>
  .personleCenter {
    width: 1200px;
    margin: 0 auto;
    overflow-y: scroll;
    height: 500px;
  }

  .el-container {
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 10px;
  }

  .mine {
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 1px solid #e4e7ed;
    padding: 20px;
  }

  .el-aside {
    margin-left: 50px;
    color: #333;
  }

  .el-aside img {
    width: 100%;
    height: 100%;
    display: block;
  }

  .el-main {
    color: #333;
  }

  .el-main p {
    margin-bottom: 10px;
  }
  .info-row {
    margin: 0.8em 0;
  }
</style>
