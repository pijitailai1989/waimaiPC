<template>
  <div>
      <common-header />
      <div class="pay-success">支付成功！</div>
      <common-footer />
  </div>
</template>

<script>
    import commonHeader from '../../components/common/common-header'
    import commonFooter from '../../components/common/common-footer'
    export default {

    }
</script>

<style lang="scss" scoped>
    .pay-success {
        height: 100px;
        text-align: center;
        line-height: 100px;
        font-size: 20px;
    }
</style>

