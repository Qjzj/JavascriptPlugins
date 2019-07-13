# 图片上传
- 简单的图片上传，使用方法见，自己用着方便，上传到后端需要根据获取的文件自己来写

## 使用方法
``` html
  <script src="/js/imgUpload.js"></script>
  <div class="upload-contaner"></div>
```
``` script
    let contanier = document.querySelect('.upload-contaner');
    configure = {
        multiple: true,   // 是否多选
        max: 10,     // 最大上传数量 默认为10
        changeFn: function(files) {
            console.log(files);
        },
        deleteFn: function (src, files) {
            console.log(src);
            console.log(files);
        }
    }
    let upload = new ImageUpload(box, configure);
    upload.init();

```

## 配置项介绍
-  width: 60,           // 图片和上传按钮宽度  
-  height: 80,          // 图片和上传按钮高度
-  multiple: false,     // 是否上传多张图片
-  max: 10,             // 多图上传时最大上传数量
-  default: [],         // 初始默认显示的图片
-  changeFn: function(files) {},   // 选择图片之后的回调，参数为选择的图片数组
-  deleteFn: function(src) {}      // 删除图片时的回调，若该图片为初始化或者调用setDefaut方法生成的图片时参数为图片地址，否则为null

## 方法
- setDefault(imgList)    // 为组件是指默认值， 参数为图片路径数组
-  getFiles()              // 返回当前上传的图片文件数组
-  clean()                // 清除容器
-  destroy()             // 销毁组件



