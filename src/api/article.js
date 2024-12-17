import service from '@/utils/request'

export function getList(params) {
  return service({
    url: '/blog/article/list',
    method: 'get',
    params
  })
}
export function getCategory(id) {
  return service({
    url: '/blog/article/' + id,
    method: 'get'
  })
}
export function delCategory(id) {
  return service({
    url: '/blog/article/' + id,
    method: 'delete'
  })
}
export function editCategory(mode, data) {
  return service({
    url: '/blog/article',
    method: mode === 'INSERT' ? 'post' : 'put',
    data
  })
}
