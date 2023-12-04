import { DataType } from '../models/data-type';
import { Param } from '../models/param';
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

export function componentToHex(c: number) {
  return c.toString(16).padStart(2, '0');
}

export function rgbToHex(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result?.slice(1).map((x) => parseInt(x, 16));
}

export function parseParamValue(pin: Param) {
  switch (pin.dataType) {
    case DataType.BOOLEAN: {
      return /^true$/i.test(pin.value);
    }
    case DataType.INTEGER: {
      return parseInt(pin.value);
    }
    case DataType.RGB: {
      const rgb = JSON.parse(pin.value);
      return rgbToHex(rgb[0], rgb[1], rgb[2]);
    }
    default: {
      return pin.value;
    }
  }
}
