<template lang="html">
  <li>
    <div class="content">
      <!-- 问题题目 -->
      <p>{{ question.title }}</p>
      <!-- 问题题目 end -->
      <!-- 所有答案 -->
      <ol v-if="question.questionnaireType !== 'text'" class="answers">
        <!-- 答案 -->
        <li
          v-for="answer in question.items"
          class="answer">
          <!-- 选择框 -->
          <input class="select" :type="question.questionnaireType" :value="`问题${qIndex + 1}`" disabled>
          <!-- 选项内容 -->
          <div class="option">
            <div class="input-fix">
              <p >{{ answer.title }}</p>
                <p>分值:<span>{{ answer.weights }}</span></p>
                
            </div>
          </div>
        </li>
      </ol>
      <!-- 所有答案 end -->
      <div v-if="question.questionnaireType === 'text'" class="option">
        <textarea class="textarea" disabled></textarea>
      </div>
    </div>
    <div class="side">
      <div class="order">Q{{ qIndex + 1 }}</div>
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
    changeQuestionTitle (qIndex, e) {
      this.$dispatch('change-question-title', qIndex, e.target.textContent)
    },
    // 问题位置
    questionPositionFront (oldIndex) {
      this.$dispatch('question-pos-change', oldIndex, oldIndex - 1)
    },
    questionPositionBack (oldIndex) {
      this.$dispatch('question-pos-change', oldIndex, oldIndex + 1)
    },
    deleteQuestion (qIndex) {
      this.$dispatch('delete-question', qIndex)
    },
    // 选项值
    changeOptionValue (qIndex, oIndex, e) {
      this.$dispatch('change-option-value', qIndex, oIndex, e.target.textContent)
    },
    // 添加选项
    addOption (qIndex) {
      this.$dispatch('add-option', qIndex)
    },
    // 删除选项
    deleteOption (qIndex, oIndex) {
      this.$dispatch('delete-option', qIndex, oIndex)
    },
    copyQuestion (qIndex) {
      this.$dispatch('copy-question', qIndex)
    },
    changeTextRequired (qIndex, e) {
      this.$dispatch('change-text-required', qIndex, e.target.checked)
    },
    optionPositionFront (qIndex, oIndex) {
      this.$dispatch('option-pos-change', qIndex, oIndex, oIndex - 1)
    },
    optionPositionBack (qIndex, oIndex) {
      this.$dispatch('option-pos-change', qIndex, oIndex, oIndex + 1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../css/base";
@import "../css/helpers/mixins";
.question {
  @include clearfix;
  padding: 1rem;
  border-radius: .4rem;
  list-style: none;
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
      margin-top: .3rem;
      list-style: none;
      padding: 0;
      visibility: hidden;
      line-height: 2;
      color: $gray;
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
    }
    .title {
      font-size: $font-size-default;
      line-height: 1.5;
      width: 100%;
      max-width: 100%;
      border-radius: .3rem;
      line-height: 2.4rem;
    }
    .answers {
      list-style: none;
      padding: 0;
      line-height: 2;
      font-size: $font-size-sm;
      color: $light-black;
      margin-top: .4rem;
      .answer {
        display: flex;
        align-items: flex-start;
        margin-bottom: .4rem;
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
            justify-content: space-between;
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
      border-radius: .4rem;
      visibility: hidden;
      .iconfont {
        margin-right: .6rem;
      }
    }
    .option {
      .textarea {
        width: 100%;
        height: 10rem;
        margin-top: .8rem;
        border: 1px solid $light-black;
      }
      [for="isRequired"] {
        margin-top: 1rem;
        display: block;
        .required {
          margin-right: .4rem;
        }
      }
    }
  }
}
</style>
