# WMEnhanceComponents

武汉美萌软件前端开发组：后台组件库增强

## 安装：

```sh
 pnpm add wm-enhance-components --filter=@wmeimob/backend-template
```
## 使用

``` ts
// table.config.tsx
import { api } from '~/request'
import type { ProColumns } from '@ant-design/pro-table'
import WmTableSwitch from '~/components/WmProDesign/TableSwitch'
import { ActionsOptions, FormConfig } from 'wm-enhance-components'
import { upload } from '../../../../components/aliyun'
const columns: ProColumns[] = [
  {
    title: '创建时间',
    dataIndex: 'gmtCreated',
    align: 'center'
  },
  {
    title: '标题',
    dataIndex: 'name',
    align: 'center'
  },
  {
    title: 'Banner图片',
    dataIndex: 'imgUrl',
    valueType: 'image',
    align: 'center',
    fieldProps: {
      width: 100
    }
  },
  {
    title: '排序值',
    dataIndex: 'sort',
    align: 'center'
  },
  {
    title: '状态',
    valueType: 'switch',
    dataIndex: 'status',
    align: 'center',
    render: (_, row, index, action) => <WmTableSwitch rowData={row} action={action} dataIndex="status" request={api['/admin/mall/banner/updateStatus_PUT']} />
  }
]

const formConfig: FormConfig[] = [
  {
    type: 'uploadButton',
    name: 'imgUrl',
    label: '封面',
    uploadButtonOptions: {
      uploadFn: upload,
      max: 1,
      listType: 'picture-card',
      accept: 'image/png,image/jpeg,image/jpg',
      extra: <span style={{ color: 'orange' }}>建议上传 ?? * ??</span>,
      rules: [
        {
          required: true
        }
      ]
    }
  },
  {
    type: 'limitInput',
    name: 'name',
    label: '标题',
    limitInputOptions: {
      maxLength: 20,
      rules: [
        {
          required: true
        }
      ]
    }
  },
  {
    type: 'digit',
    name: 'sort',
    label: '排序值',
    digitOptions: {
      min: 0,
      max: 100,
      rules: [
        {
          required: true
        }
      ],
      extra: <span style={{ color: 'orange' }}>说明：排序值越大，展示越靠前</span>
    }
  },
  {
    type: 'select',
    name: 'status',
    label: '状态',
    selectOptions: {
      rules: [
        {
          required: true
        }
      ],
      options: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ]
    }
  }
]

export const proTableOptions: ActionsOptions = {
  fieldProps: {
    request: api['/admin/mall/banner/queryList_GET'],
    columns,
    search: false,
    bordered: true
  },

  tableActions: [
    {
      key: 'edit',
      actionType: 'form',
      buttonType: 'link',
      formOptions: {
        layout: 'horizontal',
        labelCol: { span: 2 },
        disableAction: (row) => row.status,
        submitRequest: api['/admin/mall/banner/update_PUT'],
        successMessage: '编辑成功',
        modalProps: {
          destroyOnClose: true,
          okText: '保存'
        },
        formConfig
      }
    },
    {
      key: 'delete',
      buttonType: 'link',
      actionType: 'delete',
      deleteOptions: {
        deleteRequest: api['/admin/mall/banner/delete/{id}_DELETE'],
        successMessage: '删除成功',
        confirmProps: {
          title: '确认删除',
          content: '确定删除该banner？'
        }
      }
    }
  ],
  toolBarActions: [
    {
      key: 'create',
      actionType: 'form',
      buttonType: 'primary',
      formOptions: {
        successMessage: '创建成功',
        layout: 'horizontal',
        labelCol: { span: 2 },
        modalProps: {
          destroyOnClose: true,
          okText: '保存'
        },
        submitRequest: api['/admin/mall/banner/add_POST'],
        formConfig
      }
    }
  ]
}

```

``` ts
// component.tsx
import React, { memo } from 'react'
import { PageContainer } from '@ant-design/pro-layout'
import { proTableOptions } from './config/table.config'
import { EnhanceTable } from 'wm-enhance-components'
const BannerManagement: React.FC = memo(() => {
  return (
    <PageContainer>
      <EnhanceTable {...proTableOptions} />
    </PageContainer>
  )
})
BannerManagement.displayName = 'BannerManagement'
export default BannerManagement
```