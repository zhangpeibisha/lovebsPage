<template>
  <div class="personleCenter">
    <p class="mine">我的个人主页</p>
    <el-container>
      <el-aside width="200px">
        <img :src="userInfo.imageUrl"/>
      </el-aside>
      <el-main>
        <p>姓名：{{userInfo.name}}</p>
        <p>学号：{{userInfo.studentId}}</p>
        <p>电话：{{userInfo.phone}}</p>
        <p>邮箱：{{userInfo.email}}</p>
      </el-main>
    </el-container>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        userInfo: {},
      };
    },
    created() {
      this.findUserInfo()
    },
    methods: {
      findUserInfo() {

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
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 10px;
  }

  .mine {
    font-weight: 600;
    margin-bottom: 20px;
    text-align: center;
    border-bottom: 1px solid #e4e7ed;
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

  .info-row {
    margin: 0.8em 0;
  }
</style>
