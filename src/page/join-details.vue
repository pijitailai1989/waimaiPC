<template>
  <div class="join_details">
    <!--头部-->
    <join-header />
    <div class="joinContent">
      <div class="header"><div>{{$t('home.joinUs')}}</div></div>
      <div class="location">{{$t('joinUs.details.position')}}: <span @click="comeBack">{{$t('home.joinUs')}}</span> > <span class="red">{{$t('joinUs.details.position_detail')}}</span></div>
      <div class="condition">
        <div class="title">{{joinData.positionName}}</div>
        <div class="context">
          <div class="left">
            <div>{{$t('joinUs.details.department')}} : <span>{{joinData.department}}</span></div>
            <div>{{$t('joinUs.details.jop')}} : <span>{{joinData.positionType}}</span></div>
          </div>
          <div class="left">
            <!-- <div><span :class="{active : index === choose}" @click="changeType(index)">111111</span></div> -->
            <div>{{$t('joinUs.details.location')}} : <span>{{joinData.city}}</span></div>
            <div>{{$t('joinUs.details.Education')}} : <span>{{joinData.diploma}}</span></div>
          </div>
          <div class="left">{{$t('joinUs.details.Number')}} : <span>{{joinData.recruitsNumber}}</span></div>
          <p class="line"></p>
        </div>
        <div class="describe">
          <div class="titles">{{$t('joinUs.details.Summary')}}</div>
          <div v-html="joinData.jobContent"></div>
        </div>
        <div class="describe">
          <div class="titles">{{$t('joinUs.details.Key')}}</div>
          <div v-html="joinData.qualification"></div>
        </div>
        <div class="explain">
          <div class="titles">{{$t('joinUs.details.Other')}} : </div>
          <div v-html="joinData.deliveryInstructions"></div>
          <!-- <div>（2）请将简历发送至招聘邮箱 : </div>
          <div>（3）邮件格式为 : </div> -->
        </div>
      </div>
      <div class="download_base">
        <router-link to="/account/service-agreement">{{$t('home.userTerms')}}</router-link>
        <!-- <router-link to="/account/service-agreement">{{$t('home.joinUs')}}</router-link>
        <router-link to="/account/service-agreement">{{$t('home.openShop')}}</router-link> -->
        <a @click="goJoin">{{$t('home.joinUs')}}</a>
        <a @click="goTo">{{$t('home.openShop')}}</a>
        <a @click="goAbout">{{$t('home.about_us')}}</a>
      </div>
    </div>
    <!--底部-->
    <common-footer/>
  </div>
</template>
<script>
import joinHeader from '../components/common/join-header'
import {mapActions} from 'vuex'
export default {
  name: "joinUs",
  data() {
    return {
      joinData: ''
    };
  },
  components: {joinHeader},
  computed: {
    id() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.getRecruitmentInfoById()
  },
  methods: {
    ...mapActions('user', ['ajaxGetRecruitmentInfoById']),
    // 获取信息
    async getRecruitmentInfoById() {
      console.log('55858',this.$route.params.id)
      let params = {recruitmentInfoId: this.id}
      let res = await this.ajaxGetRecruitmentInfoById({params})
      console.log('55858',res)
      if (res.code==1) {
        this.joinData = res.data
      } else {
        this.$message.error(res.message)
      }
      
    },
    comeBack () {
      this.$router.push('/join')
    },
    goJoin() {
      this.$router.push('/join')
    },
    goAbout() {
      this.$router.push('/about')
    },
    goTo() {
      this.$message.warning(this.$t('home.function'))
    },
    // changeType (index) {
    //   this.choose = index
    // }
  }
};
</script>
<style lang="scss" scoped>
.join_details {
  .joinContent {
    width: 70%;
    padding: 15px 0 45px 0;
    margin: 15px auto;
    margin-top: 0;
    .header {
      height: 140px;
      width: 100%;
      background: url("../assets/img/Mask@2x.png") no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      div {
        font-size: 25px;
        text-shadow: 2px 2px 4px #909399;
        color: #ffffff;
        position: absolute;
        top: 39%;
        left: 12%;
      }
    }
    .location {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 0;
      .red {
        color: #FF644C;
      }
      span {
        &:first-child {
          cursor: pointer;
        }
      }
    }
    .condition {
      padding-bottom: 55px;
      background: #ffffff;
      .title {
        font-size: 17px;
        color: #333333;
        font-weight: 600;
        padding-left: 25px;
        height: 45px;
        line-height: 45px;
      }
      .context {
        padding: 12px 0 12px 25px;
        .left {
          width: 33%;
          display: inline-block;
          div {
            height: 30px;
            line-height: 30px;
          }
        }
        .line {
          border-bottom: 1px solid #DDDDDD;
          margin-right: 25px;
          margin-top: 20px;
        }
      }
      .describe {
        padding-left: 25px;
        .titles {
          font-size: 15px;
          color: #666666;
          height: 45px;
          line-height: 45px;
        }
        div {
          color: #838383;
          font-size: 13px;
        }
      }
      .explain {
        padding-left: 25px;
        padding-top: 15px;
        .titles {
          font-size: 15px;
          color: #666666;
          height: 45px;
          line-height: 45px;
        }
        div {
          color: #838383;
          font-size: 13px;
        }
      }
    }
    .download_base {
      position: absolute;
      bottom: 0px;
      z-index: 100;
      left: calc(50% - 150px);
      a {
        border-right: 3px solid #ddd;
        padding: 0 20px;
        cursor: pointer;
      }
      a:last-child {
        border-right: 0;
      }
    }
  }
}
@media screen and (max-width: 1224px) {
  .join_details {
    .joinContent {
      width: 88%;
    }
  }
}

@media screen and (min-width: 1370px) {
  .join_details {
    .joinContent {
      width: 65%;
    }
  }
}
@media screen and (min-width: 1550px) {
  .join_details {
    .joinContent {
      width: 55%;
    }
  }
}
</style>
