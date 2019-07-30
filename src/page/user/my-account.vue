<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="my__account__container clearfix">
      <div class="u-pc-sidebar">
        <!--侧边栏-->
        <side-bar pageId="6" />
      </div>
      <div class="account__wrapper u-pc-content">
        <div class="top__header">
          <h2>{{$t('sideBar.subNav.account')}}</h2>
        </div>
        <common-loading v-if="loading" />
        <template v-else>
          <div class="account__info clearfix">
            <div class="info__img">
              <!-- <img :src="userInfo.memberObj.profilePhoto || defaultAvatar" v-if="userInfo.memberObj.profilePhoto!=null"> -->
              <img :src="userInfo.memberObj.profilePhoto || defaultAvatar">
              <div class="change__img__wrapper">
                <div id="change__img__btn">{{$t('accountInfo.userInfo.modifyPic')}}</div>
              </div>
            </div>
            <div class="info">
              <div class="u-middle">
                <p>{{$t('accountInfo.userInfo.name')}}</p>
                <p>{{userInfo.userName}}
                  <span @click="changeName">
                    <i class="iconfont icon-zhanghushezhi-bianjiicon1 u-cursor-pointer"></i>
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div class="info__list">
            <el-row class="with-bg list__header">
              <el-col :span="8">
                {{$t('accountInfo.userInfo.project')}}
              </el-col>
              <el-col :span="8">
                {{$t('accountInfo.userInfo.content')}}
              </el-col>
              <el-col :span="8">
                {{$t('accountInfo.userInfo.edit')}}
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <i class="iconfont icon-zhanghushezhi-mimaicon1"></i>
                <span>{{$t('accountInfo.userInfo.pass')}}</span>
              </el-col>
              <el-col :span="8">
                <template v-if="parseInt(userInfo.passwordStatus)===0">{{$t('accountInfo.userInfo.noSet')}}</template>
                <template v-else>******</template>
              </el-col>
              <el-col :span="8">
                <i class="iconfont icon-zhanghushezhi-bianjiicon1 u-cursor-pointer" @click="editPassDia=true"></i>
              </el-col>
            </el-row>
            <el-row class="with-bg">
              <el-col :span="8">
                <i class="iconfont icon-zhanghushezhi-shoujiicon1"></i>
                <span>{{$t('accountInfo.userInfo.tel')}}</span>
              </el-col>
              <el-col :span="8">
                +{{userInfo.globalCode}} {{userInfo.tel | formatPhone}}
              </el-col>
              <el-col :span="8">
                <!-- <i class="iconfont icon-zhanghushezhi-bianjiicon1 u-cursor-pointer" @click="editPhone=true"></i> -->
                <i class="iconfont icon-zhanghushezhi-bianjiicon1 u-cursor-pointer" @click="getUserMobileBindStatus"></i>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <i class="iconfont icon-zhanghushezhi-zijinmimaicon1"></i>
                <span>{{$t('accountInfo.userInfo.moneyPass')}}</span>
              </el-col>
              <el-col :span="8">
                <template v-if="parseInt(payPasswordStatus)===0">{{$t('accountInfo.userInfo.noSet')}}</template>
                <template v-else>******</template>
                <!-- <span class="forget-money-password" v-if="parseInt(upThe) === 1" @click="moneyPass(1)">忘记资金密码</span> -->
              </el-col>
              <el-col :span="8">
                <i class="iconfont icon-zhanghushezhi-bianjiicon1 u-cursor-pointer" @click="moneyPass(0)"></i>
              </el-col>
            </el-row>
          </div>
        </template>
      </div>
    </div>
    <common-footer/>
    <!-- 修改用户名 -->
    <el-dialog :title="$t('accountInfo.userInfo.modifyName')" :visible.sync="editNicknameDia" class="c-dialog" width="600px">
      <div @keyup.enter="changeNickname">
        <el-form label-width="100px">
          <el-form-item :label="$t('accountInfo.userInfo.oldName')">
            {{userInfo.userName}}
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.newName')">
            <el-input :placeholder="$t('accountInfo.userInfo.newName')" v-model="nickname"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeNickname" :loading="changeLoading">{{$t('accountInfo.userInfo.confirmModify')}}</el-button>
      </div>
    </el-dialog>
    <!-- 换绑手机 -->
    <el-dialog :title="$t('accountInfo.userInfo.bindPhone')" :visible.sync="editPhone" class="c-dialog" width="600px">
      <el-dialog width="40%" :title="$t('accountInfo.userInfo.picCode')" :visible.sync="innerVisible" append-to-body :before-close="handleClose">
        <div class="verify-img">
          <el-input v-model="vCode" :placeholder="$t('accountInfo.userInfo.placeholder')"></el-input>
          <div class="code-img">
            <img :src="codeImg" v-if="!imgLoading">
            <span @click="getCodeImage">
              <i class="iconfont icon-shuaxin" :class="{'icon-rotating' : imgLoading}" v-if="!imgLoading"></i>
            </span>
          </div>
        </div>
        <p class="hint">{{$t('accountInfo.userInfo.prompts')}}</p>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :loading="submitLoading" @click="submit">{{$t('common.sub')}}</el-button>
        </div>
      </el-dialog>
      <el-form label-width="150px">
        <div class="phone-message" @keyup.enter="changePhone">
          <el-form-item :label="$t('accountInfo.userInfo.password')">
            <el-input :placeholder="$t('accountInfo.userInfo.passHolder')" type="password" v-model="password"></el-input>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.areaCode')">
            <el-select v-model="select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable>
              <el-option v-for="(item, index) in CountryJson.data" :key="index" :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.newPhone')" class="mobileNum">
            <el-input v-model="mobile" :placeholder="$t('accountInfo.userInfo.newPhoneHolder')" class="new_phone"></el-input>
            <div ref="phoneInput" :class="['button', {'disabled':disabled}]" @click="getCode">
              <span v-if="!disabled">{{$t('accountInfo.userInfo.code')}}</span>
              <span v-else>{{limitTime}}s{{$t('accountInfo.userInfo.send')}}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.phoneCode')">
            <el-input v-model="mCode" :placeholder="$t('accountInfo.userInfo.phonecodeHolder')"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePhone" :loading="changeLoading">{{$t('accountInfo.userInfo.confirmModify')}}</el-button>
      </div>
    </el-dialog>
    <!-- 修改登录密码 -->
    <el-dialog :title="$t('accountInfo.userInfo.modifyPass')" :visible.sync="editPassDia" class="c-dialog" width="600px" v-if="parseInt(userInfo.passwordStatus)===1">
      <div @keyup.enter="changePass">
        <el-form label-width="152px">
          <el-form-item :label="$t('accountInfo.userInfo.oldPass')">
            <el-input :placeholder="$t('accountInfo.userInfo.oldPass')" type="password" v-model="oldpass"></el-input>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.newPass')">
            <el-input :placeholder="$t('accountInfo.userInfo.newPass')" type="password" v-model="newpass"></el-input>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.newpassConfirm')">
            <el-input :placeholder="$t('accountInfo.userInfo.confirmHolder')" type="password" v-model="newpassr"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePass" :loading="changeLoading">{{$t('accountInfo.userInfo.confirmModify')}}</el-button>
      </div>
    </el-dialog>
    <!-- 设置登录密码 -->
    <el-dialog :title="$t('accountInfo.userInfo.setPass')" :visible.sync="editPassDia" class="c-dialog" width="600px" v-if="parseInt(userInfo.passwordStatus)===0">
      <div @keyup.enter="changePass">
        <el-form label-width="152px">
          <el-form-item :label="$t('accountInfo.userInfo.setPass')">
            <el-input :placeholder="$t('accountInfo.userInfo.passHolder')" type="password" v-model="oldpass"></el-input>
          </el-form-item>
          <el-form-item :label="$t('accountInfo.userInfo.newpassConfirm')">
            <el-input :placeholder="$t('accountInfo.userInfo.confirmHolder')" type="password" v-model="newpassr"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changePass" :loading="changeLoading">{{$t('accountInfo.userInfo.confirmModify')}}</el-button>
      </div>
    </el-dialog>
    <fund-dialog ref="funDialog" :payPasswordStatus="payPasswordStatus" @refreshList="initData" />
  </div>
