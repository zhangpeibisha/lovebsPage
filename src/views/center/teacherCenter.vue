<template>
	<div class="personleCenter">
		<p class="mine">我的个人主页</p>
		<el-container>
			<el-aside width="200px">
				<img :src="list.userInfo.imageUrl" />
			</el-aside>
			<el-main>
				<p>姓名：{{list.userInfo.name}}</p>
				<p>工号：{{list.userInfo.studentId}}</p>
				<p>电话：{{list.userInfo.phone}}</p>
				<p>邮箱：{{list.userInfo.email}}</p>
			</el-main>
		</el-container>

		<el-tabs v-model="activeName" @tab-click="handleClick">
			<el-tab-pane label="已完成问卷" name="first">

				<el-table :data="tableData" style="width: 100%">

					<el-table-column label="日期" width="180">
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span style="margin-left: 10px">{{ scope.row.date }}</span>
						</template>
					</el-table-column>

					<el-table-column label="姓名" width="180">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>姓名: {{ scope.row.name }}</p>
								<p>住址: {{ scope.row.address }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">{{ scope.row.name }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
							<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>

			<el-tab-pane label="未完成问卷" name="second">

				<el-table :data="tableData" style="width: 100%">

					<el-table-column label="日期" width="180">
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span style="margin-left: 10px">{{ scope.row.date }}</span>
						</template>
					</el-table-column>

					<el-table-column label="姓名" width="180">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>姓名: {{ scope.row.name }}</p>
								<p>住址: {{ scope.row.address }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">{{ scope.row.name }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>

					<el-table-column label="问卷名称" width="180">
						<template slot-scope="scope">
							<span style="margin-left: 10px">{{ scope.row.title }}</span>
						</template>
					</el-table-column>

					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
							<el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
			</el-tab-pane>

			<el-tab-pane label="编辑信息" name="third">

				<el-form ref="form" :model="form" label-width="80px">
					<el-form-item label="活动名称">
						<el-input v-model="form.name"></el-input>
					</el-form-item>
					<el-form-item label="活动区域">
						<el-select v-model="form.region" placeholder="请选择活动区域">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="活动时间">
						<el-col :span="11">
							<el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
						</el-col>
						<el-col class="line" :span="2">-</el-col>
						<el-col :span="11">
							<el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
						</el-col>
					</el-form-item>
					
					<el-form-item>
						<el-button type="primary" @click="onSubmit">立即创建</el-button>
						<el-button>取消</el-button>
					</el-form-item>
				</el-form>

			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
	import {findUserInfo} from '@/api/center';
	
	export default {
		data() {
			return {
				list:[],								 
				activeName: 'second',
				tableData: [{
					title: '问卷名称',
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					title: '问卷名称',
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1517 弄'
				}, {
					title: '问卷名称',
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1519 弄'
				}, {
					title: '问卷名称',
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1516 弄'
				}],
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			};
		},
		
		
		created(){			
			this.getList()
		},
		methods: {
			getList(){
				findUserInfo().then((res)=>{
					this.list=res.data
					console.log(this.list)
				})
			},
			
			handleClick(tab, event) {
				console.log(tab, event);
			},
			handleEdit(index, row) {
				console.log(index, row);
			},
			handleDelete(index, row) {
				console.log(index, row);
			},
			onSubmit() {
				console.log('submit!');
			}
		}
	};
</script>

<style scoped>
	.personleCenter{
		width: 1200px;
		margin: 0 auto;
	}
	
	.el-container{
		border-bottom: 1px solid #E4E7ED;
		margin-bottom: 10px;
	}
	.mine{
		font-weight: 600;
		margin-bottom: 20px;
		text-align: center;
		border-bottom: 1px solid #E4E7ED;
		padding: 20px;
		
	}
	.el-aside {
		margin-left: 50px;
		color: #333;
	}
	
	.el-aside img {
		width: 100%;
		height: 100%;
		display: block;
	}
	
	.el-main {
		color: #333;
	}
	
	.el-main p {
		margin-bottom: 10px;
	}
</style>