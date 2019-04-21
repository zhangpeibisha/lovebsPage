import request from '@/utils/request'

export function login(username, password,image) {
	console.log("logapi",username, password,image)
  return request({
    url: '/authentication/form?username='+username+'&password='+password+'&image='+image,
    method: 'post',
//  data: {
//    username,
//    password,
//    image
//  }
  })
}

export function getInfo() {
  return request({
    url: '/admin/info',
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}
