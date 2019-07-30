<template>
  <div class="register">
    <account-header/>
    <div class="container">
      <img src="/loong/static/img/account-inset.png" class="inset">
      <div class="panel" :class="{mask: maskShow}">
        <div class="header">
          <div class="title">{{$t('header.register')}}</div>
          <div class="link">
            <router-link :to="homeUrl">{{$t('header.homePage')}}</router-link>
            <router-link :to="loginUrl">{{$t('header.login')}}</router-link>
          </div>
        </div>
        <div class="form" @keyup.enter="register">
          <div class="phone">
            <!--区号-->
            <el-select v-model="select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable>
              <el-option v-for="(item, index) in CountryJson.data" :key="index" :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"
              />
            </el-select>
            <!--手机号-->
            <el-input v-model="mobile" :placeholder="$t('accountInfo.userInfo.phoneHolder')"></el-input>
          </div>
          <!--验证码-->
          <div class="verify">
            <el-input v-model="mCode" :placeholder="$t('accountInfo.userInfo.phonecodeHolder')"></el-input>
            <!-- <el-button type="primary" @click="openModel">获取验证码</el-button> -->
            <div ref="phoneInput" :class="['button', {'disabled':disabled}]" @click="openModel">
              <span v-if="!disabled && !isSecond && !isLoadingImg">{{$t('accountInfo.userInfo.code')}}</span>
              <span v-if="!disabled && isSecond && !isLoadingImg">{{$t('accountInfo.userInfo.repCode')}}</span>
              <span v-if="isLoadingImg"><img src="../../assets/icon/is_loading.gif" alt=""></span>
              <span v-if="disabled && !isLoadingImg">{{limitTime}}s{{$t('accountInfo.userInfo.send')}}</span>
            </div>
          </div>
          <!--密码-->
          <el-input v-model="password" type="password" :placeholder="$t('accountInfo.userInfo.passHolder')"></el-input>
          <!--确认密码-->
          <el-input v-model="cfmPassword" type="password" :placeholder="$t('accountInfo.userInfo.passConfirm')"></el-input>
          <!--协议-->
          <div class="deal">
            <el-checkbox v-model="checked"></el-checkbox>{{$t('accountInfo.agree')}}
            <a href="/loong/account/service-agreement" target="_blank">{{$t('accountInfo.agreement')}}</a>
          </div>
          <!--提交-->
          <el-button class="submit" type="primary" @click="register" :loading="submitLoading">{{$t('header.register')}}</el-button>
          <!--弹窗-->
          <send-message ref="sendMessage" @selfEvent="getTiemOut" :mobile="mobile" :globalCode="globalCode" :messageCode="messageCode"
            @close="closeModel" />
        </div>
      </div>
    </div>
    <account-footer/>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CountryJson from "../../assets/json/countryChinese";
import AccountHeader from "../../components/account/account-header";
import AccountFooter from "../../components/account/account-footer";
import SendMessage from "../../components/account/send-message";
import CountryJsons from "../../assets/json/countryEnglish.json";
import { getCookie } from "../../utils.js";

