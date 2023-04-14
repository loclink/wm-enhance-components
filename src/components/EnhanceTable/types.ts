import { ModalFormProps } from '@ant-design/pro-form';
import { ProTableProps } from '@ant-design/pro-table';
import { ProFormDraggerProps } from '@ant-design/pro-form/lib/components/UploadButton';
import { ProFormDigitProps } from '@ant-design/pro-form/lib/components/Digit';
import { ProFormSelectProps } from '@ant-design/pro-form/lib/components/Select';
import { GroupProps, ProFormFieldItemProps } from '@ant-design/pro-form/lib/interface';
import { InputProps, InputRef, ModalFuncProps } from 'antd';
import { ReactNode } from 'react';
import Password from 'antd/lib/input/Password';
import { FormInstance } from 'antd/es/form/Form';
import { IProFormLimitInputProps } from '../proFormLimitInput';
/**
 * 操作类型
 */
export type TableActionType = 'form' | 'toPath' | 'delete' | 'custom' | 'confirm';

/**
 * 按钮类型
 */
export type ButtonType = 'text' | 'link' | 'default' | 'ghost' | 'primary' | 'dashed' | undefined;

/**
 * 表单元素类型
 */
export type FormItemType =
  | 'input'
  | 'uploadButton'
  | 'limitInput'
  | 'digit'
  | 'select'
  | 'selectTable'
  | 'info'
  | 'group'
  | 'text';
interface ProFormLimitInputProps extends IProFormLimitInputProps {
  placeholder?: string | undefined;
}
interface IProFormSelectProps extends ProFormSelectProps {
  options?:
    | {
        label: any;
        value: any;
      }[]
    | string[];
}

/**
 * 表单配置
 */
export type FormConfig = {
  type: FormItemType;
  name: string;
  label?: string | ReactNode;
  hide?: boolean | ((formData) => boolean);
  required?: boolean;
  width?: number | 'xl' | 'lg' | 'md' | 'sm' | 'xs';
  tail?: ReactNode;
  formatFormField?: (itemData) => any;
  inputOptions?: ProFormFieldItemProps<InputProps, InputRef> & {
    Password?: typeof Password;
  };
  groupOptions?: GroupProps;
  groupChildren?: FormConfig[];
  limitInputOptions?: ProFormLimitInputProps;
  uploadButtonOptions?: ProFormDraggerProps & {
    uploadFn: (...params) => Promise<any>;
  };
  digitOptions?: ProFormDigitProps;
  selectOptions?: IProFormSelectProps;
  tableOptions?: ActionsOptions;
};

export type FormOptions = ModalFormProps & {
  submitRequest?: (formData) => Promise<any>;
  okText?: ReactNode | ((extraData) => ReactNode);
  successMessage?: string;
  disableAction?: (rowData: any) => boolean;
  renderItem?: (currentFormData, formInstance?: FormInstance) => ReactNode;
  formConfig?: FormConfig[];
  formatFormData?: (formData) => any;
};

/**
 * 操作配置
 */
export interface ActionsConfig {
  key: string;
  text?: string;
  buttonType?: ButtonType;
  actionType?: TableActionType;

  /**
   * 自定义回显key
   */
  echos?: string[];
  formOptions?: FormOptions;

  /**
   *  动态渲染
   * @param rowData
   * @returns
   */
  dynamicRender?: (rowData) => Promise<ActionsConfig>;
  /**
   * 确认操作配置
   */
  confirmOptions?: {
    confirmProps?: ModalFuncProps;
    confirmRequest?: (rowData) => Promise<any>;
    successMessage?: string;
  };
  toPathOptions?: {};
  deleteOptions?: {
    confirmProps?: ModalFuncProps;
    deleteRequest?: (...params) => Promise<any>;
    successMessage?: string;
  };
}

/**
 * ProTable参数类型
 */
export interface FieldProps<T, U, ValueType> extends ProTableProps<T, U, ValueType> {
  request: (...params) => Promise<any>;
}

export interface ActionsOptions<T = any, U = any, ValueType = 'text'> {
  fieldProps?: FieldProps<T, U, ValueType>;

  /**
   * @description 导出选项
   */
  exportOptions?: {
    url: string;
  };

  /**
   * @description 定义表单操作栏
   */
  tableActions?: ActionsConfig[];

  /**
   * @description 定义顶部工具栏
   */
  toolBarActions?: ActionsConfig[];
}
