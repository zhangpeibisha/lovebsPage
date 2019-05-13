<template lang="html">
<div  class="layout">

  <div class="qn-wrap">
    <div class="qn">
      <header class="header">
        <input type="text" class="title" placeholder="填写问卷标题" v-model="title" @change="updateQuestionName">
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
          <div class="tools">
            <div class="toolbar">
              <span class="btn" @click="addQuestion('radio')"><span class="iconfont">&#xe64e;</span>单选题</span>
              <span class="btn" @click="addQuestion('checkbox')"><span class="iconfont">&#xe64a;</span>多选题</span>
              <span class="btn" @click="addQuestion('text')"><span class="iconfont">&#xe64b;</span>文本题</span>
            </div>
            <div class="add-btn"><span class="iconfont">&#xe60f;</span>添加问题</div>
          </div>
        </div>
      </div>
      <footer class="footer">
        <div class="operation">
          <span class="btn" :class="{ disabled: isLoading }" @click="createE()">保存问卷</span>
          <span class="btn" :class="{ disabled: isLoading }" @click="publishBtnHandler">发布问卷</span>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import Question from "./Question";
import Calendar from "../common/Calendar";
import Alert from "../common/Alert";
import Modal from "../common/Modal";
import {
  createQuestion,
  addQuestion as _addQuestion,
  addAllQuestion,
  deleteQuestion,
  updateQuestion
} from "@/api/question";

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
      evaluationId: -1
    };
    if (editMode === "create") {
      Object.assign(defaults, { qnId: this.createId() });
    }
    return defaults;
  },
  computed: {
    questionaire() {
      return {
        title: this.title,
        questions: this.questions,
        expires: this.expires,
        publish: this.publish,
        qnId: this.qnId
      };
    }
  },
  methods: {
    // 保存问卷
    saveData() {
      addAllQuestion(
        {
          evaluationId: this.evaluationId
        },
        this.questions
      ).then(r => {
        this.$message({
          message: '恭喜你，成功创建了一个问卷',
          type: 'success'
        });
        this.$router.push({
          path: "/questionnaire/listView",
        });
      });
    },
    addQuestion(type) {
      let option = {
        title: "问题题目",
        questionnaireType: type
      };
      if (type !== "text") {
        option.items = [
          {
            title: "选项1",
            weights: 10
          },
          {
            title: "选项2",
            weights: 10
          }
        ];
      } else {
        option.mustWriter = false;
        option.text = "";
      }
      this.questions.push(option);
    },
    transposition(arr, oldIndex, newIndex) {
      let value = arr.splice(oldIndex, 1)[0];
      arr.splice(newIndex, 0, value);
    },
    modalCallback() {
      this.canDeactivate = true;
      this.$route.router.go({ path: "/platform/questionare" });
    },
    publishBtnHandler() {
      this.publish = true;
      this.saveBtnHandler();
    },
    createId() {
      return "";
    },
    getRandomNumber() {
      return Math.floor(Math.random() * 30);
    },
    deleteQue(qIndex) {
      this.questions.splice(qIndex, 1);
    },
    addOption(qindex) {
      this.questions[qindex].items.push({
        title: "选项" + (this.questions[qindex].items.length + 1),
        weights: 10
      });
    },
    copyQuestion(qIndex) {
      let temp = JSON.stringify(this.questions[qIndex]);
      let newQ = JSON.parse(temp);
      this.questions.push(newQ);
    },
    questionPositionChange(oldIndex, newIndex) {
      this.transposition(this.questions, oldIndex, newIndex);
    },
    deleteOption(qIndex, oIndex) {
      this.questions[qIndex].items.splice(oIndex, 1);
    },
    changeTextRequired(qIndex, required) {
      this.questions[qIndex].required = required;
    },
    changeQuestionTitle(qIndex, value) {
      this.questions[qIndex].title = value;
    },
    changeOptionValue(qIndex, oIndex, value) {
      this.questions[qIndex].items[oIndex].title = value;
    },
    changeOptionValue1(qIndex, oIndex, value) {
      this.questions[qIndex].items[oIndex].weights = value;
    },
    optionPositionChange() {
      this.transposition(this.questions[qIndex].answers, oOldIndex, oNewIndex);
    },
    createE() {
      createQuestion({
        title: this.title
      }).then(r => {
        this.evaluationId = r.data.id;
        this.saveData();
      });
    },
    updateQuestionName(v1,v2,v3){
      console.log("改变的数据为：",v1.target.value,v1,v3,this.title)

    }
  },
  created() {},
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
  height: 700px;
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
