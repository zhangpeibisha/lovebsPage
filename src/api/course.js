import request from '@/utils/request'

export function findCourseList(params) {
  return request({
    url: '/course/quire/list',
    method: 'get',
    params: params
  })
}

export function update(params) {
  return request({
    url: '/course/update',
    method: 'put',
    params: params
  })
}

export function createCrouse(params) {

  var data = params[0];
  return request({
    url: '/course/add',
    method: 'post',
    params: {
      coding: data.coding,
      name: data.name,
      description: data.description,
    }
  })
}

export function _delete(params) {

  console.log("删除获取到的参数为==========", params);

  var str = '';
  if (params) {
    params.forEach(row => {
      console.log("444444", row);
      str += row + ","
    })
  }
  console.log("删除获取到的参数为", str);
  return request({
    url: '/course/ids',
    method: 'delete',
    params: {
      ids: str
    }
  })
}

export function findById(id) {
  return request({
    url: '/course/id',
    method: 'get',
    params: {
      ids: id
    }
  })
}

export function findTeacherByCourseId(courseId) {
  return request({
    url: '/studentCourse/findTeacher',
    method: 'get',
    params: {
      courseId: courseId
    }
  })
}
