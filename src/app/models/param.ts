import { DataType } from './data-type';

export type Param = {
  id: number;
  name: string;
  blueprintId: number;
  dataType: DataType;
  value: string;
  agentId: number;
};
