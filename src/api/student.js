import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/student/list',
    method: 'get',
    params: params
  })
}

export function fetchProfessionList(params) {
  return request({
    url: '/profession/quire/list',
    method: 'get',
    params: params
  })
}

export function fetchFacultyList(params) {
  return request({
    url: '/faculty/quire/list',
    method: 'get',
    params: params
  })
}

export function fetchClassList(params) {
  return request({
    url: '/class/quire/list',
    method: 'get',
    params: params
  })
}

export function create(params) {
  return request({
    url: '/student/register/list',
    method: 'post',
    data: params,
    headers: {
      "Content-Type": "application/json;"
    }
  })
}

export function update(params) {
  return request({
    url: '/student/info',
    method: 'put',
    params: params
  })
}

export function _delete(params) {
  return request({
    url: '/student/update',
    method: 'delete',
    params: params
  })
}

export function chooseCourse(courseId, teacherId) {
  return request({
    url: '/studentCourse/course',
    method: 'post',
    params: {
      courseId: courseId,
      teacherAccountId: teacherId
    }
  })
}

export function findScore(teachCourseId) {
  return request({
    url: '/studentCourse/teachCourser/score',
    method: 'get',
    params: {
      teachCourseId: teachCourseId
    }
  })
}


export function checkStudentAnswer(publishQuestionId) {
  return request({
    url: '/publishQuestionnaire/check/answer',
    method: 'get',
    params: {
      publishId: publishQuestionId
    }
  })
}


export function findStudentByIds(studentAccountIds) {
  var requestIds = '';
  if (studentAccountIds) {
    studentAccountIds.forEach(res => {
      requestIds += res + ",";
    })
  }
  return request({
    url: '/student/find/by/ids',
    method: 'get',
    params: {
      ids: requestIds
    }
  })
}
