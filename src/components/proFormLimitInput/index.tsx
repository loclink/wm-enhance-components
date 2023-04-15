import { ProFormField } from '@ant-design/pro-form'
import { concatRule } from '../../form-rules'
import { Input, InputProps } from 'antd'
import { FC, memo, useMemo } from 'react'
// import styles from './index.module.less'
import { ProFormItemProps } from '@ant-design/pro-form'

export interface IProFormLimitInputProps extends ProFormItemProps<InputProps> {
  /** 最大长度 */
  maxLength?: number
}

const Component: FC<IProFormLimitInputProps> = (props) => {
  const { fieldProps, maxLength = 12, disabled, rules, ...formProps } = props

  const innerRules = useMemo(() => concatRule([...(rules ?? []), 'trim']), [rules])

  return (
    <ProFormField {...formProps} rules={innerRules}>
      <LimitInput {...fieldProps} maxLength={maxLength} disabled={disabled} />
    </ProFormField>
  )
}

Component.displayName = 'ProFormLimitInput'

const ProFormLimitInput = memo(Component)
export default ProFormLimitInput

const LimitInput = memo(({ value, maxLength, onChange, ...fieldProps }: any) => {
  return (
    <Input
      {...fieldProps}
      maxLength={maxLength}
      value={value}
      onChange={onChange}
      suffix={
        <span style={{ color: '#ccc' }}>
          {((value || '') as string).length}/{maxLength}
        </span>
      }
    />
  )
})
