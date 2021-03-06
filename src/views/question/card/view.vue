<template lang="html">
  <div class="layout">

    <el-dialog title="作者信息" :visible.sync="dialogViewAuthorInfo">
      <el-form :model="author">
        <el-form-item label="名字" :label-width="formLabelWidth">
          <el-input v-model="author.name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="author.jobNumber" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="author.correspondence.phone" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮件" :label-width="formLabelWidth">
          <el-input v-model="author.correspondence.email" autocomplete="off" disabled></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewAuthorInfo = false">确 定</el-button>
      </div>
    </el-dialog>
    <!--展示问卷-->
    <div class="qn-wrap">
      <div class="qn">
        <header class="header">
          <p class="title">{{title}}</p>
        </header>
        <div class="body">
          <div class="body-wrap">
            <ol v-if="questions.length !== 0" class="questions">
              <li
                is="question"
                v-for="(qIndex, q) in questions"
                track-by="$index"
                :qIndex="q"
                :question="qIndex"
                :qAnwser="getAnswer(qIndex)"
                class="question">
              </li>
            </ol>
          </div>
        </div>
        <footer class="footer">
          <div class="pick-date">
          </div>
          <div class="operation">
            <span
              class="btn" :class="{ disabled: isLoading }" @click="dialogViewAuthorInfo = true">查看作者信息</span>
            <span
              class="btn" :class="{ disabled: isLoading }" @click="back">教学任务</span>
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '@/store'
  import Question from "./ViewQuestion";
  import Calendar from "../common/Calendar";
  import Alert from "../common/Alert";
  import Modal from "../common/Modal";
  import {fetchPublish, findEvaluationById,findPublishInfoByids} from "@/api/question";

  export default {
    data() {
      return {
        title: "",
        questions: [],
        author: {
          id: -1,
          jobNumber: "",
          name: "",
          imageUrl: "",
          correspondence: {
            phone: "",
            email: ""
          }
        },
        isLoading: false,
        dialogViewAuthorInfo: false,
        formLabelWidth: "120px",
        qAnswers: [],
        evaluationId: 0,
        publishId: 0,
        roles: [],
      };
    },
    created: function () {
      this.getParams();
      this.getPublish();
    },
    methods: {
      transposition(arr, oldIndex, newIndex) {
        let value = arr.splice(oldIndex, 1)[0];
        arr.splice(newIndex, 0, value);
      },
      saveBtnHandler() {
        this.saveData();
      },
      editEvaluation() {
        this.$router.push({
          path: "/task/reply",
          query: {
            publishEvaluationId: this.publishId
          }
        });
      },
      getAnswer(q) {
        return (this.qAnswers.filter(a => a.questionId === q.id) || [{}])[0];
      },
      findEvaluation() {
        if (!this.evaluationId) return;
        findEvaluationById(this.evaluationId).then(result => {
          console.log("查询问卷信息", result);
          if (result.code === 200) {
            var data = result.data;
            this.questions = data.content.questions;
            this.title = data.title;
            this.author = data.author;
            console.log("获取到作者的信息为", this.author);
          }
        });
      },
      getParams: function () {
        // 取到路由带过来的参数
        this.evaluationId = this.$route.query.evaluationId;
        this.publishId = this.$route.query.publishId;
      },
      getPublish() {
        console.log("----", this.publishId);
        if (!this.publishId && this.evaluationId) {
          this.findEvaluation();
          return;
        }
        fetchPublish({
          publishId: this.publishId
        }).then(r => {
          console.log("查询发布的评卷表信息", r.data);
          this.evaluationId = r.data.evaluationQuestionnaire.id;
          if (r.data.answers && r.data.answers.questionReplies) {
            this.qAnswers = r.data.answers.questionReplies;
          }
          this.findEvaluation();
        });
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
      },back(){
        this.$router.push({
          path: "/task/teachTask"
        });
      }
    },
    components: {
      Question,
      Calendar,
      Alert,
      Modal
    }
  };
</script>
<style lang="scss">
  @import "../css/base";
  @import "../css/helpers/mixins";

  .disabled {
    @include btn-disabled;
  }

  .qn-wrap {
    padding: 3rem 6rem;
    border-top: 1px solid $line-color;
    background: $bg-gray;
    height: 500px;
    overflow: auto;
    @at-root {
      .qn {
        background-color: #fff;
        border-radius: 0.4rem;
        box-shadow: 0.1rem 0.1rem 0.4rem 0 #aaa;
        display: inline-block;
        width: 100%;
        .header {
          @include placeholder-style {
            text-align: center;
          }
          text-align: center;
          .title {
            text-align: center;
            width: 80%;
            outline: none;
            padding: 0 1rem;
            margin: 2rem auto;
            border: 1px solid transparent;
            font-size: $font-size-lg;
            line-height: 3rem;
            &:focus {
              border-color: $light-black;
              background: $bg-yellow;
            }
          }
        }
        .body {
          padding: 0 1rem;
          .body-wrap {
            border-top: 1px solid $line-color;
            border-bottom: 1px solid $line-color;
            margin-bottom: 2rem;
            @at-root .questions {
              padding: 2rem 0;
            }
            .tools {
              text-align: center;
              border-radius: 0;
              margin: 1rem auto;
              border: 1px solid $gray;
              &:hover {
                .toolbar {
                  height: 4.4rem;
                }
                .add-btn {
                  background: $light-gray;
                }
              }
              @at-root .toolbar {
                height: 0;
                overflow: hidden;
                transition: height 0.3s ease;
                .btn {
                  @include button(0.5rem, 0.2rem, $light-black);
                  margin: 1rem 0.5rem;
                  display: inline-block;
                  line-height: 1.8rem;
                  .iconfont {
                    margin-right: 0.3rem;
                  }
                }
              }
              @at-root .add-btn {
                .iconfont {
                  margin-right: 0.5rem;
                }

                background: $bg-gray;
                cursor: pointer;
                font-size: $font-size-default;
                color: $light-black;
                line-height: 3;
                width: 100%;
              }
            }
          }
        }
        .footer {
          padding: 0 1.5rem 1.5rem;
        }
      }
    }
    .footer {
      display: flex;
      .pick-date {
        display: inline-block;
        .msg {
          margin-right: 1rem;
        }
      }
      .operation {
        flex-grow: 1;
        text-align: right;
        .btn {
          border: 1px solid $light-black;
          padding: 0.2rem 1rem;
          border-radius: 0.4rem;
          cursor: pointer;
          margin-left: 1rem;
          &:last-child {
            margin-right: 10rem;
          }
          &:hover {
            background-color: $blue;
            color: #fff;
          }
        }
      }
    }
  }
</style>
