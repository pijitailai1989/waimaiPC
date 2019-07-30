<template>
  <div class="modal-add-address">
    <el-dialog ref="scrollT" :title="title" :visible.sync="visible" width="600px" class="c-dialog" top="10vh">
      <el-form label-width="130px">
        <el-form-item :label="$t('address.name')">
          <el-input v-model="addName" :placeholder="$t('address.name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('address.sex')">
          <el-radio-group v-model="addSex">
            <el-radio label="0">{{$t('payMent.Msr')}}</el-radio>
            <el-radio label="1">{{$t('payMent.miss')}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('address.addr')">
          <div class="el-input">
            <!-- <el-autocomplete class="inline-input" v-model="state2" :fetch-suggestions="querySearch" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect"></el-autocomplete> -->
            <input :id="searchInput" :placeholder="$t('address.addr')" type="text" class="el-input__inner" v-once :value="editAddresss">
          </div>
        </el-form-item>
        <el-form-item>
          <div :id="mapId" class="map"></div>
        </el-form-item>
        <el-form-item :label="$t('address.detailAdd')">
          <el-input v-model="addHouseNumer" :placeholder="$t('address.detailAdds')"></el-input>
        </el-form-item>
        <!-- 新增国家号 -->
        <el-form-item :label="$t('address.areaCode')">
          <el-select v-model="select" :placeholder="$t('accountInfo.userInfo.areaHolder')" filterable ref="selected">
              <el-option v-for="(item, index) in CountryJson.data" :key="index"
                          :label="'+'+item.phoneCode+' '+item.countryName" :value="item.countryName"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('accountInfo.userInfo.tel')">
          <el-input v-model="addPhone" :placeholder="$t('accountInfo.userInfo.tel')"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAddress" :loading="submitLoading">{{$t('common.keep')}}</el-button>
        <el-button type="primary" plain @click="visible=false">{{$t('common.cancel')}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import CountryJson from "../../assets/json/countryChinese";
import CountryJsons from "../../assets/json/countryEnglish.json";
import { getCookie } from "../../utils.js";
import $ from "jquery";
export default {
  components: {},
  props: ["item"],
  data() {
    return {
      visible: false,
      addName: "", //姓名
      addSex: "0", //性别
      addPhone: "", //手机
      CountryJson,
      select: `+63 ${this.$t("common.country")}`, //国家号
      addHouseNumer: "", //具体地址门牌号,
      map: null, //地图接口
      autocomplete: null, //搜索框
      marker: null, //地图标记
      country: { country: ["PHL", "CN"] }, //查询范围 国家给单位
      pos: {}, //选中后的经纬度对象
      radius: 500, //查询半径 以当前地点为圆心
      submitLoading: false
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
    },
    mapId() {
      if (this.item == null) {
        return "mapAdd";
      } else {
        return "mapEdit_" + this.item.id;
      }
    },
    searchInput() {
      if (this.item == null) {
        return "searchInput";
      } else {
        return "searchInput_" + this.item.id;
      }
    },
    editAddresss() {
      if (this.item != null) {
        return this.item.address;
      } else {
        return "";
      }
    },
    title() {
      if (this.item == null) {
        return this.$t("address.newlyAdd");
      } else {
        return this.$t("address.editAdd");
      }
    }
  },
  watch:{
    visible:'changeAddress'
  },
  mounted() {
    let lang = getCookie("lang");
    if (lang == "zh") {
      this.CountryJson = CountryJson;
    } else {
      this.CountryJson = CountryJsons;
    }
  },
  methods: {
    ...mapActions("user", ["ajaxNewAddress", "ajaxChangeAddress"]),
    show() {
      this.visible = true;
      if (this.item == null) {
        this.reset();
      } else {
        this.setData();
      }
      this.initMap();
    },
    reset() {
      this.addName = "";
      this.addSex = "0";
      this.addPhone = "";
      this.addHouseNumer = "";
      this.select = `+63 ${this.$t("common.country")}`;
      $("#" + this.searchInput).val("");
      this.pos = {};
    },
    setData() {
      // let self = this;
      this.addName = this.item.name;
      this.addSex = this.item.sex + "";
      this.addPhone = this.item.phone;
      this.select = this.item.tel;
      this.addHouseNumer = this.item.houseNumber;
      $("#" + this.searchInput).val(this.editAddresss);
      this.pos = {
        lat: parseFloat(this.item.lat),
        lng: parseFloat(this.item.lon)
      };
    },
    changeAddress(){
      console.log(document.getElementsByClassName("el-dialog__wrapper")[0].scrollTop,'document.getElementsByTagName("body")[0].scrollTop')
      document.getElementsByClassName("el-dialog__wrapper")[0].scrollTop=0
        
    },
    initMap() {
      let self = this;
      let location = JSON.parse(localStorage.getItem("location"));
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            let pos = null;
            if (self.item == null) {
              pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              self.pos = pos;
              //self.getPlaceByLatLng(pos);
            } else {
              pos = self.pos;
            }
            self.map = new google.maps.Map(
              document.getElementById(self.mapId),
              {
                zoom: 15,
                center: pos
              }
            );
            self.marker = new google.maps.Marker({
              position: pos,
              draggable: true,
              animation: google.maps.Animation.DROP,
              map: self.map
            });
            google.maps.event.addListener(self.marker, "dragend", function(
              MouseEvent
            ) {
              self.pos = {
                lat: MouseEvent.latLng.lat(),
                lng: MouseEvent.latLng.lng()
              };
              self.getPlaceByLatLng(self.pos);
            });
            let circle = new google.maps.Circle({
              center: pos,
              radius: self.radius
            });
            if (self.autocomplete == null) {
              self.autocomplete = new google.maps.places.Autocomplete(
                document.getElementById(self.searchInput),
                {
                  types: [],
                  componentRestrictions: self.country,
                  bounds: circle.getBounds()
                }
              );
            }
            self.autocomplete.addListener("place_changed", self.onPlaceChanged);
          },
          function() {
            console.log("获取位置失败");
            if (location) {
              self.pos = {
                lat: location.lat,
                lng: location.lon
              };
            }
            self.map = new google.maps.Map(
              document.getElementById(self.mapId),
              {
                zoom: 15,
                center: self.pos
              }
            );
          }
        );
        google.maps.event.addListener(self.marker, "dragend", function(
          MouseEvent
        ) {
          self.pos = {
            lat: MouseEvent.latLng.lat(),
            lng: MouseEvent.latLng.lng()
          };
          self.getPlaceByLatLng(self.pos);
        });
        // let circle = new google.maps.Circle({
        //   center: pos,
        //   radius: self.radius
        // });
        // if (self.autocomplete == null) {
        //   self.autocomplete = new google.maps.places.Autocomplete(document.getElementById(self.searchInput), {
        //     types: [],
        //     'componentRestrictions': self.country,
        //     bounds: circle.getBounds()
        //   });
        // }
        // self.autocomplete.addListener('place_changed', self.onPlaceChanged);
      }
    },
    onPlaceChanged() {
      let self = this;
      let place = self.autocomplete.getPlace();
      if (place.geometry) {
        self.pos = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        };
        self.map.panTo(place.geometry.location);
        self.map.setZoom(15);
        if (typeof self.marker != "undefined") {
          self.marker.setMap(null);
        }
        self.marker = new google.maps.Marker({
          position: place.geometry.location,
          draggable: true,
          animation: google.maps.Animation.DROP,
          map: self.map
        });
        google.maps.event.addListener(self.marker, "dragend", function(
          MouseEvent
        ) {
          self.pos = {
            lat: MouseEvent.latLng.lat(),
            lng: MouseEvent.latLng.lng()
          };
          self.getPlaceByLatLng(self.pos);
        });
      }
    },
    getPlaceByLatLng(location) {
      let self = this;
      let administrative_area_level_1 = "",
        locality = "",
        sublocality = "",
        route = "",
        neighborhood = "";
      if (self.geocoder == null) {
        self.geocoder = new google.maps.Geocoder();
      }
      self.geocoder.geocode({ location: location }, function(results, status) {
        if (status == "OK") {
          for (let i = 0; i < results[0].address_components.length; i++) {
            let types = results[0].address_components[i].types;
            if (types.indexOf("administrative_area_level_1") != -1) {
              administrative_area_level_1 =
                results[0].address_components[i].long_name;
            }
            if (types.indexOf("locality") != -1) {
              locality = results[0].address_components[i].long_name;
            }
            if (types.indexOf("sublocality") != -1) {
              sublocality = results[0].address_components[i].long_name;
            }
            if (types.indexOf("route") != -1) {
              route = results[0].address_components[i].long_name;
            }
            if (types.indexOf("neighborhood") != -1) {
              neighborhood = results[0].address_components[i].long_name;
            }
          }
          let fromatAdd =
            administrative_area_level_1 + locality + sublocality + route;
          $("#" + self.searchInput).val(fromatAdd);
        } else {
          self.$message.error(self.$t("home.wrong"));
        }
      });
    },
    async saveAddress() {
      let self = this;
      let params = {
        address: $("#" + self.searchInput).val(),
        name: self.addName,
        sex: self.addSex,
        tel: self.globalCode,
        phone: self.addPhone,
        houseNumber: self.addHouseNumer,
        lat: self.pos.lat,
        lon: self.pos.lng
      };
      if (this.item != null) {
        params.id = self.item.id;
      }
      if (
        !params.address ||
        !params.name ||
        !params.phone ||
        !params.houseNumber
      ) {
        self.$message.error(self.$t("common.notFull"));
      } else {
        self.submitLoading = true;
        if (this.item == null) {
          let res = await self.ajaxNewAddress(params);
          if (self.$checkData(res)) {
            self.visible = false;
            self.$message.success(self.$t("address.newAdd"));
            self.$emit("refreshList");
          }
        } else {
          let globalCode = 0;
          if (parseInt(self.select).toString() !== 'NaN') {
            params.tel = this.item.tel
          } else {
            params.tel = self.globalCode
          }
          let res = await self.ajaxChangeAddress(params);
          if (self.$checkData(res)) {
            self.visible = false;
            self.$message.success(self.$t("address.modifyAdd"));
            self.$emit("refreshList");
          }
        }
        self.submitLoading = false;
      }
    }
  }
}
</script>

<style scope lang="scss">
.map {
  width: 100%;
  height: 380px;
}

.modal-add-address {
  .el-row {
    margin-bottom: 20px;
  }
  .el-select {
    width: 390px;
    margin-bottom: 20px;
  }
  .left-text {
    text-align: right;
    padding-right: 20px;
    height: 36px;
    line-height: 36px;
  }
  .c-dialog{
    overflow-y:scroll;
    height:100vh
  }
  
}
.el-form>.el-form-item{
  margin-bottom:10px;
}
.c-dialog .el-dialog__body{
  padding:15px;
}
.el-dialog>.el-dialog__header{
  padding:10px;
  .el-dialog__headerbtn{
    top: 10px;
    right: 10px;
  }
}
</style>
