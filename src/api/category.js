import service from '@/utils/request'

export function getCategoryList(params) {
  return service({
    url: '/blog/category/list',
    method: 'get',
    params
  })
}
export function getCategory(id) {
  return service({
    url: '/blog/category/' + id,
    method: 'get'
  })
}
export function delCategory(id) {
  return service({
    url: '/blog/category/' + id,
    method: 'delete'
  })
}
export function editCategory(mode, data) {
  return service({
    url: '/blog/category',
    method: mode === 'INSERT' ? 'post' : 'put',
    data
  })
}
