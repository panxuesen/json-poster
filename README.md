# 🎨 json-poster

通过配置 JSON 快速生成精美海报。

<p align="center">
  <img src="./src/img/banner.jpg" alt="json-poster banner" width="400"/>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/json-poster">
    <img src="https://img.shields.io/npm/v/json-poster.svg" alt="npm version">
  </a>
  <a href="https://www.npmjs.com/package/json-poster">
    <img src="https://img.shields.io/npm/dm/json-poster.svg" alt="downloads">
  </a>
  <a href="https://github.com/panxuesen/json-poster/blob/main/LICENSE">
    <img src="https://img.shields.io/npm/l/json-poster.svg" alt="license">
  </a>
</p>

## ✨ 特性

- 🚀 **简单易用** - 通过 JSON 配置快速生成海报
- 🎯 **功能丰富** - 支持图片、文字、矩形、线条等多种元素
- 🎨 **样式灵活** - 支持渐变、模糊、圆角等多种效果
- 📏 **对齐方式** - 支持多种对齐方式，轻松实现元素定位
- 📝 **文字处理** - 支持普通文本和富文本，多行文本自动换行，省略号等
- 🖼️ **图片处理** - 支持多种缩放模式、高斯模糊、圆角等
- 📚 **字体加载** - 支持自定义字体加载

## 🛠 环境要求

注意：需在Node环境下运行，非浏览器环境

- Node.js: ^18.17.0 或 >= 20.3.0
- 依赖库: sharp（图像处理）, fontkit（字体处理）

## 📦 安装

```bash
npm install json-poster
# 或者
yarn add json-poster
```

## 🚀 基础用法

```typescript
import { createPoster } from 'json-poster';

const posterConfig = {
  width: 750,
  height: 1334,
  background: {
    type: 'linear',
    colors: [
      [0, '#ff5f6d'],
      [1, '#ffc371']
    ],
    rotate: 45
  },
  elements: [
    {
      type: 'img',
      content: 'https://example.com/image.jpg',
      width: 200,
      height: 200,
      x: 'center',
      y: 100,
      borderRadius: 100,
      gaussBlur: true
    },
    {
      type: 'text',
      content: '这是一段示例文本',
      width: 500,
      height: 40,
      x: 'center',
      y: 350,
      fontSize: 28,
      color: '#ffffff'
    }
  ]
};

// 生成海报
const poster = await createPoster(posterConfig);
```

## 📖 配置说明

### 基础配置

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| width | number | 是 | 海报宽度 |
| height | number | 是 | 海报高度 |
| background | IColor/string | 是 | 背景配置 |
| elements | IElement[] | 是 | 元素列表 |

### 元素公共属性

所有元素都支持以下属性：

| 属性 | 类型 | 说明 |
|------|------|------|
| type | string | 元素类型：'img'/'text'/'rect'/'line'/'mutiple_text' |
| x | number/string | x坐标，支持数字或'left'/'right'/'center' |
| y | number/string | y坐标，支持数字或'top'/'bottom'/'center' |
| width | number | 元素宽度 |
| height | number | 元素高度 |
| zIndex | number | 层级，默认为0 |
| align | string | 对齐方式：'left'/'right'/'center' |

### 元素类型

#### 🖼️ 图片元素 (type: 'img')

```typescript
{
  type: 'img',
  content: 'https://example.com/image.jpg', // 图片URL
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill', // 缩放模式
  gaussBlur?: boolean, // 是否启用高斯模糊
  gaussRadius?: number, // 模糊半径
  borderRadius?: number // 圆角大小
}
```

图片缩放模式说明：
- `scaleToFill`：默认模式，不保持纵横比完全填充
- `aspectFit`：保持纵横比，完整显示图片，可能会有留白
- `aspectFill`：保持纵横比，填满显示区域，可能会裁剪

#### 📝 文本元素 (type: 'text')

```typescript
{
  type: 'text',
  content: '文本内容',
  color: '#000000',
  fontSize: 24,
  fontFamily?: string,
  fontWeight?: string | number,
  letterSpacing?: number,
  lineHeight?: number,
  maxLine?: number // 最大行数，超出显示省略号
}
```

#### 📝 富文本元素 (type: 'mutiple_text')

支持同一段文本使用不同样式：

```typescript
{
  type: 'mutiple_text',
  content: [
    {
      content: '第一段文本',
      color: '#ff0000',
      fontSize: 24,
      fontWeight: 'bold'
    },
    {
      content: '第二段文本',
      color: '#00ff00',
      fontSize: 20,
      fontWeight: 'normal'
    }
  ],
  lineHeight?: number,
  maxLine?: number
}
```

#### 🟦 矩形元素 (type: 'rect')

```typescript
{
  type: 'rect',
  color: '#000000' | {
    type: 'linear' | 'radial',
    colors: [[0, '#start'], [1, '#end']],
    rotate?: number,      // 线性渐变的角度
    center?: [0.5, 0.5], // 径向渐变的中心点
    radius?: number      // 径向渐变的半径
  },
  opacity?: number,
  gaussBlur?: boolean,
  gaussRadius?: number,
  borderRadius?: number
}
```

#### ➖ 线条元素 (type: 'line')

```typescript
{
  type: 'line',
  color: '#000000',
  opacity?: number // 透明度
}
```

## 🌈 渐变配置

### 线性渐变

```typescript
{
  type: 'linear',
  colors: [
    [0, '#ff5f6d'],   // 起始颜色及位置
    [1, '#ffc371']    // 结束颜色及位置
  ],
  rotate: 45  // 渐变角度，0-360
}
```

### 径向渐变

```typescript
{
  type: 'radial',
  colors: [
    [0, '#ff5f6d'],  // 内圈颜色及位置
    [1, '#ffc371']   // 外圈颜色及位置
  ],
  center: [0.5, 0.5], // 中心点位置，范围0-1
  radius: 1.0         // 半径大小，范围0-1
}
```

## 📚 更多示例

### 圆形头像卡片

```typescript
{
  type: 'img',
  content: 'https://example.com/avatar.jpg',
  width: 100,
  height: 100,
  x: 'center',
  y: 50,
  borderRadius: 50,
  mode: 'aspectFill'
}
```

### 渐变背景文本卡片

```typescript
[
  {
    type: 'rect',
    width: 300,
    height: 80,
    x: 'center',
    y: 100,
    color: {
      type: 'linear',
      colors: [[0, '#ff5f6d'], [1, '#ffc371']],
      rotate: 45
    },
    borderRadius: 8
  },
  {
    type: 'text',
    content: '渐变背景文本',
    width: 260,
    height: 40,
    x: 'center',
    y: 120,
    fontSize: 24,
    color: '#ffffff'
  }
]
```

### 带高斯模糊的背景图

```typescript
{
  type: 'img',
  content: 'https://example.com/bg.jpg',
  width: 750,
  height: 400,
  x: 0,
  y: 0,
  gaussBlur: true,
  gaussRadius: 20,
  mode: 'aspectFill'
}
```

### 多样式文本示例

```typescript
{
  type: 'mutiple_text',
  content: [
    {
      content: '¥',
      color: '#FF0000',
      fontSize: 24
    },
    {
      content: '99',
      color: '#FF0000',
      fontSize: 36,
      fontWeight: 'bold'
    },
    {
      content: '.99',
      color: '#FF0000',
      fontSize: 24
    }
  ],
  width: 200,
  height: 40,
  x: 'center',
  y: 100
}
```

## 🔮 计划中的功能

- 元素旋转
- 更多图形支持

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

[MIT](LICENSE)
