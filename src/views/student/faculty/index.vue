<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right" @click="getList()" type="primary" size="small">查询结果</el-button>
        <el-button
          style="float: right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small"
        >重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>学院数据</span>
      <el-button class="btn-add" type="danger" @click="handleDelete(0,0,true)" size="mini">删除</el-button>
      <el-button
        class="btn-add"
        @click="editDialog = true;faculty = {};dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        ref="facultyTable"
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>

        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.coding}}</template>
        </el-table-column>
        <el-table-column label="学院名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="faculty = scope.row;editDialog = true;faculty.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="faculty = scope.row;editDialog = true;dialogTitle='编辑';faculty.type='edit'"
            >编辑
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row,false)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.limit"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.page"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="editDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="faculty.coding" :disabled="faculty.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="学院名">
          <el-input v-model="faculty.name" :disabled="faculty.type == 'see'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="faculty.type != 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    create,
    update,
    _delete
  } from "@/api/faculty";

  const defaultListQuery = {
    key: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5
  };
  export default {
    data() {
      return {
        editSkuInfo: {
          dialogVisible: false,
          keyword: null
        },
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        editDialog: false,
        faculty: {
          coding: '',
          name: ''
        },
        dialogTitle: ""
      };
    },
    created() {
      this.getList();
    },
    watch: {},
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1"
        this.listQuery.keyword
          ? (this.listQuery.quire +=
            ` and (coding like '%${this.listQuery.keyword}%' or name like '%${
              this.listQuery.keyword
              }%')`)
          : "";
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.data;
          this.total = response.data.total;
        })
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getList();
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleDelete(index, row,batch) {
        console.log("index=", index);
        console.log("row=", row);
        console.log("batch",batch)

        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids_delete = [];
          if (!batch){
            ids_delete.push(row.id);
            console.log("获取的值为:",ids_delete)
          }
          this.multipleSelection.forEach(row => ids_delete.push(row.id));
          console.log("选中的row",this.multipleSelection)
          _delete(
            ids_delete
          ).then(result => {
            console.log("删除返回结果", result);
            this.getList();
          });
        });
      },
      edit() {
        let faculty = this.faculty;
        // 编辑学院信息
        if (faculty.id) {
          update(this.faculty).then(result => {
            console.log("编辑学院结果返回", result);
            // 关闭窗口
            this.editDialog = false;
            this.getList();
          });
        }
        // 添加学院
        else {
          create(this.faculty).then(result => {
            console.log("添加学院结果返回", result);
            // 关闭窗口
            this.editDialog = false;
            this.getList();
          });
        }
      }
    }
  };
</script>


