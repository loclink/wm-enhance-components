import { Button } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActionType, ProColumns } from '@ant-design/pro-table';

import useProTableRequest from './useProTableRequest';
import DynamicActions from '../components/DynamicActions';
import { ActionsConfig, ActionsOptions } from './types';

/**
 * 公共的proTable hook
 * @param options
 * @returns
 */
export const useProTable = <T, ValueType = 'text'>(options: ActionsOptions<T, ValueType> = {}) => {
  const { tableActions, toolBarActions, exportOptions, fieldProps } = options;
  const [finalFieldProps, setFinalFieldProps] = useState(fieldProps);
  const tabelActionRef = useRef<ActionType | undefined>();
  const { request, exportTable, exportLoading } = useProTableRequest<T>(fieldProps?.request as any, {
    exportUrl: exportOptions?.url
  });

  const renderExportBtn = (searchConfig?) => {
    if (exportOptions) {
      return (
        <Button
          key='out'
          loading={exportLoading}
          onClick={() => {
            const values = searchConfig?.form?.getFieldsValue();
            exportTable(values);
          }}
        >
          导出
        </Button>
      );
    } else {
      return;
    }
  };

  // 处理浮层表单渲染内容
  const renderAction = (actionConfig: ActionsConfig, currentRowData?) => {
    let text;
    switch (actionConfig.key) {
      case 'create':
        text = '新增';
        break;
      case 'delete':
        text = '删除';
        break;
      case 'edit':
        text = '编辑';
        break;
      default:
        break;
    }
    if (!actionConfig.text) actionConfig.text = text;

    return <DynamicActions actionsConfig={actionConfig} rowData={currentRowData} tabelActionRef={tabelActionRef} />;
  };

  // 定义toolbar
  const toolBar = useCallback(() => {
    if (toolBarActions) {
      return () => toolBarActions.map(item => renderAction(item));
    } else {
      return;
    }
  }, []);

  // 处理表单操作栏
  const handleActionColumn = (): ProColumns => {
    return {
      dataIndex: 'operation',
      title: '操作',
      align: 'center',
      hideInSearch: true,
      render(_, row) {
        return tableActions?.map(item => {
          if (item.echos) {
            const finalRow = {};
            item.echos.forEach(key => {
              finalRow[key] = row[key];
            });
            return renderAction(item, finalRow);
          } else {
            return renderAction(item, row);
          }
        });
      }
    };
  };

  // 处理搜索配置
  const handleSearchConfig = () => {
    if (fieldProps?.search !== false) {
      let option = {};
      if (exportOptions) {
        option = {
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse(), renderExportBtn(searchConfig)]
        };
      }
      return { ...option, ...fieldProps?.search };
    } else {
      return fieldProps?.search;
    }
  };

  useEffect(() => {
    let newColumns = fieldProps?.columns?.filter(item => item.dataIndex !== 'operation');
    if (newColumns && tableActions) newColumns = [...newColumns, handleActionColumn()];
    setFinalFieldProps({
      ...fieldProps,
      columns: newColumns,
      actionRef: tabelActionRef,
      toolBarRender: toolBar(),
      search: handleSearchConfig(),
      request
    });
  }, []);

  return finalFieldProps;
};
