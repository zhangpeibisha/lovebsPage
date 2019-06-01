import request from '@/utils/request'

export function createQuestion(params) {
  return request({
    url: '/evaluationQuestionnaire/create',
    method: 'post',
    params: params
  })
}

export function addQuestion(params, data) {
  return request({
    url: '/evaluationQuestionnaire/question',
    method: 'post',
    params: params,
    data,
    headers: {
      "Content-Type": "application/json;"
    }
  })
}

export function addAllQuestion(params, data) {
  return request({
    url: '/evaluationQuestionnaire/batch/add/question',
    method: 'post',
    params: params,
    data,
    headers: {
      "Content-Type": "application/json;"
    }
  })
}

export function deleteQuestion(params) {
  return request({
    url: '/evaluationQuestionnaire/question',
    method: 'delete',
    params: params
  })
}

export function updateQuestion(params) {
  return request({
    url: '/evaluationQuestionnaire/question',
    method: 'put',
    params: params
  })
}

// 发现问卷id
export function findEvaluationById(evaluationId) {
  console.log("查询问卷的信息参数======：", evaluationId);
  return request({
    url: '/evaluationQuestionnaire/question/by/id',
    method: 'get',
    params: {
      evaluationId: evaluationId
    }
  })
}

// 发现发布问卷id
export function findPublishQuestionById(publishId) {
  return request({
    url: '/publishQuestionnaire/findById',
    method: 'get',
    params: {
      id: publishId
    }
  })
}

// 老师点击查看发布问卷的问卷详情信息
export function teacherClieckPublishQuestion(questionId) {
  console.log("发现请求参数为：", questionId);
  return request({
    url: '/publishQuestionnaire/teacher/read/publish',
    method: 'put',
    params: {
      publishQuestingId: questionId
    }
  })
}

// 添加黑名单学生
export function addBlackList(publishId, ids) {
  return request({
    url: '/publishQuestionnaire/addBlack',
    method: 'post',
    params: {
      publisId: publishId,
      studentIds: ids
    }
  })
}

// 删除黑名单学生
export function deleteBlackList(publishId, ids) {
  return request({
    url: '/publishQuestionnaire/deleteBlack',
    method: 'delete',
    params: {
      publisId: publishId,
      studentIds: ids
    }
  })
}

export function commitE(params, data) {
  return request({
    url: '/publishQuestionnaire/writeQuestion',
    method: 'post',
    params: params,
    data,
    headers: {
      "Content-Type": "application/json;"
    }
  })
}

export function fetchPublish(params) {
  return request({
    url: '/publishQuestionnaire/answers',
    method: 'get',
    params: params
  })
}

// 按条件查询问卷
export function findQuireQuestion(params) {
  return request({
    url: '/evaluationQuestionnaire/all/list',
    method: 'get',
    params: params
  })
}

// 按条件查询问卷
export function publishQuestionnaireByCourseIds(params) {
  return request({
    url: '/publishQuestionnaire/publish/by/courseIds',
    method: 'post',
    params: params
  })
}

// 获取统计信息，发布的评教卷的
export function statisticsScore(publishId) {
  return request({
    url: '/publishQuestionnaire/statisticsScore',
    method: 'get',
    params: {
      publishId: publishId
    }
  })
}

// 获取排名信息
export function findRankByFacultyAndYearAndSemester(params) {
  return request({
    url: '/teacherCourse/faculty/rank',
    method: 'get',
    params: params
  })
}

export function findPublishInfoByids(ids) {
  var str = '';
  ids.forEach(id => str += id + ",");
  return request({
    url:'/publishQuestionnaire/list/by/ids',
    method:'get',
    params:{
      ids:str
    }
  })
}
