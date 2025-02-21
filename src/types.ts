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

export interface ILinearGradientColor {
    type: 'linear',
    colors: Array<any>,
    rotate: number
}
  
export interface IRadialGradientColor {
    type: 'radial',
    colors: Array<any>,
    center: [number, number], // 圆心, 默认[0.5, 0.5] 0-1
    radius: number // 半径, 默认0.5 0-1
}
  
export type IColor = ILinearGradientColor | IRadialGradientColor | string
  
export interface IPoster {
    width: number,
    height: number,
    background: IColor,
    directory: string,
    elements: IElement[],
    sort: number
}

export interface IElement {
    type: ElementType, // 元素类型 图片
    width: number, // 元素宽度
    height: number, // 元素高度
    align: ElementAlign, // 对齐方式
    zIndex: number, // 元素层级
    x: number | xAlign, // 元素坐标 或者 对齐方式
    y: number | yAlign, // 元素坐标 或者 对齐方式
    // 设置旋转
    rotate?: number,
    [key: string]: any
}

export enum IImageMode {
    scaleToFill = 'scaleToFill', // 	缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
    aspectFit = 'aspectFit', // 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。
    aspectFill = 'aspectFill' // 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
}

export interface TextFragmentStyle {
    color: string;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string | number;
    letterSpacing?: number;
}

export interface TextFragment extends TextFragmentStyle {
    content: string;
    width?: number,  // 文本宽度 计算得出
    fragmentId?: number;
}

export interface ElementImg extends IElement {
    type: ElementType.IMG, // 图片
    mode: IImageMode,
    content: string, // 图片地址
    gaussBlur: boolean, // 开启高斯模糊
    gaussRadius: number, // 高斯模糊半径
    borderRadius: number // 圆角
}

export interface ElementText extends IElement, TextFragmentStyle {
    type: ElementType.TEXT, // 文本
    content: string;
    lineHeight?: number;
    maxLine?: number;
}

export interface ElementMutipleText extends IElement, TextFragmentStyle {
    type: ElementType.MUTIPLE_TEXT, // 文本
    content: TextFragment[];
    lineHeight?: number;
    maxLine?: number;
}

export interface ElementRect extends IElement {
    type: ElementType.RECT, // 矩形
    color: IColor;
    borderColor: string, // 矩形边框颜色
    opacity?: number;
    gaussBlur?: boolean;
    gaussRadius?: number;
    borderRadius?: number;
}

export interface ElementLine extends IElement {
    color: string;
    opacity?: number;
    type: ElementType.LINE, // 线条
}