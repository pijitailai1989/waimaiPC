<template>
  <div class="place">
    <!--头部-->
    <common-header />
    <!--筛选条件-->
    <!-- <seller-class :classList="classList" :loading="classLoading" @changeType="changeType" /> -->
    <seller-class :classList="classList" @changeType="changeType" />
    <!--商家列表-->
    <seller-list :sellerLists="sellerLists" :loading="listLoading" :loadAll="loadAll" @changeSort="changeSort" />
    <!--返回顶部-->
    <common-back-top />
    <!--底部-->
    <common-footer/>
  </div>
</template>
<script>
  import { mapActions } from 'vuex'
  import SellerList from "../components/seller/seller-list";
  import SellerClass from "../components/seller/seller-class";

  export default {
    name: "place",
    components: { SellerClass, SellerList },
    data() {
      return {
        listLoading: false,
        classLoading: false,
        loadAll: false,
        showCount: 8,
        currentPage: 1,
        totalPage: null,
        sellerLabelType: null,
        sellerLabelPoint: null,
        sortType: 5,
        location: null,
        sellerLists: [],
        classList: [{ sellerLabelName: this.$t('place.classification'), sellerLabelPoint: null, sellerLabelType: null }],
        no_location: false
      }
    },
    created() {
      let current_location = localStorage.getItem('current_location');
      console.log(current_location);
      if (current_location == null) {
        this.no_location = true;
      } else {
        this.no_location = false;
      }
    },
    async mounted() {
      let location = localStorage.getItem('location');
      if (!location) {
        // this.$router.push('/')
      } else {
        this.location = JSON.parse(location)
        this.getSellerClass()
        this.initList()
        console.log('商家页面', this.location)
      }
    },
    methods: {
      ...mapActions('seller', ['ajaxSellerList', 'ajaxSellerClass', 'ajaxSellerSort']),
      // 获取商家类型
      async getSellerClass() {
        this.classLoading = true
        let res = await this.ajaxSellerClass()
        if (res.code === 1) {
          // console.log('商家类型', res)
          res.data.forEach(item => {
            this.classList.push(item)
          })
          console.log('商家类型', this.classList)
          // this.classList = res.data;
        } else {
          this.$message.error(res.message)
        }
        this.classLoading = false
      },
      // 初始化列表
      async initList() {
        window.addEventListener('scroll', this.scrollHandler)
        await this.getSellerList()
      },
      // 获取商家列表
      async getSellerList() {
        if (this.listLoading) return
        this.listLoading = true
        // let {showCount, currentPage, catId, deliveryScheme, sortType} = this
        // let {lat, lon, areaId} = this.location
        let { lat, lon } = this.location
        let pramas = {
          lat,
          lon,
          showCount: this.showCount,
          currentPage: this.currentPage,
          sortType: this.sortType,
        }
        // 
        if (this.sellerLabelType == 1) {
          // 商家分类 
          pramas.catId = this.sellerLabelPoint
        } else if (this.sellerLabelType == 2) {
          // 商家分类 龙配送 24小时配送 
          pramas.deliveryScheme = 1
        } else if (this.sellerLabelType == 3) {
          pramas.allDayOpen = 1
        }
        // let res = await this.ajaxSellerList({lat, lon, areaId, showCount, currentPage, type, sortType})

        let res = await this.ajaxSellerList(pramas)
        if (res.code === 1) {
          console.log('商家列表', res)
          res.data.sellerList.forEach(item => {
            item.orderScore = parseFloat(item.orderScore)
            this.sellerLists.push(item)
          })
          if (res.data.totalPage <= this.currentPage) {
            this.loadedAll = true
            window.removeEventListener('scroll', this.scrollHandler)
            console.log('加载完成')
          }
          this.currentPage++
        } else {
          this.$message.error(res.message)
        }
        this.listLoading = false
        return res
      },
      // 切换商家类型
      async changeType(item) {
        this.sellerLists = []
        this.loadAll = false
        this.sellerLabelType = item.sellerLabelType
        this.sellerLabelPoint = item.sellerLabelPoint
        this.currentPage = 1
        this.initList()
      },
      // 切换排序方式
      async changeSort(item) {
        this.sellerLists = []
        this.loadAll = false
        this.sortType = item.sortType
        this.currentPage = 1
        this.initList()
      },
      // 滚动加载
      async scrollHandler() {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        let distance = scrollHeight - clientHeight - scrollTop
        if (distance < 500 && !this.listLoading) {
          console.log('滚动加载-----')
          let res = await this.getSellerList()
        }
      }
    }
  }

</script>
<style scoped lang="scss">
</style>