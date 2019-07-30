<template>
  <div>
    <!--头部-->
    <common-header/>
    <div class="my__address__container clearfix">
      <div class="u-pc-sidebar">
        <!--侧边栏-->
        <side-bar pageId="7" />
      </div>
      <div class="address__wrapper u-pc-content">
        <div class="top__header">
          <h2>{{$t('accountInfo.myAddress')}}</h2>
        </div>
        <common-loading v-if="loading" />
        <div class="address__list">
          <el-row v-if="!loading">
            <el-col :span="12" v-for="(item, index) in addressList" :key="index" :item="item" >
              <card-address ref="cardAddress" :item="item" @refreshList="initData" :length="addressList.length"/>
            </el-col>
            <el-col :span="12">
              <!-- <div class="address__list__wrapper u-cursor-pointer" @click="$refs.modalAddress.show()"> -->
              <div class="address__list__wrapper u-cursor-pointer" @click="add_address">
                <div class="add__address u-middle-all">
                  <i class="iconfont icon-icon_add_big"></i>
                  <span>{{$t('payMent.addAddress')}}</span>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <common-footer/>
    <modal-address ref="modalAddress" @refreshList="initData" />
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import SideBar from "../../components/user/side-bar";
  import ModalAddress from '../../components/common/common-address'
  import CardAddress from '../../components/user/card-address'

  export default {
    data() {
      return {
        addressList: [],
        loading: true,
        changeLoading: false,
      }
    },
    components: { SideBar, ModalAddress, CardAddress },
    async mounted() {
      this.initData()
    },
    methods: {
      ...mapActions('user', ['ajaxAddressList', 'ajaxDeleteAddress']),
      add_address() {
        console.log(this.addressList.length);
        if (this.addressList.length == 5) {
          this.$message.error(this.$t('address.limit'));
        } else {
          this.$refs.modalAddress.show();
        }
      },
      async initData() {
        let self = this;
        self.loading = true;
        let res = await this.ajaxAddressList();
        if (self.$checkData(res)) {
          self.addressList = [];
          res.data.forEach(item => {
            item.deleteShow = false;
            self.addressList.push(item)
          })
          console.log(self.addressList)
        } else {
          this.$message.error(res.message);
        }
        self.loading = false;
      },
      // 删除
      async deleteAddress(id) {
        let self = this;
        if (self.changeLoading) {
          return false;
        }
        let load = self.$message({
          message: this.$t('payMent.deleting'),
          type: 'warning',
          duration: 0
        });
        let res = await this.ajaxDeleteAddress({ addrId: id })
        load.close();
        self.changeLoading = false;
        if (self.$checkData(res)) {
          self.$message.success(this.$t('payMent.deleting'));
          self.initData()
        }
      }
    }
  }

</script>
<style scope lang="scss">
  .my__address__container {
    @include container;
    margin-top: 20px;
    .address__list {
      padding: 10px;
      .el-col {
        padding: 10px;
        .address__list__wrapper {
          border: 1px solid $bd-gray;
          padding: 15px 20px;
          border-radius: 4px;
          min-height: 132px;
          .add__address {
            text-align: center;
            i {
              font-size: 20px;
              color: #ccc;
              position: relative;
              top: 2px;
            }
            span {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
</style>