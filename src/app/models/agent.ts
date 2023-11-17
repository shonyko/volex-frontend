import { Blueprint } from './blueprint';

export type Agent = {
  id: number;
  name: string;
  blueprint: Blueprint;
  macAddr: string;
};
