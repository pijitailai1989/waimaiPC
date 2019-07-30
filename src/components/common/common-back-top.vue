<template>
  <!-- <div class="common-back-top" :style="{bottom: bottom+'px'}"> -->
  <div class="common-back-top">
    <div class="button" @click="backTop" v-show="visible">
      <i class="iconfont icon-Upward"></i><br>
      <span>{{$t('common.backTop')}}</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "common-back-top",
    data() {
      return {
        visible: false,
        bottom: 176
      }
    },
    mounted() {
      window.addEventListener('scroll', this.scrollHandle)
    },
    methods: {
      backTop() {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      },
      scrollHandle() {
        let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
        let distance = scrollHeight - clientHeight - scrollTop
        this.visible = scrollTop >= 400;
        if (distance < 300) {
          this.bottom = 376 - distance
        } else {
          this.bottom = 76
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .common-back-top {
    position: fixed;
    left: 50%;
    bottom:140px;
    margin-left: 630px;
    z-index:1001;
    .button {
      width: 47px;
      height: 48px;
      background: #FAFAFA;
      border: 1px solid #ededed;
      cursor: pointer;
      text-align: center;
      padding-top:5px;
      i {
        font-size: 16px;
      }
      &:hover {
        background: #f5f5f5;
      }
      span {
        font-size: 12px;
      }
    }
  }
  @media (min-width: 1251px) and (max-width: 1370px) {
  .common-back-top {
    position: fixed;
    right: 10px;
    left: inherit;
    bottom:140px;
  }
  }
  @media screen and (max-width: 1250px) {
  .common-back-top {
    position: fixed;
    right: 10px;
    left: inherit;
    bottom:120px;
  }
  }
</style>
