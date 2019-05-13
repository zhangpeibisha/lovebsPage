<template>
  <div class="personleCenter">
    <p class="mine">我的个人主页</p>
    <el-container>
      <el-aside width="200px">
        <img :src="userInfo.imageUrl"/>
      </el-aside>
      <el-main>
        <p>姓名：{{userInfo.name}}</p>
        <p>学号：{{userInfo.studentId}}</p>
        <p>电话：{{userInfo.phone}}</p>
        <p>邮箱：{{userInfo.email}}</p>
      </el-main>
    </el-container>

    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane :label="'待查看问卷'+'('+pendingIds.length+')'" name="first">

        <el-table :data="pendingList" style="width: 100%">

          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.startRespondTime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="更新时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.endRespondTime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="描述" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.description}}</span>
            </template>
          </el-table-column>

          <el-table-column label="老师名" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.questionnaire.author.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleView(scope.$index, scope.row)">查看</el-button>
              <el-button size="mini" @click="answerSheet(scope.$index, scope.row)">答卷</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!--<el-tab-pane :label="'未完成问卷'+'('+checkedIds.length+')'" name="second">-->

      <!--<el-table :data="datalist" style="width: 100%">-->

      <!--<el-table-column label="创建时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.startRespondTime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="更新时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.endRespondTime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="描述" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.description}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="老师名" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.questionnaire.author.name}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->


      <!--<el-table-column label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>-->
      <!--<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->

      <!--<el-tab-pane :label="'已完成问卷'+'('+completeIds.length+')'" name="third">-->

      <!--<el-table :data="datalist" style="width: 100%">-->

      <!--<el-table-column label="创建时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.startRespondTime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="更新时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.releaseTime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="描述" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.description}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="老师名" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{scope.row.questionnaire.author.name}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>-->
      <!--<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->
      <!--</el-tab-pane>-->


      <el-tab-pane label="选课">
        <el-row>
          <el-button @click="chooseCourse" type="success" plain>选课</el-button>
        </el-row>
      </el-tab-pane>


    </el-tabs>
  </div>
</template>

<script>
  import {findUserInfo, findPublishInfoByids, timestampToTime} from '@/api/center';

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
      chooseCourse(){
        console.log("点击选课========")
        this.$router.push({
          path: "/teacher/course",
        });
      },
      answerSheet(index, row){
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
    border-bottom: 1px solid #E4E7ED;
    margin-bottom: 10px;
  }

  .mine {
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 1px solid #E4E7ED;
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
</style>
