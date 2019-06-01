<template>
  <div class="personleCenter">
    <p class="mine">我的个人主页</p>
    <el-container>
      <el-aside width="200px">
        <img :src="userInfo.avatar"/>
      </el-aside>
      <el-main>
        <p>姓名：{{userInfo.name}}</p>
        <p>角色：{{rolesName}}</p>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import store from '@/store'

  export default {
    data() {
      return {
        userInfo: {},
        roles:[],
        rolesName:[]
      };
    },
    created() {
      this.findUserInfo()
    },
    methods: {
      findUserInfo() {
        const user = store.state.user;
        this.userInfo = user;
        console.log("主页用户信息获取到：", user);
        const roles = user.roles;
        this.insertRole(roles);
        this.insertRoleName(roles);
        console.log("主页角色信息获取到：", this.roles);
        this.imageUrl = user.avatar;
        console.log("主页角色信息获取到imageUrl：", this.imageUrl);
      }, insertRole(roles) {
        if (roles) {
          roles.forEach(res => {
            this.roles.push(res.name);
          })
        }
      },insertRoleName(roles){
        roles.forEach(res => {
          this.rolesName.push(res.description);
        })
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
