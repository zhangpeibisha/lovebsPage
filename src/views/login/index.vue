<template>
  <div style="margin: auto" class="login-template">
    <el-form :model="loginForm"
             status-icon
             ref="loginForm"
             label-width="100px"
             id="loginForm"
             class="demo-ruleForm"
             @submit.native.prevent>

      <el-form-item label="账号" prop="text">
        <el-input class="qxs-ic_user" type="text" v-model="loginForm.username"
                  autocomplete="off" style="width: 200px" clearable></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="pass">
        <el-input class="qxs-ic_password" type="password" v-model="loginForm.password"
                  autocomplete="off" style="width: 200px" clearable show-password></el-input>
      </el-form-item>

      <el-form-item label="验证码" prop="text">
        <el-row :gutter="10">
          <el-input class="qxs-ic_user" type="text" v-model="loginForm.image"
                    autocomplete="off" style="width: 100px;height: 28px" clearable></el-input>
          <img id="imgIdentifyingCode" alt="点击更换" style="width: 100px;height: 28px"
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
          username: '826416790',
          password: '826416790',
          image: ""
        }
      }
    },
    mounted() {
      this.getIdentifyingCode();
    },
    methods: {
      handleLogin() {
        try {
          this.loading = true;
          this.$store.dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({path: '/'})
            })
            .catch(err => {
              console.log("获取的登陆错误信息==", err)
            });
          this.loading = false;
        } catch (e) {
          console.log("获取的登陆错误信息", e)
        }

      },
      resetForm() {
        this.loginForm.username = '';
        this.loginForm.password = '';
        this.loginForm.image = '';
      },
      getIdentifyingCode() {
        let objs = document.getElementById("imgIdentifyingCode");
        objs.src = 'http://wds001:8080/validate/image';
      }
    }
  }
</script>

<style>

  .login-template {
    width: 100%;
    height: 100%;
    background: url("../../assets/images/background.png") no-repeat center fixed;
    background-size: cover;
    position: fixed;
  }

  #loginForm {
    margin: 0 auto;
    margin-top: 14%;
    width: 367px;
    padding-top: 23px;
    height: 300px;
    background-color: #ffffff;
    opacity: 0.93;
    border-radius: 10px;
    /*background-color: #8b8b8b;*/
  }

</style>
