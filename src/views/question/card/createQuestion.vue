<template lang="html">
  <li>
    <div class="content">
      <!-- 问题题目 -->
      <p
        @keyup="changeQuestionTitle(qIndex, $event)"
        class="input title" contenteditable>{{ question.title }}</p>
      <!-- 问题题目 end -->
      <!-- 所有答案 -->
      <ol v-if="question.questionnaireType !== 'text'" class="answers">
        <!-- 答案 -->
        <li
          v-for="(answer,oIndex) in question.items"
          class="answer">
          <!-- 选择框 -->
          <input class="select" :type="question.questionnaireType" :name="question.title" :value="`问题${qIndex + 1}`">
          <!-- 选项内容 -->
          <div class="option">
            <div class="input-fix">
              <p
                @keyup="changeOptionValue(qIndex, oIndex, $event)"
                @change="changeOptionValue(qIndex,oIndex,$event)"
                class="input"
                contenteditable>{{ answer.title }}</p>
                <p>分值:</p>
                <p
                @keyup="changeOptionValue1(qIndex, oIndex, $event)"
                @change="changeOptionValue1(qIndex,oIndex,$event)"
                class="input"
                contenteditable>{{ answer.weights }}</p>
            </div>
            <!-- 选项工具框 -->
            <ul class="option-panel">
              <li
                @click="optionPositionFront(qIndex, $index)"
                class="iconfont">↑</li>
              <li
                @click="optionPositionBack(qIndex, $index)"
                class="iconfont">↓</li>
              <li
                v-show="question.items.length > 1"
                @click="deleteOption(qIndex, $index)"
                class="iconfont">&#xe646;</li>
            </ul>
          </div>
        </li>
      </ol>
      <!-- 所有答案 end -->
      <div
        @click="addOption(qIndex)"
        v-if="question.questionnaireType !== 'text'"
        class="add-option"><span class="iconfont">&#xe60f;</span>添加选项</div>
      <div v-else class="option">
        <textarea class="textarea"></textarea>
        <label for="isRequired"><input
          @change="changeTextRequired(qIndex, $event)"
          :checked="question.mustWriter"
          class="required"
          id="isRequired"
          type="checkbox">是否必填</label>
      </div>
    </div>
    <div class="side">
      <div class="order">Q{{ qIndex + 1 }}</div>
      <ul class="opertions">
        <li
          @click="questionPositionFront(qIndex)"
          class="iconfont">&#xe63e;</li>
        <li
          @click="questionPositionBack(qIndex)"
          class="iconfont">&#xe63f;</li>
        <li
          @click="copyQuestion(qIndex)"
          class="iconfont">&#xe62e;</li>
        <li
          @click="deleteQuestion(qIndex)"
          class="iconfont">&#xe60d;</li>
      </ul>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    },
    qIndex: {
      type: Number,
      required: true
    }
  },
  methods: {
    // 问题题目
    changeQuestionTitle(qIndex, e) {
      this.$parent.changeQuestionTitle(qIndex, e.target.textContent);
    },
    // 问题位置
    questionPositionFront(oldIndex) {
      this.$parent.questionPositionChange(oldIndex, oldIndex - 1);
    },
    questionPositionBack(oldIndex) {
      this.$parent.questionPositionChange(oldIndex, oldIndex + 1);
    },
    deleteQuestion(qIndex) {
      this.$parent.deleteQue(qIndex);
    },
    // 选项值
    changeOptionValue(qIndex, oIndex, e) {
      this.$parent.changeOptionValue(qIndex, oIndex, e.target.textContent);
    },
    changeOptionValue1(qIndex, oIndex, e) {
      this.$parent.changeOptionValue1(qIndex, oIndex, e.target.textContent);
    },
    // 添加选项
    addOption(qIndex) {
      this.$parent.addOption(qIndex);
    },
    // 删除选项
    deleteOption(qIndex, oIndex) {
      this.$parent.deleteOption(qIndex, oIndex);
    },
    copyQuestion(qIndex) {
      this.$parent.copyQuestion(qIndex);
    },
    changeTextRequired(qIndex, e) {
      this.$parent.changeTextRequired(
        "change-text-required",
        qIndex,
        e.target.checked
      );
    },
    optionPositionFront(qIndex, oIndex) {
      this.$parent.optionPositionChange(qIndex, oIndex, oIndex - 1);
    },
    optionPositionBack(qIndex, oIndex) {
      this.$parent.optionPositionChange(qIndex, oIndex, oIndex + 1);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/base";
@import "../css/helpers/mixins";
.question {
  @include clearfix;
  padding: 1rem;
  border-radius: 0.4rem;
  list-style: none;
  &:hover {
    background-color: $bg-gray;
    .side {
      .opertions {
        visibility: visible !important;
      }
    }
    .add-option {
      visibility: visible !important;
    }
  }
  .side {
    float: left;
    margin-left: -100%;
    width: 3rem;
    font-size: $font-size-default;
    cursor: pointer;
    line-height: 1.5;
    text-align: center;
    .order {
      line-height: 2.4rem;
    }
    .opertions {
      margin-top: 0.3rem;
      list-style: none;
      padding: 0;
      visibility: hidden;
      line-height: 2;
      color: $gray;
      .iconfont:hover {
        color: $blue;
      }
    }
  }
  .content {
    float: left;
    width: 100%;
    padding-left: 4rem;
    .textarea,
    .input {
      border: 1px solid transparent;
      background-color: transparent;
      margin: 0;
      outline: none;
      &:hover {
        border-color: $blue;
        background-color: $bg-yellow;
      }
    }
    .title {
      font-size: $font-size-default;
      line-height: 1.5;
      width: 100%;
      max-width: 100%;
      border-radius: 0.3rem;
      line-height: 2.4rem;
      &:hover {
        border-color: $light-black;
        background-color: $bg-yellow;
      }
    }
    .answers {
      list-style: none;
      padding: 0;
      line-height: 2;
      font-size: $font-size-sm;
      color: $light-black;
      margin-top: 0.4rem;
      .answer {
        display: flex;
        align-items: flex-start;
        margin-bottom: 0.4rem;
        @include clearfix;
        .select {
          display: inline-block;
          height: 2.4rem;
          width: 2rem;
          float: left;
          position: relative;
        }
        .option {
          font-size: $font-size-default;
          float: left;
          width: 100%;
          margin-left: -2rem;
          padding-left: 2rem;
          @include clearfix;
          .input-fix {
            float: left;
            width: 100%;
            padding-right: 10rem;
            display: flex;
            .input {
              line-height: 2.4rem;
              border: 1px solid transparent;
              background-color: transparent;
              margin: 0;
              outline: none;
              min-width: 40%;
              max-width: 40%;
              padding: 0 0.2rem;
              border-radius: 0.3rem;
              color: #777;
            }
          }
          .option-panel {
            display: none;
            float: left;
            width: 10rem;
            margin-left: -12rem;
            font-size: $font-size-default;
            .iconfont {
              list-style: none;
              float: left;
              width: 2rem;
              line-height: 2.4rem;
              color: $blue;
              padding: 0;
              text-align: center;
              &:hover {
                color: lighten($blue, 30%);
              }
            }
          }
          &:hover {
            .input-fix {
              .input {
                border-color: $blue;
                background-color: $bg-yellow;
              }
            }
            .option-panel {
              display: block;
            }
          }
        }
      }
    }
    .add-option {
      margin-top: 1rem;
      font-size: $font-size-default;
      cursor: pointer;
      color: $gray;
      display: inline-block;
      line-height: 2;
      text-align: center;
      border-radius: 0.4rem;
      visibility: hidden;
      &:hover {
        color: $blue;
      }
      .iconfont {
        margin-right: 0.6rem;
      }
    }
    .option {
      .textarea {
        width: 100%;
        height: 10rem;
        margin-top: 0.8rem;
        border: 1px solid $light-black;
      }
      [for="isRequired"] {
        margin-top: 1rem;
        display: block;
        .required {
          margin-right: 0.4rem;
        }
      }
    }
  }
}
</style>
