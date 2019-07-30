<template>
  <div class="address__list__wrapper">
    <div class="list__header">
      <h2>{{item.name}} {{item.sex | sexTranslate}}</h2>
      <div class="list__todo">
        <i class="iconfont icon-zhanghushezhi-bianjiicon1" @click="$refs.modalEditAddress.show()"></i>
        <i class="iconfont icon-shanchuicon1" @click="item.deleteShow=true"></i>
      </div>
    </div>
    <p class="address__detail">{{item.address}} {{item.houseNumber}}</p>
    <p class="tel">{{item.phone}}</p>
    <div class="delete__btn__wrapper" v-if="item.deleteShow">
      <div class="u-middle">
        <p>{{$t('payMent.delete')}}</p>
        <el-button round size="mini" @click="item.deleteShow=false">{{$t('common.cancel')}}</el-button>
        <el-button type="danger" round size="mini" @click="deleteAddress(item.id)" :loading="changeLoading">{{$t('common.delete')}}
        </el-button>
      </div>
    </div>
    <modal-address ref="modalEditAddress" @refreshList="refreshList" :item="item" />
  </div>
</template>
<script>
  import { mapActions,mapMutations } from 'vuex'
  import ModalAddress from '../../components/common/common-address'

  export default {
    props: ['item','length'],
    data() {
      return {
        changeLoading: false,
      }
    },
    components: { ModalAddress },
    methods: {
      ...mapActions('user', ['ajaxDeleteAddress']),
      // 删除
      ...mapMutations("order", ["clearAddress"]),
      async deleteAddress(id) {
        console.log(this.length,'this.length')
        console.log(this.item,'this.item')
        if(this.length<=1){
          this.clearAddress()
        }
        let self = this;
        if (self.changeLoading) {
          return false;
        }
        self.changeLoading = true;
        let res = await this.ajaxDeleteAddress({ id: id })
        if (self.$checkData(res)) {
          self.$message.success(this.$t('payMent.success'));
          this.$emit('refreshList');

        }
        self.changeLoading = false;
      },
      refreshList() {
        this.$emit('refreshList');
      }
    }
  }

</script>
<style scope lang="scss">
  .address__list__wrapper {
    border: 1px solid $bd-gray;
    padding: 15px 20px;
    border-radius: 4px;
    min-height: 132px;
    .list__header {
      padding-bottom: 15px;
      border-bottom: 1px dashed $bd-gray;
      margin-bottom: 15px;
      h2 {
        font-size: 16px;
        display: inline-block;
        font-weight: normal;
        color: #333;
      }
      .list__todo {
        float: right;
        i {
          font-size: 17px;
          margin-left: 10px;
          cursor: pointer;
          color: #666;
          &.icon-zhanghushezhi-bianjiicon1 {
            font-size: 16px;
          }
        }
      }
    }
    .address__detail,
    .tel {
      color: #888;
      @include text-over;
    }
    .address__detail {
      margin-bottom: 10px;
    }
    .delete__btn__wrapper {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
      background: rgba(51, 51, 51, 0.70);
      text-align: center;
      p {
        margin-bottom: 15px;
        color: #fff;
      }
    }
    .add__address {
      text-align: center;
      i {
        font-size: 20px;
      }
      span {
        margin-left: 20px;
      }
    }
  }
</style>