<template>
  <div class="edit">

    <el-row class="edit-content">
      <el-col class="edit-content-left" :span="12">
        <el-row>
          <el-col>
            <h4>报告基本信息 ：</h4>
            英文名：{{ thisReport.base.ename }}
            <br>
            中文名：{{ thisReport.base.name }}
            <br>
            作者：{{ thisReport.base.editor }}
            <br>
            创建时间：{{thisReport.base.createdate}}
          </el-col>
        </el-row>
        <!--<el-tree show-checkbox lazy :data="thisReport.tree" :props="thisReport.defaultProps"  @node-click="test">-->
        <el-tree id="reportTree" node-key="id" :default-expand-all="true" :data="thisReport.tree" accordion
                 :props="thisReport.defaultProps"
                 @node-click="changeSelectNode"></el-tree>

      </el-col>

      <el-col class="edit-content-right" :span="12">
        <!--编辑功能区-->
        <div>
          <el-button type="primary" @click="addTitle(  1 )">新建子标题</el-button>
          <el-button type="primary" @click="addTitle(  2 )">新建兄弟标题</el-button>
          <el-button type="primary" @click="addTitle(  4 )">标题内容修改</el-button>
          <br><br>
          <el-button @click="deleteSelectedNode()" type="danger"> 删除选中的组件或标题</el-button>

          <!--添加组件功能-->
          <template v-if="thisReport.selectNode.type == 'title' ">
            <br><br>
            <el-button type="warning" @click="showDialog( 1  , '文字')">文字组件</el-button>
            <el-button type="warning" @click="showDialog( 1 , '图片')">图片组件</el-button>
            <el-button type="warning" @click="showDialog( 1 , '表格')">表格组件</el-button>
          </template>
          <template v-if="thisReport.selectNode.type === 'conponent' ">
            <br><br>
            <el-button type="warning" @click="reviseComponent()">修改选中组件</el-button>
          </template>


          <div style="display: none">
            <br><br>
            <input type="file" @change="getFile($event)">
            <button @click="fileSubmit()"> 上传 </button>
            <br>
            {{deepCopy(componentsData)}}
          </div>
        </div>

        <!--components - 编辑对话框 --dialog -->
        <el-dialog title="组件编辑" :visible.sync="componentsData.dialogVisible" width="60%">

          <!--点击添加文本组件时的前端视图-->
          <template v-if="selectComponent == '文字' ">
            <el-form>
              <el-form-item>
                <!--<el-input type="textarea" v-model="form.desc"></el-input>-->
                <el-input type="textarea" v-model="componentsData.ajaxData.original_content"></el-input>
              </el-form-item>
            </el-form>
          </template>

          <!--点击图片组件时的前端视图-->
          <template v-if="selectComponent == '图片' ">
            <el-form label-width="160px" labelPosition="left">
              <el-form-item label="组件类型：">
                <el-radio-group v-model="componentsData.ajaxData.imgtype">
                  <el-radio label="single">单图</el-radio>
                  <el-radio label="many">多图</el-radio>
                  <el-radio label="common">公共图片</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="图片名称：">
                <el-input v-model="componentsData.ajaxData.name"></el-input>
              </el-form-item>
              <template v-if="componentsData.ajaxData.imgtype == 'common' ">
                <el-form-item label="图片上传：">
                  <input type="file" @change="getFile($event)">
                  <el-button @click="uploadFile( 1 )" size="small" type="warning"> 上传 </el-button>
                </el-form-item>
              </template>

              <el-form-item label="图片路径：">
                <el-input v-model="componentsData.ajaxData.path"></el-input>
              </el-form-item>
              <el-form-item label="注内容：">
                <el-input type="textarea" v-model="componentsData.ajaxData.notes"></el-input>
              </el-form-item>
              <el-form-item label="下载功能：">
                <el-radio-group v-model="componentsData.ajaxData.isdownshow">
                  <el-radio label="false">否</el-radio>
                  <el-radio label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="componentsData.ajaxData.isdownshow == 'true'">
                <el-form-item label="下载提示：">
                  <el-input v-model="componentsData.ajaxData.downloadnotes"></el-input>
                </el-form-item>
              </template>


            </el-form>
          </template>


          <!--点击表格组件时的前端视图-->
          <template v-if="selectComponent == '表格' ">
            <el-form label-width="160px" labelPosition="left">
              <el-form-item label="组件类型：">
                <el-radio-group v-model="componentsData.ajaxData.tabletype">
                  <el-radio label="data">生信数据表格</el-radio>
                  <el-radio label="common">自定义表格</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="表格名称：">
                <el-input v-model="componentsData.ajaxData.name"></el-input>
              </el-form-item>
              <template v-if="componentsData.ajaxData.tabletype == 'common' ">
                <el-form-item label="表格上传：">
                  <input type="file" @change="getFile($event)">
                  <el-button @click="uploadFile( 1 )" size="small" type="warning"> 上传 </el-button>
                </el-form-item>
              </template>

              <el-form-item label="表格路径：">
                <el-input v-model="componentsData.ajaxData.path"></el-input>
              </el-form-item>
              <el-form-item label="注内容：">
                <el-input type="textarea" v-model="componentsData.ajaxData.notes"></el-input>
              </el-form-item>
              <el-form-item label="下载功能：">
                <el-radio-group v-model="componentsData.ajaxData.isdownshow">
                  <el-radio label="false">否</el-radio>
                  <el-radio label="true">是</el-radio>
                </el-radio-group>
              </el-form-item>
              <template v-if="componentsData.ajaxData.isdownshow == 'true'">
                <el-form-item label="下载提示：">
                  <el-input v-model="componentsData.ajaxData.downloadnotes"></el-input>
                </el-form-item>
              </template>


            </el-form>
          </template>


          <span slot="footer" class="dialog-footer">
                  <el-button @click="componentsData.dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addComponent() ">确 定</el-button>
                </span>
        </el-dialog>

      </el-col>
    </el-row>
  </div>

