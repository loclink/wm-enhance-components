import { ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface'
import { TextProps } from 'antd/lib/typography/Text'
import { ReactNode } from 'react'

export interface IProFormInfoProps extends ProFormFieldItemProps {
  /**
   * 自定义提示信息
   * 如果form表单项目声明了value并且有值的情况下
   * 优先显示value值
   */
  info?: ReactNode

  /**
   * 组件项的props参数
   */
  fieldProps?: TextProps
}

export interface IProFormInfoCom extends TextProps {
  value?: string

  info?: ReactNode
}
