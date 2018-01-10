<template>
  <div id="template-content">
    <h2>{{ msg }}</h2>
    <el-row>
      <el-col :span="24">
        <el-tabs>
          <el-tab-pane label="所有报告">
            <el-row>
              <el-col>
                <el-table class="" :data="allReportData" border style="width: 100%">
                  <el-table-column type="index" width="50" label="序号"></el-table-column>
                  <el-table-column min-width="20%" prop="name" label="中文名"></el-table-column>
                  <el-table-column min-width="20%" prop="ename" label="英文名"></el-table-column>
                  <el-table-column min-width="20%" prop="editor" label="作者"></el-table-column>
                  <el-table-column min-width="20%" prop="createdate" label="创建时间"></el-table-column>
                  <el-table-column min-width="40%" prop="do" label="操作">
                    <template slot-scope="scope">
                      <el-button plain type="info" size="small" @click=""> 编辑模板</el-button>
                      <el-button plain type="success" size="small">
                        <router-link :to="editUrl + scope.row.ename">生成报告</router-link>
                      </el-button>
                      <el-button plain type="danger" @click="delSingleReport( scope.row)" size="small">删除模板</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-tab-pane>

          <el-tab-pane label="新建报告" class="template-newReport">
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
            </el-form>

            <div class="template-newReport-btns">
              <el-button type="danger" @click="clearObjValue( newReport )" >清空</el-button>
              <el-button @click="sendToNewReport" type="success">保存</el-button>
            </div>
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
          ip_port: 'http://192.168.2.7:8080/',
          getAllReport: 'webpage/report/report!list.action',
          newReport: 'webpage/report/report!save.action',
          delSingleReport: 'webpage/report/report!delete.action'
        },
        allReportData: [],
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
      test: function (v) {
        console.log(v)
      },

//      获取所有报告
      getAllReport: function () {
        let _this = this;
        let url = _this.serverPath.ip_port + _this.serverPath.getAllReport;
        console.log('getAllReport-url:' + url);
        axios(url).then(function (res) {
          _this.allReportData = res.data;
//          console.log(res.data)
        }).catch(function (err) {
          console.log(' getAllReport接口无法正常获取：', err)
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
          console.log( res.data );
            if (res.data == 'success') {

              _this.$notify.success({
                title:'成功：',
                message: reportName +'----删除成功!'
              });

//              重新加载所有报告模板
              _this.getAllReport();

            } else {

              _this.$notify.error({
                title:'失败：',
                message: reportName +'----删除失败--'+ (res.data || '后台并非返回错误原因')
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
            _this.$notify.success({title: '成功：', message: '报告创建成功，模板待编辑...'})

            setTimeout(function () {
              _this.clearObjValue(_this.newReport);
            }, 1000)
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
      }
    }
  }

</script>

<style scoped lang="less">
  a {
    color: inherit;

    text-decoration: none;
  }

  #template-content {
    padding: 30px;
    .template-newReport{
      padding-top: 100px;
      width: 80%;
      margin-left: auto;
      margin-right: auto;
      &-btns{
        margin-top: 30px;
        text-align: right;
      }
    }
  }

</style>
