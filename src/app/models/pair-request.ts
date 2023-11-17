import { Blueprint } from './blueprint';

export type PairRequest = {
  id: number;
  blueprint: Blueprint;
  macAddr: string;
  date: string;
};
