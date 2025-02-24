import sharp, { Blend } from 'sharp';
import axios from 'axios';
import fontkit from 'fontkit';
import { ElementType, ElementImg, ElementRect, ElementText, ElementLine, IPoster, IElement, IColor, ElementMutipleText, TextFragment, xAlign, yAlign, ElementAlign, TextFragmentStyle } from "./types";
// import { posterDatas } from './demoData';

// 使用fontkit或者canvas加载字体，或者直接将新加字体放到系统字体目录
// 加载字体

export const loadFont = (filename: string, postscriptName?: string) => {
  return fontkit.openSync(filename, postscriptName);
}

/**
 * 创建海报 多种对齐方式
 * 1、图片（高斯模糊、圆角、缩放模式）
 * 2、矩形（线性渐变、径向渐变、高斯模糊、圆角）
 * 3、文本（多行、省略号、字体设置）
 * 4、分片文本（多行、省略号、分片样式、字体设置）
 * 5、直线
 * 6、旋转【计划更新】
 * 7、贝塞尔曲线【计划更新】
 * 8、其他形状【计划更新】
 */

export const createPoster = async (data: IPoster) => {
  const { width, height, background, elements } = data;

  // 创建背景渐变
  const backgroundGradient = createGradientSVG(width, height, background);
  let image = sharp(Buffer.from(backgroundGradient));
  let composites = []

  // 按照zIndex排序
  const sortedElements = elements.sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const element of sortedElements) {
    const position = await getElementPosition(element, width, height);
    const type = element.type.toLocaleLowerCase();
    if (type === ElementType.IMG) {
      composites.push(await drawImgWithSharp(element as ElementImg, position)) 
    } else if (type === ElementType.TEXT) {
      composites.push(await drawTextWithSharp(element as ElementText, position))
    } else if (type === ElementType.RECT) {
      composites.push(await drawRectWithSharp(element as ElementRect, position))
    } else if (type === ElementType.LINE) {
      composites.push(await drawLineWithSharp(element as ElementLine, position))
    } else if (type === ElementType.MUTIPLE_TEXT) {
      composites.push(await drawMutipleTextWithSharp(element as ElementMutipleText, position))
    }
  }
  await image.composite(composites)
  
  return image; // stream

  // return image.png().toBuffer(); // buffer

  // return image.png().toBuffer().then(buf => `data:image/png;base64,${buf.toString('base64')}`); // base64

  // 将生成的海报写入文件
  // const outputPath = path.resolve(__dirname, './test.png');
  // await image.toFile(outputPath);
  // console.log(`Poster saved to ${outputPath}`);
};
async function drawImgWithSharp(element: ElementImg, position: { x: number, y: number }) {
  const response = await axios.get(element.content, { responseType: 'arraybuffer' });
  const imgBuffer = Buffer.from(response.data);
  const originalImage = sharp(imgBuffer);

  const metadata = await originalImage.metadata();

  const cropInfo = getCropImageInfo(element.mode, metadata.width!, metadata.height!, element.width, element.height);

  let processedBuffer = await originalImage
    .extract({ left: cropInfo.sx, top: cropInfo.sy, width: cropInfo.sw, height: cropInfo.sh })
    .resize(cropInfo.dw, cropInfo.dh)
    .toBuffer();
    
  if (element.gaussBlur) {
    let blurValue = (element.gaussRadius || 10) / 2 + 1
    processedBuffer = await sharp(processedBuffer).blur(blurValue).toBuffer();
  }
  if (element.borderRadius && element.borderRadius > 0) {
    let radiusMask = getRadiusMask({width: cropInfo.dw, height: cropInfo.dh, borderRadius: element.borderRadius});
    processedBuffer = await sharp(processedBuffer).png().composite([radiusMask]).toBuffer()
  }

  return { input: processedBuffer, top: position.y + cropInfo.offsetY, left: position.x + cropInfo.offsetX };
}

