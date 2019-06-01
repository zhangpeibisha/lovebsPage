<template>
  <div class="app-container"
       style="height: 500px; overflow-y: scroll;">
    <el-card class="filter-container"
             shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float: right"
                   @click="getList()"
                   type="primary"
                   size="small">查询结果
        </el-button>
        <el-button style="float: right;margin-right: 15px"
                   @click="handleResetSearch()"
                   size="small">重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true"
                 :model="listQuery"
                 size="small"
                 label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px"
                      v-model="listQuery.keyword"
                      placeholder="关键字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container"
             shadow="never">
      <i class="el-icon-tickets"></i>
      <span>学院数据</span>
      <!--<el-button class="btn-add"-->
      <!--type="danger"-->
      <!--@click="handleDelete(0,0,true)"-->
      <!--size="mini">删除-->
      <!--</el-button>-->
      <el-button class="btn-add"
                 @click="editDialog = true;faculty = {};dialogTitle='添加'"
                 size="mini">添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入学院信息
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border>
        <el-table-column type="selection"
                         width="60"
                         align="center"></el-table-column>

        <el-table-column label="编号"
                         align="center">
          <template slot-scope="scope">{{scope.row.coding}}</template>
        </el-table-column>
        <el-table-column label="学院名称"
                         align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="院长"
                         align="center">
          <template slot-scope="scope">{{!scope.row.dean?'无':scope.row.dean.name}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini"
                       @click="faculty = scope.row;editDialog = true;faculty.type = 'see';dialogTitle='查看'">查看
            </el-button>
            <el-button size="mini"
                       @click="faculty = scope.row;editDialog = true;
                       dialogTitle='编辑';faculty.type='edit';
                       faculty.dean.accountId=''">编辑
            </el-button>
            <!--<el-button size="mini"-->
            <!--type="danger"-->
            <!--@click="handleDelete(scope.$index, scope.row,false)">删除-->
            <!--</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     layout="total, sizes,prev, pager, next,jumper"
                     :page-size="listQuery.limit"
                     :page-sizes="[5,10,15]"
                     :current-page.sync="listQuery.page"
                     :total="total"></el-pagination>
    </div>
    <el-dialog :title="dialogTitle"
               :visible.sync="editDialog"
               width="30%">
      <el-form label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="faculty.coding"
                    :disabled="faculty.type === 'see'"></el-input>
        </el-form-item>
        <el-form-item label="学院名">
          <el-input v-model="faculty.name"
                    :disabled="faculty.type === 'see'"></el-input>
        </el-form-item>
        <el-form-item label="院长">
          <el-select
            v-model="faculty.dean.accountId"
            placeholder="请选院长"
            clearable
            filterable
            :disabled="faculty.type === 'see'"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.accountId"
              :label="item.name"
              :value="item.accountId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer"
            v-if="faculty.type !== 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary"
                   @click="edit()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="上传学院信息"
      :visible.sync="showImportTask"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        :on-success="uploadTaskSuccess"
        :on-error="uploadTaskError"
        :action='uploadUrl'
        multiple
        headers="{'Content-Type':'application/x-www-form-urlencoded'}"
        name="faculty">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showImportTask = false">确 定</el-button>
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
  import {findById as teacherFindById} from "@/api/teacher";
  import {uploadFaculty} from '@/config/config'
  import {fetchTeacherList} from "@/api/profession";

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
          name: '',
          dean: {
            accountId: 0,
            name: ''
          }
        },
        dialogTitle: "",
        importDia: false,
        showImportTask: false,
        uploadUrl: uploadFaculty,
        teacherList: []
      };
    },
    created() {
      this.getFetchTeacherList();
      this.getList();
    },
    watch: {},
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1";
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
      getFetchTeacherList() {
        fetchTeacherList({
          quire: `and 1 = 1`
        }).then(result => {
          this.teacherList = result.data.data;
        });
      },
      uploadSuccess() {
        this.importDia = false;
        this.$message({
          message: '学院信息上传成功',
          type: 'success'
        });
        this.getList();
      },
      uploadError() {
        console.log("error");
        this.$message({
          message: '学院信息上传失败',
          type: 'error'
        });
      },
      handleDelete(index, row, batch) {
        console.log("index=", index);
        console.log("row=", row);
        console.log("batch", batch)

        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids_delete = [];
          if (!batch) {
            ids_delete.push(row.id);
            console.log("获取的值为:", ids_delete)
          }
          this.multipleSelection.forEach(row => ids_delete.push(row.id));
          console.log("选中的row", this.multipleSelection)
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
          const updateValue = {};
          updateValue.coding= this.faculty.coding;
          updateValue.dean= this.faculty.dean.accountId;
          updateValue.id= this.faculty.id;
          updateValue.name= this.faculty.name;
          update(updateValue).then(result => {
            console.log("编辑学院结果返回", result);
            // 关闭窗口
            this.editDialog = false;
            this.$message({
              message: '学院信息编辑成功',
              type: 'success'
            });
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
      }, uploadTaskSuccess() {
        this.$message({
          message: '学院信息上传成功',
          type: 'success'
        });
        this.getList();
      }, uploadTaskError() {
        this.$message({
          message: '学院信息上传失败',
          type: 'error'
        });
      }
    }
  };
</script>
<style>
  .upload-demo {
    text-align: center;
  }
</style>


