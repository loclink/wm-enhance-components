import { ActionType, RequestData } from '@ant-design/pro-table'
import { SortOrder } from 'antd/lib/table/interface'
import { useCallback, useRef } from 'react'
import useExport from './useExport'

type Params<U> = U & {
  pageSize?: number
  current?: number
  keyword?: string
}

type Sort = Record<string, SortOrder>

type Filter = Record<string, React.ReactText[] | null>

type Fn<U, T> = (params: any, sort: Sort, filter: Filter) => Promise<{ code?: number; msg?: string; data?: { list?: T[]; total?: number } }>

export interface IUseProTableRequestOption<T, U = T> {
  /**
   * 格式化参数
   *
   * 前置处理请求参数。如果你需要传递给导出时。这会很有用
   * @param params 将要传递给接口的参数
   */
  paramsFormat?(params: any): any
  /**
   * 格式化数据
   * 你可以对返回的数据做一些处理
   */
  dataFormat?: (data: T[]) => U[]

  /**
   * 导出接口url
   */
  exportUrl?: string
}

/**
 * antd pro table请求封装钩子
 * @param fn
 * @param option
 * @returns
 */
export default function useProTableRequest<T, U extends Record<string, any> = {}>(fn: Fn<U, T>, option: IUseProTableRequestOption<T> = {}) {
  // Table action 的引用，便于自定义触发
  const actionRef = useRef<ActionType>()
  // 缓存请求参数
  const requestParams = useRef<Record<string, any>>({})
  // 数据缓存参数
  const dataSourceRef = useRef<T[]>([])

  // 集成导出
  const [exportTable, exportLoading] = useExport(option.exportUrl)

  // 表格请求
  const tableRequst = useCallback(async (params: Params<U>, sort: Sort, filter: Filter) => {
    const { dataFormat } = option
    const { current, ...rest } = params as Record<string, any>
    let newParams: any = { ...rest, pageNum: current }
    // 格式化并缓存参数
    requestParams.current = option.paramsFormat ? option.paramsFormat(newParams) : newParams

    // 重置数据
    let total = 0
    let data: T[] = []

    try {
      // 参数长度过长不处理
      if (JSON.stringify(requestParams.current).length < 1000) {
        const res = await fn(requestParams.current, sort, filter)
        // 如果当前列表为空并且pageNum不为1.则重新发起请求
        if (!res.data?.list?.length && requestParams.current.pageNum !== 1) {
          setTimeout(() => {
            actionRef.current?.reload(true)
          })
        }
        const { list = [] as T[] } = res.data || {}
        total = res.data?.total || 0
        data = dataFormat ? dataFormat(list) : list
        dataSourceRef.current = data
      }
    } catch (error) {
      console.error(error)
    }

    return { data, success: true, total } as Partial<RequestData<T>>
  }, [])

  return {
    actionRef,
    /**
     * 表格请求
     */
    request: tableRequst,
    /**
     * 表格query参数
     */
    params: requestParams,

    /**
     * 表格数据缓存
     */
    dataSource: dataSourceRef,

    /**
     * 导出
     * @param params
     * @returns
     */
    exportTable: (params?: Record<string, any>) => {
      return exportTable({ ...requestParams.current, ...params })
    },
    /**
     * 导出loading
     */
    exportLoading
  }
}