async function drawTextWithSharp(element: ElementText, position: { x: number, y: number }) {
  const content = await getTextContent(element)

  const lineHeight = element.lineHeight || (element.maxLine ? element.height / element.maxLine : element.fontSize)
  const padding = (lineHeight - element.fontSize) / 2
  let textSvg = ''
  for (let index = 0; index < content.length; index++) {
    const text = content[index];
    textSvg +=
      `<text x="0" y="${lineHeight * (index + 1) - padding}" font-family="${element.fontFamily || 'Arial'}" font-size="${element.fontSize}" letter-spacing="${element.letterSpacing || 0}" dominant-baseline="text-before-edge" text-anchor="start">
        ${text}
      </text>`
  }
  const svg = `
    <svg width="${element.width}" height="${element.height}" xmlns="http://www.w3.org/2000/svg">
        ${textSvg}
    </svg>
  `;
  const svgBuffer = Buffer.from(svg);
  return { input: svgBuffer, top: position.y, left: position.x }
}

async function drawMutipleTextWithSharp(element: ElementMutipleText, position: { x: number, y: number }) {
  let textFragments:TextFragment[] = []
  for (let j = 0; j < element.content.length; j++) {
    let text = removeRichTextLabel(element.content[j].content).split('')
    let subTextFragments:TextFragment[] = []
    for (let index = 0; index < text.length; index++) {
      let subTextFragment = getNewSubTextFragment(element, {
        ...element.content[j],
        content: text[index],
        fragmentId: j
      })
      subTextFragments.push(subTextFragment)
    }
    textFragments = textFragments.concat(subTextFragments)
  }
  const textFragmentsList = await getTextFragmentContent(element, textFragments)
  const lineHeight = element.lineHeight || (element.maxLine ? element.height / element.maxLine : element.fontSize)
  const padding = (lineHeight - element.fontSize) / 2
  let textSvg = ''
  for (let i = 0; i < textFragmentsList.length; i++) {
    const textFragmentsListItem = textFragmentsList[i]
    let tspanSvg = ''
    let textFragmentsItemId = null
    for (let j = 0; j < textFragmentsListItem.length; j++) {
      const textFragmentsItem = textFragmentsListItem[j]
      if (textFragmentsItemId !== textFragmentsItem.fragmentId) {
        textFragmentsItemId = textFragmentsItem.fragmentId
        tspanSvg +=
          `<tspan
            font-family="${textFragmentsItem.fontFamily || 'Arial'}"
            font-weight="${textFragmentsItem.fontWeight}"
            font-size="${textFragmentsItem.fontSize}"
            letter-spacing="${textFragmentsItem.letterSpacing || 0}"
            fill="${textFragmentsItem.color}"
          >`
      }
      tspanSvg += textFragmentsItem.content
      if (textFragmentsItemId !== textFragmentsListItem[j + 1]?.fragmentId || j === textFragmentsListItem.length - 1) {
        tspanSvg += '</tspan>'
      }
    }
    textSvg+= `<text x="0" y="${lineHeight * (i+1) - padding}" text-anchor="start">${tspanSvg}</text>`
  }
  const svg = `
    <svg width="${element.width}" height="${element.height}" xmlns="http://www.w3.org/2000/svg">
        ${textSvg}
    </svg>
  `;
  const svgBuffer = Buffer.from(svg);
  return { input: svgBuffer, top: position.y, left: position.x }
}

async function drawRectWithSharp(element: ElementRect, position: { x: number, y: number }) {
  let defsColor = getDefsColor(element.color)
  const svgRect = `
    <svg width="${element.width}" height="${element.height}" xmlns="http://www.w3.org/2000/svg">
      ${defsColor.defs}
      <rect width="${element.width}" height="${element.height}" ${defsColor.fillStyle} rx="${element.borderRadius}" ry="${element.borderRadius}" opacity="${element.opacity || 1}" />
    </svg>
  `;
  let svgBuffer = Buffer.from(svgRect);
  if (element.gaussBlur) {
    let blurValue = (element.gaussRadius || 10) / 2 + 1
    let radiusMask = getRadiusMask(element)
    svgBuffer = await sharp(svgBuffer).blur(blurValue).composite([radiusMask]).toBuffer();
  }
  return { input: svgBuffer, top: position.y, left: position.x }
}

