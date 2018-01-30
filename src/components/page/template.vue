<template>
  <div id="template-content">
    <!--<h2>{{ msg }}</h2>-->
    <el-row>
      <el-col :span="22" :offset="1">
        <el-tabs :value="tempateTabsValue">
          <el-tab-pane label="所有报告">
            <el-table id="all_report" :data="tempReport" style="width: 100%">
              <el-table-column min-width="10%" type="index" label="序号"></el-table-column>
              <el-table-column min-width="10%" prop="name" label="中文名"></el-table-column>
              <el-table-column min-width="10%" prop="ename" label="英文名"></el-table-column>
              <el-table-column min-width="10%" prop="editor" label="作者"></el-table-column>
              <el-table-column min-width="15%" prop="createdate" label="创建时间"></el-table-column>
              <el-table-column min-width="30%" prop="do" label="操作">
                <template slot-scope="scope">

                  <el-button plain type="success" size="small" @click="createReport(scope.row)">生成报告</el-button>
                  <el-button plain type="warning" size="small">
                    <router-link :to="editUrl + scope.row.ename">编辑模板</router-link>
                  </el-button>

                  <el-button plain type="danger" @click="delSingleReport( scope.row)" size="small">删除模板</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--报告列表分页-->
            <el-pagination id="pagination"
                           @current-change="handleCurrentChange"
                           :page-size="pagination.size"
                           :current-page.sync="pagination.currentPage"
                           layout="total, prev, pager, next"
                           :total="allReportData.length">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane label="新建报告" class="template-newReport">

            <el-row>
              <el-col :span="22" :offset="1">
                <el-form ref="form" :model="newReport">
                  <el-form-item label="报告英文名：">
                    <el-input v-model="newReport.ename"></el-input>
                  </el-form-item>
                  <el-form-item label="报告中文名：">
                    <el-input v-model="newReport.name"></el-input>
                  </el-form-item>
                  <el-form-item label="报告模板作者：">
                    <el-input v-model="newReport.editor"></el-input>
                  </el-form-item>
                  <div class="template-newReport-btns">
                    <el-button size="small" plain type="danger" @click="clearObjValue( newReport )">清空</el-button>
                    <el-button size="small" plain @click="sendToNewReport" type="success">保存</el-button>
                  </div>
                </el-form>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>

      </el-col>
    </el-row>

  </div>

</template>


