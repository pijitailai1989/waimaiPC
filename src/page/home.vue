<template>
  <div class="home">
    <!--头部-->
    <common-header :choose-city="chooseCity" />
    <!--搜索功能-->
    <div class="main">
      <div class="container">
        <div class="panel" :class="{showMap:mapShow}">
          <!-- <h3 class="showMapHide">
            {{$t('home.delicious')}}
            <span>LOONG</span>
            {{$t('home.takeOut')}}
          </h3> -->

          <div class="showMapHide slogan" v-if="lang=='zh'">
            <template v-if="slogan">{{$t('home.delicious')}}
              <span>LOONG</span>
              {{$t('home.takeOut')}}
            </template>
            <template v-else>{{$t('home.delicious')}}龙{{$t('home.takeOut')}}</template>
          </div>
          <div class="showMapHide slogan" v-if="lang=='en'">{{$t('home.delicious')}}
            <span>LOONG</span> DELIVERY</div>
          <div class="search clearfix">

            <!-- <div class="select-city" v-popover:cityPopover>
              <a href="javascript:;" class="city__choose">
                <img src="../assets/icon/location@2x.png">
                <span>{{chooseCity}}</span>search
                <i class="iconfont icon-arrLeft-fill1"></i>
              </a>
            </div> -->

            <div class="el-input">
              <input v-model="gussCity" :placeholder="$t('home.posSearch')" id="add__search" type="text" class="el-input__inner" @keyup.enter="search">
            </div>
            <el-button type="primary" @click="search" class="search__btn">{{$t('home.searchBtn')}}</el-button>
            <!-- <p class="located" @click="showMap_search">
              <img src="../assets/icon/redLocation@2x.png" />
              <span id="show_map">{{gussCity}}</span>
              <span v-if="no_location">{{this.$t('home.location_fail')}}</span>
            </p> -->
            <div class="search__resalut clearfix">
              <div class="address__list__wrapper">
                <p class="address__num">{{$t('home.searchCount')}}:
                  <span>{{showl}}</span>
                </p>
                <div class="address__list">
                  <ul class="list__wrapper">
                    <common-no-data :message="$t('home.notFind')" v-if="posList.length === 0 && isload==0" />
                    <li v-for="(pos, index) in posList" :key="pos.index" @click="posChange(pos, index)" :class="{active: index === showIndex}">
                      <a href="javascript:;">
                        <i class="iconfont icon-location"></i>
                        <h3>{{pos.name}}</h3>
                        <p>{{pos.formatted_address}}</p>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="google-map">
                <div id="map">
                </div>
              </div>
            </div>
          </div>
          <!-- 静态 -->
          <div class="download_container">
            <div class="download_vessel">
              <img src="../assets/img/vCode.png" alt="" />
            </div>
            <div class="download_vessel">
              <p>{{$t('home.newSubscribers')}}</p>
              <h1>{{$t('home.maximum')}}</h1>
              <p>{{$t('home.downloadNow')}}</p>
              <div class="download_btn_group">
                <template v-if="slogan">
                  <a href="" class="btn app"> </a>
                  <a href="" class="btn andiord"> </a>
                </template>
                <span v-else></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="download_base">
        <!-- <router-link to="/account/service-agreement">{{$t('home.userTerms')}}</router-link> -->
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
import { mapActions } from 'vuex'
import HomeStatic from '../components/home-static'
import $ from 'jquery'
import { getCookie } from '../utils.js'

