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
          <span class="btn" :class="{ disabled: isLoading }" @click="publishBtnHandler">编辑问卷</span>
        </div>
      </footer>
    </div>
  </div>
</div>
</template>

<script>
import Question from "./ViewQuestion";
import Calendar from "../common/Calendar";
import Alert from "../common/Alert";
import Modal from "../common/Modal";

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
      questions: [
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 3,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 8,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 24,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 29,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "text",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 23,
              weights: 22,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 15,
              weights: 3,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 21,
              weights: 13,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 17,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 11,
              weights: 26,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 7,
              weights: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 7,
              weights: 25,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 3,
              weights: 28,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 8,
              weights: 29,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 8,
              weights: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 27,
              weights: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 29,
              weights: 29,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 9,
              weights: 23,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 15,
              weights: 4,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 4,
              weights: 8,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 14,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 7,
              weights: 8,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 21,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 26,
              weights: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 10,
              weights: 8,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 17,
              weights: 22,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 17,
              weights: 1,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 5,
              weights: 29,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 18,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 29,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 9,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 26,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 26,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "text",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 27,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 17,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 24,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 28,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "text",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 22,
              weights: 16,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 8,
              weights: 21,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 7,
              weights: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 0,
              weights: 3,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 20,
              weights: 19,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 17,
              weights: 2,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 4,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 15,
              weights: 18,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 12,
              weights: 2,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 6,
              weights: 17,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 15,
              weights: 0,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 15,
              weights: 18,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 23,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 17,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 20,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              high: 20,
              width: 20,
              defaultsValue: "hello",
              maxSize: 2000,
              sort: 21,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "text",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 17,
              weights: 22,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 4,
              weights: 18,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 17,
              weights: 25,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 1,
              weights: 6,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 7,
              weights: 29,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 26,
              weights: 8,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 22,
              weights: 28,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 24,
              weights: 29,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 21,
              weights: 21,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 7,
              weights: 16,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 22,
              weights: 6,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 9,
              weights: 22,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 3,
              weights: 17,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 4,
              weights: 1,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 12,
              weights: 7,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 18,
              weights: 22,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "radio",
          mustWriter: true
        },
        {
          title: "测试你的题目",
          prompt: "测试题目",
          items: [
            {
              sort: 26,
              weights: 8,
              title: "选项1",
              prompt: "选项1",
              mustWriter: true
            },
            {
              sort: 1,
              weights: 1,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 1,
              weights: 24,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            },
            {
              sort: 0,
              weights: 1,
              title: "选项2",
              prompt: "选项2",
              mustWriter: true
            }
          ],
          questionnaireType: "checkbox",
          mustWriter: true
        }
      ],
      showAlert: false,
      publish: false,
      showModal: false,
      routerCanDeactivate: false,
      expires: "",
      qnId: -1,
      isLoading: false
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
      if (!this.isLoading) {
        let editMode = window.sessionStorage.getItem("edit-mode");
        this.isLoading = true;
        window
          .fetch("/updateUserQnData", {
            method: "post",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `qnData=${JSON.stringify(
              this.questionaire
            )}&editMode=${editMode}`,
            credentials: "same-origin"
          })
          .then(res => {
            return res.json();
          })
          .then(result => {
            if (result.code === 0 || result.code === 1) {
              this.canDeactivate = true;
              this.$route.router.go({ path: "/platform/questionare" });
            } else if (result.code === -1) {
              this.canDeactivate = true;
              this.$route.router.go({ path: "/login" });
            }
          });
      }
    },
    addQuestion(type) {
      let option = {
        title: "问题题目",
        type: type
      };
      if (type !== "text") {
        option.answers = ["选项1", "选项2"];
        option.answersData = [this.getRandomNumber(), this.getRandomNumber()];
      } else {
        option.required = false;
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
    saveBtnHandler() {
      this.saveData();
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
    }
  },
  created() {
    let editMode = window.sessionStorage.getItem("edit-mode");
    let currentQnId = window.sessionStorage.getItem("current-qn-id");
    // 如果是编辑模式，获取要编辑的那份问卷
    if (editMode === "modify") {
      window
        .fetch(`/getUserQnData?qnId=${currentQnId}`, {
          method: "GET",
          credentials: "same-origin"
        })
        .then(response => {
          return response.json();
        })
        .then(result => {
          if (result.code === 1) {
            let qnData = result.data;
            this.title = qnData.title;
            this.questions = qnData.questions;
            this.publish = qnData.publish;
            this.expires = qnData.expires;
            this.qnId = qnData.qnId;
            this.$refs.datePicker.$els.datePicker.value = qnData.expires;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  components: {
    Question,
    Calendar,
    Alert,
    Modal
  },
  events: {
    "change-option-value": function(qIndex, oIndex, value) {
      this.questions[qIndex].answers[oIndex] = value;
    },
    "change-question-title": function(qIndex, value) {
      this.questions[qIndex].title = value;
    },
    "question-pos-change": function(oldIndex, newIndex) {
      this.transposition(this.questions, oldIndex, newIndex);
    },
    "add-option": function(qIndex) {
      this.questions[qIndex].answers.push(
        "选项" + (this.questions[qIndex].answers.length + 1)
      );
      this.questions[qIndex].answersData.push(this.getRandomNumber());
    },
    "delete-option": function(qIndex, oIndex) {
      this.questions[qIndex].answers.splice(oIndex, 1);
      this.questions[qIndex].answersData.pop();
    },
    "delete-question": function(qIndex) {
      this.questions.splice(qIndex, 1);
    },
    "copy-question": function(qIndex) {
      let temp = JSON.stringify(this.questions[qIndex]);
      let newQ = JSON.parse(temp);
      this.questions.push(newQ);
    },
    "change-text-required": function(qIndex, required) {
      this.questions[qIndex].required = required;
    },
    "option-pos-change": function(qIndex, oOldIndex, oNewIndex) {
      this.transposition(this.questions[qIndex].answers, oOldIndex, oNewIndex);
    },
    "date-change": function(dateValue) {
      this.expires = dateValue;
    }
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
