import { ModalForm, ProFormDigit, ProFormField, ProFormGroup, ProFormSelect, ProFormText, ProFormUploadButton } from '@ant-design/pro-form'
import { Button, FormInstance, Modal, Table, message } from 'antd'
import React, { memo, useRef, useState } from 'react'
import EnhanceTable from '../EnhanceTable'
import ProFormLimitInput from '../proFormLimitInput'
// import { upload } from '../../utils'
import { ActionType } from '@ant-design/pro-table'
import { ActionsConfig, FormConfig } from '../../hooks/types'
import ProFormInfo from '../proFormInfo'

interface Props {
  actionsConfig: ActionsConfig
  rowData: any
  tabelActionRef: React.MutableRefObject<ActionType | undefined>
}

const DynamicActions: React.FC<Props> = memo((props) => {
  const { actionsConfig, rowData, tabelActionRef } = props
  // const { formOptions, actionType, text } = actionsConfig
  const [visble, setVisble] = useState(false)
  const [selectRows, setSelectRows] = useState<any[]>([])
  const [currentFormData, setCurrentFormData] = useState({})

  // 动态操作配置
  const [dynamicActionsConfig, setDynamicActionsConfig] = useState(actionsConfig)

  const tabelRef = useRef<any>({})
  const formRef = useRef<FormInstance>()
  const handleClickBtn = async () => {
    let newActionsConfig: ActionsConfig = actionsConfig
    const dynamicRender = await actionsConfig?.dynamicRender?.(rowData)
    if (dynamicRender) {
      setDynamicActionsConfig(dynamicRender)
      newActionsConfig = dynamicRender
    }

    switch (newActionsConfig.actionType) {
      // 处理表单
      case 'form':
        setVisble(true)
        setCurrentFormData(formRef.current?.getFieldsValue())
        return

      // 处理删除操作
      case 'delete':
        await Modal.confirm({
          ...newActionsConfig.deleteOptions?.confirmProps,
          async onOk() {
            await newActionsConfig.deleteOptions?.deleteRequest?.(rowData.id).then(() => {
              message.success(newActionsConfig.deleteOptions?.successMessage)
            })
            tabelActionRef.current?.reload()
          }
        })
        return

      // 处理路径跳转操作
      case 'toPath':
        return
      case 'confirm':
        await Modal.confirm({
          ...newActionsConfig.confirmOptions?.confirmProps,
          async onOk() {
            await newActionsConfig.confirmOptions?.confirmRequest?.(rowData).then(() => {
              message.success(newActionsConfig.confirmOptions?.successMessage)
            })
            tabelActionRef.current?.reload()
          }
        })
        return
    }
  }

  const isHide = (formConfigItem: FormConfig) => {
    return typeof formConfigItem.hide === 'function' ? formConfigItem.hide(currentFormData) : formConfigItem.hide
  }

  // 条件渲染表单内容
  const handleRenderFormItem = (formConfig: FormConfig) => {
    switch (formConfig.type) {
      case 'input':
        return (
          !isHide(formConfig) && (
            <>
              <ProFormText {...formConfig} {...formConfig.inputOptions} />
              <span style={{ marginTop: '5px' }}>{formConfig.tail}</span>
            </>
          )
        )

      case 'limitInput':
        return (
          !isHide(formConfig) && (
            <>
              <ProFormLimitInput
                {...formConfig}
                {...formConfig.limitInputOptions}
                fieldProps={{ placeholder: formConfig.limitInputOptions?.placeholder, ...formConfig.limitInputOptions?.fieldProps }}
              />
              <span style={{ marginTop: '5px' }}>{formConfig.tail}</span>
            </>
          )
        )

      case 'uploadButton':
        return !isHide(formConfig) && <ProFormUploadButton {...formConfig} {...formConfig.uploadButtonOptions} fieldProps={{ beforeUpload: () => false }} />

      case 'digit':
        return (
          !isHide(formConfig) && (
            <>
              <ProFormDigit {...formConfig} {...formConfig.digitOptions} />
              <span style={{ marginTop: '5px' }}>{formConfig.tail}</span>
            </>
          )
        )

      case 'select':
        return (
          !isHide(formConfig) && (
            <>
              <ProFormSelect {...formConfig} {...formConfig.selectOptions} />
              <span style={{ marginTop: '5px' }}>{formConfig.tail}</span>
            </>
          )
        )

      case 'selectTable':
        if (formConfig.tableOptions?.fieldProps) {
          formConfig.tableOptions.fieldProps.rowSelection = {
            selections: [Table.SELECTION_ALL],
            onSelect(record, selected, selectedRows, nativeEvent) {
              tabelRef.current.selectRow = selectedRows
              setSelectRows(selectedRows)
            }
          }
        }
        return (
          !isHide(formConfig) && (
            <ProFormField {...formConfig}>
              <EnhanceTable {...formConfig.tableOptions} />
            </ProFormField>
          )
        )

      case 'info':
        return !isHide(formConfig) && <ProFormInfo {...formConfig} />

      case 'group':
        return (
          !isHide(formConfig) && (
            <ProFormGroup {...formConfig} {...formConfig.groupOptions}>
              {formConfig.groupChildren?.map((item) => handleRenderFormItem(item))}
            </ProFormGroup>
          )
        )
      default:
        return
    }
  }

  const handleModalContent = () => {
    if (dynamicActionsConfig.actionType === 'form') {
      if (dynamicActionsConfig.formOptions?.renderItem) {
        return dynamicActionsConfig.formOptions?.renderItem(currentFormData, formRef.current)
      } else {
        return dynamicActionsConfig.formOptions?.formConfig?.map((item) => handleRenderFormItem(item))
      }
    }
    return
  }

  // 处理回显数据
  const handleInitialValues = () => {
    // 无数据不做回显处理
    if (!rowData) return {}
    const formData = { ...rowData }

    // 对图片格式进行回显处理
    const uploadConfigs = dynamicActionsConfig.formOptions?.formConfig?.filter((item) => item.type === 'uploadButton')
    uploadConfigs?.map((item) => (formData[item.name] = [{ url: formData.imgUrl }]))

    return formData
  }

  // 处理提交
  const handleOnFinish = async (formData) => {
    // 上传请求队列
    const requestList: Promise<any>[] = []
    // 处理文件上传格式
    const uploadConfigs = dynamicActionsConfig.formOptions?.formConfig?.filter((item) => item.type === 'uploadButton')
    uploadConfigs?.map(async (item) => {
      const req = async () => {
        if (formData[item.name][0].originFileObj) {
          const uploadResult = await item.uploadButtonOptions?.uploadFn([formData[item.name][0].originFileObj])
          formData[item.name] = uploadResult[0]
        } else {
          formData[item.name] = formData[item.name][0].url
        }
      }
      requestList.push(req())
    })

    // 注入选择表单数据
    dynamicActionsConfig.formOptions?.formConfig?.forEach((item) => {
      if (item.type === 'selectTable') {
        formData[item.name] = tabelRef.current.selectRow
      }
    })

    // 执行字段数据格式化
    dynamicActionsConfig.formOptions?.formConfig?.map((item) => {
      if (item.formatFormField) formData[item.name] = item.formatFormField(formData[item.name])
      return item
    })

    // 执行表单数据格式化
    // formData = actionsConfig.formOptions?.formatFormData?.(formData)

    // 处理图片上传
    await Promise.all(requestList).finally(async () => {
      if (rowData) {
        formData = Object.assign(rowData, formData)
      }

      console.log('%c [ formData ]-223', 'font-size:13px; background:pink; color:#bf2c9f;', formData)
      // 提交表单
      if (dynamicActionsConfig.formOptions?.onFinish) {
        await dynamicActionsConfig.formOptions?.onFinish(formData)
      } else {
        await dynamicActionsConfig.formOptions?.submitRequest?.(formData).then(() => {
          dynamicActionsConfig.formOptions?.successMessage && message.success(dynamicActionsConfig.formOptions?.successMessage)
        })
      }

      // 关闭表单
      setVisble(false)

      // 刷新表格
      tabelActionRef.current?.reload()

      return true
    })
  }

  // 监听form数据变化，并保存当前数据
  const handleFormValueChange = (changeValues, allValues) => {
    console.log(allValues)
    setCurrentFormData(allValues)
  }

  return (
    <>
      <Button type={dynamicActionsConfig.buttonType} onClick={handleClickBtn} disabled={dynamicActionsConfig.formOptions?.disableAction?.(rowData)}>
        {dynamicActionsConfig.text}
      </Button>
      <ModalForm
        {...dynamicActionsConfig.formOptions}
        onValuesChange={handleFormValueChange}
        onFinish={handleOnFinish}
        formRef={formRef}
        initialValues={handleInitialValues()}
        title={dynamicActionsConfig.formOptions?.title || dynamicActionsConfig.text}
        visible={visble}
        modalProps={{
          ...dynamicActionsConfig.formOptions?.modalProps,
          onCancel: () => setVisble(false),
          okText:
            typeof dynamicActionsConfig.formOptions?.modalProps?.okText === 'function'
              ? dynamicActionsConfig.formOptions.modalProps.okText({ selectRows })
              : dynamicActionsConfig.formOptions?.modalProps?.okText
        }}
      >
        {handleModalContent()}
      </ModalForm>
    </>
  )
})

export default DynamicActions