// 创建圆角蒙版
function getRadiusMask(element: { width: number, height:number, borderRadius?:number }): { input: Buffer, blend: Blend } {
  const mask = Buffer.from(`
    <svg><rect 
      x="0" 
      y="0" 
      width="${element.width}" 
      height="${element.height}" 
      rx="${element.borderRadius || 0}" 
      ry="${element.borderRadius || 0}"
    /></svg>
  `);
  return {
    input: mask,
    blend: 'dest-in'
  };
}

async function drawLineWithSharp(element: ElementLine, position: { x: number, y: number }) {
  const svgLine = `
    <svg width="${element.width}" height="${element.height}" xmlns="http://www.w3.org/2000/svg">
      <line x1="0" y1="${element.height / 2}" x2="${element.width}" y2="${element.height / 2}" stroke="${element.color}" stroke-width="${element.height}" opacity="${element.opacity || 1}" />
    </svg>
  `;
  const svgBuffer = Buffer.from(svgLine);
  return { input: svgBuffer, top: position.y, left: position.x }
}

function createGradientSVG(width: number, height: number, color: IColor): string {
  let defsColor = getDefsColor(color)
  let svgstr =  `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${defsColor.defs}
      <rect width="100%" height="100%" ${defsColor.fillStyle} />
    </svg>
  `;
  return svgstr
}

function getDefsColor(color: IColor): { defs: string, fill: string, fillStyle: string } {
  if (typeof color === 'object' && color !== null && 'colors' in color) {
    let defs
    if (color.type === 'radial') {
      let { colors = [[0, '#fff'], [1, '#fff']], center = [0.5, 0.5], radius = 1.0 } = color;
      // 将中心点从0-1的比例转换为百分比
      const centerX = center[0] * 100;
      const centerY = center[1] * 100;
      
      // 将半径从0-1的比例转换为百分比
      const radiusPercent = radius * 100;
      
      defs = `
        <defs>
          <radialGradient id="rectGradient" cx="${centerX}%" cy="${centerY}%" r="${radiusPercent}%" fx="${centerX}%" fy="${centerY}%">
            ${colors.map(([offset, color]) => `
              <stop offset="${offset * 100}%" style="stop-color:${color};stop-opacity:1" />
            `).join('')}
          </radialGradient>
        </defs>
      `;
    } else {
      let { colors = [[0, '#fff'], [1, '#fff']], rotate = 0 } = color;
      // 标准化角度到 0-360 范围内
      const normalizedRotate = ((rotate % 360) + 360) % 360;
    
      // 计算渐变的起点和终点百分比坐标
      let x1, y1, x2, y2;
      
      // 处理特殊角度，避免三角函数计算误差
      if (normalizedRotate === 0) {
        // 从左到右
        x1 = 0; y1 = 0; x2 = 100; y2 = 0;
      } else if (normalizedRotate === 90) {
        // 从上到下
        x1 = 0; y1 = 0; x2 = 0; y2 = 100;
      } else if (normalizedRotate === 180) {
        // 从右到左
        x1 = 100; y1 = 0; x2 = 0; y2 = 0;
      } else if (normalizedRotate === 270) {
        // 从下到上
        x1 = 0; y1 = 100; x2 = 0; y2 = 0;
      } else {
        // 其他角度使用三角函数计算
        const radian = (normalizedRotate * Math.PI) / 180;
        const distance = 50; // 使用固定距离确保渐变覆盖
        
        // 以50%,50%为中心点计算
        x1 = 50 - Math.cos(radian) * distance;
        y1 = 50 - Math.sin(radian) * distance;
        x2 = 50 + Math.cos(radian) * distance;
        y2 = 50 + Math.sin(radian) * distance;
      }
      // 处理渐变色
      defs = `
        <defs>
          <linearGradient id="rectGradient" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
            ${colors.map(([offset, color]) => `
              <stop offset="${offset * 100}%" style="stop-color:${color};stop-opacity:1" />
            `).join('')}
          </linearGradient>
        </defs>
      `;
    }
    return { defs, fill: 'url(#rectGradient)', fillStyle: 'fill="url(#rectGradient)"' }
  } else {
    // 处理单一颜色
    return {
      defs: '',
      fill: typeof color === 'string' ? color : '',
      fillStyle: typeof color === 'string' ? `fill="${color}"` : '',
    }
  }
}

