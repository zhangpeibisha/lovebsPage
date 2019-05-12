import request from '@/utils/request'

export function createQuestion(params) {
  return request({
    url: '/evaluationquestionnaire/create',
    method: 'post',
    params: params
  })
}

export function addQuestion(params, data) {
  return request({
    url: '/evaluationquestionnaire/question',
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
    url: '/evaluationquestionnaire/batch/question',
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
    url: '/evaluationquestionnaire/question',
    method: 'delete',
    params: params
  })
}

export function updateQuestion(params) {
  return request({
    url: '/evaluationquestionnaire/question',
    method: 'put',
    params: params
  })
}

// 发现问卷id
export function findEvaluationById(evaluationId) {
  return request({
    url: '/evaluationquestionnaire/question/by/id',
    method: 'get',
    params: {
      evaluationId: evaluationId
    }
  })
}

// 发现发布问卷id
export function findPublishQuestionById(publishId) {
  return request({
    url: '/publishquestionnaire/findById',
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
    url: '/publishquestionnaire/teacher/read/publish',
    method: 'put',
    params: {
      publishQuestingId: questionId
    }
  })
}

// 添加黑名单学生
export function addBlackList(publishId, ids) {
  return request({
    url: '/publishquestionnaire/addBlack',
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
    url: '/publishquestionnaire/deleteBlack',
    method: 'delete',
    params: {
      publisId: publishId,
      studentIds: ids
    }
  })
}

export function commitE(params, data) {
  return request({
    url: '/publishquestionnaire/writeQuestion',
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
    url: '/publishquestionnaire/answers',
    method: 'get',
    params: params
  })
}
