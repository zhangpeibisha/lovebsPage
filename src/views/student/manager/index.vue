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
          <el-form-item label="学号：">
            <el-input style="width: 203px" v-model="listQuery.studentId" placeholder="学号"></el-input>
          </el-form-item>
          <el-form-item label="姓名：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="姓名"></el-input>
          </el-form-item>
          <el-form-item label="学院：">
            <el-select
              v-model="listQuery.facultyId"
              placeholder="请选择学院"
              clearable
              filterable
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
              v-model="listQuery.professionId"
              placeholder="请选择专业"
              clearable
              filterable
            >
              <el-option
                v-for="item in professionList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="班级：">
            <el-select v-model="listQuery.classId" placeholder="请选择班级" clearable filterable>
              <el-option
                v-for="item in classes"
                :key="item.id"
                :label="item.classCoding"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>学生数据</span>
      <!--<el-button class="btn-add" type="danger" @click="handleDelete()" size="mini">删除</el-button>-->
      <el-button
        class="btn-add"
        @click="student = {
        class:{
          profession: {
            facultyVo:{
            },
            id:undefined
          },
          id:undefined
        }
      };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入学生信息信息(模拟)
      </el-button>
    </el-card>


    <el-dialog
      title="上传模拟学生信息"
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
        name="student">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请规范excel格式，不然无法导入</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showImportTask = false">确 定</el-button>
      </span>
    </el-dialog>


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
        <el-table-column label="学号" align="center">
          <template slot-scope="scope">{{scope.row.studentId}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="专业" align="center">
          <template slot-scope="scope">{{scope.row.class.profession.name}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="student = scope.row;editDialog = true;student.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="student = scope.row;editDialog = true;dialogTitle='编辑';student.type='edit';getClasses(scope.row.class.profession.id)"
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
        <el-form-item label="学号">
          <el-input v-model="student.studentId" :disabled="student.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="student.name" :disabled="student.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="student.phone" :disabled="student.type == 'see'"></el-input>
        </el-form-item>
        <el-form-item label="学院：">
          <el-select
            v-model="student.class.profession.facultyVo.id"
            placeholder="请选择学院"
            clearable
            filterable
            :disabled="student.type == 'see'"
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
            v-model="student.class.profession.id"
            placeholder="请选择专业"
            clearable
            filterable
            :disabled="student.type == 'see'"
          >
            <el-option
              v-for="item in professionList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班级：">
          <el-select
            v-model="student.class.id"
            placeholder="请选择班级"
            clearable
            filterable
            :disabled="student.type == 'see'"
          >
            <el-option
              v-for="item in classes"
              :key="item.id"
              :label="item.classid"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="student.type != 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    fetchList,
    fetchProfessionList,
    fetchFacultyList,
    fetchClassList,
    create,
    update,
    _delete
  } from "@/api/student";
  import {uploadStudent} from '@/config/config'

  const defaultListQuery = {
    key: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5,
    professionId: undefined
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
        student: {
          class: {
            profession: {
              facultyVo: {}
            }
          }
        },
        dialogTitle: "",
        showImportTask: false,
        uploadUrl: uploadStudent
      };
    },
    created() {
      this.getList();
      this.getFacultyList();
    },
    watch: {
      'student.class.profession.facultyVo.id': function (val, val2) {
        let clear = () => {
          this.professionList = [{
            id: undefined
          }];
          this.student.class.profession.id = undefined;
        };
        if (!val) {
          clear();
          return;
        }
        fetchProfessionList({
          quire: ` and facultyId = ${val}`
        }).then(res => {
          let professionList = res.data.data;
          if (professionList && professionList.length > 0) {
            this.professionList = professionList;
            this.student.class.profession.id = professionList[0].id;
          } else {
            clear();
          }
        })
      },
      'listQuery.facultyId': function (val, val2) {
        let clear = () => {
          this.professionList = [{
            id: undefined
          }];
          this.listQuery.professionId = undefined;
        };
        if (!val) {
          clear();
          return;
        }
        fetchProfessionList({
          quire: ` and facultyId = ${val}`
        }).then(res => {
          let professionList = res.data.data;
          if (professionList && professionList.length > 0) {
            this.professionList = professionList;
            this.listQuery.professionId = professionList[0].id;
          } else {
            clear();
          }
        })
      },
      'listQuery.professionId': function (val, val2) {
        console.log("查询到的数据为=======||||||=====：", val, val2);
        let clear = () => {
          this.classes = [{
            id: undefined
          }];
          this.student.class.id = undefined;
        };
        if (!val) {
          clear();
          return;
        }
        fetchClassList({
          quire: ` and professionId = ${val}`
        }).then(res => {
          let classes = res.data.data;
          if (classes && classes.length > 0) {
            this.classes = classes;
            this.listQuery.classId = classes[0].id;
          } else {
            clear();
          }
        })
      },
      'student.class.profession.id': function (val) {
        let clear = () => {
          this.classes = [{
            id: undefined
          }];
          this.student.class.id = undefined;
        };
        if (!val) {
          clear();
          return;
        }
        fetchClassList({
          quire: ` and professionId = ${val}`
        }).then(res => {
          let classes = res.data.data;
          if (classes && classes.length > 0) {
            this.student.class.id = classes[0].id;
            this.classes = classes;
          } else {
            clear();
          }
        })
      }
    },
    methods: {
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire +=
          ` and (name like '%${
            this.listQuery.keyword
            }%' or studentId like '%${this.listQuery.keyword}%' ` +
          `or studentId like '%${this.listQuery.keyword}%'  or email like '%${
            this.listQuery.keyword
            }%')`)
          : "";
        this.listQuery.studentId
          ? (this.listQuery.quire += ` and studentId = ${
            this.listQuery.studentId
            }`)
          : "";
        this.listQuery.name
          ? (this.listQuery.quire += ` and name = '${this.listQuery.name}'`)
          : "";
        this.listQuery.facultyId && !this.listQuery.professionId
          ? (this.listQuery.quire += ` and classId in (select id from class where professionId in (select id from profession where facultyId = ${
            this.listQuery.facultyId
            }))`)
          : "";
        this.listQuery.professionId && !this.listQuery.classId
          ? (this.listQuery.quire += ` and classId in (select id from class where professionId = ${
            this.listQuery.professionId
            })`)
          : "";
        this.listQuery.classId
          ? (this.listQuery.quire += ` and classId = ${this.listQuery.classId}`)
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
      getClasses(professionId) {
        fetchClassList({
          quire: `and professionId = ${professionId ||
          this.listQuery.professionId}`
        }).then(result => {
          this.classes = result.data.data;
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
        this.$confirm("是否要进行删除操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let ids = [];
          this.multipleSelection.forEach(row => ids.push(row.id));
          _delete({
            ids
          });
        });
      },
      edit() {
        let student = this.student;
        // 编辑学生信息
        if (student.id) {
          update({
            classId: student.class.id,
            studentId: student.studentId,
            name: student.name,
            phone: student.phone,
            id: student.id
          }).then(result => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
          });
        }
        // 添加学生
        else {
          create([{
            classId: student.class.id,
            studentId: student.studentId,
            name: student.name,
            phone: student.phone
          }]).then(result => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
          });
        }
        this.editDialog = false;
        this.getList();
      }, uploadTaskSuccess() {
        this.$message({
          message: '学生信息上传成功',
          type: 'success'
        });
        this.getList();
      }, uploadTaskError() {
        this.$message({
          message: '学生信息上传失败',
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