<script>
  import axios from 'axios';

  export default {
    data: function () {
      return {
        msg: '报告模板页',
        editUrl: '/edit?id=',
        serverPath: {
//          ip_port: 'http://192.168.2.7:8080/',
          ip_port: 'http://localhost:8080/',
          getAllReport: 'webpage/report/report!list.action',
          newReport: 'webpage/report/report!save.action',
          delSingleReport: 'webpage/report/report!delete.action' ,
          getReport:'webpage/report/report!getReport.action'  // 生成报告
        },
        allReportData: [],
        tempReport: [],
        pagination: {
          size: 8,
          total: '',
          currentPage: 1
        },
        allReportDataCount: '1',
        tempateTabsValue: 0,
        newReport: {
          ename: '',
          name: '',
          editor: ''
        }

      }
    },
    beforeCreate: function () {

    },
    created: function () {
      this.getAllReport()
    },
    methods: {
//      测试
      test: function () {
        console.log('所有报告选项卡被点击')
      },

//      获取所有报告数据
      getAllReport: function () {
        console.log(' 获取所有报告列表');

        let _this = this;
        let url = _this.serverPath.ip_port + _this.serverPath.getAllReport;
        console.log('getAllReport-url:' + url);
        axios(url).then(function (res) {
          _this.allReportData = res.data;
          _this.allReportData.forEach(function (v , i ) {
            v.createdate =  _this.formatDate(v.createdate )
          })


          _this.handleCurrentChange(1);


//          console.log(res.data)
        }).catch(function (err) {
          console.log('getAllReport接口无法正常获取：', err)
        })
      },

//      删除单个报告
      delSingleReport: function (v) {

//        console.log(v)

        let url = this.serverPath.ip_port + this.serverPath.delSingleReport;
        let data = {id: v.id};
        let reportName = v.name;
        let _this = this;

//        确认是否为误触
        this.$confirm(v.name + '--是否删除该报告模板', '警告：', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(() => {
//        确认删除后，发送AJax请求，删除该报告
          axios(url, {params: data}).then(function (res) {
            console.log(res.data);
            if (res.data == 'success') {

              _this.$notify.success({
                title: '成功：',
                message: reportName + '----删除成功!'
              });

//              重新加载所有报告模板
              _this.getAllReport();

            } else {

              _this.$notify.error({
                title: '失败：',
                message: reportName + '----删除失败--' + (res.data || '后台并非返回错误原因')
              });

            }
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });


      },
//      创建新报告
      sendToNewReport: function () {
        let _this = this;
        let url = _this.serverPath.ip_port + _this.serverPath.newReport;

//        console.log( 'newReport接口准备发送的数据' ,_this.newReport );
//        console.log('newReport接口地址：' , url   );

//        判断用户创建创建报告时是否传入了有效参数

        if (!_this.newReport.ename) {
          _this.$notify.error({title: '错误：', message: '报告英文名填写有误...'});

          return false;
        }
        if (!_this.newReport.name) {
          _this.$notify.error({title: '错误：', message: '报告中文名填写有误...'});
          return false;
        }
        if (!_this.newReport.editor) {
          _this.$notify.error({title: '错误：', message: '报告作者填写有误...'});
          return false;
        }

//        发送ajax请求，创建新报告

        axios(url, {params: _this.newReport}).then(function (res) {
          console.log('sendToNewReport-新建报告:', res.data);
          if (res.data == 'success') {
            _this.$notify.success({title: '成功：', message: '报告创建成功，模板待编辑...'});

            setTimeout(function () {
              _this.clearObjValue(_this.newReport);

//              发送请求,重新获取最新报告数据
              _this.getAllReport();

//              跳转到报告列表tab
              _this.tempateTabsValue = 0;

            }, 1000);


          } else {
            _this.$notify.warning({title: '警告：', message: res.data.toString() || '未知错误！后台未返回任何提示！'})
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
//      清空一个对象的所有值
      clearObjValue: function (v) {
        if (v) {
          for (let key in v) {
            v[key] = ''
          }
        } else {
          this.$notify.warning({title: '警告：', message: '清空数据方法未传入参数！！'})
        }
      },

//      判断参数是否为真
      toBoolean: function (v) {
        console.log(typeof v)
        return v ? true : false;
      },

      handleCurrentChange(v) {
        let temp = v - 1;

        let _this = this;
        if (temp) {

          let start = temp * this.pagination.size - 1;
          let end = start + this.pagination.size
          this.tempReport = this.allReportData.filter(function (v, i) {
            return i >= start && i < end
          })
        } else {
          this.tempReport = this.allReportData.filter(function (v, i) {
            return i < _this.pagination.size;
          })
        }
      },
      formatDate: function (now) {
        if( now ){
          let time = new Date( now );
          let year =time.getYear();
          let month =time.getMonth() + 1;
          let date = time.getDate();
          let hour = time.getHours();
          let minute = time.getMinutes();
          let second = time.getSeconds();
          return "20" + (year-100) + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
        }
      },

      // 生成报告
      createReport:function ( v ) {
        if( !v ){
          this.$message.error('错误：未获取到报告信息 , 无法生成指定报告');
          return false
        }
        console.log( v )
        let _this = this ;
        let url  =  this.serverPath.ip_port + this.serverPath.getReport ;
        let ename = v.ename ;
        let cname = v.name;

        _this.$confirm('生成《'+cname+ '》报告？' , '提示：' , {
          confirmButtonText: '生成',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(()=>{
          axios( url , { params:{ ename: ename } }).then(  function (res ) {
            console.log( 'success:' , res )
            if( res.data ===  'success'){
              _this.$notify.success({ title:'成功：' ,  message:'《'+cname+'》报告生成请求已经提交。\n 后台提示：'+ res.data , duration:0 })
            }else{
              _this.$notify.error({ title:'失败：' ,  message:'《'+cname+'》报告生成生成失败。 后台提示：'+ res.data , duration:0 })
            }
          }).catch(function (err) {
            console.log( 'err:' , err )
            _this.$notify.error({ title:'错误' ,  message: '《' + cname + '》报告生成错误！'+ err  , duration:0})
          })
        }).catch(()=>{
          _this.$message.info( '提示： 取消生成 《'+ cname +'》 报告 ');
          }
        )





      }

    }
  }

</script>

<style lang="less">
  a {
    color: inherit;
    text-decoration: none;
  }

  #template-content {
    padding: 30px;

    .template-newReport {
      margin-top: 50px;
      /*padding-top: 100px;*/

      &-btns {
        margin-top: 30px;
        text-align: right;

      }
    }

    .el-table {
      table {
        border-collapse: inherit;
      }
      border-radius: 0.3rem;
      box-shadow: 0 0 0 1px hsla(0, 0%, 100%, .3) inset;
      text-shadow: 0 1px 1px hsla(0, 0%, 100%, .3);
      background: rgba(0, 0, 0, 0) !important;

      th, td {
        background: rgba(255, 255, 255, 0.6) !important;
        color: #303133;
      }
      tr, td {
        background: rgba(0, 0, 0, 0) !important;
      }
      tr:hover {
        background: rgba(255, 255, 250, 0.32) !important;
        td {
          color: #3a8ee6;
        }
      }
    }
    #pagination {
      margin-top: 10px;
      text-align: right;
    }
    .el-input {
      background: inherit !important;
      input {
        background: rgba(255, 255, 255, 0.4) !important;
      }
    }
  }


</style>
