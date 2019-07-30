<template>
  <div class="about_us">
    <!--头部-->
    <join-header />
    <div class="joinContent">
      <div class="header"><div>{{$t('home.about_us')}}</div></div>
      <div class="location">{{$t('joinUs.details.position')}}: <span @click="comeBack">{{$t('header.homePage')}}</span> > <span class="red">{{$t('home.about_us')}}</span></div>
      <div class="context">
        <div class="title">{{$t('home.about_us')}}</div>
        <p class="line"></p>
        <div class="notes">
          <p>{{$t('aboutUs.notes_one')}}</p>
          <p>{{$t('aboutUs.notes_two')}}</p>
          <p>{{$t('aboutUs.notes_three')}}</p>
          <p>{{$t('aboutUs.notes_four')}}</p>
        </div>
      </div>
      <div class="contact">
        <div class="title">{{$t('aboutUs.contact_us')}}</div>
        <p class="line"></p>
        <div class="num_qq">
          <div>{{$t('aboutUs.Business')}} Email : <span>ceo@loong.ph.com</span></div>
          <div class="addresses">{{$t('aboutUs.address')}} : 26th Floor 330 Sen. Gil Puyat Avenue, Makati City.
          </div>
          <div :class="{addressed: isEnglish, addressed_zh: !isEnglish}">
            <p>Unit 604 National Insurance Life Building 6762 Ayala Ave. Makati.</p>
            <p>{{$t('aboutUs.address_one')}}</p>
            <p>{{$t('aboutUs.address_two')}}</p>
            <p></p>
          </div>
          <div id="map" style="width:100%;height:450px"></div>
        </div>
      </div>
      <div class="download_base">
        <router-link to="/account/service-agreement">{{$t('home.userTerms')}}</router-link>
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
import joinHeader from "../components/common/join-header";
import {getCookie} from "../utils.js"
export default {
  name: "joinUs",
  data() {
    return {
      tableData: [
        {
          career: "2525",
          address: "ertrt",
          account: "rtret",
          time: "rtret"
        }
      ],
      showCount: 8,
      currentPage: 1,
      totalPage: 100,
      choose: 0,
      locPos: null,
      isEnglish: false
    };
  },
  components: { joinHeader },
  mounted() {
    let lang = getCookie('lang')
    if (lang=='en') {
      this.isEnglish = true
    } else {
      this.isEnglish = false
    }
    this.initialize();
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    changePage(page) {
      this.currentPage = page;
      window.scrollTo(0, 0);
    },
    goJoin() {
      this.$router.push("/join");
    },
    goAbout() {
      this.$router.push("/about");
    },
    goTo() {
      this.$message.warning(this.$t("home.function"));
    },
    comeBack() {
      this.$router.push('/');
    },
    changeType(index) {
      this.choose = index;
    },
    initialize() {
      // let self = this;
      // if (navigator.geolocation) {
      //   console.log("-----navigator.geolocation---------");
      //   navigator.geolocation.getCurrentPosition(
      //     function(position) {
      //       console.log("---getCurrentPosition----");
      //       let pos = {
      //         lat: position.coords.latitude,
      //         lng: position.coords.longitude
      //       };
      //       self.locPos = pos;
      //       // console.log('self.locPos',self.locPos)
      //       console.log("定位成功--", pos);
      //       let points = [
      //         new google.maps.LatLng(30.874309, 120.09734600000002),
      //         new google.maps.LatLng(22.639643, 114.03812900000003),
      //         new google.maps.LatLng(14.5615804, 121.02153900000008),
      //         new google.maps.LatLng(14.5558126, 121.02200849999997)
      //       ];
      //       // let myCenter = new google.maps.LatLng(14.5558126, 121.02200849999997);
      //       let myCenter = self.locPos;
      //       console.log(myCenter, "00000000");
      //       let mapProp = {
      //         center: myCenter,
      //         zoom: 2,
      //         mapTypeControl: false,
      //         zoomControl: false,
      //         fullscreenControl: false,
      //         streetViewControl: false
      //       };
      //       let markers = [];
      //       let map = new google.maps.Map(
      //         document.getElementById("map"),
      //         mapProp
      //       );
      //       let marker = new google.maps.Marker({
      //         position: myCenter
      //       });
      //       //添加四个标注，并将其存入数组marker[]
      //       for (let i = 0; i < points.length; i++) {
      //         let gmarker = new google.maps.Marker({
      //           position: points[i],
      //           map: map
      //         });
      //         markers.push(gmarker);
      //       }
      //     },
      //     function(position) {
      //       console.log("---定位服务失败-------", self.cityName);
      //       self.$message.error(self.$t("home.wrong"));
      //     }
      //   );
      // } else {
      //   console.log("定位失败");
      //   self.$message.error(self.$t("home.wrong"));
      // }
      let points = [
        new google.maps.LatLng(30.874309, 120.09734600000002),
        new google.maps.LatLng(22.639643, 114.03812900000003),
        new google.maps.LatLng(14.5615804, 121.02153900000008),
        new google.maps.LatLng(14.5558126, 121.02200849999997)
      ];
      let myCenter = new google.maps.LatLng(14.5600804, 121.02153900000008);
      // console.log(myCenter, "00000000");
      let mapProp = {
        center: myCenter,
        zoom: 15,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false
      };
      let markers = [];
      let map = new google.maps.Map(document.getElementById("map"), mapProp);
      let marker = new google.maps.Marker({
        position: myCenter
      });
      //添加四个标注，并将其存入数组marker[]
      for (let i = 0; i < points.length; i++) {
        let gmarker = new google.maps.Marker({
          position: points[i],
          map: map
        });
        markers.push(gmarker);
      }
    },
  }
};
</script>
<style lang="scss" scoped>
.about_us {
  .joinContent {
    width: 70%;
    padding: 15px 0 45px 0;
    margin: 15px auto;
    margin-top: 0;
    .header {
      height: 148px;
      width: 100%;
      background: url("../assets/img/about@2x.png") no-repeat;
      background-size: 100% 100%;
      background-position: center center;
      div {
        font-size: 25px;
        color: #ffffff;
        position: absolute;
        top: 43%;
        left: 12%;
        font-family: SimSun;
        font-weight: 600;
      }
    }
    .location {
      color: #333333;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 0;
      .red {
        color: #ff644c;
      }
      span {
        &:first-child {
          cursor: pointer;
        }
      }
    }
    .context {
      background: #ffffff;
      .title {
        font-size: 17px;
        color: #333333;
        font-weight: 600;
        padding-left: 25px;
        height: 45px;
        line-height: 45px;
      }
      .line {
        border-bottom: 1px solid #dddddd;
        margin: 0 25px;
      }
      .notes {
        padding: 25px;
        font-size: 13px;
        p {
          text-indent: 2em;
          margin-bottom: 12px;
        }
      }
    }
    .contact {
      background: #ffffff;
      .title {
        font-size: 17px;
        color: #333333;
        font-weight: 600;
        padding-left: 25px;
        height: 45px;
        line-height: 45px;
      }
      .line {
        border-bottom: 1px solid #dddddd;
        margin: 0 25px;
      }
      .num_qq {
        padding: 30px 55px;
        #map {
          margin-top: 15px;
        }
        .addressed {
          margin-left: 132px;
        }
        .addressed_zh {
          margin-left: 68px;
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
  .about_us {
    .joinContent {
      width: 88%;
    }
  }
}

@media screen and (min-width: 1370px) {
  .about_us {
    .joinContent {
      width: 65%;
    }
  }
}
@media screen and (min-width: 1550px) {
  .about_us {
    .joinContent {
      width: 55%;
    }
  }
}
</style>
