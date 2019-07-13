/**
 * @Author QJ
 * @date 2019--10 09:25
 * @desc imgUpload.js
 */
(function (w) {
    let ImageUpload = function (el, configure = {}) {
        const OBJ = el;   // 承载容器
        let OPTIONS = {
            width: 60,
            height: 80,
            multiple: false,
            max: 10,
            default: [],
            changeFn: function(files) {},
            deleteFn: function(src) {}
        };
        Object.assign(OPTIONS, configure);

        let ImgWrap = null;     // 图片容器
        let UploadButton = null;  // 上传按钮

        const ClassObject = {
          currentLength: 0,
          currentFile: [],
        };


        this.init = function () {
            createWrap();
            setDefault(OPTIONS.default);
        };

        /**
         * 获取文件
         * @returns {Array}
         */
        this.getFiles = function () {
          return ClassObject.currentFile;
        };

        /**
         * 设置图片默认值
         * @param imgList
         */
        this.setDefault = function (imgList) {
            setDefault(imgList);
        };

        /**
         * 清除图片
         */
        this.clean = function() {
          ClassObject.currentFile = [];
          ClassObject.currentLength = 0;
          for(let i=0; i<ImgWrap.children.length; i++) {
              let item = ImgWrap.children[i];
              if(item.nodeName.toLowerCase() === 'div') {
                  item.remove();
                  i--;
              }
          }
          toggleUploadBtn(true);
        };

        /**
         * 销毁函数
         */
        this.destroy = function() {
          OBJ.innerHTML = '';
          ImgWrap = null;
          UploadButton = null;
        };

        /**
         * 设置初始图片
         * @returns {null}
         */
        function setDefault(imgList) {
            if(imgList.length === 0) return null;
            const tempFrags = document.createDocumentFragment();
            if(imgList.length > OPTIONS.max) imgList.splice(0, OPTIONS.max);
            imgList.forEach((value) => {
                const img = createImg(value);
                tempFrags.appendChild(img);
            });

            if(ImgWrap.children.length === 0) {
                ImgWrap.appendChild(tempFrags);
            }else {
                ImgWrap.insertBefore(tempFrags, ImgWrap.firstChild);
            }
        }


        /**
         * 创建组件容器和上传按钮
         */
        function createWrap() {
            ImgWrap = document.createElement("div");
            UploadButton = document.createElement('label');
            let input = document.createElement('input');
            let icon = document.createElement('span');
            ImgWrap.appendChild(UploadButton);
            UploadButton.appendChild(input);
            UploadButton.appendChild(icon);
            input.setAttribute('type', 'file');
            input.style.display = 'none';
            input.addEventListener('change', inputChange);
            OPTIONS.multiple && input.setAttribute('multiple', true);

            // 设置添加符号的样式
            icon.innerText = '+';
            icon.style.display = 'inline-block';
            icon.style.width = '20px';
            icon.style.height = '20px';
            icon.style.lineHeight = '16px';
            icon.style.fontSize = '20px';
            icon.style.color = '#ccc';
            icon.style.transform = 'scale(2)';


            // 设置上传按钮的样式
            UploadButton.style.display = 'inline-block';
            UploadButton.style.marginBottom = '10px';
            UploadButton.style.width = OPTIONS.width + 'px';
            UploadButton.style.height = OPTIONS.height + 'px';
            UploadButton.style.textAlign = 'center';
            UploadButton.style.lineHeight = OPTIONS.height + 'px';
            UploadButton.style.border = '2px solid #e8e8e8';
            UploadButton.style.boxSizing = 'border-box';

            OBJ.appendChild(ImgWrap);
        }

        /**
         * 创建图片
         * @param url
         * @param name
         * @returns {HTMLDivElement}
         */
        function createImg(url, name) {
            let imgBox = document.createElement('div');
            let img = document.createElement('img');
            let delIcon = document.createElement('span');

            imgBox.appendChild(img);
            imgBox.appendChild(delIcon);

            imgBox.style.display = 'inline-block';
            imgBox.style.width = OPTIONS.width + 'px';
            imgBox.style.height = OPTIONS.height + 'px';
            imgBox.style.boxSizing = 'border-box';
            imgBox.style.position = 'relative';
            imgBox.style.borderRadius = '3px';
            imgBox.style.verticalAlign = 'top';
            imgBox.style.marginRight = '10px';
            imgBox.style.overflow = 'hidden';

            img.setAttribute('src', url);
            img.style.width = '100%';
            img.style.height = '100%';

            delIcon.addEventListener('click', deleteImg);
            if(name) delIcon.setAttribute('data-name', name);
            delIcon.innerText = '×';
            delIcon.style.position = 'absolute';
            delIcon.style.top = '2px';
            delIcon.style.right = '2px';
            delIcon.style.width = '20px';
            delIcon.style.height = '20px';
            delIcon.style.fontSize = '18px';
            delIcon.style.color = 'red';
            delIcon.style.fontWeight = 'bold';
            delIcon.style.cursor = 'pointer';

            return imgBox;
        }

        /**
         * 上传文件时
         * @param e
         */
        function inputChange(e) {
            let files = Array.from(e.target.files);
            if(OPTIONS.multiple) {
                const elementFlags = document.createDocumentFragment();
                let completeCount = 0;  //
                let len = files.length;
                if(OPTIONS.max < ClassObject.currentLength + len) {
                    len = OPTIONS.max - ClassObject.currentLength;
                    files = files.slice(0, len);
                }
                for (let i=0; i<len; i++) {
                    const file = files[i];
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload = function() {
                        ClassObject.currentLength ++;
                        completeCount ++;
                        if(ClassObject.currentLength === OPTIONS.max) toggleUploadBtn(false);
                        const imgItem = createImg(this.result, files[i].name);
                        elementFlags.appendChild(imgItem);
                        if(completeCount === len) {
                            ImgWrap.insertBefore(elementFlags, ImgWrap.firstChild);
                            e.target.value = '';
                        }

                    }
                }
                ClassObject.currentFile.push(...files);
                OPTIONS.changeFn && OPTIONS.changeFn(files);
            }else {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(files[0]);
                fileReader.onload = function() {
                    let imgItem = createImg(this.result, files[0].name);
                    ImgWrap.insertBefore(imgItem, ImgWrap.firstChild);
                    // 隐藏上传按钮
                    toggleUploadBtn(false);
                    OPTIONS.changeFn && OPTIONS.changeFn(files[0]);
                    e.target.value = ''
                }

            }

        }

        /**
         * 切换上传按钮的显示和隐藏
         * @param flag
         */
        function toggleUploadBtn(flag) {
            UploadButton.style.display = flag ? 'inline-block' : 'none';
        }

        /**
         * 删除图片
         */
        function deleteImg() {
            this.parentNode.remove();
            const currentImg = this.previousElementSibling;
            let currentSrc = currentImg.getAttribute('src');
            let name = this.getAttribute('data-name');
            currentSrc = currentSrc.startsWith('data:') ? null : currentSrc;
            if(OPTIONS.multiple) {
                ClassObject.currentLength--;
            }
            // 如果是上传文件则删除文件列表中的改文件
            if(name) {
                ClassObject.currentFile = ClassObject.currentFile.filter(item => item.name !== name);
            }
            OPTIONS.deleteFn && OPTIONS.deleteFn(currentSrc, ClassObject.currentFile);
            toggleUploadBtn(true);
        }

    };


    w.ImageUpload = ImageUpload;
})(window);