</template>


<script>

  import axios from 'axios';

  let id = 1000;
  export default {
    data: function () {
      return {
        eName: '报告数据获取中...',
        serverPath: {
//          ip_port: 'http://192.168.2.7:8080/',
          ip_port: 'http://localhost:8080/',
          getThisReportTree: 'webpage/chapter/chapter!getTree.action', // 通过ename 获取报告tree
          findByEname: 'webpage/report/report!findByEname.action',  // 通过ename获取报告信息
          addChildrenTitle: 'webpage/chapter/chapter!save.action',  //为标题添加子标题
          saveComponent: 'webpage/conponents/conponents!save.action', // 保存组件数据
          delComponent: 'webpage/conponents/conponents!delete.action',  // 删除组件
          delTitle: 'webpage/chapter/chapter!delete.action',  // 删除组件,
          filesUpload: 'webpage/filesc/filesc!upload.action',  // 文件上传地址
          findComponentById:'webpage/conponents/conponents!findById.action'  // 查询并获取组件内容
        },
        thisReport: {
          filterText: '',
          defaultProps: {
            children: 'children',
            label: 'text',
//            isLeaf:'children'
          },
          base: {
            ename: '获取中...',
            name: '获取中...',
            editor: '获取中...',
            id: '获取中',
            createdate: '获取中'
          },
          tree: [],
          selectNode: '',  // tree中被选中的节点
        },
        componentsData: {
          dialogVisible: false,
          ajaxData: '',
          paragraph: {
            pid: '未获取到所属章节', //所属章节id
            type: '文字', //组件类型，文字
            original_content: '', // 文字内容
            project_num: '报告英文名'//
          },
          img: {
            pid: '',                //所属章节id
            name: '',               //图片名称
            path: '',               //图片路径
            notes: '',              //图片注解，
            type: '图片',               //组件类型，图片
            imgtype: 'single',            //图片类型，单图 -single ，多图- many , 公共图片 - common
            isdownshow: 'false',         //是否显示下载组件
            downloadnotes: '下载列表：'       //下载组件的介绍
          },
          table: {
            pid: '',//所属章节id
            name: '',//表格名称
            path: '',//表格路径
            notes: '',//表格注解，
            type: '表格',//组件类型，data - 项目中的表格  common - 自定义表格
            tabletype: 'data',//表格类型：data文件夹中表格：data 公共表格： common
            isdownshow: 'false',//是否显示下载组件
            downloadnotes: '下载列表：',//下载组件的介绍
          }
        },
        selectComponent: '', // 图片 文字  表格   dialog对话框将根据这个字段进行样式的展示
        fileList: [],
        selectedFile: '' , //通过input file 获取到准备上传的文件 ，
        reviseComponentFlag:false, // 是否支持修改组件
      }
    },
    created: function () {
//       将URl中的报告英文名,绑定至 data.eName
      this.eName = this.getUrlEname;

//    根据data.eName 获取报告基本信息
      this.getReportBase();
//     根据data.eName 获取报告tree
      this.getReportTree();
    },
    computed: {

//      获取URl参数中的报告名
      getUrlEname: function () {
        let ename = window.location.href.split('?')[1].split('=')[1];
        return ename
      }


    },
    methods: {
      test: function (v, e, i) {
//        console.log( v ,e)
//        console.log( i  )
        console.log('it is useful')
      },
      CheckChange(data, checked, indeterminate) {
        console.log(data, checked, indeterminate);
      },

//      对象数组深拷贝
      deepCopy: function (v) {

//        console.log( v  );

        if ((typeof v == 'object' ) || ( typeof v == 'array')) {

//        参数为数组或对象时，进行深拷贝，并返回数据
          return JSON.parse(JSON.stringify(v));
        } else {

//        其他情况，提示参数错误后 ，返回undefined
          this.$message.error('deepCopy方法无法对参数进行处理');
          return undefined
//          return 'hello world'

        }
      },

//      清空对象的值， obj 是被清空的对象 ， arr[数组] 哪些键无需处理
      clearObject: function (obj, arr) {
        if (!obj) {
          this.$message.error('clearObject方法未传入有效对象');
        }
        if (!arr) {
          for (let k in obj) {
            obj[k] = ''
          }
        } else {
          for (let k in obj) {
            for (let i = 0; i < arr.length; i++) {
              if (k !== arr[i]) {
                obj[k] = ''
              }
            }
          }

          console.log(obj);
        }
      },

//      获取报告的tree
      getReportTree: function () {

        if (!this.eName) {
          this.$notify.error({message: '未能获取到正确的报告英文名，无法进行下一步操作。', title: '错误：'});
          return false;
        }

        let _this = this;

//        获取报告的tree
        let getTreeUrl = _this.serverPath.ip_port + _this.serverPath.getThisReportTree;
        let getTreeData = {project_num: _this.eName};
        console.log('获取报告tree接口地址：', getTreeUrl)
        axios(getTreeUrl, {params: getTreeData}).then(function (res) {

//          _this.$notify.success({title: '成功：', message: '报告tree正常获取'})
          _this.thisReport.tree = res.data;
        }).catch(function (err) {
          console.log('接口异常：' + getTreeUrl, err)
        });

      },
//      获取报告基本信息
      getReportBase: function () {
        if (!this.eName) {
          this.$notify.error({message: '未能获取到正确的报告英文名，无法进行下一步操作。', title: '错误：'});
          return false;
        }

        let _this = this;

//        获取报告的基本信息

        let findReportUrl = _this.serverPath.ip_port + _this.serverPath.findByEname;
        let findReportData = {ename: _this.eName};

        console.log('获取报告基本信息接口地址：', findReportUrl)
        axios(findReportUrl, {params: findReportData}).then(function (res) {
//          console.log(  'findReportByEname:'  , res.data );

          if (res.data != 'error') {

            _this.thisReport.base = res.data;

            _this.$notify.success({title: '成功：', message: '报告基本内容正常获取'})
          } else {
            _this.$notify.error({title: '错误：', message: '无法获取该报告基本内容'})
          }

        }).catch(function (err) {
          console.log('接口异常：' + findReportUrl, err)
        });
      },

//      当eltree 触发node-click时 ， 将选择的节点数据绑定到thisReport.selectNode 上
      changeSelectNode: function (data, e) {
        this.$message.info('选择的是《' + data.text + '》');
//        console.log(data);
//        console.log(e);
        this.thisReport.selectNode = data;
      },
      addTitle: function (type) {
        let node = this.thisReport.selectNode;

//        console.log(node);

        /*
        * 参数说明：
        * node 节点
        * type 操作类型：
        *   1  进行子标题的创建，默认自动追加到最后一个子标题
        *   2  插入兄弟标题,根据获取标题自动向后插入
        *
        *   4 修改标题内容
        *
        * */
//        对参数进行校验
        if (!node) {
          this.$message.error('错误：未选择标题节点');
          return false;
        }
        if (!type) {
          this.$message.error('错误:未传入type类型，无法准确获知您的意图');
          return false;
        }

//        node.type为标题才允许创建子标题
        if (node.type != 'title') {
          this.$message.error('错误:非标题，无法创建子标题');
          return false;
        }


        let ename = node.ename;
        let id = node.id;
        let pid = node.pid;
        let text = node.text;


        let _this = this;

//        创建子标题  1
        if (type == 1) {

          let url = _this.serverPath.ip_port + _this.serverPath.addChildrenTitle;
          let params = {
            params: {
              name: '未填写标题',
              project_num: _this.eName,
              pid: id
            }
          };

          _this.$prompt('请输入标题名称', '为《' + text + '》添加子标题：', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
//            inputPattern: /正则/,
            inputErrorMessage: '标题格式不正确'
          }).then(function (v) {
            params.params.name = v.value;
            axios(url, params).then(function (res) {
              if (res.data === 'success') {
                _this.$notify.success({title: '成功：', message: '标题添加成功'})
                _this.getReportTree();
              } else {
                _this.$notify.error({title: '错误：', message: '添加子标题的请求已经提交，后台返回错误：' + res.data, duration: 0})
              }
            }).catch(function (err) {
              console.log('接口异常：' + url, err)
            });


          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });


        }


//        插入标题,根据获取标题自动向后插入  2
        if (type == 2) {

          let url = _this.serverPath.ip_port + _this.serverPath.addChildrenTitle;
          let params = {
            params: {
              chapterid: id,             //章节插入位置的上一个章节的id
              name: '未填写标题名称',      //章节名称
              pid: pid,                 //章节所属上街id
              project_num: _this.eName //章节所属报告的英文名
            }
          };

          _this.$prompt('请输入标题名称', '在《' + text + '》后追加标题', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
//            inputPattern: /正则/,
            inputErrorMessage: '标题格式不正确'
          }).then(function (v) {
            params.params.name = v.value;
            axios(url, params).then(function (res) {
              if (res.data === 'success') {
                _this.$notify.success({title: '成功：', message: '追加标题成功'})
                _this.getReportTree();
              } else {
                _this.$notify.error({title: '错误：', message: '追加兄弟标题请求已经提交，后台返回 error：' + res.data, duration: 0})
              }
            }).catch(function (err) {
              console.log('接口异常：' + url, err)
            });


          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });


        }


//        修改标题内容  4
        if (type == 4) {

          let url = _this.serverPath.ip_port + _this.serverPath.addChildrenTitle;
          let params = {
            params: {
              name: '未填写标题',
              project_num: _this.eName,
              pid: pid,
              id: id
            }
          };

          _this.$prompt('请输入标题名称', '修改标题《' + text + '》的名称', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
//            inputPattern: /正则/,
            inputErrorMessage: '标题格式不正确'
          }).then(function (v) {
            params.params.name = v.value;
            axios(url, params).then(function (res) {
              if (res.data === 'success') {
                _this.$notify.success({title: '成功：', message: '标题修改成功'})
                _this.getReportTree();
              } else {
                _this.$notify.error({title: '错误：', message: '标题修改请求已经提交，后台返回错误：' + res.data, duration: 0})
              }
            }).catch(function (err) {
              console.log('接口异常：' + url, err)
            });


          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });


        }


      },
      showDialog: function (v, componentType) {
        if (v && this.checkSelectedNode()) {
            this.componentsData.dialogVisible = true;
        } else {
          this.componentsData.dialogVisible = false;
        }
        if (componentType) {
          this.selectComponent = componentType;

          if (componentType === '文字') {
            this.componentsData.ajaxData = this.deepCopy(this.componentsData.paragraph);
          } else if (componentType === '图片') {
            this.componentsData.ajaxData = this.deepCopy(this.componentsData.img);
          } else if (componentType === '表格') {
            this.componentsData.ajaxData = this.deepCopy(this.componentsData.table);
          } else {
            this.$message.error('错误！无法识别想要调用的组件类型，无法复制数据模型------showDialog()')
          }

        }
      },
      checkSelectedNode: function (v) {
//        '未传入参数时自动选用已经选择的节点'
        if (v === undefined) {
          v = this.thisReport.selectNode;
        }

        if (v) {
          return v
        } else {
          this.$message.error('未选择到文档节点，请选选择');
          return undefined
        }

      },
      addComponent: function () {

        let url = this.serverPath.ip_port + this.serverPath.saveComponent;

        let node = this.thisReport.selectNode;
        let componentType = this.selectComponent;
        console.log(componentType);

        console.log('组件的修改状态是否激活:' , this.reviseComponentFlag);


        let reportEname = this.thisReport.base.ename;
        let ename = node.ename;
        let id = node.id;
        let pid = node.pid;
        let text = node.text;
        let _this = this;


        function successDo(componentType) {
          if (!componentType) {
            let componentType = ''
          }
          _this.componentsData.ajaxData = '';
          _this.showDialog(0);
          _this.$notify.success({title: '成功：', message: componentType + '组件添加成功'});
          _this.getReportTree();
        }


//     预处理保存组件的请求数据
        let params = {params: _this.componentsData.ajaxData};

//        是否为修改组件内容的请求
        if(_this.reviseComponentFlag){
          // 修改组件时需要将当前选中的组件的id 和pid 作为参数传入
          params.params.id = id;
          params.params.pid = pid;

        }else{
          // 点击标题新增组件时，需要将标题的id作为组件的pid 作为参数传入
          params.params.pid = id;

        }
        params.params.project_num = reportEname;




//        文本提交
        if (componentType == '文字') {

          axios(url, params).then(function (res) {
            if (res.data === 'success') {
              successDo('文字')
            } else {
              _this.$notify.error({title: '错误：', message: '文本组件的添加请求已经提交，后台返回 error:' + res.data, duration: 0})
            }
          }).catch(function (err) {
            console.log('接口异常：' + url, err)
          });

        }
//        图片组件提交
        if (componentType == '图片') {


          axios(url, params).then(function (res) {
            if (res.data === 'success') {
              successDo('图片')
            } else {
              _this.$notify.error({title: '错误：', message: '图片组件的添加请求已经提交，后台返回 error:' + res.data, duration: 0})
            }
          }).catch(function (err) {
            console.log('接口异常：' + url, err)
          });

        }
//        表格组件提交
        if (componentType === '表格') {


          axios(url, params).then(function (res) {
            if (res.data === 'success') {
              successDo('表格')
            } else {
              _this.$notify.error({title: '错误：', message: '表格组件的添加请求已经提交，后台返回 error:' + res.data, duration: 0})
            }
          }).catch(function (err) {
            console.log('接口异常：' + url, err)
          });

        }

        this.reviseComponentFlag = false ;
        console.log('组件的修改状态是否激活:' , this.reviseComponentFlag);

      },
      deleteSelectedNode: function () {
        if(!this.checkSelectedNode()){
          this.$message.error('错误：')
          return false
        }
        let node = this.thisReport.selectNode;
        // 不提供删除报告目录的功能 , 报告目录节点的pic 为字符串 -1
        if( node.pid === '-1' ){
          this.$message.error('错误：报告的根目录是不应该删除的！');
          return
        }


        let id = node.id;
        let type = node.type;
        let delComponentUrl = this.serverPath.ip_port + this.serverPath.delComponent;
        let delTitleUrl = this.serverPath.ip_port + this.serverPath.delTitle;
        let url = '';
        if (type === 'title') {
          url = delTitleUrl;
        } else {
          url = delComponentUrl;
        }


        let _this = this;

        _this.$confirm('您正在进行标题或组件的删除操作,请确认...' , '警告：' , {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'danger'
        }).then(()=>{

          axios(url, {params: {id: id}}).then(function (res) {
            if (res.data === 'success') {
              _this.getReportTree();
              _this.$notify.success({title: '成功：', message: type + '删除成功'});

            } else {
              _this.$notify.error({title: '错误：', message: '删除的请求已经提交，后台返回 error:' + res.data})
            }
          }).catch(function (err) {
            console.log('接口异常：' + url, err)
          });

        }).catch(()=>{
            _this.$message.info( '提示： 取消删除');
          }
        )





      },
      uploadFile: function (v) {
        /*
        * v 代表上传的方法类型
        * v === 1 组件内上传 , 需要将后台的返回路径值绑定到数据模型componentsData.ajaxData.path
        *
        *
        *
        * */

        if (!this.selectedFile) {
          this.$message.error('未选择需要上传的文件');
          return
        }

        let url = this.serverPath.ip_port + this.serverPath.filesUpload + '?ename=' + this.eName + '&filename=' + this.selectedFile.name

        let formFile = new FormData();
        formFile.append("file", this.selectedFile);

        let _this = this;

        axios.post(url, formFile).then(function (res) {
//          console.log( res )
          if (res.data !== 'error') {

            if (!_this.componentsData.ajaxData) {
              _this.$message.error('错误！componentsData.ajaxData无数据模型！------ uploadFile()');
              return false
            }

            if (v === 1) {
              _this.componentsData.ajaxData.path = res.data;
            }

            _this.$notify.success({
              title: '成功：',
              message: _this.selectedFile.name + '上传成功。文件位置提示：' + res.data
            })
          } else {
            _this.$notify.error({
              title: '错误：', message: _this.selectedFile.name + '上传失败。错误提示提示：' + res.data,
              duration: 0
            })
          }

        }).catch(function (err) {
          console.log('文件上传请求错误' + err)
        })


      },

      getFile: function (e) {
        this.selectedFile = e.target.files[0]
      },
