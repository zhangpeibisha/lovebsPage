<template>
	<div class="Questionnaire">
		<div>
			<h2>创建问卷</h2>
			<p><span>问卷名称：</span><input /></p>
			<router-link to="/Questionnaire/Establish/creat">立即创建</router-link>
		</div>
	</div>
</template>

<script>
</script>

<style scoped>
	h2{
		text-align: center;
		font-size: 30px;
		color: #30a6f5;
		margin-bottom: 30px;
		
	}
	p{
		text-align: center;
	}
	.Questionnaire p span{
		font-size: 30px;
		color: #30a6f5;
		font-weight: 600;
	}
	.Questionnaire input{
		width: 800px;
		height: 50px;
		border-radius: 10px;
		outline: none;
		border: 1px solid #b3b3b3;
		padding-left: 20px;
		box-sizing: border-box;
	}
	.Questionnaire a{
		text-align: center;
		line-height: 50px;
		width: 200px;
		height: 50px;
		background: #1ea0fa;
		border: 0;
		display: block;
		margin: 0 auto;
		color: white;
		font-size: 26px;
		border-radius:6px;
		margin-top: 40px;
	}
</style>