</template>
<script>
  import defaultAvatar from '../../assets/img/avatar-male.svg'
  import { mapActions, mapMutations } from 'vuex'
  import SideBar from "../../components/user/side-bar"
  import FundDialog from '../../components/user/fund-dialog'
  import CountryJson from '../../assets/json/countryChinese'
  import CountryJsons from '../../assets/json/countryEnglish.json'
  import { getCookie } from '../../utils.js'

  export default {
    data() {
      return {
        CountryJson,
        defaultAvatar,
        changeLoading: false,
        editNicknameDia: false,
        editPassDia: false,
        innerVisible: false,
        editPhone: false,
        nickname: null,
        mobile: null,
        vCode: null,
        mCode: null,
        codeImg: null,
        imgLoading: false,
        disabled: false,
        submitLoading: false,
        clientType: '1',
        module: '5',
        select: `+63 ${this.$t('common.country')}`,
        password: null,
        modifyThe: null,
        oldpass: null,
        newpass: null,
        newpassr: null,
        loading: true,
        userInfo: {},
        limitTime: 60,
        timeId: null,
        passwordStatus: null,
        payPasswordStatus: null,
        imgCodeShow: ''
      }
    },
    components: { SideBar, FundDialog },
    computed: {
      globalCode() {
        let globalCode = 0
        let { select, CountryJson } = this
        let list = CountryJson.data
        list.forEach(item => {
          if (item.countryName === select) globalCode = item.phoneCode
        })
        return globalCode || '63'
      }
    },
    async mounted() {
      let self = this;
      let lang = getCookie('lang')
      if (lang == 'zh') {
        self.CountryJson = CountryJson
      } else {
        self.CountryJson = CountryJsons
      }
      await self.initData();
      self.loading = false;
      self.initQiniu();
      // self.getMoneyPasswordStatus()
    },
    methods: {
      ...mapActions('user', ['ajaxUserInfo', 'ajaxChangeUserInfo', 'ajaxChangeUserPhone', 'ajaxCodeImg', 'ajaxSendMessage', 'ajaxChangePassword', 'ajaxAddMoneyPassword', 'ajaxMoneyPasswordStatus', "ajaxLogout", "ajaxImageFlag"]),
      // ...mapActions('user', ['ajaxChangeUserInfo', 'ajaxChangePassword', 'ajaxAddMoneyPassword', 'ajaxMoneyPasswordStatus']),
      ...mapActions('order', ['ajaxGetQiniuToken']),
      ...mapMutations('user', ['setUser']),
      // ...mapState('user', ['userinfo']),
      getUserMobileBindStatus() {
        this.$http.post('/innerService/getUserMobileBindStatus').then(res => {
          console.log(res);
          if (res.data.data.bindStatus == true) {
            alert(this.$t('accountInfo.userInfo.onceBind'));
          } else {
            this.editPhone = true;
          }
        }).catch(err => {
          console.error(err);
        });
      },
      async initData() {
        let self = this;
        let res = await this.ajaxUserInfo();
        if (res.code === 1) {
          if (self.$checkData(res)) {
            self.userInfo = res.data;
            self.setUser(res.data)
            self.modifyThe = res.data.modifyThe
            self.passwordStatus = res.data.passwordStatus
            self.payPasswordStatus = res.data.memberObj.paymentpwdFlag
            console.log('ajaxUserInfo', self.userInfo)
            console.log(self.payPasswordStatus)
          }
        } else {
          self.$message.error(res.message)
        }

      },
      async getCode() {
        let userNum = /^\d{3,14}$/;
        let vCodeId = sessionStorage.getItem("vCodeId");
        if (!this.mobile) {
          this.$message.error(this.$t('accountInfo.userInfo.phoneHolder'))
          return
        } else if (!userNum.test(this.mobile)) {
          this.$message.error(this.$t('accountInfo.userInfo.phone_right'))
          return
        } else if (!this.globalCode) {
          this.$message.error(this.$t('accountInfo.userInfo.areaHolder'))
          return
        } else {
          let res = await this.ajaxImageFlag({
            clientType: 1,
            globalCode: this.globalCode,
            mobile: this.mobile,
            module: 5
          })
          if (res.code === 1) {
            this.imgCodeShow = res.data;
            if (this.imgCodeShow == "true") {
              if (!this.disabled) {
                this.getCodeImage()
                this.innerVisible = true
              }
            } else {
              let sendMesRes = await this.ajaxSendMessage({
                  clientType: 1,
                  globalCode: this.globalCode,
                  mobile: this.mobile,
                  module: 5,
                  vCodeId: vCodeId
                })
                if (sendMesRes.code === 1) {
                  this.disabled = true;
                  this.timeOut();
                } else {
                  this.$message.error(sendMesRes.message);
                }
            }
          } else {
            this.$message.error(res.message);
          }
        }
      },
      async getCodeImage() {
        if (this.imgLoading) return
        this.imgLoading = true
        let vCodeId = sessionStorage.getItem("vCodeId");
        let codeImg = await this.ajaxCodeImg({ clientType: this.clientType, vCodeId: vCodeId })
        console.log(codeImg)
        this.codeImg = codeImg
        this.imgLoading = false

      },
      handleClose (done) {
        this.vCode = ''
        done()
      },
      async submit() {
        let { vCode, module, globalCode, mobile, clientType } = this;
        console.log(globalCode)
        if (!vCode) {
          this.$message.error(this.$t('accountInfo.userInfo.placeholder'))
          return
        }
        this.submitLoading = true
        let vCodeId = sessionStorage.getItem("vCodeId");
        let res = await this.ajaxSendMessage({ vCode, module, mobile, globalCode, clientType, vCodeId: vCodeId })
        if (res.code === 1) {
          this.$message.success(res.message)
          this.innerVisible = false
          this.vCode = ''
          this.timeOut()
        } else {
          this.$message.error(res.message)
          this.getCodeImage()
        }
        this.submitLoading = false
      },
      timeOut() {
        // if (!this.$refs.inputVal.value || this.disabled) return 
        this.limitTime = 60
        clearInterval(this.timeId)
        // this.setMsgStatus(true)
        this.disabled = true
        if (this.disabled) {
          this.timeId = setInterval(() => {
            this.limitTime--;
            if (this.limitTime == 0) {
              // console.log('----dao---shi ')
              this.disabled = false
              this.limitTime = 60
              clearInterval(this.timeId)
            }
          }, 1000)

        }
      },
      async initQiniu() {
        let self = this;
        let uptoken = await self.ajaxGetQiniuToken();
        Qiniu.uploader({
          runtimes: 'html5,flash,html4',
          browse_button: 'change__img__btn',
          uptoken: uptoken,
          get_new_uptoken: false,
          unique_names: true,
          domain: 'http://p09c65oxn.bkt.clouddn.com',
          max_retries: 9,
          chunk_size: '4mb',
          auto_start: true,
          multi_selection: false,
          filters: {
            max_file_size: '20mb',
            prevent_duplicates: false,
            mime_types: [
              { title: "Image files", extensions: "jpg,gif,png,jpeg" },
            ]
          },
          init: {
            'FilesAdded': function (up, files) { },
            'BeforeUpload': function (up, file) { },
            'UploadProgress': function (up, file) { },
            'FileUploaded': function (up, file, info) {
              let domain = up.getOption('domain');
              let res = eval("(" + info + ")");
              let sourceLink = domain + "/" + res.key;
              self.changeAvatar(res.key);
            },
            'Error': function (up, err, errTip) {
              //self.$message.error(errTip)
            },
            'UploadComplete': function () { },
            'Key': function (up, file) {
              let key = "";
              return key
            }
          }
        });
      },
      async changeAvatar(img) {
        let self = this;
        if (self.changeLoading) {
          return false;
        }
        let load = self.$message({
          message: this.$t('accountInfo.userInfo.upLoading'),
          duration: 0
        });
        self.changeLoading = true;
        let res = await this.ajaxChangeUserInfo({ profilePhoto: img })
        console.log('ChangeUserInfo', res)
        load.close();
        self.changeLoading = false;
        if (res.code === 1) {
          if (self.$checkData(res)) {
            this.$message.success(this.$t('accountInfo.userInfo.modifyPicSuccess'))
            await this.initData();
          }
        } else {
          this.$message.error(res.message);
        }
      },
      changeName() {
        console.log('modifiy', this.modifyThe)
        if (this.modifyThe == 1) {
          console.log('----true')
          this.$message({
            message: this.$t('accountInfo.userInfo.onlyOne'),
            type: 'warning'
          });
          return
        } else {
          this.editNicknameDia = true;
        }
      },
      async changeNickname() {
        if (this.changeLoading) return
        let { nickname } = this
        if (!nickname) {
          this.$message.error(this.$t('common.notFull'))
          return
        }
        this.changeLoading = true
        let res = await this.ajaxChangeUserInfo({ userName: nickname })
        // console.log('修改昵称',res)
        if (res.code === 1) {
          if (this.$checkData(res)) {
            this.editNicknameDia = false;
            this.nickname = '';
            this.$message.success(this.$t('accountInfo.userInfo.modNameSucc'));
            await this.initData();
          }
        } else {
          this.$message.success(res.message)
        }
        this.changeLoading = false
      },
      async changePass() {
        if (this.changeLoading) return
        if (this.passwordStatus == 1) {
          if (!this.oldpass || !this.newpass || !this.newpassr) {
            this.$message.error(this.$t('common.notFull'))
            return
          } else if (this.newpass !== this.newpassr) {
            this.$message.error(this.$t('accountInfo.userInfo.noIdentical'))
            return
          }
        } else {
          if (!this.oldpass || !this.newpassr) {
            this.$message.error(this.$t('common.notFull'))
            return
          } else if (this.oldpass !== this.newpassr) {
            this.$message.error(this.$t('accountInfo.userInfo.noIdentical'))
            return
          }
        }

        this.changeLoading = true
        let res = await this.ajaxChangePassword({
          passwordStatus: this.passwordStatus,
          password: this.oldpass,
          newpassword: this.newpass,
          cfmPassword: this.newpassr
        });
        if (res.code === 1) {
          if (this.$checkData(res)) {
            this.editPassDia = false;
            this.oldpass = '';
            this.newpass = '';
            this.newpassr = '';
            this.$message.success(this.$t('accountInfo.userInfo.modPassSucc'));
            this.setUser(null)
            // await this.initData();
            setTimeout(() => {
              this.$router.push('/account/login')
            }, 1000)
          }
        } else {
          this.$message.error(res.message);
        }
        this.changeLoading = false
      },
      // async getMoneyPasswordStatus() {
      //   let res = await this.ajaxMoneyPasswordStatus()
      //   if (res.code === 1) {
      //     this.upThe = res.data.UpThe
      //   }
      // },
      moneyPass(value) {
        this.$refs.funDialog.level = value
        this.$refs.funDialog.show()
      },
      // 换绑手机
      async changePhone() {
        let { globalCode, mobile, mCode, password } = this
        if (!password) {
          this.$message.error(this.$t('accountInfo.userInfo.pass_holder'))
          return
        } else if (!mobile) {
          this.$message.error(this.$t('accountInfo.userInfo.phoneHolder'))
          return
        } else if (!mCode) {
          this.$message.error(this.$t('accountInfo.userInfo.codeHolder'))
          return
        }
        this.changeLoading = true
        let res = await this.ajaxChangeUserPhone({ globalCode, mobile, mCode, password, clientType: 1 })
        if (res.code === 1) {
          this.$message.success(this.$t('accountInfo.userInfo.bindSuccess'))
          this.editPhone = false
          this.mobile = ''
          this.mCode = ''
          this.password = ''
          this.select = `+63 ${this.$t('common.country')}`
          this.initData()
        } else {
          this.$message.error(res.message)
        }
        this.changeLoading = false
      }

    }
  }

