<template lang="html">
<div  class="layout">

  <div class="qn-wrap">
    <div class="qn">
      <header class="header">
        <p class="title" >{{title}}</p>
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
              class="question">
            </li>
          </ol>
        </div>
      </div>
      <footer class="footer">
        <div class="pick-date">
        </div>
        <div class="operation">
          <span class="btn" :class="{ disabled: isLoading }" @click="saveData">提交问卷</span>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import Question from "./replyAnswer";
import Calendar from "../common/Calendar";
import Alert from "../common/Alert";
import Modal from "../common/Modal";
  import {findEvaluationById,commitE,findPublishQuestionById} from "@/api/question"

export default {
  data() {
    let editMode;
    if (!window.sessionStorage.getItem("edit-mode")) {
      editMode = "create";
      window.sessionStorage.setItem("edit-mode", "create");
    } else {
      editMode = window.sessionStorage.getItem("edit-mode");
    }
    let defaults = {
      title: "问卷题目",
      questions: [],
      showAlert: false,
      publish: false,
      showModal: false,
      routerCanDeactivate: false,
      expires: "",
      qnId: -1,
      isLoading: false,
      answers:{
        questionReplies:[]
      },
      // 发布问卷的id
      publishId: -1
    };
    return defaults;
  },
  computed: {
  },
  methods: {
    // 保存问卷
    saveData() {
      this.answers.status = 'commit';
      this.answers.studentId = '';
      commitE({
        publishId: this.publishId
      },this.answers).then(result => {
        console.log("提交返回结果",result);
        this.$message({
          message: '恭喜你，提交问卷成功',
          type: 'success'
        });
        this.$router.push({
          path: "/home",
        })
      })
    },
    answer(answer) {
      console.log("a==",answer)
      this.answers.questionReplies.filter(q => q.questionId == answer.questionId).length == 1 ?
      this.answers.questionReplies = this.answers.questionReplies.map(q => q.questionId == answer.questionId ? answer : q)
      :
      this.answers.questionReplies.push(answer);
    },
    transposition(arr, oldIndex, newIndex) {
      let value = arr.splice(oldIndex, 1)[0];
      arr.splice(newIndex, 0, value);
    },
    saveBtnHandler() {
      this.saveData();
    },
    getParams: function() {
      // 取到路由带过来的参数,这个是发布问卷的id
      this.publishId = this.$route.query.publishEvaluationId;
      console.log("获取到的发布id为==========", this.publishId)
    },
    findEvaluationById(evaluationId) {
      findEvaluationById(evaluationId).then(result => {
        console.log("查询问卷信息", result);
        if (result.code === 200) {
          var data = result.data;
          this.questions = data.content.questions;
          this.title = data.title;
          this.author = data.author;
        }
      });
    },
    findPublishQuestionById(){
      console.log("获取到的发布id为",this.publishId);
      findPublishQuestionById(this.publishId).then(result=>{
        const data = result.data;
        console.log("获取到的data为",result);
        this.findEvaluationById(data.questionnaireId);
      });
    }
  },
  created() {
    this.getParams();
    this.findPublishQuestionById();
  },
  components: {
    Question,
    Calendar,
    Alert,
    Modal
  },
  route: {
    canDeactivate() {
      if (!this.canDeactivate) {
        this.showModal = true;
        return false;
      }
      return true;
    }
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
