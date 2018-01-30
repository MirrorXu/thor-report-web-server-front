<template>
  <div id="app">
    <div id="header">
      <h1 id="header-name" >索真报告网页化系统</h1>
      <div id="nav-bar">
        <router-link to="/template">模板中心</router-link>
        <router-link to="/">欢迎</router-link>
      </div>
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
    left: 10%;
    top: 4%;
    width: 80%;
    height: 92%;
    overflow: hidden;

    border-radius: 0.5rem;
    box-shadow: 0 0 0 1px hsla(0,0%,100%,.3) inset,
    0 .5em 1em rgba(0, 0, 0, 0.6);
    text-shadow: 0 1px 1px hsla(0,0%,100%,.3);
    background: hsla(0,0%,100%,0.5);


    @header-h: 90px;
    #header {
      position: absolute;
      width: 100%;
      height: @header-h;
      /*background: #006699;*/
      background: hsla(0,0%,100%,0.5);
      z-index: 11;
      overflow: hidden;
      /*border-bottom: 2px solid rgba(255,255,255,0.5);*/
      #header-name{
        height: @header-h;
        line-height: @header-h;
        font-size: 1.6rem;
        text-align: center;
        color: #666666;
      }
      #nav-bar{
        @h:30px;
        width: 100%;
        height:@h;
        text-align: right;
        position: absolute;
        right: 0;
        bottom: 0;
        display: inline-block;
        /*background: seagreen;*/
        a{
          text-decoration: none;
          float: right;
          display: block;
          height: @h;
          line-height: @h;
          font-size: 0.8rem;
          color: #303133;
          margin-left: 10px;
          padding: 0 20px;
          background: rgba(255,255,255 , 0.7);
          box-shadow: 0 0 0 1px hsla(0,0%,100%,.6) inset;
          position: relative;
          top: 2px;
          border-radius: 3px ;
        }
        a:first-child{
          margin-right: 10px;
        }

      }

    }

    #content {
       width: 100%;
      height: 100%;
      padding-top: @header-h;
      padding-bottom: 5%;
      color: #333;
    }
  }
  #app::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: -1;
    filter: blur(50px);
    background-image:url('http://pic1.win4000.com/wallpaper/2018-01-17/5a5ec530235bf.jpg' );
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
