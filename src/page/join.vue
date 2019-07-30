<template>
  <div class="joinUs">
    <!--头部-->
    <join-header />
    <div class="joinContent">
      <div class="header"></div>
      <div class="condition">
        <div class="title">{{$t('joinUs.filter')}}</div>
        <div class="context">
          <div :class="{left: isEnglish, leftZh: !isEnglish}">
            <div>{{$t('joinUs.type')}} : </div>
            <div>{{$t('joinUs.address')}} : </div>
            <div>{{$t('joinUs.postType')}} : </div>
          </div>
          <div class="right">
            <!-- <div><span :class="{active : index === choose}" @click="changeType(index)">111111</span></div> -->
            <div><span :class="{active : index === choose}" @click="changeType(index, item)" v-for="(item, index) in recruitmentTypes" :key="index">{{item.recruitmentName}}</span></div>
            <div><span :class="{active : index === choosed}" @click="changeArea(index, items)" v-for="(items, index) in areaMap" :key="index">{{items.city}}</span></div>
            <div><span :class="{active : index === chooses}" @click="changePosition(index, itemd)" v-for="(itemd, index) in positionTypeMap" :key="index">{{itemd.lookupItemName}}</span></div>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              :label="$t('joinUs.name')"
              width="400"
              :filters="tableData"
              :filter-method="filterTag">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="medium">{{scope.row.positionName}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="positionType"
              :label="$t('joinUs.postType')"
              width="150">
            </el-table-column>
            <el-table-column
              prop="city"
              :label="$t('joinUs.address')"
              width="120">
            </el-table-column>
            <el-table-column
              prop="recruitsNumber"
              :label="$t('joinUs.count')"
              width="120">
            </el-table-column>
            <el-table-column
              prop="lastUpdateTime"
              :label="$t('joinUs.time')">
            </el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="totalPage" :current-page="currentPage" @current-change="changePage"></el-pagination>
        </div>
      </div>
    </div>
    <!--底部-->
    <div class="join_bottom">
      <div class="download_base">
        <router-link to="/account/service-agreement">{{$t('home.userTerms')}}</router-link>
        <!-- <router-link to="/account/service-agreement">{{$t('home.joinUs')}}</router-link>
        <router-link to="/account/service-agreement">{{$t('home.openShop')}}</router-link> -->
        <a @click="goJoin">{{$t('home.joinUs')}}</a>
        <a @click="goTo">{{$t('home.openShop')}}</a>
        <a @click="goAbout">{{$t('home.about_us')}}</a>
      </div>
      <common-footer/>
    </div>
  </div>
</template>
<script>
import joinHeader from '../components/common/join-header'
import {mapActions} from 'vuex'
import {getCookie} from '../utils.js'
export default {
  name: "joinUs",
  data() {
    return {
      tableData: [],
      areaMap: [{city: `${this.$t('joinUs.all')}`, city_id: null}],
      positionTypeMap: [{lookupTypeCode: "position_type", lookupItemCode: null, lookupItemName: `${this.$t('joinUs.all')}`}],
      recruitmentTypes: [{campusRecruitment: '0', recruitmentName: `${this.$t('joinUs.school')}`, recruit_id: '0'}, {campusRecruitment: '1', recruitmentName: `${this.$t('joinUs.society')}`, recruit_id: '1'}],
      showCount: 8,
      currentPage: 1,
      totalPage: 0,
      choose: 0,
      choosed: 0,
      chooses: 0,
      cityId: null,
      recruitmentType: '0',
      positionType: null,
      isEnglish: ''
    };
  },
  components: {joinHeader},
  
  mounted () {
    this.getRecruitmentArea()
    this.getRecruitmentInfoList()
    let lang = getCookie('lang')
    if (lang=="en") {
      this.isEnglish = true
    } else {
      this.isEnglish = false
    }
  },
  methods: {
    ...mapActions('user', ['ajaxGetRecruitmentInfoList', 'ajaxGetRecruitmentArea']),
    async getRecruitmentInfoList() {
      let params = {
        page: this.currentPage, 
        limit: this.showCount, 
        recruitmentType: this.recruitmentType,
        cityId: this.cityId,
        positionType: this.positionType
      }
      // if (!this.cityId) {
      //   params.cityId = null
      // } else {
      //   params.cityId = this.cityId
      // }
      // if (!this.positionType) {
      //   params.positionType = null
      // } else {
      //   params.positionType = this.positionType
      // }
      let res = await this.ajaxGetRecruitmentInfoList({params})
      console.log(res,'\\\\\\')
      if (res.code==1) {
        console.log(res.data.resultMap)
        res.data.resultMap.forEach(elem=> {
          elem.lastUpdateTime = this.$formatDateTime(elem.lastUpdateTime, 'ymd')
        })
        this.tableData = res.data.resultMap
        this.totalPage = res.data.totalPage * 10
      } else {
        this.$message.error(res.message)
      }
    },
    async getRecruitmentArea() {
      let res = await this.ajaxGetRecruitmentArea()
      if (res.code==1) {
        console.log('000000011111',res.data.areaMap)
        res.data.areaMap.forEach(elem=> {
          this.areaMap.push(elem)
        })
        res.data.positionTypeMap.forEach(el=> {
          this.positionTypeMap.push(el)
        }) 
      } else {
        this.$message.error(res.message)
      }
    },
    handleClick(row) {
      console.log(row);
      this.$router.push('/join-details/' + row.id)
    },
    filterTag(value, row) {
      console.log('000000',value)
      return row.tag === value;
    },
    changePage(page) {
      this.currentPage = page
      this.getRecruitmentInfoList()
      window.scrollTo(0, 0)
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
    changeType (index, item) {
      this.choose = index
      this.recruitmentType = item.campusRecruitment
      this.getRecruitmentInfoList()
    },
    changeArea (index, items) {
      this.choosed = index
      this.cityId = items.city_id
      this.getRecruitmentInfoList()
      console.log("items.city_id", items.city_id)
    },
    changePosition (index, itemd) {
      this.chooses = index
      this.positionType = itemd.lookupItemCode
      this.getRecruitmentInfoList()
    }
  }
};
</script>
<style lang="scss" scoped>
.joinUs {
  height: 100vh;
  .joinContent {
    width: 55%;
    min-height: 868px;
    padding: 15px 0 45px 0;
    margin: 15px auto;
    margin-top: 0;
    .header {
      height: 140px;
      width: 100%;
      background: url("../assets/img/Mask@2x.png") no-repeat;
      background-size: 100% 100%;
      background-position: center center;
    }
    .condition {
      .title {
        font-size: 17px;
        color: #333333;
        font-weight: 600;
        padding-left: 25px;
        background-color: #FAFAFA;
        height: 45px;
        line-height: 45px;
        margin-top: 10px;
      }
      .context {
        padding: 12px 0 12px 25px;
        background: #ffffff;
        .left {
          width: 15%;
          display: inline-block;
          div {
            height: 30px;
            line-height: 30px;
            font-size: 13px;
          }
        }
        .leftZh {
          width: 9%;
          display: inline-block;
          div {
            height: 30px;
            line-height: 30px;
            font-size: 13px;
          }
        }
        .right {
          display: inline-block;
          .active {
            background: #FF644D;
            color: #ffffff;
            padding: 3px 10px;
            border-radius: 12px;
          }
          div {
            height: 30px;
            line-height: 30px;
            span {
              margin-right: 30px;
              cursor: pointer;
              padding: 3px 10px;
              font-size: 13px;
            }
          }
        }
      }
      .table {
        background: #ffffff;
        margin-top: 15px;
      }
    }
  }
  .join_bottom {
    width: 100%;
    text-align: center;
    .download_base {
      width: 100%;
      // position: absolute;
      // bottom: 75px;
      z-index: 100;
      // left: calc(50% - 150px);
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
  .joinUs {
    .joinContent {
      width: 88.5%;
      min-height: 560px;
    }
  }
}
// @media screen and (min-width:1225px) and (max-width:1275px) {
//   .joinUs {
//     .joinContent {
//       width: 75%;
//     }
//   }
// }
@media screen and (min-width: 1276px) and (max-width:1369px) {
  .joinUs {
    .joinContent {
      width: 73%;
      min-height: 640px;
    }
  }
}
@media screen and (min-width: 1370px)  and (max-width:1549px) {
  .joinUs {
    .joinContent {
      width: 70%;
      min-height: 675px;
    }
  }
}
@media screen and (min-width: 1550px)  and (max-width:1680px) {
  .joinUs {
    .joinContent {
      width: 59%;
      min-height: 868px;
    }
  }
}
</style>