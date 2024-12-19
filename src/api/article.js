import service from '@/utils/request'

export function getArticleList(params) {
  return service({
    url: '/blog/article/list',
    method: 'get',
    params
  })
}
export function getArticle(id) {
  return service({
    url: '/blog/article/' + id,
    method: 'get'
  })
}
export function delArticle(id) {
  return service({
    url: '/blog/article/' + id,
    method: 'delete'
  })
}
export function editArticle(mode, data) {
  return service({
    url: '/blog/article',
    method: mode === 'INSERT' ? 'post' : 'put',
    data
  })
}
export function getArticleStateApi() {
  return service({
    url: '/dict/stateType',
    method: 'get'
  })
}
export function getArticleCategoryApi() {
  return service({
    url: '/blog/category/categoryType',
    method: 'get'
  })
}
