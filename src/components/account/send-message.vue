<template>
  <div class="send-message" v-if="visible" @keyup.enter.stop="submit">
    <p>{{$t('accountInfo.userInfo.placeholder')}}</p>
    <div class="close" @click="close">
      <i class="iconfont icon-chuyidong"></i>
    </div>
    <div class="verify">
      <el-input v-model="vCode" :placeholder="$t('accountInfo.userInfo.placeholder')"></el-input>
      <div class="code-img">
        <img :src="codeImg" v-if="!imgLoading">
        <span @click="getCodeImage">
          <i class="iconfont icon-shuaxin" :class="{'icon-rotating' : imgLoading}" v-if="!imgLoading"></i>
        </span>
      </div>
    </div>
    <p class="hint">{{$t('accountInfo.userInfo.prompts')}}</p>
    <el-button type="primary" :loading="submitLoading" @click="submit">{{$t('common.sub')}}</el-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'send-message',
  props: ['mobile', 'globalCode', 'messageCode'],
  data() {
    return {
      vCode: null,
      module: '',
      codeImg: null,
      imgLoading: false,
      submitLoading: false,
      clientType: '1',
      visible: false
    }
  },
  methods: {
    ...mapActions('user', ['ajaxCodeImg', 'ajaxSendMessage']),
    async getCodeImage() {
      if (this.imgLoading) return
      this.imgLoading = true
      let vCodeId = sessionStorage.getItem('vCodeId')
      let codeImg = await this.ajaxCodeImg({
        clientType: this.clientType,
        vCodeId: vCodeId
      })
      console.log(codeImg)
      // this.token = token
      this.codeImg = codeImg
      this.imgLoading = false
    },
    async open() {
      this.getCodeImage()
      this.vCode = null
      this.visible = true
    },
    async close() {
      this.visible = false
      this.$emit('close')
    },
    async submit() {
      let { vCode, module, globalCode, mobile, clientType } = this
      console.log(globalCode)
      if (!vCode) {
        this.$message(this.$t('accountInfo.userInfo.placeholder'))
        return
      }
      switch (this.messageCode) {
        case 1: // 登录模块获取手机验证码
          module = '1'
          break
        case 2: // 注册模块获取手机验证码
          module = '3'
          break
        case 3: // 忘记密码模块获取手机验证码
          module = '2'
          break
        case 4: // 换绑手机模块
          module = '5'
          break
        case 8: // 骑手招募
          module = '8'
          break
        default:
          // 默认为登录模块获取手机验证码
          module = '1'
          break
      }
      this.submitLoading = true
      let vCodeId = sessionStorage.getItem('vCodeId')
      let res = await this.ajaxSendMessage({
        vCode,
        module,
        mobile,
        globalCode,
        clientType,
        vCodeId: vCodeId
      })
      if (res.code === 1) {
        this.$emit('selfEvent')
        this.$message(this.$t('accountInfo.userInfo.sendSuccess'))
        this.close()
      } else {
        this.$message.error(res.message)
        this.getCodeImage()
      }
      this.submitLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.send-message {
  position: absolute;
  top: 0;
  width: 100%;
  background: #fff;
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.02);
  z-index: 3;
  .verify {
    position: relative;
    margin: 15px 0;
    .el-input {
      padding-right: 145px;
      .el-input__inner {
        padding-right: 145px;
      }
    }
    .code-img {
      position: absolute;
      right: 0;
      top: 5px;
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
  .close {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 30px;
    height: 30px;
    line-height: 10px;
    text-align: center;
    cursor: pointer;
    font-size: 24px;
    &:hover {
      color: $color-primary;
    }
  }
  .hint {
    font-size: 12px;
    color: #999999;
  }
  .el-button {
    margin-top: 15px;
    width: 100%;
  }
}
</style>