export default {
  data() {
    return {
      slogan: false, // 控制标题显示LOONG/龙
      radius: 500, //查询半径 以当前地点为圆心
      country: { country: ['PHL', 'CN'] }, //查询范围 国家给单位
      locPos: null, //搜索圆心经纬度
      staticLoc: {}, //当前位置信息
      cityList: [], //城市详细信息列表
      loading: false,
      gussCity: ``,
      chooseCity: `${this.$t('home.position')}...`,
      cityDis: false, //城市选择框是否出现
      autocomplete: null,
      geocoder: null,
      posLoading: true, //正在定位中
      map: null,
      infowindow: null,
      service: null,
      posList: [], //查询结果列表显示
      showl: 0, //显示地址总数,
      showIndex: 0,
      isload: 0, //是否已经查询并限时完成
      maxL: 10, //列表最多显示条数
      markers: [], //map 标记
      choosed: {}, //上个页面传过来的数据
      ifStatic: true, //城市选择是否选择的是默认定位的地址
      jumpLoading: false, //跳转之前的判断 该地区是否开通
      mapShow: false, //判断是否显示搜索地图,
      clickMarker: null, //点击地图事件添加标记
      changeLoading: false, //点击地图事件loading
      lang: ''
    }
  },
  components: { HomeStatic },
  created() {
    console.log(getCookie('lang'))
    this.lang = getCookie('lang')

    // let current_location = localStorage.getItem('current_location');
    // if (!current_location) {
    //   this.no_location = true;
    // } else {
    //   this.no_location = false;
    // }
  },
  async mounted() {
    let self = this
    // 设置默认城市
    // let location = localStorage.getItem("location");
    // if (location) {
    //   self.chooseCity = JSON.parse(location).cityName;
    //   // self.gussCity = JSON.parse(location).cityName
    //   let location_address = localStorage.getItem("location_address");
    //   self.gussCity = JSON.parse(location_address);
    // }
    $(document).on('click', '.map__show__info button', function() {
      let lat = $(this).data('lat')
      let lng = $(this).data('lng')
      let pos = {
        lat: lat,
        lng: lng
      }
      // console.log('pos',pos)
      self.getCity(pos)
      setTimeout(() => {
        self.jump(pos)
        self.$router.go(0)
      }, 300)
    })
    self.initialize()
    // await self.getAddressArea();
    // 设置唯一标识
    let vCodeId = sessionStorage.getItem('vCodeId')
  },
  methods: {
    ...mapActions('user', ['ajaxArea', 'ajaxPosition']),
    //获取已开通城市列表
    async getAddressArea() {
      let self = this
      self.loading = true
      // let res = await self.ajaxArea()
      // if (res.code === 1) {
      //   for (let i = 0; i < res.data.length; i++) {
      //     res.data[i].value = res.data[i].name;
      //     self.cityList.push(res.data[i]);
      //   }
      // } else {
      //   self.$message.error(res.message);
      // }
      self.loading = false
    },
    // 展示地图
    showMap_search() {
      let self = this
      // if (self.no_location) {
      //   return false;
      // }
      if (!self.mapShow) {
        self.mapShow = true
        self.initMap()
        self.initMapChoose()
      }
      let request = {
        radius: self.radius,
        location: self.locPos,
        query: $('#show_map').text()
      }
      if (self.isload == 0) {
        self.service.textSearch(request, self.searchCallback)
        self.showIndex = 0
      }
    },
    //搜索
    search() {
      let self = this
      if ($('#add__search').val() == '') {
        self.showl = 0
        return false
      } else if (self.posLoading) {
        this.$message.error(this.$t('home.wrong'))
        return false
      } else {
        if (!self.mapShow) {
          self.mapShow = true
          self.initMap()
          self.initMapChoose()
        }
        let request = {
          radius: self.radius,
          location: self.locPos,
          query: $('#add__search').val()
        }
        if (self.isload == 0) {
          self.service.textSearch(request, self.searchCallback)
          self.showIndex = 0
        }
      }
    },
    initialize() {
      // console.log('initialize--------------')
      let self = this
      let location = localStorage.getItem('location')
      // console.log("location", JSON.parse(location).lon)
      if (location) {
        self.chooseCity = JSON.parse(location).cityName
        // self.gussCity = JSON.parse(location).cityName
        let location_address = localStorage.getItem('location_address')
        self.gussCity = JSON.parse(location_address)
        let pos = {
          lat: JSON.parse(location).lat,
          lng: JSON.parse(location).lon
        }
        if (google) {
          self.posLoading = false
        } else {
          this.$message.error(this.$t('home.wrong'))
        }
        self.locPos = pos
        self.initAutocomplete()
        self.geocoder = new google.maps.Geocoder()
        self.getCity(pos)
      } else {
        if (navigator.geolocation) {
          console.log('-----navigator.geolocation---------')
          navigator.geolocation.getCurrentPosition(
            function(position) {
              console.log('---getCurrentPosition----', position)
              let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              self.locPos = pos
              // console.log('self.locPos',self.locPos)
              self.initAutocomplete()
              self.geocoder = new google.maps.Geocoder()
              self.getCity(pos)
              console.log('定位成功--', pos)
              localStorage.removeItem('cityName')
            },
            function(position) {
              console.log('---定位服务失败-------', self.cityName)
              // self.initAutocomplete();
              localStorage.setItem('cityName', `${self.$t('home.location')}`)
              self.chooseCity = self.$t('home.location')
              self.gussCity = self.$t('home.location_fail')
              localStorage.setItem(
                'location_address',
                JSON.stringify(self.gussCity)
              )
            },
            {
              enableHighAccuracy: false,
              timeout: 8000
              // maximumAge: 8000
            }
          )
        }
      }
    },
    initMap() {
      let self = this
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: self.locPos,
        mapTypeControl: false,
        zoomControl: false,
        fullscreenControl: false,
        streetViewControl: false
      })
      self.infowindow = new google.maps.InfoWindow()
      self.service = new google.maps.places.PlacesService(self.map)
    },
    initMapChoose() {
      let self = this
      google.maps.event.addListener(self.map, 'click', function(e) {
        if (self.clickMarker != null) {
          self.clickMarker.setMap(null)
          self.clickMarker = null
        }
        let pos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng()
        }
        self.getMapChoose(pos, function(chooseInfo) {
          self.clickMarker = new google.maps.Marker({
            position: pos,
            map: self.map
          })
          let markerShowHtml = `<div class="map__show__info">
        <p>${chooseInfo}</p>
        <button data-lat="${pos.lat}" data-lng="${
            pos.lng
          }" type="button" class="el-button el-button--primary el-button--mini"><span>${self.$t(
            'home.lookSeller'
          )}</span></button>
        </div>`
          self.infowindow.setContent(markerShowHtml)
          setTimeout(function() {
            self.infowindow.open(self.map, self.clickMarker)
          }, 100)
          google.maps.event.addListener(self.clickMarker, 'click', function() {
            self.infowindow.setContent(markerShowHtml)
            self.infowindow.open(self.map, self.clickMarker)
          })
        })
      })
    },
    initAutocomplete() {
      let self = this
      let circle = new google.maps.Circle({
        center: self.locPos,
        radius: self.radius
      })
      self.autocomplete = new google.maps.places.Autocomplete(
        document.getElementById('add__search'),
        {
          types: [],
          componentRestrictions: self.country,
          bounds: circle.getBounds()
        }
      )
      // console.log('initAutocomplete',self.autocomplete)
    },
    //定位城市
    getCity(location) {
      console.log('self.geocoder', this)
      let self = this
      let locality = null,
        route = null,
        neighborhood = null,
        premise = null,
        sublocality = null
      self.geocoder.geocode({ location: location }, function(results, status) {
        if (status == 'OK') {
          for (let i = 0; i < results[0].address_components.length; i++) {
            let types = results[0].address_components[i].types
            if (types.indexOf('locality') != -1) {
              locality = results[0].address_components[i].long_name
            }
            if (types.indexOf('route') != -1) {
              route = results[0].address_components[i].long_name
            }
            if (types.indexOf('neighborhood') != -1) {
              neighborhood = results[0].address_components[i].long_name
            }
            if (types.indexOf('premise') != -1) {
              premise = results[0].address_components[i].long_name
            }
            if (types.indexOf('sublocality') != -1) {
              sublocality = results[0].address_components[i].long_name
            }
          }
          if (premise != null) {
            locality = premise
          } else if (neighborhood != null) {
            locality = neighborhood
          } else if (route != null) {
            locality = route
          } else if (sublocality != null) {
            locality = sublocality
          } else {
            locality = locality
          }
          let storLocation = localStorage.getItem('location')
          if (!storLocation) {
            self.chooseCity = locality
            self.gussCity = results[0].formatted_address
            self.staticLoc = {
              cityName: locality,
              lat: location.lat,
              lon: location.lng
            }
            localStorage.setItem('location', JSON.stringify(self.staticLoc))
            localStorage.setItem(
              'location_address',
              JSON.stringify(results[0].formatted_address)
            )
          }
          localStorage.setItem('current_location', JSON.stringify(locality))
          self.posLoading = false
        } else {
          self.$message.error(self.$t('home.wrong'))
        }
      })
    },
    //地图点选详情
    getMapChoose(location, fn) {
      let self = this
      if (self.chooseLoading) {
        return false
      }
      let load = self.$message({
        message: `${self.$t('home.position')}...`,
        duration: 0
      })
      self.chooseLoading = true
      self.geocoder.geocode({ location: location }, function(results, status) {
        self.chooseLoading = false
        load.close()
        if (status == 'OK') {
          fn(results[0].formatted_address)
        } else {
          self.$message.error(self.$t('home.wrongChoose'))
        }
      })
    },
    searchCallback(results, status) {
      let self = this
      self.posList = []
      self.clearMarkers()
      self.showl = 0
      self.isload = 1
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        if (results.length >= self.maxL) {
          self.showl = self.maxL
        } else {
          self.showl = results.length
          console.log('000000', JSON.stringify(results[0].formatted_address))
        }
        for (let i = 0; i < self.showl; i++) {
          self.posList.push({
            lat: results[i].geometry.location.lat(),
            lng: results[i].geometry.location.lng(),
            index: i,
            name: results[i].name,
            formatted_address: results[i].formatted_address
          })
          self.addMarkerWithTimeout(results[i], i, self.showl)
        }
        $('.list__wrapper').animate({ scrollTop: 0 }, 100)
        self.map.setCenter(results[0].geometry.location)
        self.map.setZoom(15)
      } else {
        self.showl = 0
        self.isload = 0
      }
    },
    addMarkerWithTimeout(res, i, showl) {
      let self = this
      self.markers[i] = new google.maps.Marker({
        position: res.geometry.location,
        map: self.map
      })
      google.maps.event.addListener(self.markers[i], 'click', function() {
        self.mapInfoShow(self.posList[i])
      })
      if (i == showl - 1) {
        self.isload = 0
        self.mapInfoShow(self.posList[0])
      }
    },
    clearMarkers() {
      let self = this
      for (let i = 0; i < self.markers.length; i++) {
        self.markers[i].setMap(null)
      }
      self.markers = []
    },
    posChange(posObj, i) {
      let self = this
      if (self.isload == 0) {
        self.showIndex = i
        self.mapInfoShow(posObj)
      }
    },
    mapInfoShow(posObj) {
      let self = this
      let markerShowHtml = `<div class="map__show__info">
        <h3>${posObj.name}</h3>
        <p>${posObj.formatted_address}</p>
        <button data-lat="${posObj.lat}" data-lng="${
        posObj.lng
      }" type="button" class="el-button el-button--primary el-button--mini"><span>${self.$t(
        'home.lookSeller'
      )}</span></button>
        </div>`
      self.infowindow.setContent(markerShowHtml)
      self.infowindow.open(self.map, self.markers[posObj.index])
      self.staticLoc = {
        cityName: posObj.name,
        lat: posObj.lat,
        lon: posObj.lng
      }
      localStorage.setItem('location', JSON.stringify(self.staticLoc))
      localStorage.setItem(
        'location_address',
        JSON.stringify(posObj.formatted_address)
      )
    },
    querySearch(queryString, cb) {
      let cityList = this.cityList
      let results = queryString
        ? cityList.filter(this.createFilter(queryString))
        : cityList
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return cityList => {
        return cityList.value.indexOf(queryString.toLowerCase()) === 0
      }
    },
    async jump(pos) {
      console.log('pos', pos)
      let self = this

      // localStorage.setItem('location', JSON.stringify(choosed));
      self.$router.push('/place')
    },
    goJoin() {
      this.$router.push('/join')
    },
    goAbout() {
      this.$router.push('/about')
    },
    goTo() {
      this.$message.warning(this.$t('home.function'))
    }
  }
}
</script>
<style lang="scss">
.home {
  background: #f7f7f7;
  .main {
    width: 100%;
    height: 82vh;
    background: url('/loong/static/img/bg@3x.png') center;
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
    .container {
      @include container;
    }
    .panel {
      width: 1180px;
      padding-top: 50px;
      transition-duration: 1s;
      &.showMap {
        padding-top: 60px;
        .showMapHide,
        .download_container {
          display: none;
        }
        .search {
          .select-city {
            margin-left: 0;
          }
        }
        .search__resalut {
          opacity: 1 !important;
        }
      }
      h3 {
        font-size: 36px;
        color: #332e2e;
        letter-spacing: 1.12px;
        text-align: center;
        span {
          font-family: NotoSansCJK-Black;
          font-size: 35px;
          color: #ff8428;
          letter-spacing: 1.09px;
        }
      }
      h1 {
        font-size: 64px;
        span {
          font-weight: 300;
        }
      }
      .download_container {
        z-index: 100;
        width: 60%;
        padding-top: 50px;
        overflow: hidden;
        margin: 0 auto;
        .download_vessel:last-child {
          margin-left: 30px;
        }
        .download_vessel {
          // display: inline-block;
          text-align: left;
          float: left;
          img {
            width: 220px;
            height: 220px;
          }
          p {
            font-family: MicrosoftYaHei;
            font-size: 16px;
            color: #332e2e;
            letter-spacing: 0;
          }
          h1 {
            font-family: NotoSansCJK-Black;
            font-size: 26px;
            color: #fb4e34;
            letter-spacing: 0;
            margin-bottom: 10px;
          }
          .download_btn_group {
            margin-top: 20px;
            a.btn {
              display: inline-block;
              width: 140px;
              height: 46px;
              border: 1px solid #9b9b9b;
              border-radius: 8px;
              margin-right: 10px;
            }
            a.app {
              background: url('/loong/static/img/Group11@2x.png') 10px 6px
                no-repeat;
            }
            a.andiord {
              background: url('/loong/static/img/Group11@2x.png') -156px 6px no-repeat;
            }
            span {
              background: url('/loong/static/img/Group11@2x.png') no-repeat;
              display: inline-block;
              width: 290px;
              height: 39px;
            } // span {
            //   display: inline-block;
            //   width: 175px;
            //   height: 50px;
            //   background: url('/loong/static/img/iphone.png') no-repeat 0 0;
            //   background-size: 100% 100%;
            // }
            // span:last-child {
            //   background: url('/loong/static/img/Android.png') no-repeat 0 0;
            //   background-size: 100% 100%;
            //   margin-left: 20px;
            // }
          }
        }
      }
      .slogan {
        font-size: 36px;
        color: #332e2e;
        text-align: center;
        letter-spacing: 1.12px;
        span {
          // font-family: .SFNSDisplay;
          font-size: 35px;
          color: #ff8428;
          letter-spacing: 1.09px;
        }
      }

      .search {
        width: 850px;
        margin: 20px auto 0px auto;
        .search__resalut {
          transition-duration: 1s;
          opacity: 0;
          position: absolute;
          width: 1050px;
          top: 100px;
          z-index: 1;
          box-shadow: 2px 2px 10px -2px #a9a9a9;
          .address__list__wrapper {
            /* height: 600px; */
            height: 50vh;
            float: left;
            width: 380px;
            background: #fff;
            overflow: hidden;
            .address__num {
              font-size: 18px;
              color: #333;
              margin: 0; // padding: 30px 0;
              text-align: center;
              span {
                margin-left: 10px;
                position: relative;
              }
            }
            .address__list {
              background: #fff;
              padding: 20px;
              ul {
                overflow-x: hidden;
                overflow-y: auto;
                /* height: 476px; */
                height: 50vh;
                li {
                  &.active {
                    a {
                      background-color: #f2f5f7;
                    }
                    i {
                      color: $color-primary;
                    }
                  }
                  a {
                    position: relative;
                    display: block;
                    line-height: 1.6em;
                    padding: 15px 15px 15px 45px;
                    position: relative;
                    display: block;
                    line-height: 1.6em;
                    &:hover {
                      background-color: #f2f5f7;
                    }
                    i {
                      position: absolute;
                      color: #666;
                      left: 15px;
                      top: 20px;
                      font-size: 20px !important;
                    }
                    h3 {
                      font-size: 16px;
                      color: #333;
                      font-weight: 700;
                      margin-bottom: 10px;
                    }
                    p {
                      margin: 3px 0;
                      font-size: 14px;
                      color: #666666;
                      line-height: 18px;
                    }
                  }
                }
              }
            }
          }
          .google-map {
            overflow: hidden;
            #map {
              width: 100%;
              height: 50vh;
            }
          }
        }
        .select-city {
          float: left;
          width: 142px;
          height: 60px;
          text-align: center;
          line-height: 60px;
          background: #fff;
          border: 1px solid #dcdfe6;
          border-right: none;
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
          margin-left: 170px;
          .city__choose {
            display: inline-block;
            width: 104px;
            position: relative;
            text-align: center;
            color: #333333;
            padding: 0 20px;
            span {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 82px;
              position: relative;
            }
            img {
              margin-bottom: -3px;
            }
          }
        }
        .el-input {
          float: left;
          width: 750px;
          height: 60px;
          .el-input__inner {
            height: 60px;
            border-right: none;
            border-radius: 0;
          }
        }
        .search__btn {
          float: left;
          width: 100px;
          height: 60px;
          border-bottom-left-radius: 0;
          border-top-left-radius: 0;
        }
      }
      p {
        color: #999999;
        font-size: 14px;
        &:first-child {
          margin-top: 33px;
          margin-bottom: 10px;
        }
      }
    }
  }
}

.map__show__info {
  h3 {
    font-size: 18px !important;
    color: #333 !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  p {
    font-size: 13px !important;
    color: #999 !important;
    margin-top: 2px !important;
  }
  button {
    margin-top: 10px;
  }
}

.city__choose__container {
  .top {
    font-size: 12px;
    color: #333333;
    margin: 3px 10px 15px 10px;
    button {
      margin-left: 10px;
    }
    .city__search {
      width: 130px;
    }
  }
  .city__list {
    margin-top: 20px;
    ul {
      li {
        float: left;
        padding: 5px;
        margin: 0 10px;
        cursor: pointer;
        &:hover {
          color: $color-primary;
        }
      }
    }
  }
}

.located {
  clear: both;
  cursor: pointer;
  padding-top: 10px;
  margin-left: 20px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  img {
    margin-bottom: -4px;
  }
}
</style>