// 计算图片相关信息
// mode 图片裁剪、缩放的模式
// iw:图片实际宽度 ih:图片实际高度
// dw:图片在画布上需要绘制的宽度  dh:图片在画布上需要绘制的高度
// sx:图片裁剪的x起始坐标 sy:图片裁剪的y起始坐标
// sw:图片裁剪的宽度 sh图片裁剪的高度
// offsetX、offsetY  在aspectFit模式下，图片可能存在留白，需要进行偏移以保持坐标的准确性
function getCropImageInfo(mode: string = 'scaleToFill', iw: number, ih: number, dw: number, dh: number) {
  // 默认模式 scaleToFill	缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满 image 元素
  let sw = iw, sh = ih, dh1 = dh, dw1 = dw, sx = 0, sy = 0;
  let offsetX = 0, offsetY = 0, iScale = iw / ih, dScale = dw / dh;

  if (mode === 'aspectFit') {
    // aspectFit	缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。（返回新的绘制大小 需要重新计算绘制坐标）
    if (iScale > dScale) {
      dh1 = dw / iScale;
      offsetY = (dh - dh1) / 2;
    } else if (iScale < dScale) {
      dw1 = dh * iScale;
      offsetX = (dw - dw1) / 2;
    }
  } else if (mode === 'aspectFill') {
    // aspectFill	缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。
    if (iScale > dScale) {
      sw = ih * dScale;
    } else if (iScale < dScale) {
      sh = iw / dScale;
    }
    sx = (iw - sw) / 2;
    sy = (ih - sh) / 2;
  }

  return {
    sx: Number(sx.toFixed()), sy: Number(sy.toFixed()),
    sw: Number(sw.toFixed()), sh: Number(sh.toFixed()),
    dh: Number(dh1.toFixed()), dw: Number(dw1.toFixed()),
    offsetX: Number(offsetX.toFixed()), offsetY: Number(offsetY.toFixed())
  };
}

async function getElementPosition(element: IElement, canvasWidth: number, canvasHeight: number): Promise<{ x: number, y: number }> {
  let x: number = 0, y: number = 0, elementWidth = element.width
  const type = element.type.toLocaleLowerCase();
  if (type === ElementType.TEXT) {
    const elementText = element as ElementText
    let content = removeRichTextLabel(elementText.content)
    let TextFragment = {...element, content } as ElementText
    let contentWidth = await getTextWidth(TextFragment)
    if (contentWidth < elementWidth) {
      elementWidth = contentWidth
    }
  } else if (type === ElementType.MUTIPLE_TEXT) { 
    const elementMutipleText = element as ElementMutipleText
    let contentWidth = await getFragmentsTextWidth(elementMutipleText.content)
    if (contentWidth < elementWidth) {
      elementWidth = contentWidth
    }
  }

  if (element.x === xAlign.LEFT || element.align === ElementAlign.LEFT) {
    x = 0
  } else if (element.x === xAlign.RIGHT || element.align === ElementAlign.RIGHT) {
    x = canvasWidth - elementWidth
  } else if (element.x === xAlign.CENTER || element.align === ElementAlign.CENTER) {
    x = (canvasWidth - elementWidth) / 2
  } else {
    x = element.x
  }

  if (element.y === yAlign.TOP) {
    y = 0
  } else if (element.y === yAlign.BOTTOM) {
    y = canvasHeight - element.height
  } else if (element.y === yAlign.CENTER) {
    y = (canvasHeight - element.height) / 2
  } else {
    y = element.y
  }
  return { x: Number(x.toFixed()), y: Number(y.toFixed()) };
}

