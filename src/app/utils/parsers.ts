import { Result } from '../models/state';

export function parseId(str: string | null): Result<number, string> {
  if (str == null) {
    return {
      err: 'no id found',
    };
  }
  const id = Number(str);
  if (id == null || isNaN(id)) {
    return {
      err: 'invalid id',
    };
  }
  return {
    val: id,
  };
}
