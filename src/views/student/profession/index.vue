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
          <el-form-item label="学院：">
            <el-select v-model="listQuery.facultyId" placeholder="请选择学院" clearable filterable>
              <el-option
                v-for="item in facultyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>专业数据</span>
      <!--<el-button class="btn-add" type="danger" @click="handleDelete()" size="mini">删除</el-button>-->
      <el-button
        class="btn-add"
        @click="profession = {
            facultyVo:{},
            teacher:{}
      };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入专业信息
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
        <el-table-column label="编号" align="center">
          <template slot-scope="scope">{{scope.row.coding}}</template>
        </el-table-column>
        <el-table-column label="专业名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="系主任" align="center">
          <template slot-scope="scope">{{getTheacher(scope.row.departmentId).name}}</template>
        </el-table-column>
        <!--<el-table-column label="学院" align="center">-->
        <!--<template slot-scope="scope">{{scope.row.name}}</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="profession = scope.row;editDialog = true;profession.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="profession = scope.row;editDialog = true;dialogTitle='编辑';profession.type='edit'"
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
      title="上传专业信息"
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


    <el-dialog :title="dialogTitle" :visible.sync="editDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="编号">
          <el-input v-model="profession.coding" :disabled="profession.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="专业名称">
          <el-input v-model="profession.name" :disabled="profession.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="学院：">
          <el-select
            v-model="profession.facultyId"
            placeholder="请选择学院"
            clearable
            filterable
            :disabled="profession.type == 'see'"
          >
            <el-option
              v-for="item in facultyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指导老师：">
          <el-select
            v-model="profession.departmentId"
            placeholder="请选指导老师"
            clearable
            filterable
            :disabled="profession.type == 'see'"
          >
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="profession.type != 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    fetchFacultyList,
    fetchTeacherList,
    create,
    update,
    _delete
  } from "@/api/profession";

  import {Message, MessageBox} from 'element-ui'
  import {uploadProfession} from '@/config/config'

  const defaultListQuery = {
    keyword: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5
  };
  export default {
    name: "professionList",
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
        teacherList: [],
        editDialog: false,
        profession: {
          facultyVo: {},
          teacher: {}
        },
        dialogTitle: "",
        showImportTask: false,
        uploadUrl: uploadProfession
      };
    },
    created() {
      this.getFetchTeacherList();
      this.getList();
      this.getFacultyList();
    },
    watch: {},
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire += ` and (coding like '%${
            this.listQuery.keyword
            }%' or name like '%${this.listQuery.keyword}%') `)
          : "";
        this.listQuery.facultyId
          ? (this.listQuery.quire += ` and facultyId = ${
            this.listQuery.facultyId
            }`)
          : "";
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.data;
          this.total = response.data.total;
        });
      },
      getFacultyList() {
        fetchFacultyList({}).then(result => {
          this.facultyList = result.data.data;
        });
      },
      getFetchTeacherList() {
        fetchTeacherList({
          quire: `and 1 = 1`
        }).then(result => {
          this.teacherList = result.data.data;
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
        this.getList();
      },
      getTheacher(id) {
        var teacherList = this.teacherList.filter(t => t.id === id)[0];
        if (teacherList) {
          return teacherList;
        }
        var tempTeacher = {
          name: '无'
        };
        return tempTeacher;
      },
      handleDelete(index, row) {
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = row ? [row.id] : [];
          this.multipleSelection.forEach(row => ids.push(row.id));
          console.log(ids)
          _delete({
            ids: ids.toString()
          }).then(r => {
            this.getList();
          });
        });
      },
      edit() {
        let profession = this.profession;
        if (profession.id) {
          update(this.profession).then(result => {
            this.editDialog = false;
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          });
        }
        // 添加专业
        else {
          create(this.profession).then(result => {
            this.editDialog = false;
            this.getList();
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          });
        }
      }, uploadTaskSuccess() {
        this.$message({
          message: '专业上传成功',
          type: 'success'
        });
        this.getList();
      }, uploadTaskError() {
        this.$message({
          message: '专业上传失败',
          type: 'error'
        });
      }
    }
  };
</script>