export default {
  name: "register",
  components: { AccountHeader, AccountFooter, SendMessage },
  data() {
    return {
      CountryJson,
      homeUrl: "/place",
      loginUrl: "/account/login",
      select: `+63 ${this.$t("common.country")}`,
      mobile: null,
      mCode: null,
      messageCode: 2,
      certificate: null,
      password: null,
      cfmPassword: null,
      submitLoading: false,
      maskShow: false,
      limitTime: 60,
      timeId: null,
      disabled: false,
      checked: true,
      imgCodeShow: "",
      isLoadingImg: false,
      isSecond: false
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
    let current_location = localStorage.getItem("current_location");
    console.log(current_location);
    if (current_location == null) {
      this.homeUrl = "/";
    } else {
      this.homeUrl = "/place";
    }
  },
  methods: {
    ...mapActions("user", [
      "ajaxRegister",
      "ajaxCheckCode",
      "ajaxImageFlag",
      "ajaxSendMessage"
    ]),
    async openModel() {
      let userNum = /^\d{3,14}$/;
      let vCodeId = sessionStorage.getItem("vCodeId");
      if (!this.globalCode) {
        this.$message.error(this.$t("accountInfo.userInfo.areaHolder"));
        return;
      } else if (!this.mobile) {
        this.$message.error(this.$t("accountInfo.userInfo.phoneHolder"));
        return;
      } else if (!userNum.test(this.mobile)) {
        this.$message.error(this.$t("accountInfo.userInfo.phone_right"));
        return;
      } else {
        this.isLoadingImg = true;
        let self = this;
        let res = await this.ajaxImageFlag({
          clientType: 1,
          globalCode: self.globalCode,
          mobile: self.mobile,
          module: 3
        });
        if (res.code === 1) {
          self.imgCodeShow = res.data;
          if (self.imgCodeShow == "true") {
            if (!this.disabled) {
              this.$refs.sendMessage.open();
              this.maskShow = true;
            }
            self.isLoadingImg = false;
          } else {
            let sendMesRes = await this.ajaxSendMessage({
              clientType: 1,
              globalCode: self.globalCode,
              mobile: self.mobile,
              module: 3,
              vCodeId: vCodeId
            });
            if (sendMesRes.code === 1) {
              self.disabled = true;
              self.isSecond = true;
              self.isLoadingImg = false;
              self.getTiemOut();
            } else {
              self.$message.error(sendMesRes.message);
              self.isLoadingImg = false;
            }
          }
        } else {
          self.$message.error(res.message);
          self.isLoadingImg = false;
        }
        // if (!this.disabled) {
        //   this.$refs.sendMessage.open();
        //   this.maskShow = true;
        // }
      }
    },
    // 倒计时
    getTiemOut() {
      // if (!this.$refs.inputVal.value || this.disabled) return
      this.limitTime = 60;
      clearInterval(this.timeId);
      // this.setMsgStatus(true)
      this.disabled = true;
      if (this.disabled) {
        this.timeId = setInterval(() => {
          this.limitTime--;
          if (this.limitTime == 0) {
            // console.log('----dao---shi ')
            this.disabled = false;
            this.limitTime = 60;
            clearInterval(this.timeId);
          }
        }, 1000);
      }
    },
    closeModel() {
      this.maskShow = false;
    },
    async register() {
      let {
        globalCode,
        mobile,
        mCode,
        password,
        certificate,
        cfmPassword,
        checked
      } = this;
      if (!mobile) {
        this.$message.error(this.$t("accountInfo.userInfo.phoneHolder"));
        return;
      } else if (!mCode) {
        this.$message.error(this.$t("accountInfo.userInfo.codeHolder"));
        return;
      } else if (!password) {
        this.$message.error(this.$t("accountInfo.userInfo.passHolders"));
        return;
      } else if (!cfmPassword) {
        this.$message.error(this.$t("accountInfo.userInfo.confirmation"));
        return;
      } else if (password !== cfmPassword) {
        this.$message.error(this.$t("accountInfo.userInfo.noIdentical"));
        return;
      } else if (!checked) {
        this.$message.error(this.$t("accountInfo.noAgree"));
        return;
      } else if (mCode !== null) {
        let res = await this.ajaxCheckCode({
          globalCode,
          mobile,
          mCode,
          clientType: 1
        });
        console.log(res);
        if (res.code === 1) {
          certificate = res.data.certificate;
          if (!certificate) {
            this.$message.warning(res.message);
            return;
          }
          this.submitLoading = true;
          // let token = this.$refs.sendMessage.token
          let regRes = await this.ajaxRegister({
            certificate,
            password,
            cfmPassword
          });
          this.submitLoading = false;
          console.log("注册", regRes);
          if (regRes.code === 1) {
            clearInterval(this.timeId);
            this.$message.success(regRes.message);
            setTimeout(() => {
              this.$router.push("/account/login");
            }, 1000);
          } else {
            this.$message.error(regRes.message);
          }
        } else {
          this.$message.error(res.message);
        }
      }
    }
  }
};
</script>

<style scoped lang="scss">
.register {
  background: #fff;
  height: 100vh;
  position: relative;
  .container {
    @include container;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
  }
  .inset {
    float: left;
    width: 600px;
    margin-top: 100px;
    margin-left: 60px;
  }
  .panel {
    float: right;
    width: 380px;
    padding: 30px 30px 40px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-top: 10px;
    box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.02);
    &:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 2;
      border-radius: 6px;
      display: none;
    }
    &.mask {
      &:before {
        display: block;
      }
    }
    .header {
      overflow: hidden;
      .title {
        float: left;
        font-size: 24px;
        font-weight: bold;
        color: #333333;
      }
      .link {
        float: right;
        height: 30px;
        line-height: 30px;
        a {
          margin: 0 10px;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    .form {
      position: relative;
      .phone {
        overflow: hidden;
        .el-select {
          margin-top: 30px;
          width: 40%;
          float: left;
          input {
            @include text-over;
          }
        }
        .el-input {
          width: 55%;
          margin-left: 5%;
          float: left;
        }
      }
      .el-input {
        margin-top: 30px;
      }
      .verify {
        overflow: hidden;
        margin-top: 30px;
        .el-input {
          float: left;
          width: 65%;
          margin-top: 0;
        }
        .el-button {
          float: right;
          width: 30%;
          padding: 0;
          height: 30px;
          margin-top: 5px;
        }
      }
      .deal {
        margin-top: 30px;
      }
      .submit {
        width: 100%;
        margin-top: 30px;
      }
      .send-message {
        top: 30px;
      }
    }
  }
  .button {
    float: left;
    cursor: pointer;
    width: 90px;
    height: 38px;
    line-height: 38px;
    text-align: center;
    margin-left: 1rem;
    border-radius: 4px;
    font-size: 13px;
    border: 1px solid #f56c6c;
    color: #f56c6c;
    background: rgba(255, 100, 76, 0.1);
    box-sizing: border-box;
    &:active {
      background: #f56c6c;
      color: #fff;
    }
    span {
      img {
        width: 27px;
        margin-bottom: -7px;
      }
    }
  }
  .disabled {
    // color: $primary;
    &:active {
      background: #dddddd;
      color: #666666;
    }
    color: #666666;
    border: 1px solid #999999;
    background-color: #dddddd;
  }
}
</style>