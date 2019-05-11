<template>
  <div class="personleCenter">
    <p class="mine">我的个人主页</p>
    <el-container>
      <el-aside width="200px">
        <img :src="userInfo.imageUrl"/>
      </el-aside>
      <el-main>
        <p>姓名：{{userInfo.name}}</p>
        <p>工号：{{userInfo.jobNumber}}</p>
        <p>电话：{{userInfo.phone}}</p>
        <p>邮箱：{{userInfo.email}}</p>
      </el-main>
    </el-container>

    <el-dialog :title="'配置不计分学生'+'('+blacklist.canChoose+')'" :visible.sync="blacklist.dialogVisible">
      <el-form :model="blacklist">
        <el-form-item label="不计分学生" :label-width="blacklist.formLabelWidth">
          <el-tag
            v-for="(item,index) in blacklist.showChooseStudentName[activeIndex]"
            :key="item.index"
            @close="deleteSelect(index)"
            closable>
            {{item.name}}
          </el-tag>
        </el-form-item>
        <el-form-item label="学生列表" :label-width="blacklist.formLabelWidth">
          <template>
            <el-select v-model="selectedStudent"
                       placeholder="请选择学生"
                       @change="handleConfig($event)"
                       clearable
                       filterable>
              <el-option
                v-for="item in blacklist.viewStudent"
                :key="item.id"
                :label="item.name"
                :disabled="(blacklist.showChooseStudentName[activeIndex] &&
                blacklist.showChooseStudentName[activeIndex].filter(s => s.id == item.id).length > 0) ||
(blacklist.showChooseStudentName[activeIndex] && blacklist.showChooseStudentName[activeIndex].length >= blacklist.canChoose)"
                :value="item.index">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clearBlackListConfig">取 消</el-button>
        <el-button type="primary" @click="submitBlackList">确 定</el-button>
      </div>
    </el-dialog>


    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane :label="'未读问卷'+'('+pendingQuestionIds.length+')'" name="first">
        <el-table :data="pendingQuestionListShow" style="width: 100%">

          <el-table-column label="标题" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column label="描述" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.descritption}}</span>
            </template>
          </el-table-column>

          <el-table-column label="作者" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.author.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createtime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="更新时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.updatetime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="findStudentList(scope.$index, scope.row)" size="mini">配置</el-button>
              <el-button size="mini" @click="handleView(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pendingQuestionIds.length"
          @current-change="pendingChangePageSize">
        </el-pagination>
      </el-tab-pane>


      <el-tab-pane :label="'已经查看问卷'+'('+clickedQuestionIds.length+')'" name="second">
        <el-table :data="clickedQuestionList" style="width: 100%">

          <el-table-column label="标题" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.title}}</span>
            </template>
          </el-table-column>

          <el-table-column label="描述" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.descritption}}</span>
            </template>
          </el-table-column>

          <el-table-column label="作者" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.author.name}}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.createtime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="更新时间" width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{ scope.row.updatetime}}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="findStudentList(scope.$index, scope.row)" size="mini">配置</el-button>
              <el-button size="mini" @click="handleView(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!--<el-tab-pane :label="'已完成问卷'+'('+completeQuestionIds.length+')'" name="third">-->
      <!--<el-table :data="completeQuestionLis" style="width: 100%">-->

      <!--<el-table-column label="标题" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.title}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="描述" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.descritption}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="作者" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.author.name}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="创建时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.createtime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="更新时间" width="180">-->
      <!--<template slot-scope="scope">-->
      <!--<span style="margin-left: 10px">{{ scope.row.updatetime}}</span>-->
      <!--</template>-->
      <!--</el-table-column>-->

      <!--<el-table-column label="操作">-->
      <!--<template slot-scope="scope">-->
      <!--<el-button type="text" @click="dialogVisible = true" size="mini">配置</el-button>-->
      <!--<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <!--</el-table>-->

      <!--</el-tab-pane>-->


      <!--<el-tab-pane label="编辑信息" name="fouth">-->
      <!--<el-form ref="form" :model="form" label-width="80px">-->
      <!--<el-form-item label="活动名称">-->
      <!--<el-input v-model="form.name"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="活动区域">-->
      <!--<el-select v-model="form.region" placeholder="请选择活动区域">-->
      <!--<el-option label="区域一" value="shanghai"></el-option>-->
      <!--<el-option label="区域二" value="beijing"></el-option>-->
      <!--</el-select>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="活动时间">-->
      <!--<el-col :span="11">-->
      <!--<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>-->
      <!--</el-col>-->
      <!--<el-col class="line" :span="2">-</el-col>-->
      <!--<el-col :span="11">-->
      <!--<el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>-->
      <!--</el-col>-->
      <!--</el-form-item>-->

      <!--<el-form-item>-->
      <!--<el-button type="primary" @click="onSubmit">立即创建</el-button>-->
      <!--<el-button>取消</el-button>-->
      <!--</el-form-item>-->
      <!--</el-form>-->
      <!--</el-tab-pane>-->
    </el-tabs>

  </div>
