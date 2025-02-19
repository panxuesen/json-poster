export enum ElementType {
  IMG = 'img',
  TEXT = 'text',
  RECT = 'rect',
  LINE = 'line',
  MUTIPLE_TEXT = 'mutiple_text'
}

export enum xAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export enum yAlign {
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center'
}

export enum ElementAlign {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface IColor {
  type?: 'linear' | 'radial';
  colors?: [number, string][];
  rotate?: number;
  center?: [number, number];
  radius?: number;
}

export interface IElement {
  type: ElementType;
  x: number | xAlign;
  y: number | yAlign;
  width: number;
  height: number;
  zIndex?: number;
  align?: ElementAlign;
}

export interface TextFragmentStyle {
    color: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string | number;
    letterSpacing?: number;
}

export interface ElementImg extends IElement {
  content: string;
  mode?: string;
  gaussBlur?: boolean;
  gaussRadius?: number;
  borderRadius?: number;
}

export interface ElementText extends IElement,TextFragmentStyle {
  content: string;
  lineHeight?: number;
  maxLine?: number;
}

export interface ElementRect extends IElement {
  color: IColor | string;
  opacity?: number;
  gaussBlur?: boolean;
  gaussRadius?: number;
  borderRadius?: number;
}

export interface ElementLine extends IElement {
  color: string;
  opacity?: number;
}

export interface TextFragment extends TextFragmentStyle {
  content: string;
  fragmentId?: number;
}

export interface ElementMutipleText extends IElement,TextFragmentStyle {
    content: TextFragment[];
    lineHeight?: number;
    maxLine?: number;
}

export interface IPoster {
  width: number;
  height: number;
  background: IColor;
  elements: IElement[];
} 