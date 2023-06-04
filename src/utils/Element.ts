import type { MutableRefObject } from 'react';
import type { SizeValue, PositionValue } from '../typings';

export default class Element {
  static getSize(element?: MutableRefObject<unknown>): SizeValue {
    const e = element as MutableRefObject<HTMLElement>;
    const width = element ? e.current?.offsetWidth || 0 : window.innerWidth;
    const height = element ? e.current?.offsetHeight || 0 : window.innerHeight;
    return { height, width };
  }

  static getPosition(element?: MutableRefObject<unknown>): PositionValue {
    const e = element as MutableRefObject<HTMLElement>;
    const x = element ? e.current?.getBoundingClientRect().x || 0 : 0;
    const y = element ? e.current?.getBoundingClientRect().y || 0 : 0;
    return { y, x };
  }
}
