import { useState } from 'react'

/**
 * 导出hook
 */
export default function useExport(url = '') {
  const [loading, setLoading] = useState(false)

  /**
   * 导出表格
   * @param params
   * @returns
   */
  async function exportTable(params: Record<string, any> = {}) {
    if (!url) {
      return
    }
    const Authorization = window.localStorage.getItem('Authorization')
    try {
      const headers = new Headers()
      setLoading(true)
      if (Authorization) {
        headers.set('Authorization', Authorization)
      }

      const fetchUrl = jointQuery(url, { ...params, pageNum: 1, pageSize: undefined })

      const option: any = { method: 'GET', headers, responseType: 'blob' }
      const res = await fetch(fetchUrl, option)
      const blobData = await res.blob()

      let blob = new Blob([blobData], { type: 'application/vnd.ms-excel; charset=UTF-8' })
      // 创建下载的链接
      let downloadElement = document.createElement('a')
      let href = window.URL.createObjectURL(blob)
      downloadElement.href = href

      const contentDisposition = res.headers!.get('content-disposition') || ''
      const [_, fileName = ''] = contentDisposition.split('filename=')
      downloadElement.download = decodeURI(fileName) || '' // 下载后文件名
      document.body.appendChild(downloadElement)
      downloadElement.click() // 点击下载
      document.body.removeChild(downloadElement) // 下载完成移除元素
      window.URL.revokeObjectURL(href) // 释放掉blob对象
    } catch (error) {
      console.error(`导出失败`, error)
    }
    setLoading(false)
  }

  return [exportTable, loading] as const
}

function jointQuery(url: string, params: { [i: string]: any } = {}) {
  // 是否携带query
  const query = Object.keys(params)
    .filter((key) => ![undefined, null].includes(params[key])) // 排除掉无效值
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')

  if (!query) {
    return url
  }
  return url + (url.search(/\?/) === -1 ? '?' : '&') + query
}
