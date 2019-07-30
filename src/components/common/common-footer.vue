<template>
  <div class="common-footer">
    <div class="footer-content">
    </div>
    <div class="bottom">
      <div>
        <p> &copy; 2018 DEPROMO TECHNOLOGY INC.</p>
        <p>604，6th Floor，National Life Insurance Building 6762 Ayala Avenue,Makati</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "common-footer",
    data() {
      return {
        is_loading: false
      };
    },
    created() {
      this.is_loading = localStorage.getItem('is_loading_fn');
      console.log(this.is_loading)
    }
  };
</script>

<style scoped lang="scss">
  .common-footer {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    text-align: center;
    background: #332e2e;
    box-shadow: 0 -1px 0 0 #dddddd;
    color: #e0e0e0;
  }

  .bottom {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
  }

  .is_opacity {
    opacity: 0;
  }
</style>