<template>
  <div id="app">
    <div id="header">
      索真报告系统
    </div>
    <div id="nav">
      <!--<router-link to="/">欢迎</router-link>-->
      <router-link to="/template">模板中心</router-link>
      <router-link to="/edit">编辑</router-link>
    </div>
    <div id="content">
      <router-view/>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'app'
  }
</script>

<style scoped lang="less">
  #app {
    position: relative;
    width: 100%;
    height: 100%;
    background: seagreen;
    overflow: hidden;
    @header-h: 80px;
    @nav-w: 80px;
    #header {
      position: fixed;
      width: 100%;
      height: @header-h;
      background: #006699;
      z-index: 11;
      overflow: hidden;
      text-align: center;
      line-height: @header-h;
      font-size: 30px;
      color: white;
    }
    #nav {
      position: fixed;
      width: @nav-w;
      height: 100%;
      background: yellow;
      padding-top: @header-h;
      z-index: 10;
      overflow: hidden;
      a{
        @color:#fff;
        display: block;
        width: @nav-w;
        height: @nav-w;
        background: #006699;
        &:link{
          color: @color;
        }
        &:visited{
          color: @color;
        }
        &:hover{
          color: @color;
        }
        &:active{
          color: @color;
        }
      }
    }
    #content {
       width: 100%;
      height: 100%;
      padding-left: @nav-w;
      padding-top: @header-h;
      background: azure;
      color: #333;
    }
  }
</style>
