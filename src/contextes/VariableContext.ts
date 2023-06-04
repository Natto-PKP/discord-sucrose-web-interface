import React from 'react';
import type Types from '../typings';
import type { SizeType } from '../utils/Query';

// # contexte interface
export interface VariableContextInterface {
  langs: {
    list: typeof langs;
    selected: string;
    setSelected: React.Dispatch<React.SetStateAction<string>>
  };
  window: { size: Types.SizeValue, type: SizeType, update: () => unknown };
  navigation: { size: Types.SizeValue, position: Types.PositionValue, update: () => unknown };
  mainBanner: { size: Types.SizeValue, position: Types.PositionValue, update: () => unknown };
  // mainBody: { size: Types.SizeValue, position: Types.PositionValue, update: () => unknown };
  main: { size: Types.SizeValue, position: Types.PositionValue, update: () => unknown };
  tags: { colors: { [key: string]: string } };
}

// # langs
export const langs = [
  { label: 'English', value: 'en', flag: 'fi fi-gb' },
  { label: 'Français', value: 'fr', flag: 'fi fi-fr' },
];

// # defaults
export const defaultLang = 'en';
export const defaultSizeValue = { width: 0, height: 0 };
export const defaultPositionValue = { x: 0, y: 0 };
export const defaultSetter = () => {};

export const defaultTagColors = {
  package: 'tag--purple',
  new: 'tag--yellow',
} as { [key: string]: string };

// # default variable context value
export const defaultVariableValue = {
  langs: { list: langs, selected: defaultLang, setSelected: () => defaultLang },
  tags: { colors: defaultTagColors },
  window: { size: defaultSizeValue, type: 'mobile' as SizeType, update: defaultSetter },
  navigation: { size: defaultSizeValue, position: defaultPositionValue, update: defaultSetter },
  mainBanner: { size: defaultSizeValue, position: defaultPositionValue, update: defaultSetter },
  // mainBody: { size: defaultSizeValue, position: defaultPositionValue, update: defaultSetter },
  main: { size: defaultSizeValue, position: defaultPositionValue, update: defaultSetter },
};

// # default variable context
export const Context = React.createContext<VariableContextInterface>(defaultVariableValue);
