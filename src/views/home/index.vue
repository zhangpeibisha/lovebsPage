<template>

  <div style="height: 500px; overflow-y: scroll;">
    <el-row :gutter="20">
      <el-col :span="12" :offset="1">
        <el-carousel :interval="2000" arrow="always" >
          <el-carousel-item v-for="item in schoolPicture" :key="item">
            <img :src="item" style="width: 100%;height: 100%"/>
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="6" offset="3">
        <div class="block">
          <el-timeline>
            <el-timeline-item timestamp="2019/4/12" placement="top">
              <el-card>
                <h4>老师交的好不好</h4>
                <p>老师很亲切，很乐意帮助学生理解问题</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/3" placement="top">
              <el-card>
                <h4>线性代数容易懂吗</h4>
                <p>罗老师讲的十分的好，我很喜欢罗老师</p>
              </el-card>
            </el-timeline-item>
            <el-timeline-item timestamp="2018/4/2" placement="top">
              <el-card>
                <h4>计算机网络有什么好的学习方式</h4>
                <p>根据书上的思路，一次次推演就能明白了</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        schoolPicture: [
          "https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1308406061,2009991518&fm=27&gp=0.jpg",
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2416873696,1403917680&fm=26&gp=0.jpg",
          "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1637602312,2244573236&fm=26&gp=0.jpg",
          "https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=287304366,4289202788&fm=26&gp=0.jpg"
        ]
      };
    }
  };
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    margin: 0;
  }
</style>
