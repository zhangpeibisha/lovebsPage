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
            <el-select
              v-model="listQuery.facultyId"
              placeholder="请选择学院"
              clearable
              filterable
              @change="listQuery.professionId = null;getProfessionList()"
            >
              <el-option
                v-for="item in facultyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="专业：">
            <el-select v-model="listQuery.professionId" placeholder="请选择专业" clearable filterable>
              <el-option
                v-for="item in professionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>


    <el-dialog
      title="上传班级信息"
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
        name="classFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showImportTask = false">确 定</el-button>
      </span>
    </el-dialog>


    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>班级数据</span>
      <!--<el-button class="btn-add" type="danger" @click="handleDelete()" size="mini">删除</el-button>-->
      <el-button
        class="btn-add"
        @click="classModel = {
             profession: {
              faculty: {

              }
          },
          teacher: {}
      };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入班级信息
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
          <template slot-scope="scope">{{scope.row.classCoding}}</template>
        </el-table-column>
        <el-table-column label="指导老师" align="center">
          <template slot-scope="scope">{{scope.row.teacher ? scope.row.teacher.name : "无"}}</template>
        </el-table-column>
        <el-table-column label="专业" align="center">
          <template slot-scope="scope">{{scope.row.profession ? scope.row.profession.name : "无"}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="classModel = scope.row;editDialog = true;classModel.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="classModel = scope.row;editDialog = true;
              dialogTitle='编辑';classModel.type='edit';
              getProfessionList(classModel.profession.faculty.id);"
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
    <el-dialog :title="dialogTitle" :visible.sync="editDialog" width="30%">
      <el-form label-width="80px">
        <el-form-item label="班级编号">
          <el-input v-model="classModel.classCoding" :disabled="classModel.type === 'see'"></el-input>
        </el-form-item>
        <el-form-item label="学院：">
          <el-select
            v-model="classModel.profession.faculty.id"
            placeholder="请选择学院"
            clearable
            filterable
            :disabled="classModel.type === 'see'"
            @change="classModel.professionId = null;getProfessionList(classModel.profession.faculty.id)"
          >
            <el-option
              v-for="item in facultyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="专业：">
          <el-select
            v-model="classModel.professionId"
            placeholder="请选择专业"
            clearable
            filterable
            :disabled="classModel.type === 'see'"
          >
            <el-option
              v-for="item in professionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指导老师：">
          <el-select
            v-model="classModel.teacherId"
            placeholder="请选指导老师"
            clearable
            filterable
            :disabled="classModel.type === 'see'"
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
      <span slot="footer" class="dialog-footer" v-if="classModel.type !== 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchTeacherList,
    findById as professionFindById
  } from "@/api/profession";
  import {findById as facultyFindById} from "@/api/faculty";
  import {findById as teacherFindById} from "@/api/teacher";
  import {fetchList, create, update, _delete} from "@/api/class";
  import {
    fetchProfessionList,
    fetchFacultyList,
    fetchClassList
  } from "@/api/student";

  import {Message, MessageBox} from "element-ui";
  import {uploadClass} from '@/config/config'

  const defaultListQuery = {
    keyword: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5
  };
  export default {
    name: "classList",
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
        teacherList: [],
        editDialog: false,
        classModel: {
          profession: {
            faculty: {}
          },
          teacher: {}
        },
        dialogTitle: "",
        showImportTask: false,
        uploadUrl: uploadClass,
      };
    },
    created() {
      this.getList();
      this.getFacultyList();
      this.getFetchTeacherList();
    },
    watch: {},
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = " and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire += ` and  classCoding like '%${
            this.listQuery.keyword
            }%'`)
          : "";
        this.listQuery.facultyId && !this.listQuery.professionId
          ? (this.listQuery.quire += ` and professionId in (select id from profession where facultyId = ${
            this.listQuery.facultyId
            })`)
          : "";
        this.listQuery.professionId && !this.listQuery.classid
          ? (this.listQuery.quire += ` and professionId = ${
            this.listQuery.professionId
            }`)
          : "";
        fetchList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = [];
          let list = response.data.data;
          list.forEach(item => {

            item.profession = {};
            item.teacher = {};
            professionFindById(item.professionId).then(res => {
              let profession = res.data;
              if (profession) {
                facultyFindById(profession.facultyId).then(res1 => {
                  profession.faculty = res1.data;
                  item.profession = profession;
                  this.list = list;
                });
              }
            });
            console.log("获取到的班级信息为", item);
            if (item.teacherId) {
              teacherFindById(item.teacherId).then(t => (item.teacher = t.data));
            } else {
              item.teacher.name = '无';
            }

          });
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

      getProfessionList(facultyId) {
        this.professionList = [];
        fetchProfessionList({
          quire: ` and facultyId = ${facultyId || this.listQuery.facultyId}`
        }).then(result => {
          let professionList = result.data.data;
          if (professionList && professionList.length > 0) {
            if (facultyId) {
              this.classModel.professionId = professionList[0].id;
            } else {
              this.listQuery.professionId = professionList[0].id;
            }
          }
          this.professionList = professionList;
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
        return this.teacherList.filter(t => t.id === id)[0];
      },
      handleDelete(index, row) {
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = row ? [row.id] : [];
          this.multipleSelection.forEach(row => ids.push(row.id));
          console.log(ids);
          _delete({
            ids: ids.toString()
          }).then(r => {
            this.getList();
          });
        });
      },
      edit() {
        let classModel = this.classModel;
        // 修改班级信息
        if (classModel.id) {
          update(classModel).then(result => {
            this.editDialog = false;
            this.getList();
            Message({
              message: "修改成功",
              type: "success",
              duration: 1000
            });
          });
        }
        // 添加班级
        else {
          console.log("需要添加的班级信息为：", this.classModel);
          create(this.classModel).then(result => {
            this.editDialog = false;
            this.getList();
            Message({
              message: "添加成功",
              type: "success",
              duration: 1000
            });
          });
        }
      },
      uploadTaskSuccess() {
        this.$message({
          message: '班级信息上传成功',
          type: 'success'
        });
        this.getList();
      }, uploadTaskError() {
        this.$message({
          message: '班级信息上传失败',
          type: 'error'
        });
      }
    }
  };
</script>

