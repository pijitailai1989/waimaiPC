<template>
  <div class="address-list">
    <div class="top">
      <p>{{$t('payMent.confirmAddress')}}
        <router-link to="/user/my-address">{{$t('payMent.adminAddress')}}</router-link>
      </p>
      <div class="switch" @click="switchLength">
        <i class="iconfont icon-unfold"></i>{{$t('payMent.lookAddress')}}</div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in addressList" :key="index" v-show="index<showLength">
        <card-address @refreshList="refreshList" @setAdd="setAdd" :item="item"/>
      </el-col>
      <el-col :span="6" class="add-address">
        <!-- <div class="content" @click="$refs.modalAddress.show()"> -->
        <div class="content" ref="add_address_fn" @click="add_address_fn">
          <div class="button">
            <i class="iconfont icon-icon_add_big"></i>
            <br>{{$t('payMent.addAddress')}}
          </div>
        </div>
      </el-col>
    </el-row>
    <modal-address ref="modalAddress" @refreshList="refreshList" />
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import ModalAddress from "../../components/common/common-address";
import CardAddress from "../../components/consume/card-address";
export default {
  name: "address-list",
  props: ["addressList"],
  data() {
    return {
      showLength: 3,
      item: null
    };
  },
  components: { ModalAddress, CardAddress },
  computed: {
    ...mapState("order", ["address"])
  },
  created() {
    console.log("this.state:::" + JSON.stringify(this.addressList));
    
  },
  mounted() {
    let setDefault = [];
    // if (this.addressList.length==0) {
    //   this.setAddress(null)
    // }
    this.addressList.forEach(item => {
      setDefault.push(item.km);
      console.log(this.addressList[0].id,'id');
    });
    console.log("setDefault", setDefault);
    // 默认地址
    let current_location = localStorage.getItem("current_location");
    if (current_location == null) {
      // 定位失败，默认选中列表中第一个地址
      this.setAddress(this.addressList[0]);
    } else {
      // 定位成功，默认选中离当前位置最近的收货地址
      console.log(this.addressList,'this.addressList')
      let arr = [];
      this.addressList.forEach(item => {
        arr.push(item.km);
      });
      arr.sort((n1, n2) => {
        return n1 - n2;
      });
      this.addressList.forEach(item => {
        if (item.km == arr[0]) {
          console.log(JSON.stringify(item));
          this.setAddress(item);
        }
      });
    }
    console.log("length:::" + this.addressList.length);
  },
  methods: {
    ...mapMutations("order", ["setAddress"]),
    add_address_fn() {
      if (this.addressList.length == 5) {
        this.$message.error(this.$t("address.limit"));
      } else {
        console.log("show");
        this.$refs.modalAddress.show();
      }
    },
    chooseAddress(item) {
      if (item.disabled) return;
      this.setAddress(item);
    },
    refreshList() {
      this.$emit("refreshList");
    },
    switchLength() {
      this.showLength = this.showLength > 3 ? 3 : this.addressList.length;
    },
    editAddress(add) {
      this.item = add;
      // console.log(this.item);
      this.$refs.modalEditAddress.show();
    },
    setAdd(item) {
      this.setAddress(item);
      // console.log('地址列表页地址',item)
    }
  }
};
</script>
<style scoped lang="scss">
.address-list {
  .top {
    overflow: hidden;
    margin-top: 30px;
    p {
      float: left;
      font-size: 14px;
      color: #666666;
      a {
        margin-left: 10px;
        color: #d69d00;
        font-size: 12px;
      }
    }
    .switch {
      float: right;
      color: #999999;
      cursor: pointer;
      user-select: none;
      i {
        margin-right: 5px;
      }
      &:hover {
        color: $color-primary;
      }
    }
  }

  .el-col {
    margin-top: 30px;
    cursor: pointer;
  }

  .add-address {
    .content {
      width: 100%;
      height: 160px;
      border: 1px solid #ebebeb;
      position: relative;
      .button {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #999999;
      }
      i {
        color: #cccccc;
        font-size: 30px;
      }
    }
  }
}
</style>