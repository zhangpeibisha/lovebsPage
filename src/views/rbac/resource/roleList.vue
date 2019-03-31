<template>
  <div>
    <!--删除提示框-->
    <div>
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
        <el-form :label-position="labelPosition" label-width="80px" :model="updateRole">
          <el-form-item label="名称">
            <el-input v-model="updateRole.name"></el-input>
          </el-form-item>

          <el-form-item label="使用描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3}"
              placeholder="请输入内容"
              v-model="updateRole.description">
            </el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="updatePopoverView = false">取 消</el-button>
          <el-button type="primary" @click="updatePopoverView = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--添加角色-->
    <div>
      <el-dialog title="添加角色" :visible.sync="addRolePopoverView">
        <el-form :label-position="labelPosition" label-width="80px" :model="addRoleModel">
          <el-form-item label="名称">
            <el-input v-model="addRoleModel.name"></el-input>
          </el-form-item>
          <el-form-item label="使用描述">
            <el-input
              type="textarea"
              :autosize="{ minRows: 1, maxRows: 3}"
              placeholder="请输入内容"
              v-model="addRoleModel.description">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRolePopoverView = false">取 消</el-button>
          <el-button type="primary" @click="addRoleRun">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <!--搜索框-->
    <div style="justify-items: center;margin-top: 15px;margin-left: 15%">
      <el-row :gutter="20">
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <div class="grid-content bg-purple">
              <div>
                <el-input placeholder="请输入内容" v-model="selectValue" class="input-with-select">
                  <el-select v-model="selectType" slot="prepend" placeholder="请选择查询类型">
                    <el-option label="名称" value="role"></el-option>
                    <el-option label="描述" value="url"></el-option>
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
            <div style="margin-left: 10%;margin-right: 0">
              <el-row>
                <el-button type="success" @click="addRoleBtn">添加角色</el-button>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content">
            <div style="margin-left: 0">
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
        prop="description"
        label="角色描述"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        prop="updateTime"
        label="更新时间"
        show-overflow-tooltip>
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
  import {fetchList} from '../../../api/roleList'


  export default {
    name: 'roleList',
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
        updateRole: {
          name: '',
          description: '',
          resources: []
        },
        // 分页当前页
        page: {
          currPage: 1,
          total: 20
        },
        selectValue: null,
        selectType: '',
        addRoleModel: {
          name: '',
          description: '',
          resources: []
        },
        addRolePopoverView: false
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
            this.list = response.roles;
            this.total = response.count;
            console.log("获取到的数据为", this.list)
          }
        });
      },
      // 删除指定数据
      deleteClick() {
        this.deletePopoverView = false;
        console.log("需要删除的值", this.tempData);
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
      addRoleBtn() {
        this.addRolePopoverView = true;
        console.log("添加信息")
      },
      // 执行添加动作
      addRoleRun() {
        this.addRolePopoverView = false;
        console.log("获取到的添加数据", this.addRoleModel)
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


