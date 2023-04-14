import { message, Modal, Switch } from 'antd'
import React, { memo } from 'react'

interface Props {
  request: (...params) => Promise<any>
  rowData: any
  dataIndex: string
  action: any
  confirm?:
    | {
        title: string
        content: string
        okText?: string
        cancelText?: string
      }
    | false
}

// switch 组件
const WmTableSwitch: React.FC<Props> = memo((props) => {
  const { rowData, dataIndex, request, action, confirm } = props
  const handleChangeSwitch = async (value) => {
    if (confirm) {
      Modal.confirm({
        title: confirm.title,
        content: confirm.content,
        okText: confirm.okText,
        cancelText: confirm.cancelText,
        onOk: async () => {
          await request({
            id: rowData.id,
            [dataIndex]: Number(value)
          }).then(() => {
            message.success('操作成功')
          })
          action.reload()
        }
      })
    } else {
      await request({
        id: rowData.id,
        [dataIndex]: Number(value)
      }).then(() => {
        message.success('操作成功')
      })
      action.reload()
    }
  }
  return <Switch checked={rowData[dataIndex]} onChange={handleChangeSwitch} />
})
WmTableSwitch.displayName = 'WmTableSwitch'
export default WmTableSwitch
