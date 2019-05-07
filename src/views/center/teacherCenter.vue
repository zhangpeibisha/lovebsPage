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
              <el-button type="text" @click="dialogVisible = true" size="mini">配置</el-button>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
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

      <el-tab-pane :label="'已完成问卷'+'('+completeQuestionIds.length+')'" name="second">
        <el-table :data="completeQuestionLis" style="width: 100%">

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
              <el-button type="text" @click="dialogVisible = true" size="mini">配置</el-button>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane :label="'已经查看问卷'+'('+clickedQuestionIds.length+')'" name="third">
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
              <el-button type="text" @click="dialogVisible = true" size="mini">配置</el-button>
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

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
        completeQuestionLis: [],
        dialogVisible: false
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
          this.pendingChangePageSize(1);
          this.findUserClickedIds();
          this.findUserCompleteIds();
        });
      },
      findUserPendingIds() {
        const pendingIds = [];
        this.qnaireTask.pendingDetail.forEach(row => {
          pendingIds.push(row.id)
        });
        this.pendingQuestionIds = pendingIds;
        findPublishInfoByids(this.pendingQuestionIds).then(result => {
          result.data.forEach(row => {
            this.pendingQuestionList.push(row.questionnaire)
          });
        })
      },
      findUserClickedIds() {
        const clickedIds = [];
        this.qnaireTask.checkedDetail.forEach(row => {
          clickedIds.push(row.id)
        });
        this.clickedQuestionIds = clickedIds;
        findPublishInfoByids(this.clickedQuestionIds).then(result => {
          result.data.forEach(row => {
            this.clickedQuestionList.push(row.questionnaire)
          });
        })
      },
      findUserCompleteIds() {
        const completeIds = [];
        this.qnaireTask.completeDetail.forEach(row => {
          completeIds.push(row.id)
        });
        this.completeQuestionIds = completeIds;
        findPublishInfoByids(this.completeQuestionIds).then(result => {
          result.data.forEach(row => {
            this.completeQuestionLis.push(row.questionnaire)
          });
        })
      },
      pendingChangePageSize(currPage) {
        const maxLen = this.pendingQuestionList.length;
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
      handleEdit(index, row) {

      },
      handleDelete(index, row) {

      }
    }
  };
</script>

<style scoped>
  .configure {
    z-index: 111;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 80%;
    height: 20%;
    margin: auto;
    background: rgba(0, 0, 0, .5);
  }

  .message {
    background: white;
    margin: 20px;
  }

  .personleCenter {
    width: 1200px;
    margin: 0 auto;
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
