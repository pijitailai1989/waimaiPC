<template>
  <div class="login-message" @keyup.enter="login">
    <!--区号-->
    <el-select  v-model="select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable >
        <el-option v-for="(item, index) in CountryJson.data" :key="index"
                    :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"/>
    </el-select>
    <div class="phone">
      <el-input v-model="mobile" :placeholder="$t('accountInfo.userInfo.phoneHolder')"></el-input>
      <!-- <el-button type="primary" ref="phoneInput" @click="openModel">获取验证码</el-button> -->
      <div ref="phoneInput" :class="['button', {'disabled':disabled}]" @click="openModel"><span v-if="!disabled && !isSecond && !isLoadingImg">{{$t('accountInfo.userInfo.code')}}</span><span v-if="!disabled && isSecond && !isLoadingImg">{{$t('accountInfo.userInfo.repCode')}}</span><span v-if="isLoadingImg"><img src="../../assets/icon/is_loading.gif" alt=""></span> <span v-if="disabled && !isLoadingImg">{{limitTime}}s{{$t('accountInfo.userInfo.send')}}</span>  </div>
    </div>
    <el-input v-model="mCode" :placeholder="$t('accountInfo.userInfo.phonecodeHolder')"></el-input>
    <el-button type="primary" :loading="submitLoading" class="btn_login" @click="login">{{$t('header.login')}}</el-button>
    <send-message @selfEvent="getTiemOut" ref="sendMessage" :mobile="mobile" :globalCode="globalCode" :messageCode="messageCode" @close="closeModel"/>
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import SendMessage from "./send-message";
import CountryJson from "../../assets/json/countryChinese";
import CountryJsons from "../../assets/json/countryEnglish.json";
import { getCookie } from "../../utils.js";

export default {
  name: "login-message",
  components: { SendMessage },
  data() {
    return {
      CountryJson,
      messageCode: 1,
      select: `+63 ${this.$t("common.country")}`,
      mobile: null,
      mCode: null,
      limitTime: 60,
      timeId: null,
      disabled: false,
      submitLoading: false,
      imgCodeShow: "",
      isLoadingImg: false,
      isSecond: false
    };
  },
  computed: {
    token() {
      return this.$refs.sendMessage.token;
    },
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
    // console.log('0000',this.$route.query.name)
  },
  methods: {
    ...mapActions("user", ["ajaxLogin", "ajaxImageFlag", "ajaxSendMessage"]),
    ...mapMutations("user", ["setUser"]),
    async openModel() {
      let userNum = /^\d{3,14}$/;
      let vCodeId = sessionStorage.getItem("vCodeId");
      if (!this.mobile) {
        this.$message.error(this.$t("accountInfo.userInfo.phoneHolder"));
        return;
        // } else if (!this.$refs.phoneInput.value || this.disabled) return
      } else if (!userNum.test(this.mobile)) {
        this.$message.error(this.$t("accountInfo.userInfo.phone_right"));
        return;
      } else {
        this.isLoadingImg = true
        let self = this;
        let res = await this.ajaxImageFlag({
          clientType: 1,
          globalCode: self.globalCode,
          mobile: self.mobile,
          module: 1
        });
        if (res.code === 1) {
          self.imgCodeShow = res.data;
          if (self.imgCodeShow == "true") {
            if (!this.disabled) {
              this.$refs.sendMessage.open();
              this.$emit("open");
            }
            this.isLoadingImg = false
          } else {
            let sendMesRes = await this.ajaxSendMessage({
              clientType: 1,
              globalCode: self.globalCode,
              mobile: self.mobile,
              module: 1,
              vCodeId: vCodeId
            });
            if (sendMesRes.code === 1) {
              self.disabled = true;
              this.isLoadingImg = false
              this.isSecond = true
              self.getTiemOut();
            } else {
              self.$message.error(sendMesRes.message);
              this.isLoadingImg = false
            }
          }
        } else {
          self.$message.error(res.message);
          this.isLoadingImg = false
        }
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
      this.$emit("close");
    },
    // getTiemOut () {
    // 	this.$refs.phoneInput.timeOut()
    // },
    async login() {
      var _czc = _czc || [];
      _czc.push(["_tarckEvent", "登录", "登录"]);
      let { mobile, mCode, globalCode } = this;
      if (!mobile) {
        this.$message.error(this.$t("accountInfo.userInfo.phoneHolder"));
        return;
      } else if (!mCode) {
        this.$message.error(this.$t("accountInfo.userInfo.phonecodeHolder"));
        return;
      }
      let vCodeId = sessionStorage.getItem("vCodeId");
      this.submitLoading = true;
      let res = await this.ajaxLogin({
        userName: mobile,
        globalCode,
        mCode,
        clientType: 1,
        loginType: 2,
        vCodeId: vCodeId
      });
      if (res.code === 1) {
        this.$message.success(res.message);
        // let auth = {headers: {Authorization: res.data.token}}
        // localStorage.setItem('auth', JSON.stringify(auth))
        clearInterval(this.timeId);
        this.setUser(res.data.userObj);
        // localStorage.setItem('userInfo', JSON.stringify(res.data.userObj))
        let name = this.$route.query.name
        if (name) {
          this.$router.push('/seller/' + this.$route.query.Id)
        } else {
          this.$router.push("/place");
        }
      } else {
        this.$message.error(res.message);
      }
      this.submitLoading = false;
    }
  }
};
</script>

<style scoped lang="scss">
.login-message {
  position: relative;
  .el-select {
    margin-top: 30px;
    width: 100%;
  }
  .phone {
    margin-top: 30px;
    overflow: hidden;
    .el-input {
      margin-top: 0;
      float: left;
      width: 200px;
    }
    .el-button {
      float: left;
      width: 90px;
      height: 30px;
      padding: 0;
      text-align: center;
      margin-left: 20px;
      margin-top: 5px;
      font-size: 12px;
    }
  }
  .el-input {
    margin-top: 30px;
  }
  .el-button {
    margin-top: 30px;
    width: 100%;
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