//      修改组件内容
      reviseComponent: function () {

//        修改组件内容的时候，修改状态为 true
        this.reviseComponentFlag = true ;

        // 获取当前选中节点
        let node = this.thisReport.selectNode;
        // 如果未选中节点，终止操作
        if(!node){
          this.$message.error('未选中任何节点，无法进行修改操作')
          return false
        }
        // 如果节点类型type 不是 conponent, 终止操作
        if( node.type !== 'conponent' ){
          this.$message.error('当前选中非组件节点，无法进行下一步操作')
          return false
        }

        let id = node.id;
        let text = node.text;  // 文本 、 图片 、 表格

        let _this = this;

        let url_findByComponentId = this.serverPath.ip_port + this.serverPath.findComponentById ;
        let url_saveComponent  = this.serverPath.ip_port + this.serverPath.saveComponent;

//        发送ajax请求，获取当前选中组件的数据
        axios(url_findByComponentId , { params:{id:id } } ).then(function (res) {
          if (res.data !== 'error' ) {
            _this.showDialog( 1 , text);
            _this.componentsData.ajaxData = res.data;

          } else {
            _this.$notify.error({title: '错误：', message: '查询组件信息的请求已经提交，后台返回 error:' + res.data, duration: 0})
          }
        }).catch(function (err) {
          console.log('接口异常：' + url, err)
        });

      }
    }
  }

</script>

<style  lang="less">
  .edit {

    padding: 50px 30px 0 30px;
    height: 100%;
    width: 100%;
    overflow: hidden;
    &-content {
      /*background: orangered;*/
      height: 100%;
      overflow: hidden;
      &-left {
        /*background: deepskyblue;*/
        box-sizing: border-box;
        height: 100%;
        overflow-y: auto;
        padding-right: 20px;
        background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.1));
        background-size: 1px 700px;
        background-repeat: no-repeat;
        background-position: right center;
        #reportTree {
          margin-top: 10px;
          color: #303133;
          background: rgba(255, 255, 255, 0.7) !important;

        }

      }
      &-right {
        padding-left: 20px;
        /*background: salmon;*/
        height: 100%;

      }
    }



  }
  .el-textarea{

    height: 150px !important;
    textarea{
      height: 150px !important;
    }

  }




</style>
