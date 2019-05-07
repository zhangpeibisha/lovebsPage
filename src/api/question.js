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

export function findEvaluationById(evaluationId) {
  return request({
    url: '/evaluationquestionnaire/question/by/id',
    method: 'get',
    params: {
      evaluationId:evaluationId
    }
  })
}

export function commitE(params,data) {
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
