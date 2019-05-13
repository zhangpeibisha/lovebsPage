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
          <input class="select" :type="question.questionnaireType" :name="question.id" :value="answer.id" disabled
           :checked="qAnwser.chooseId && qAnwser.chooseId.split(',').indexOf(answer.id) >= 0">
          <!-- 选项内容 -->
          <div class="option">
            <div class="input-fix">
              <p >{{ answer.title }}</p>
              <p v-if="!qAnwser.questionId">分值:<span>{{ answer.weights }}</span></p>
            </div>
          </div>
        </li>
      </ol>
      <!-- 所有答案 end -->
      <div v-if="question.questionnaireType === 'text'" class="option">
        <textarea class="textarea" disabled :value="qAnwser.suggest"></textarea>
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
    },
    qAnwser: {
      type: Object,
      required: false,
      default: {}
    }
  },
  methods: {
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
      border-radius: 0.3rem;
      line-height: 2.4rem;
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
      border-radius: 0.4rem;
      visibility: hidden;
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
