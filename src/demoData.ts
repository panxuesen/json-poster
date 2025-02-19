// demo数据
export const posterDatas = [{
  width: 600, // 海报宽度
  height: 710, // 海报高度
  directory: 'poster', // 海报存放目录
  background: {
    // linear 线性渐变
    type: 'linear', // 渐变类型 linear 线性渐变 radial 径向渐变
    rotate: 90, // 渐变角度，取0到90度 从上到下渐变取90度， 从左到右渐变取0度  对角为45度
    colors: [[0, '#FFF5E8'], [1, '#FFF5E8']] // 建变过程控制，0 到 1，可设置多个 0.2 0.5 等等

    // radial 径向渐变
    // type: 'radial', // 渐变类型 linear 线性渐变 radial 径向渐变
    // colors: [[0, '#FFF5E8'], [1, '#FFF5E8']], // 建变过程控制，0 到 1，可设置多个 0.2 0.5 等等
    // center: [0.5, 0.5], // 渐变圆心, 默认[0.5, 0.5] 0-1
    // radius: 0.5 // 渐变半径, 默认0.5 0-1
  },
  sort: 0,
  elements: [
    {
      type: "IMG",
      content: 'https://static.lvtuguanjia.com/trip/tojoy/img/h5/app-liquidation/train-icon.png',
      // content: 'https://test-1258763073.cos.ap-beijing.myqcloud.com/image/applet/api/qr/a35a633d54364d99b44d73c1dd84e052.png',
      width: 298,
      height: 270,
      align: 'center', // 水平对齐方式
      mode: 'aspectFit',
      zIndex: 0,
      borderRadius: 10,
      gaussBlur: false, // 开启高斯模糊
      gaussRadius: 40, // 高斯模糊半径
      x: 'center',
      y: 'center'
    },
    {
      type: 'MUTIPLE_TEXT',
      content: [{
        fontFamily: 'D-DIN-PRO',
        // fontFamily: 'D-DIN-PRO-700-Bold',
        fontWeight: 400,
        color: '#333333',
        fontSize: 33,
        letterSpacing: 0,
        content: '测试数据'
      },
      {
        fontFamily: 'D-DIN-PRO',
        // fontFamily: 'D-DIN-PRO-700-Bold',
        fontWeight: 600,
        color: 'red',
        fontSize: 43,
        letterSpacing: 0,
        content: '哈哈哈'
      }, {
        fontFamily: 'D-DIN-PRO',
        // fontFamily: 'D-DIN-PRO-700-Bold',
        fontWeight: 400,
        color: '#333333',
        letterSpacing: 0,
        fontSize: 33,
        content: '车票下单仅支持中国居民身份证港澳台居民居住证'
      }],
      width: 420,
      height: 90,
      align: 'center', // 对齐方式
      fontFamily: 'D-DIN-PRO',
      // fontFamily: 'D-DIN-PRO-700-Bold',
      fontWeight: 400,
      color: '#333333',
      letterSpacing: 0,
      fontSize: 33,
      maxLine: 2, // 最大行数 超出自动显示省略号
      zIndex: 1,
      x: 86,
      y: 600
    },
    // {
    //   type: 'TEXT',
    //   content: '测试数据',
    //   width: 230,
    //   height: 84,
    //   align: 'center', // 对齐方式
    //   fontFamily: 'D-DIN-PRO',
    //   // fontFamily: 'D-DIN-PRO-700-Bold',
    //   fontWeight: 400,
    //   color: '#333333',
    //   letterSpacing: 0,
    //   fontSize: 33,
    //   maxLine: 2, // 最大行数 超出自动显示省略号
    //   zIndex: 1,
    //   x: 'center',
    //   y: 'center'
    // },
    {
      type: 'LINE', // 线条
      height: 1, // 线条高度 线条粗细
      width: 430, // 线条宽度
      align: 'center', // 对齐方式
      color: '#F1F1F1', // 线条颜色
      zIndex: 0,
      x: 86,
      y: 586
    },
    // {
    //   type: 'RECT', // 矩形
    //   width: 400, // 矩形宽度
    //   height: 400, // 矩形高度
    //   align: 'center', // 对齐方式
    //   gaussBlur: true, // 开启高斯模糊
    //   gaussRadius: 1000, // 高斯模糊半径
    //   // color:'red',
    //   color: {
    //     rotate: 90, // 渐变角度，取0到90度 从上到下渐变取90度， 从左到右渐变取0度  对角为45度
    //     colors: [[0, 'red'], [1, '#fff']] // 建变过程控制，0 到 1，可设置多个 0.2 0.5 等等
    //   }, // 矩形颜色
    //   borderRadius: 30,
    //   zIndex: 0,
    //   x: 84,
    //   y: 270
    // }
  ]
},
  {
    "width": 596, "height": 1060, "background": "#fff", "sort": 1, "elements": [
      { "type": "IMG", "content": "https://static.tojoyshop.com/images/wxapp-boss/poster-logo.png", "width": 234.5, "height": 84, "align": "center", "zIndex": 0, "x": 181, "y": 39 },
      { "type": "IMG", "content": "https://tojoy-mall-test.oss-cn-beijing.aliyuncs.com/product/swiper/1721872801195.jpg", "width": 520, "height": 520, "borderRadius": 4, "align": "center", "zIndex": 0, "x": 38, "y": 157 },
      { "type": "TEXT", "content": "步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋步力宝悬磁鞋", "width": 520, "height": 84, "align": "center", "fontFamily": "", "fontWeight": 400, "color": "#333333", "fontSize": 30, "maxLine": 2, "zIndex": 0, "x": 38, "y": 717 },
      { "type": "LINE", "width": 522, "height": 1, "align": "center", "color": "#F1F1F1", "zIndex": 0, "x": 38, "y": 820 },
      { "type": "TEXT", "content": "长按识别二维码", "width": 200, "height": 38, "align": "left", "fontFamily": "", "fontWeight": 400, "color": "#333333", "fontSize": 25, "maxLine": 1, "zIndex": 0, "x": 38, "y": 889 },
      { "type": "TEXT", "content": "查看商品详情", "width": 200, "height": 38, "align": "left", "fontFamily": "", "fontWeight": 400, "color": "#333333", "fontSize": 25, "maxLine": 1, "zIndex": 0, "x": 38, "y": 927 },
      { "type": "IMG", "content": "https://pre-resource.kang-boss.com/bh-mall/self/wechat/qr/2c645c528af9421595e76f14dc857d84.png", "width": 166, "height": 166, "align": "left", "zIndex": 0, "x": 385, "y": 844 }]
  }]