</template>

<script>
  import {findUserInfo, findPublishInfoByids, timestampToTime} from '@/api/center';
  import {teacherClieckPublishQuestion, addBlackList} from '@/api/question'

  export default {
    data() {
      return {
        userInfo: {
          id: 0,
          jobNumber: '',
          name: '',
          imageUrl: '',
          email: '',
          phone: ''
        },
        qnaireTask: {
          total: 0,
          pending: 0,
          checked: 0,
          complete: 0,
          pendingDetail: [],
          checkedDetail: [],
          completeDetail: []
        },
        activeName: 'first',
        // 已经查看了的问卷id信息
        clickedQuestionIds: [],
        // 已经查看了的问卷信息，为了实现懒加载
        clickedQuestionList: [],
        // 已经查看了的问卷id信息
        pendingQuestionIds: [],
        // 已经查看了的问卷信息，为了实现懒加载
        pendingQuestionList: [],
        pendingQuestionListShow: [],
        pendingQuestionCurrPage: 1,
        pendingQuestionPageSize: 10,
        // 已经查看了的问卷id信息
        completeQuestionIds: [],
        // 已经查看了的问卷信息，为了实现懒加载
        selectedStudent: {},
        completeQuestionLis: [],
        blacklist: {
          dialogVisible: false,
          showChooseStudentName: {},
          // 该问卷有的学生
          student: [],
          formLabelWidth: '120px',
          tempChooseStudent: '',
          // 能够选择的总人数
          canChoose: 0,
          selectedStudent: {},
          viewStudent: []
        },
        activeIndex: 0
      };
    },
    created() {
      this.findUserInfo();
    },
    methods: {
      findUserInfo() {
        findUserInfo().then(result => {
          this.userInfo = result.data.userInfo;
          this.qnaireTask = this.userInfo.workJson.qnaireTask;
          this.findUserPendingIds();
          this.findUserClickedIds();
          this.findUserCompleteIds();
        });
      },
      findUserPendingIds() {
        const pendingIds = [];
        if (this.qnaireTask.pendingDetail !== undefined) {
          this.qnaireTask.pendingDetail.forEach(row => {
            pendingIds.push(row.id)
          });
          this.pendingQuestionIds = pendingIds;
          findPublishInfoByids(this.pendingQuestionIds).then(result => {
            result.data.forEach(row => {
              const questionnaire = row.questionnaire;
              questionnaire.publishId = row.id;
              this.pendingQuestionList.push(questionnaire)
            });
            this.pendingChangePageSize(1);
          });
        }
      },
      findUserClickedIds() {
        const clickedIds = [];
        if (this.qnaireTask.checkedDetail !== undefined) {
          this.qnaireTask.checkedDetail.forEach(row => {
            clickedIds.push(row.id)
          });
          this.clickedQuestionIds = clickedIds;
          findPublishInfoByids(this.clickedQuestionIds).then(result => {
            result.data.forEach(row => {
              const questionnaire = row.questionnaire;
              questionnaire.publishId = row.id;
              this.clickedQuestionList.push(questionnaire)
            });
          })
        }
      },
      findUserCompleteIds() {
        const completeIds = [];
        if (this.qnaireTask.completeDetail !== undefined) {
          this.qnaireTask.completeDetail.forEach(row => {
            completeIds.push(row.id)
          });
          this.completeQuestionIds = completeIds;
          findPublishInfoByids(this.completeQuestionIds).then(result => {
            result.data.forEach(row => {
              const questionnaire = row.questionnaire;
              questionnaire.publishId = row.id;
              this.completeQuestionLis.push(questionnaire)
            });
          })
        }
      },
      pendingChangePageSize(currPage) {
        const maxLen = this.pendingQuestionList.length;
        console.log("获取到未读信息", this.pendingQuestionList);
        const startIndex = (currPage - 1) * this.pendingQuestionPageSize;
        const endIndex = startIndex + this.pendingQuestionPageSize;
        console.log(maxLen, startIndex, endIndex);
        console.log(this.pendingQuestionList.slice(startIndex, endIndex));
        if (maxLen < endIndex && maxLen >= startIndex) {
          this.pendingQuestionListShow = this.pendingQuestionList.slice(startIndex, maxLen);
        } else {
          this.pendingQuestionListShow = this.pendingQuestionList.slice(startIndex, endIndex);
        }
      },
      clickedChangePageSize(currPage) {

      },
      handleClick() {

      },
      // 老师查看问卷信息
      handleView(index, row) {
        console.log("查看问卷点击了", index, row);
        teacherClieckPublishQuestion(row.publishId).then(result => {

        });
        this.$router.push({
          path: "/questionnaire/view",
          query: {
            evaluationId: row.id
          }
        })
      },
      // 老师发现哪些学生参与评教
      findStudentList(index, row) {
        this.activeIndex = index;
        this.selectedStudent = "";
        this.blacklist.dialogVisible = true;
        const cuurPublishId = row.publishId;
        teacherClieckPublishQuestion(row.publishId).then(result => {
          console.log("查看到评卷信息", result);
          this.blacklist.canChoose = result.data.statisticsJson.canFilters;
          this.blacklist.student = [];
          this.blacklist.viewStudent = [];
          var blackListStudentId =  result.data.statisticsJson.black || [];
          result.data.statisticsJson.students.forEach(row => {
            row.index = this.blacklist.student.length;
            console.log("获取到的当前发布id:", cuurPublishId);
            row.currPublishId = cuurPublishId;
            this.blacklist.student.push(row);
            this.blacklist.viewStudent.push(row);
          })
          this.blacklist.showChooseStudentName[this.activeIndex] =
            this.blacklist.viewStudent.filter(item => blackListStudentId.indexOf(item.id) > -1);
        });
        console.log("参与学生", this.blacklist.student)
      },
      //删除选中的黑名单
      deleteSelect(index) {
        this.blacklist.showChooseStudentName[this.activeIndex].splice(index, 1);
        this.blacklist = JSON.parse(JSON.stringify(this.blacklist));
      },
      // 老师配置黑名单学生
      handleConfig(e) {
        this.blacklist.showChooseStudentName[this.activeIndex] =
          (this.blacklist.showChooseStudentName[this.activeIndex] || []).concat(this.blacklist.viewStudent[e]);
      },
      // 操作错误通知
      noticeConfig(title) {
        this.$alert(title, '添加黑名单失败', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'warning ',
              message: `action: ${ action }`
            });
          }
        });
      },
      // 清除选择
      clearBlackListConfig() {
        this.blacklist.viewStudent = [];
        this.blacklist.student.forEach(row => {
          this.blacklist.viewStudent.push(row);
        })
      },
      // 提交选择
      submitBlackList() {
        this.blacklist.dialogVisible = false;
        const students = this.blacklist.showChooseStudentName[this.activeIndex];
        const studentView = this.blacklist.viewStudent;
        if (!students || students.length === 0 || students.length > this.canChoose) {
          this.noticeConfig("提交失败")
        } else {
          const publishId = this.clickedQuestionList[this.activeIndex].id;
          var ids = '';
          students.forEach(row => {
            ids += row.id + ",";
          });
          addBlackList(publishId, ids).then(row => {
            console.log("提交黑名单得到响应", row);
          })
        }
      },
      handleDelete(index, row) {

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
