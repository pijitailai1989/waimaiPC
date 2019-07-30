<template>
  <div class="login-password" @keyup.enter="login">
    <!--区号-->
    <el-select v-model="select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable>
      <el-option v-for="(item, index) in CountryJson.data" :key="index" :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"/>
    </el-select>
    <el-input v-model="phone" :placeholder="$t('accountInfo.userInfo.nameHolder')"></el-input>
    <el-input v-model="password" type="password" :placeholder="$t('accountInfo.userInfo.passHolder')"></el-input>
    <div class="verify">
      <el-input v-model="vCode" :placeholder="$t('accountInfo.userInfo.codeHolder')"></el-input>
      <div class="code-img">
        <img :src="codeImg" v-if="!imgLoading">
        <i class="iconfont icon-shuaxin" :class="{'icon-rotating' : imgLoading}" @click="getCodeImage" v-if="!imgLoading"></i>
      </div>
    </div>
    <div class="forget">
      <router-link to="/account/retrieve-password">{{$t('forget.forgetPass')}}</router-link>
    </div>
    <el-button type="primary" :loading="submitLoading" class="btn_login" @click="login">{{$t('header.login')}}</el-button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import CountryJson from "../../assets/json/countryChinese";
import CountryJsons from "../../assets/json/countryEnglish.json";
import { getCookie } from "../../utils.js";

export default {
  name: "login-password",
  data() {
    return {
      CountryJson,
      select: `+63 ${this.$t("common.country")}`,
      passwordUrl: "/account/retrieve-password",
      phone: null,
      password: null,
      vCode: null,
      codeImg: null,
      imgLoading: false,
      submitLoading: false,
      vCodeId: null
    };
  },
  computed: {
    globalCode() {
      let globalCode = 0;
      let { select, CountryJson } = this;
      let list = CountryJson.data;
      list.forEach(item => {
        if (item.countryName === select) globalCode = item.phoneCode;
      });
      return globalCode || "63";
    }
  },
  mounted() {
    let lang = getCookie("lang");
    if (lang == "zh") {
      this.CountryJson = CountryJson;
    } else {
      this.CountryJson = CountryJsons;
    }
    this.getCodeImage();
    // var btn_login = document.getElementsByClassName("btn_login")[0];
    // btn_login.addEventListener("click", function() {
    //   console.log(1111);
    //   _czc.push(["_tarckEvent", "登录", "登录"]);
    //   console.log(_czc);
    // });
  },
  methods: {
    ...mapActions("user", ["ajaxCodeImg", "ajaxLogin"]),
    ...mapMutations("user", ["setUser"]),
    async getCodeImage() {
      if (this.imgLoading) return;
      this.imgLoading = true;
      let vCodeId = sessionStorage.getItem("vCodeId");
      let codeImg = await this.ajaxCodeImg({ clientType: 1, vCodeId: vCodeId });
      console.log("codeImg", codeImg);
      this.codeImg = codeImg;
      this.imgLoading = false;
    },
    async login() {
      let userNum = /^\d{3,14}$/;
      let { phone, password, vCode, globalCode } = this;
      if (!phone) {
        this.$message.error(this.$t("accountInfo.userInfo.nameHolder"));
        return;
      } else if (!userNum.test(phone)) {
        this.$message.error(this.$t("accountInfo.userInfo.phone_right"));
        return;
      } else if (!password) {
        this.$message.error(this.$t("accountInfo.userInfo.passHolders"));
        return;
      } else if (!vCode) {
        this.$message.error(this.$t("accountInfo.userInfo.codeHolder"));
        return;
      }
      this.submitLoading = true;
      // password = this.$md5(password)
      let vCodeId = sessionStorage.getItem("vCodeId");
      let res = await this.ajaxLogin({
        userName: phone,
        password,
        globalCode,
        vCode,
        clientType: 1,
        loginType: 1,
        vCodeId: vCodeId
      });
      if (res.code === 1) {
        console.log("login_tokenKey",getCookie("tokenKey"));
        this.$message.success(res.message);
        // let auth = {headers: {Authorization: res.data.token}}
        // localStorage.setItem('auth', JSON.stringify(auth))
        this.setUser(res.data.userObj);
        // localStorage.setItem('userInfo', JSON.stringify(res.data.userObj))
        let name = this.$route.query.name;
        if (name) {
          this.$router.push("/seller/" + this.$route.query.Id);
        } else {
          this.$router.push("/place");
        }
      } else {
        this.$message.error(res.message);
        this.getCodeImage();
      }
      this.submitLoading = false;
    }
  }
};
</script>

<style lang="scss">
.login-password {
  .el-input {
    margin-top: 10px;
  }
  .el-select {
    width: 318px;
  }
  .verify {
    position: relative;
    .el-input {
      .el-input__inner {
        padding-right: 145px;
      }
    }
    .code-img {
      position: absolute;
      right: 0;
      top: 15px;
      overflow: hidden;
      img {
        float: left;
        height: 30px;
      }
      i {
        width: 30px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        float: right;
        font-size: 18px;
        cursor: pointer;
        margin: 0 5px;
        &:before {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
  .forget {
    margin-top: 30px;
    color: #e6a23b;
    padding-right: 2px;
    text-align: right;
    a {
      color: #e6a23b;
    }
  }
  .el-button {
    width: 100%;
    margin-top: 30px;
  }
}
</style>