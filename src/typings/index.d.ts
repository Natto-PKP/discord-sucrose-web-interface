export interface New {
  type?: string;
  label: string;
  file?: string;
  details?: string;
}

export interface SizeValue {
  height: number;
  width: number;
}

export interface PositionValue {
  x: number;
  y: number;
}

export interface NewMapping {
  list: New[];
}
