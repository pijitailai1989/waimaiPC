<template>
  <div class="rate">
    <!--头部-->
    <common-header/>
    <!--商家头部-->
    <seller-header v-if="!error"/>
    <!--主内容-->
    <div class="main">
      <seller-rate class="seller-rate" :rateList="rateList" :loading="listLoading" :loadAll="loadAll" v-if="!error"/>
      <seller-announce class="announce" type="2" :orderScore="orderScore" v-if="!error"/>
    </div>
    <common-no-data v-if="error" :message="$t('seller.noSeller')" style="min-height: 580px; padding-top: 100px;"/>
    <!--返回顶部-->
    <common-back-top />
    <!--底部-->
    <common-footer v-show="isLoading"/>
  </div>
</template>
<script>
  import {mapActions} from 'vuex'
  import SellerHeader from "../../components/seller/seller-header"
  import SellerAnnounce from "../../components/seller/seller-announce"
  import SellerRate from '../../components/seller/seller-rate'

  export default {
    name: "rate",
    components: {SellerHeader, SellerAnnounce, SellerRate},
    data() {
      return {
        error: false,
        // loading: false,
        loadAll: false,
        listLoading: false,
        location: null,
        orderScore: 0,
        deliveryScore: 0,
        isLoading: false,
        showCount: 8,
        currentPage: 1,
        rateList: []
      }
    },
    computed: {
      sellerId() {
        return this.$route.params.id
      }
    },
    async mounted() {
      let location = localStorage.getItem('location')
      this.location = JSON.parse(location)
      // await this.getSellerRate()
      this.initData()
      setTimeout(() => {
        this.isLoading = true
      }, 300);
    },
    methods: {
      ...mapActions('seller', ['ajaxSellerRate']),
      async getSellerRate() {
        if (this.listLoading) return
        this.listLoading = true
        let {sellerId, showCount, currentPage} = this
        let {lat, lon} = this.location
        let res = await this.ajaxSellerRate({sellerId, showCount, currentPage, lat, lon})
        console.log('商家评论列表',res)
        if (res.code === 1) {
          this.orderScore = res.data.orderCommentList.orderScore
          this.deliveryScore = parseFloat(res.data.orderCommentList.deliveryScore)
          res.data.orderCommentList.forEach(item => {
            item.photos = item.picturePath ? item.picturePath.split(',') : []
            item.isShow = false  
            item.unfoldMore = false 
            this.rateList.push(item)
          })
          // this.rateList = res.data.orderCommentList
          if (res.data.totalPage <= this.currentPage) {
            this.loadedAll = true
            window.removeEventListener('scroll', this.scrollHandler)
           
            console.log('加载完成')
          }
          this.currentPage++
        }else {
          this.error = true
        }
        this.listLoading = false
        return res
      },
      async initData() {
        window.addEventListener('scroll', this.scrollHandler)
        await this.getSellerRate()
      },
      async scrollHandler() {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        let distance = scrollHeight - clientHeight - scrollTop
        if (distance < 500 && !this.listLoading) {
          console.log('滚动--------------------')
          // this.listLoading = true
          
          let res = await this.getSellerRate()
          // if (res && res.code === 1 && res.data.orderCommentList.length <= this.showCount) {
            // window.removeEventListener('scroll', this.scrollHandler)
            // this.loadAll = true

            // this.listLoading = true
          // }
          // this.currentPage += 1
          // this.listLoading = true
        }
      }
    }
  }

</script>
<style scoped lang="scss">
  .rate {
    .main {
      @include container;
      overflow: hidden;
    }
    .seller-rate {
      float: left;
    }
    .announce {
      float: right;
    }
  }

</style>
