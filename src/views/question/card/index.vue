<template>
  <div class="layout">
    <div class="sider">
      <el-button style="margin:20px 0" @click="createQuestion('a')">单选题</el-button>
      <el-button style="margin:20px 0" @click="createQuestion('b')">多选题</el-button>
      <el-button style="margin:20px 0" @click="createQuestion('c')">填空题</el-button>
    </div>
    <div class="right">
      <div class="top">问卷编辑</div>
      <div class="content">
        <div class="questions" v-for=" (question,index) in questions" :key="index">
          <div class="sign" v-if="question.edit">
            <div class="title">{{index + 1}}: 题目：</div>
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 10}"
              placeholder="问题描述"
              v-model="question.title"
            ></el-input>
            <div v-if="question.questionnaireType === questionTypeMapping.a || question.questionnaireType === questionTypeMapping.b">
              <div v-for="(selectItem,_index) in question.items" :key="_index" class="select-group-edit">
                <el-input
                  :style="{width:'auto'}"
                  placeholder="选项"
                  v-model="selectItem.title"
                  clearable
                ></el-input>|
                <el-input
                  :style="{width:'auto'}"
                  placeholder="分值"
                  v-model="selectItem.weights"
                  type="number"
                  clearable
                ></el-input>
              </div>
              <el-button type="primary" @click="addRadioItem(index)">添加选项</el-button>
            </div>
            <div v-if="question.questionnaireType === questionTypeMapping.c">
              默认回答
              <el-input
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 10}"
                placeholder="默认回答"
                v-model="question.defaultsValue"
              ></el-input>回答提示
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10}"
                placeholder="回答提示"
                v-model="question.prompt"
              ></el-input>
            </div>
          </div>
          <div class="single" v-if="!question.edit">
            <div class="title"><span class="must-writer" v-if="question.mustWriter">*</span>{{index + 1}}: {{question.title}}</div>
            <div v-if="question.questionnaireType === questionTypeMapping.a || question.questionnaireType === questionTypeMapping.b">
              <div class="select-group">
                <el-radio
                  v-for="(selectItem,index) in question.items"
                  :key="index"
                  :disabled="true"
                  :label="selectItem.title"
                >{{selectItem.title}}</el-radio>
              </div>
            </div>

            <div v-if="question.questionnaireType === questionTypeMapping.c">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 10}"
                :placeholder="question.prompt"
                v-model="question.defaultsValue"
                :disabled="true"
              ></el-input>
            </div>
          </div>
          <div class="menu" v-if="!question.edit">
            <i class="el-icon-edit" @click="editQ(index)"></i>
            <i class="el-icon-delete" @click="deleteQ(index)"></i>
          </div>
        </div>
      </div>
      <div class="bottom">张沛毕设</div>
    </div>
    <div class="msg">
      <el-checkbox v-model="mustWriter" label="必填" border></el-checkbox>
      <div :style="{textAlign:'center'}">
        <div>回答字数限制</div>
        <el-input-number v-model="maxSize" :min="1" label="字数限制"></el-input-number>
      </div>
      <el-button type="primary" round :loading="saveLoding" @click="save()">提交问卷</el-button>
    </div>
  </div>
</template>
<script>
const questionTypeMapping = {
  a: "CHOSE_SINGLE",
  b: " CHOSE_MULTI",
  c: "FILL_BLANK_SINGLE"
};
export default {
  data() {
    return {
      questionTypeMapping,
      questions: [
        {
          questionnaireType: "FILL_BLANK_SINGLE",
          mustWriter: true,
          defaultsValue: "期望你的回答",
          maxSize: 500,
          title: "问题标题",
          prompt: "你对这门课有什么想说的",
          defaults: true,
          edit: false
        }
      ],
      mustWriter: false,
      maxSize: 500,
      saveLoding: false,
      selectIndex:-1
    };
  },
  created() {},
  methods: {
    createQuestion(type) {
      switch (type) {
        case 'b':
        case "a":
          this.questions.push({
            questionnaireType: questionTypeMapping.a,
            mustWriter: false,
            defaultsValue: "",
            title: "",
            prompt: "",
            defaults: true,
            items: [],
            edit: true
          });
          break;
        case "c":
          this.questions.push({
            questionnaireType: questionTypeMapping.c,
            mustWriter: false,
            defaultsValue: "",
            maxSize: 500,
            title: "",
            prompt: "",
            defaults: true,
            edit: true
          });
          break;
      }
      this.save();
      this.selectIndex = this.questions.length - 1;
    },
    addRadioItem(index) {
      console.log("index=",index);
      this.questions[index].items.push({
        defaults: false,
        id: 3,
        sort: 3,
        weights: 0,
        title: "",
        prompt: "",
        mustWriter: true
      });
    },
    editQ(index) {
      this.save();
      this.questions[index].edit = true;
      this.selectIndex = index;
    }, 
    deleteQ(index) {
      this.save();
      this.questions.splice(index,1);
    },
    save() {
      if (this.selectIndex > -1 && this.selectIndex < this.questions.length) {
        this.questions[this.selectIndex].edit = false,
        this.questions[this.selectIndex].mustWriter = this.mustWriter,
        this.questions[this.selectIndex].maxSize = this.maxSize
      }
    }
  }
};
</script>
<style>
.layout {
  width: 100%;
}
.layout .sider {
  width: 20%;
  position: fixed;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.layout .right {
  position: relative;
  width: 60%;
  margin-left: 20%;
}
.layout .right > div {
  text-align: center;
}
.layout .right .content {
  min-height: 500px;
  text-align: left;
}
.must-writer {
  color: red;
}
.questions {
  position: relative;
  width: 100%;
  margin-top: 20px;
  padding: 20px 20px;
  border-radius: 10px;
}
.questions .menu {
  position: absolute;
  right: 20px;
  top: 10px;
  z-index: 2;
  letter-spacing: 10px;
}
.questions:nth-child(2n) {
  background-color: #f1f1f1;
}
.questions:nth-child(2n + 1) {
  background-color: #666666;
}
.questions .single textarea {
  width: 100%;
  min-height: 50px;
  outline: 0 none;
  border-color: rgba(82, 168, 236, 0.8);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1),
    0 0 8px rgba(82, 168, 236, 0.6);
}
.layout .msg {
  position: fixed;
  width: 20%;
  right: 0;
  top: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.select-group {
  margin-top: 10px;
}
.layout .msg > * {
  margin: 20px 0;
}
</style>
