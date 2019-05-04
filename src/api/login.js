import request from '@/utils/request'

// 图片验证码登陆
export function login(username, password, image) {
  return request({
    url: '/authentication/form',
    method: 'post',
    params: {
      username,
      password,
      image
    }
  })
}
// 获取当前登陆用户的信息
export function getInfo() {
  return request({
    url: '/account/user/info',
    method: 'get',
  })
}

// 用户退出登陆
export function logout() {
  return request({
    url: '/logout',
    method: 'get'
  })
}
