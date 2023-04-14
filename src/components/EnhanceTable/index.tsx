import React, { memo } from 'react';
import { useProTable } from '~/hooks/useProTable';
import ProTable from '@ant-design/pro-table';
import  { ActionsOptions } from './types';

type Props = ActionsOptions;

const EnhanceTable: React.FC<Props> = memo(props => {
  const proTableProps = useProTable(props);
  return <ProTable {...proTableProps} />;
});

export default EnhanceTable;
