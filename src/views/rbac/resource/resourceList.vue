<template>
  <div>
    <!--删除提示框-->
    <div style="height: 500px; overflow-y: scroll;">
      <el-dialog
        title="删除资源"
        :visible.sync="deletePopoverView"
        width="30%">
        <span>是否要删除该资源配置</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="deletePopoverView = false">取 消</el-button>
        <el-button type="primary" @click="deleteClick">确 定</el-button>
      </span>
      </el-dialog>
    </div>

    <!--更新数据展示-->
    <div>
      <el-dialog title="更新资源信息" :visible.sync="updatePopoverView">
        <el-form :label-position="labelPosition" label-width="80px" :model="updateResource">
          <el-form-item label="名称">
            <el-input v-model="updateResource.name"></el-input>
          </el-form-item>
          <el-form-item label="请求地址">
            <el-input placeholder="请输入资源地址" v-model="updateResource.url">
              <template slot="prepend">{{this.baseUrl}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="请求方法">
            <el-checkbox-group v-model="updateResource.method">
              <el-checkbox label="GET" name="method"></el-checkbox>
              <el-checkbox label="POST" name="method"></el-checkbox>
              <el-checkbox label="PUT" name="method"></el-checkbox>
              <el-checkbox label="DELETE" name="method"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="使用描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3}"
              placeholder="请输入内容"
              v-model="updateResource.description">
            </el-input>
          </el-form-item>
          <el-form-item label="资源配置">
            <el-col :span="6">
              <el-form-item label="匿名访问">
                <el-switch v-model="updateResource.permissionAll"></el-switch>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="6">
              <el-form-item label="开关">
                <el-switch v-model="updateResource.use"></el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePopoverView = false">取 消</el-button>
          <el-button type="primary" @click="updatePopoverView = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--添加资源-->
    <div>
      <el-dialog title="添加资源" :visible.sync="addResourcePopoverView">
        <el-form :label-position="labelPosition" label-width="80px" :model="addResourceModel">
          <el-form-item label="名称">
            <el-input v-model="addResourceModel.name"></el-input>
          </el-form-item>
          <el-form-item label="请求地址">
            <el-input placeholder="请输入资源地址" v-model="addResourceModel.url">
              <template slot="prepend">{{this.baseUrl}}</template>
            </el-input>
          </el-form-item>
          <el-form-item label="请求方法">
            <el-checkbox-group v-model="addResourceModel.method">
              <el-checkbox label="GET" name="method"></el-checkbox>
              <el-checkbox label="POST" name="method"></el-checkbox>
              <el-checkbox label="PUT" name="method"></el-checkbox>
              <el-checkbox label="DELETE" name="method"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="使用描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3}"
              placeholder="请输入内容"
              v-model="addResourceModel.description">
            </el-input>
          </el-form-item>
          <el-form-item label="资源配置">
            <el-col :span="6">
              <el-form-item label="匿名访问">
                <el-switch v-model="addResourceModel.permissionAll"></el-switch>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1">&nbsp;</el-col>
            <el-col :span="6">
              <el-form-item label="开关">
                <el-switch v-model="addResourceModel.use"></el-switch>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRolePopoverView = false">取 消</el-button>
          <el-button type="primary" @click="addResourceRun">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--搜索框-->
    <div style="justify-items: center;margin-top: 15px;margin-left: 13%">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div>
                <el-input placeholder="请输入内容" v-model="selectValue" class="input-with-select">
                  <el-select v-model="selectType" slot="prepend" placeholder="请选择查询类型">
                    <el-option label="名称" value="role"></el-option>
                    <el-option label="请求路径" value="url"></el-option>
                    <el-option label="请求方法" value="method"></el-option>
                    <el-option label="匿名访问" value="permissionAll"></el-option>
                  </el-select>
                  <el-button slot="append" icon="el-icon-search"
                             @click="selectInfo(selectValue,selectType)"></el-button>
                </el-input>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <div style="margin-left: 10%;margin-right: 0px">
              <el-row>
                <el-button type="success" @click="addResourceBtn">添加资源</el-button>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <div style="margin-left: 0px">
              <el-row>
                <el-button type="danger">批量删除</el-button>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!--表格展示-->
    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称"
        width="120">
      </el-table-column>
      <el-table-column
        prop="url"
        label="请求地址"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="method"
        label="请求方法">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>描述可以使用的http请求方法</p>
            <div slot="reference" class="name-wrapper">
              <div v-for="item in scope.row.method" style="display: inline-block">
                <el-tag size="mini">{{item}}</el-tag>
              </div>
            </div>
          </el-popover>
        </template>
      </el-table-column>


      <el-table-column
        prop="description"
        label="使用描述"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        label="匿名访问" prop="permissionAll" :formatter="permissionAllFormtter">
      </el-table-column>
      <el-table-column
        prop="use"
        label="开关"
        :formatter="userFormatter">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDeletePopover(scope.row)">删除</el-button>
          <el-button @click="showUpdatePopover(scope.row)" type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--表格分页-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currPage"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  import {fetchList, deleteProductAttr} from '@/api/resourceList'
  import {deleteResourceById} from "../../../api/resourceList";
  import {getBaseUrl} from "../../../utils/request"


  export default {
    name: 'resourceList',
    inject: ['reload'],
    data() {
      return {
        list: null,
        total: null,
        multipleSelection: [],
        deletePopoverView: false,
        updatePopoverView: false,
        tempData: null,
        // 表示表单如何展示
        labelPosition: 'right',
        // 表单数据对象
        updateResource: {
          url: '',
          name: '',
          description: '',
          method: [],
          permissionAll: '',
          use: ''
        },
        // 分页当前页
        page: {
          currPage: 1,
          total: 20
        },
        // 基础url
        baseUrl: getBaseUrl(),
        selectValue: null,
        selectTypes: [
          {
            label: "角色",
            type: "role"
          }, {
            label: "请求路径",
            type: "url"
          }, {
            label: "请求方法",
            type: "method"
          }, {
            label: "匿名使用",
            type: "permissionALl"
          }
        ],
        selectType: '',
        addResourceModel: {
          url: '',
          name: '',
          description: '',
          method: [],
          permissionAll: false,
          use: true
        },
        addResourcePopoverView: false
      }
    },
    created() {
      this.getList();
    },
    methods: {
      // 获取数据列表信息
      getList() {
        fetchList(this.page.currPage, this.page.total).then(response => {
          if (response.code === 200) {
            this.list = response.data;
            this.total = response.count;
            console.log("获取到的数据为", this.list)
          }
        });
      },
      // 将数据进行转换
      permissionAllFormtter(row) {
        if (row.permissionAll) {
          return "可匿名访问"
        }
        return "不可匿名访问"
      },
      userFormatter(row) {
        if (row.use) {
          return "开启"
        }
        return "关闭"
      },
      // 删除指定数据
      deleteClick() {
        this.deletePopoverView = false;
        console.log("需要删除的值", this.tempData)
        deleteResourceById(this.tempData.id).then(response => {
          console.log("删除响应信息", response)
        });
        this.reload();
      },
      // 全选后加载数据
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 显示删除提示框
      showDeletePopover(row) {
        this.deletePopoverView = true;
        this.tempData = row;
      },
      // 显示原始的信息，并更新该数据的值的显示框
      showUpdatePopover(row) {
        console.log("更新信息", row)
        this.updatePopoverView = true;
        this.tempData = row;
        this.updateResource = row;
      },
      // 触发添加框展示
      addResourceBtn(){
        this.addResourcePopoverView = true;
      },
      // 执行添加动作
      addResourceRun(){
        this.addResourcePopoverView = false;
        console.log("获取到的添加数据",this.addRoleModel)
      },
      // 分页显示页面
      handleSizeChange(pageSize) {
        console.log("当前分页数量", pageSize)
      },
      // 处理当前页改变
      handleCurrentChange(currPage) {
        console.log("当前页信息", currPage)
      },
      // 搜索处理
      selectInfo(data, type) {
        console.log("搜索携带的数据为", data, type)
      }
    }
  }
</script>

<style>
  .el-select .el-input {
    width: 130px;
  }

  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }

  .el-row {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>


