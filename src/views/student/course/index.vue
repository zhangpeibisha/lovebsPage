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
          @selection-change="handleSelectionChange"
          size="small"
        >重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.keyword" placeholder="关键字"></el-input>
          </el-form-item>
          <el-form-item label="课程编码：">
            <el-input style="width: 203px" v-model="listQuery.coding" placeholder="课程编码"></el-input>
          </el-form-item>
          <el-form-item label="课程名字：">
            <el-input style="width: 203px" v-model="listQuery.name" placeholder="课程名字"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>课程数据</span>
      <el-button
        class="btn-add"
        @click="course = {
       };editDialog = true;dialogTitle='添加'"
        size="mini"
      >添加
      </el-button>
      <el-button
        class="btn-add" type="success" @click="showImportTask=true" size="mini">导入课程信息
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
        <el-table-column label="课程编号" align="center">
          <template slot-scope="scope">{{scope.row.coding}}</template>
        </el-table-column>
        <el-table-column label="课程名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="课程描述" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column label="操作" style="width: 600px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="course = scope.row;editDialog = true;course.type = 'see';dialogTitle='查看'"
            >查看
            </el-button>
            <el-button
              size="mini"
              @click="course = scope.row;editDialog = true;dialogTitle='编辑';course.type='edit'">编辑
            </el-button>
            <!--<el-button-->
              <!--&lt;!&ndash;size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除&ndash;&gt;-->
            <!--</el-button>-->
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
      title="上传课程信息"
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
        name="course">
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
        <el-form-item label="课程名字">
          <el-input v-model="course.name" :disabled="course.type === 'see'"></el-input>
        </el-form-item>
        <el-form-item label="课程编号">
          <el-input v-model="course.coding" :disabled="course.type === 'see'"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="course.description" :disabled="course.type === 'see'"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="course.type !== 'see'">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="edit()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
  import {
    findCourseList,
    update,
    _delete,
    createCrouse,
    findTeacherByCourseId
  } from "@/api/course";

  import {
    findTeacherList,
    addCourse
  } from "@/api/teacher"

  import {findUserInfo} from '@/api/center';

  import {chooseCourse} from '@/api/student';
  import {uploadCourse} from '@/config/config'

  const defaultListQuery = {
    key: null,
    word: null,
    blurry: false,
    page: 1,
    limit: 5
  };

  export default {
    name: "courseList",
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
        course: {},
        courseTeacher: {
          course: {
            name: ''
          }
        },
        teacherList: [],
        teacherId: '',
        addTeacherView: false,
        formLabelWidth: '120px',
        dialogTitle: "",
        userType: '',
        teacherListByCourseId: [],
        addCourseView: false,
        showImportTask: false,
        uploadUrl: uploadCourse
      };
    },
    created() {
      this.getList();
      this.getTeacherList();
      this.findUserType();
    },
    methods: {
      findUserType() {
        findUserInfo().then((res) => {
          this.userType = res.data.userType;
        })
      },
      getList() {
        this.listLoading = true;
        this.listQuery.quire = "and 1 = 1";
        this.listQuery.keyword
          ? (this.listQuery.quire +=
          ` and (name like '%${this.listQuery.keyword}%' or coding like '%${this.listQuery.keyword}%' `
          +
          `or description like '%${this.listQuery.keyword}%')`)
          : "";
        this.listQuery.coding
          ? (this.listQuery.quire += ` and coding = ${
            this.listQuery.coding
            }`)
          : "";
        this.listQuery.name
          ? (this.listQuery.quire += ` and name = '${this.listQuery.name}'`)
          : "";
        console.log("5656ddddd获取到的数据为：==========");
        findCourseList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.data;
          this.total = response.data.total;
          console.log("565656asdsa获取到的数据为：", list)
        });
      },
      handleSizeChange(val) {
        this.listQuery.page = 1;
        this.listQuery.limit = val;
        this.getList();
      },
      getTeacherList() {
        findTeacherList().then(result => {
          console.log("获取老师信息为", result);
          this.teacherList = result.data.data;
        })
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
            console.log("index====", index, row);
            ids.push(row.id)
          }
          this.multipleSelection.forEach(row => ids.push(row.id));
          _delete(
            ids
          );
          this.getList();
        });
      },
      edit() {
        let teacher = this.course;
        console.log("返回的数据为：==================", teacher);
        // 编辑课程信息
        if (teacher.id) {
          update(this.course).then(result => {
            console.log("返回的数据为：", result);
            this.getList()
          });
        }
        // 添加课程
        else {
          createCrouse([this.course]).then(result => {
            console.log("返回的数据为：", result);
            this.getList()
          });
        }
        this.editDialog = false
      },
      addTeacher(index, row) {
        console.log("addTeacher获取的数据为：", index, row, this.teacherId);
        this.courseTeacher.course = row;

        this.addTeacherView = true;
      },
      chooseTeacher() {
        this.courseTeacher.teacherId = this.teacherId;
      },
      submitAddTeacher() {
        addCourse(this.courseTeacher).then(result => {
          this.addTeacherView = false;
          console.log("获取结果", result)
        })
      },
      chooseCourse(index, row) {
        if (row) {
          this.courseTeacher.course = row;
          this.findCourseTeacher(row.id);
        }
        this.addCourseView = true;
      },
      submitChooseCourse() {
        console.log("提交结果为：", this.teacherId, this.courseTeacher.course);
        chooseCourse(this.courseTeacher.course.id, this.teacherId).then(res => {
          console.log("加课结果为：", res)
          this.addCourseView = false;
        })
      },
      findCourseTeacher(courseId) {
        findTeacherByCourseId(courseId).then(res => {
          this.teacherListByCourseId = res.data;
        })
      }, uploadTaskSuccess() {
        this.$message({
          message: '课程上传成功',
          type: 'success'
        });
        this.getList();
      }, uploadTaskError() {
        this.$message({
          message: '课程上传失败',
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