async function getTextContent(element: ElementText): Promise<string[]> {
  let maxLine = element.maxLine || Infinity
  let content = removeRichTextLabel(element.content) // 提取标签中的文案
  let strList = [] // 每一行的字符串
  let lineCount = 1 // 当前操作行为第几行
  let starIndex = 0 // 某一行第一个字符串在所有字符串中的索引
  let maxWidth = element.width // 最大宽度
  let ellipsisText = '...' // 省略号
  let lastLineAllTextWidth = 0 // 最后一行所有文字的宽度(包含溢出的总长度)
  for (let index = 1; index < content.length; index++) {
    let currentLineText = content.substring(starIndex, index) // 截取某一行第1个到第index个字符串片段
    let currentLineWidth = await getTextWidth(getNewSubTextFragment(element, {content: currentLineText})) // 获取该字符串片段长度
    if (!lastLineAllTextWidth && lineCount >= maxLine) {
      lastLineAllTextWidth = await getTextWidth(getNewSubTextFragment(element, {content: currentLineText + content.substring(index, content.length)})) // 获取该字符串片段长度
    }
    let addEllipsis = lineCount >= maxLine && (lastLineAllTextWidth > maxWidth) // 当前行是否添加省略号
    let ellipsisLineWidth = await getTextWidth(getNewSubTextFragment(element, {content: currentLineText + ellipsisText})) // 获取该字符串片段长度
    let compareWidth = addEllipsis ? ellipsisLineWidth : currentLineWidth // 要对比的宽度
    if (content[index] === '\n') { // 匹配到换行符 直接换行
      let endIndex = index
      strList.push(content.substring(starIndex, endIndex)) // 记录一行字符串
      starIndex = endIndex // 设置下一行首个字符串索引
      lineCount ++ // 换行
    } else if (compareWidth >= maxWidth) { // 当前行字符串宽度超过了最大宽度 开始换行操作
      let endIndex = compareWidth === maxWidth ? index : index - 1  // 最后一个字符串索引
      strList.push(content.substring(starIndex, endIndex) + (addEllipsis ? ellipsisText : '')) // 记录一行字符串 和末尾符号
      starIndex = endIndex // 设置下一行首个字符串索引
      lineCount ++ // 换行
    } else if (index === content.length - 1) { // 如果当前行字符串宽度没有超过最大宽度，但是已经到了最后一个字符串则直接截取最后一行字符串 结束整个循环
      strList.push(content.substring(starIndex, content.length))
      break
    }
    if (lineCount > maxLine) break // 超出最大行数不在循环剩余文字 结束整个循环
  }
  return strList
}

async function getTextFragmentContent(element: ElementMutipleText, textFragments: TextFragment[]): Promise<TextFragment[][]> {
  let maxLine = element.maxLine || Infinity // 最多显示几行文本
  let textFragmentsList: TextFragment[][] = [] // 每一行的字符串
  let lineCount = 1 // 当前操作行为第几行
  let starIndex = 0 // 某一行第一个字符串在所有字符串中的索引
  let maxWidth = element.width // 最大宽度
  let ellipsisTextFragment = getNewSubTextFragment(element, { content: '...' })
  let lastLineAllTextWidth = 0 // 最后一行所有文字的宽度(包含溢出的总长度)
  for (let index = 1; index < textFragments.length; index++) {
    let fragments = textFragments.slice(starIndex, index) // 截取某一行第1个到第index个字符串片段
    let currentLineWidth = await getFragmentsTextWidth(fragments) // 获取该字符串片段长度
    if (!lastLineAllTextWidth && lineCount >= maxLine) {
      lastLineAllTextWidth = await getFragmentsTextWidth([...fragments, ...textFragments.slice(index, textFragments.length)]) // 获取该字符串片段长度
    }
    let addEllipsis = lineCount >= maxLine && (lastLineAllTextWidth > maxWidth) // 当前行是否添加省略号
    let ellipsisLineWidth = await getFragmentsTextWidth([...fragments, ellipsisTextFragment]) // 获取该字符串片段长度
    let compareWidth = addEllipsis ? ellipsisLineWidth : currentLineWidth // 要对比的宽度
    if (textFragments[index].content === '\n') { // 匹配到换行符 直接换行
      let endIndex = index
      textFragmentsList.push(textFragments.slice(starIndex, endIndex)) // 记录一行字符串
      starIndex = endIndex // 设置下一行首个字符串索引
      lineCount ++ // 换行
    } else if (compareWidth >= maxWidth) { // 当前行字符串宽度超过了最大宽度 开始换行操作
      let endIndex = compareWidth === maxWidth ? index : index - 1  // 最后一个字符串索引
      textFragmentsList.push([...textFragments.slice(starIndex, endIndex), ...(addEllipsis ? [ellipsisTextFragment] : [])]) // 记录一行字符串 和末尾符号
      starIndex = endIndex // 设置下一行首个字符串索引
      lineCount ++ // 换行
    } else if (index === textFragments.length - 1) { // 如果当前行字符串宽度没有超过最大宽度，但是已经到了最后一个字符串则直接截取最后一行字符串 结束整个循环
      textFragmentsList.push(textFragments.slice(starIndex, textFragments.length))
      break
    }
    if (lineCount > maxLine) break // 超出最大行数不在循环剩余文字 结束整个循环
  }
  return textFragmentsList
}