</script>
<style lang="scss">
  .my__account__container {
    @include container;
    margin-top: 20px;
    .account__wrapper {
      .account__info {
        padding: 20px;
        margin-bottom: 40px;
        .info__img {
          width: 200px;
          height: 110px;
          float: left;
          margin-right: 20px;
          img {
            width: 100%;
            height: 100%;
          }
          .change__img__wrapper {
            user-select: none;
            background: rgba(0, 0, 0, 0.5);
            color: #fff;
            text-align: center;
            height: 25px;
            line-height: 25px;
            position: absolute;
            width: 100%;
            bottom: 0;
            cursor: pointer;
            &:hover {
              background: rgba(0, 0, 0, 0.6);
            }
          }
        }

        .info {
          overflow: hidden;
          height: 110px;
          p {
            &:first-child {
              margin-bottom: 20px;
            }
            span {
              margin-left: 20px;
            }
          }
        }
      }
      .info__list {
        padding: 0 20px;
        .el-row {
          border-bottom: 1px solid $bd-gray;
          &:first-child {
            border-top: 1px solid $bd-gray;
          }
          &.with-bg {
            background: $bg-gray--light;
          }
          &.list__header {
            font-size: 16px;
            .el-col {
              &:first-child {
                text-align: center;
                padding-left: 0;
              }
            }
          }
          .el-col {
            text-align: center;
            height: 60px;
            line-height: 60px;
            &:first-child {
              text-align: left;
              padding-left: 88px;
            }
            i {
              font-size: 20px;
              &.icon-zhanghushezhi-zijinmimaicon1 {
                font-size: 18px;
              }
            }
            span {
              margin-left: 20px;
            }
          }
        }
      }
    }
    .forget-money-password {
      cursor: pointer;
      &:hover {
        color: $color-primary;
      }
    }

  }

  .hint {
    color: #b1afaf;
    margin-top: 10px;
  }

  .mobileNum {
    .button {
      display: inline-block;
      cursor: pointer;
      width: 110px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      margin-left: 1rem;
      border-radius: 4px;
      font-size: 13px;
      border: 1px solid #F56C6C;
      color: #F56C6C;
      background: rgba(255, 100, 76, 0.1);
      box-sizing: border-box;
      &:active {
        background: #F56C6C;
        color: #fff;
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