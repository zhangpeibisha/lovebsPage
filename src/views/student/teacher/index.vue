<template>
  <div class="app-container" style="height: 500px; overflow-y: scroll;">
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
          <el-form-item label="工号：">
            <el-input style="width: 203px" v-model="listQuery.jobNumber" placeholder="工号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="姓名"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>老师数据</span>
      <!--<el-button class="btn-add" type="danger" @click="handleDelete()" size="mini">删除</el-button>-->
      <el-button
        class="btn-add"
        @click="teacher = {
       };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入老师信息
      </el-button>

      <el-button
        class="btn-add" type="success" @click="showConfigTeacher=true" size="mini">为学院、专业、班级配置老师
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="listLoading"
        border
      >
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img style="height: 80px;width:80px;" :src="scope.row.imageUrl">
          </template>
        </el-table-column>
        <el-table-column label="工号" align="center">
          <template slot-scope="scope">{{scope.row.jobNumber}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.phone}}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="teacher = scope.row;editDialog = true;teacher.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="teacher = scope.row;editDialog = true;dialogTitle='编辑';teacher.type='edit'"
            >编辑
            </el-button>
            <!--<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>-->
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


    <el-dialog
      title="上传老师信息"
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
        name="teacher">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showImportTask = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="为学院、专业、班级配置老师"
      :visible.sync="showConfigTeacher"
      width="30%">
      <el-upload
        class="upload-demo"
        drag
        :on-success="uploadTaskSuccess"
        :on-error="uploadTaskError"
        :action='configTeacherUrl'
        multiple
        headers="{'Content-Type':'application/x-www-form-urlencoded'}"
        name="configTeacher">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showConfigTeacher = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="dialogTitle" :visible.sync="editDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="工号">
          <el-input v-model="teacher.jobNumber" :disabled="teacher.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="teacher.name" :disabled="teacher.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="teacher.phone" :disabled="teacher.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="teacher.email" :disabled="teacher.type == 'see'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="teacher.type != 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    findTeacherList,
    update,
    _delete,
    createTeacher
  } from "@/api/teacher";
  import {uploadTeacherUrl,uploadConfigTeacherUrl} from '@/config/config'

  const defaultListQuery = {
    key: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5
  };
  export default {
    name: "studentList",
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
        facultyList: [],
        professionList: [],
        classes: [],
        editDialog: false,
        teacher: {},
        dialogTitle: "",
        showImportTask: false,
        uploadUrl: uploadTeacherUrl,
        showConfigTeacher:false,
        configTeacherUrl:uploadConfigTeacherUrl
      };
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire +=
          ` and (name like '%${this.listQuery.keyword}%' or jobNumber like '%${this.listQuery.keyword}%' `
          +
          `or phone like '%${this.listQuery.keyword}%'  or email like '%${this.listQuery.keyword}%')`)
          : "";
        this.listQuery.jobNumber
          ? (this.listQuery.quire += ` and jobnumber = ${
            this.listQuery.jobNumber
            }`)
          : "";
        this.listQuery.name
          ? (this.listQuery.quire += ` and name = '${this.listQuery.name}'`)
          : "";
        findTeacherList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.data;
          this.total = response.data.total;
          console.log("获取到的数据为：", response)
        });
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
      },
      handleDelete(index, row) {
        console.log("index=", index, row);
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = [];
          if (row) {
            console.log("index====", index, row)
            ids.push(row.id)
          }
          this.multipleSelection.forEach(row => ids.push(row.id))
          _delete(
            ids
          );
          this.getList();
        });
      },
      edit() {
        let teacher = this.teacher;
        console.log("返回的数据为：==================", teacher);
        // 编辑老师信息
        if (teacher.id) {
          update(this.teacher).then(result => {
            console.log("返回的数据为：", result);
            this.$message({
              message: '编辑成功',
              type: 'success'
            });
            this.getList()
          });
        }
        // 添加老师
        else {
          createTeacher([this.teacher]).then(result => {
            console.log("返回的数据为：", result);
          });
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.getList()
        }
        this.editDialog = false
      }, uploadTaskSuccess() {
        this.$message({
          message: '上传成功',
          type: 'success'
        });
      }, uploadTaskError() {
        this.$message({
          message: '上传失败',
          type: 'error'
        });
      }
    }
  };
</script>

<style>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>


