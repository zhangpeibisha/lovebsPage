<template>
  <div style="margin: auto">
    <el-form :model="loginForm" status-icon
             ref="loginForm" label-width="100px" class="demo-ruleForm"
             @submit.native.prevent>

      <el-form-item label="账号" prop="text">
        <el-input type="text" v-model="loginForm.username"
                  autocomplete="off" style="width: 200px" clearable></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="loginForm.password"
                  autocomplete="off" style="width: 200px" clearable show-password></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="text">
        <el-row :gutter="10">
          <el-input class="input" maxlength="4"
                    placeholder="请输入验证码" style="width: 100px;" clearable></el-input>
          <img id="imgIdentifyingCode" alt="点击更换"
               title="点击更换" @click="getIdentifyingCode"/>
        </el-row>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleLogin()">登陆</el-button>
        <el-button @click="resetForm(loginForm)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: 'laoshi',
          password: 'laoshi',
          image: ""
        }
      }
    },
    methods: {
      handleLogin() {
        this.loading = true;
        this.$store.dispatch('Login', this.loginForm).then(() => {
          this.loading = false;
          this.$router.push({path: '/'})
        }).catch(() => {
          this.loading = false
        })
      },
      resetForm() {
        this.loginForm.username = '';
        this.loginForm.password = '';
        this.loginForm.image = '';
      },
      getIdentifyingCode() {
        let objs = document.getElementById("imgIdentifyingCode");
        objs.src = 'http://localhost:8080/validate/image';
      }
    }
  }
</script>