function getNewSubTextFragment(father: TextFragmentStyle, params: any): TextFragment {
  return {
    fontFamily: father.fontFamily || 'Arial',
    fontWeight: father.fontWeight,
    color: father.color,
    fontSize: father.fontSize,
    letterSpacing: father.letterSpacing,
    ...params
  }
}

async function getFragmentsTextWidth(textFragments: TextFragment[]):Promise<number> {
  let tspanSvg = ''
  let textFragmentId = null
  for (let i = 0; i < textFragments.length; i++) {
    const textFragmentsItem = textFragments[i]
    if (textFragmentId !== textFragmentsItem.fragmentId) {
      textFragmentId = textFragmentsItem.fragmentId
      tspanSvg +=
        `
        <tspan
          font-family="${textFragmentsItem.fontFamily || 'Arial'}"
          font-weight="${textFragmentsItem.fontWeight}"
          font-size="${textFragmentsItem.fontSize}"
          letter-spacing="${textFragmentsItem.letterSpacing || 0}"
          fill="${textFragmentsItem.color}"
        >
        `
    }
    tspanSvg += textFragmentsItem.content
    if (textFragmentId !== textFragments[i + 1]?.fragmentId || i === textFragments.length - 1) {
      tspanSvg +=
      `
        </tspan>
      `
    }
  }
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg">
      <text x="50%" y="100%" text-anchor="middle">
        ${tspanSvg}
      </text>
    </svg>
  `;
  let img = await sharp(Buffer.from(svg)).metadata()
  return img.width || 0
}

async function getTextWidth(fontObj: TextFragment): Promise<number> {
  if (fontObj.content === '\n' || !fontObj.content) return 0
  const svgText = `
  <svg xmlns="http://www.w3.org/2000/svg">
    <text
      x="50%"
      y="100%"
      font-size="${fontObj.fontSize || 16}"
      font-weight="${fontObj.fontWeight || 'normal'}"
      font-family="${fontObj.fontFamily || 'Arial'}"
      letter-spacing="${fontObj.letterSpacing || 0}"
      text-anchor="middle"
    >
    ${fontObj.content}
    </text>
  </svg>
  `;
  let img = await sharp(Buffer.from(svgText)).metadata()
  return img.width || 0
}

// 去除富文本标签
function removeRichTextLabel(richText: string):string {
  let reg = new RegExp(/<.+?>/g)
  let content = ''
  if (reg.test(richText)) {
    /* 去除富文本中的html标签 */
    /* *、+限定符都是贪婪的，因为它们会尽可能多的匹配文字，只有在它们的后面加上一个?就可以实现非贪婪或最小匹配。*/
    content = richText.replace(reg, '');
    // /* 去除  */
    // content = content.replace(/ /ig, '')
    // /* 去除空格 */
    // content = content.replace(/\s/ig, '')
  } else {
    content = richText
  }

  return content
}
