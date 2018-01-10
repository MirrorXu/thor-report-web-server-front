<template>
  <div>
    {{ msg }}

    <div>
       location.href: <span style="color: red"> {{  param }}</span>
    </div>
  </div>

</template>


<script>

  import axios from 'axios';
  export default {
    data: function () {
      return {
        msg: '报告编辑页',
        param:'没有获取到'
      }
    },
    created:function () {
      this.param = window.location.href;
    }


  }

</script>

<style scoped lang="less">

</style>
