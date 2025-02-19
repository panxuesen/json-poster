# 🎨 json-poster

通过配置 JSON 快速生成精美海报。

<p align="center">
  <img src="./src/img/banner.jpg" alt="json-poster banner" width="800"/>
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
- 📝 **文字处理** - 支持多行文本、省略号、自定义字体等
- 🖼️ **图片处理** - 支持多种缩放模式、高斯模糊、圆角等
- 📚 **字体加载** - 支持自定义字体加载

## 📦 安装

```bash
npm install json-poster
# 或者
yarn add json-poster
```

## 🚀 快速开始

```typescript
import { createImagesWithSharp } from 'json-poster';

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
const poster = await createImagesWithSharp(posterConfig);
```

## 📖 配置说明

### 基础配置

| 参数 | 类型 | 说明 |
|------|------|------|
| width | number | 海报宽度 |
| height | number | 海报高度 |
| background | object/string | 背景配置 |
| elements | array | 元素列表 |

### 元素类型

- 🖼️ **图片 (img)**
  - 支持远程图片
  - 多种缩放模式
  - 圆角和模糊效果

- 📝 **文本 (text)**
  - 单行/多行文本
  - 自定义字体
  - 文本省略
  - 对齐方式

- 🟦 **矩形 (rect)**
  - 纯色/渐变背景
  - 圆角
  - 透明度

- ➖ **直线 (line)**
  - 自定义颜色
  - 线条粗细
  - 透明度

## 🌈 渐变配置

### 线性渐变

```typescript
{
  type: 'linear',
  colors: [
    [0, '#ff5f6d'],
    [1, '#ffc371']
  ],
  rotate: 45  // 渐变角度
}
```

### 径向渐变

```typescript
{
  type: 'radial',
  colors: [
    [0, '#ff5f6d'],
    [1, '#ffc371']
  ],
  center: [0.5, 0.5],  // 中心点位置
  radius: 1.0  // 半径
}
```

## 🎯 图片缩放模式

- `scaleToFill`: 完全填充，不保持比例
- `aspectFit`: 保持比例，完整显示
- `aspectFill`: 保持比例，裁剪显示

## 📚 更多示例

### 圆角头像

```typescript
{
  type: 'img',
  content: 'https://example.com/avatar.jpg',
  width: 100,
  height: 100,
  x: 'center',
  y: 100,
  borderRadius: 50,
  mode: 'aspectFill'
}
```

### 渐变背景文本

```typescript
{
  type: 'rect',
  width: 200,
  height: 60,
  x: 'center',
  y: 200,
  color: {
    type: 'linear',
    colors: [[0, '#ff5f6d'], [1, '#ffc371']],
    rotate: 45
  },
  borderRadius: 30
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 开源协议

[MIT](LICENSE)
