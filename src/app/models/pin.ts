import { DataType } from './data-type';
import { PinType } from './pin-type';

export type Pin = {
  id: number;
  name: string;
  pinType: PinType;
  dataType: DataType;
  blueprintId: number;
  agentId: number;
  value: string;
  srcPinId: number | null;
};
