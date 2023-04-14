import { ProFormField } from '@ant-design/pro-form'
import { FC, memo } from 'react'
import { IProFormInfoCom, IProFormInfoProps } from './const'
import { Typography } from 'antd'

function Info({ value, info, ...fieldProps }: IProFormInfoCom) {
  return <Typography.Text {...fieldProps}>{value || info}</Typography.Text>
}

/**
 * 提示信息 没有意义 只是展示信息
 * @param props
 * @returns
 */
const Component: FC<IProFormInfoProps> = (props) => {
  const { fieldProps = {}, info = '', ...formProps } = props

  return (
    <ProFormField {...formProps}>
      <Info {...fieldProps} info={info} />
    </ProFormField>
  )
}

Component.displayName = 'ProFormInfo'

const ProFormInfo = memo(Component)
export default ProFormInfo
