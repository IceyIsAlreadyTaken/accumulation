/**
 * 导出json文件
 * @param data 导出内容
 * @param fileName 导出文件名
 */
export function exportJson(data: object, fileName: string) {
  const a = document.createElement('a');
  a.style.visibility = 'hidden';
  document.body.appendChild(a);
  const blobs = new Blob([JSON.stringify(data)], {
    type: 'data:application/json;charset=utf-8',
  });
  const objurl = URL.createObjectURL(blobs);
  a.href = objurl;
  a.download = fileName;
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(objurl);
}

/**
 * 导入json文件
 * @param eleId input元素id
 * @param callback 文件导入后的回调，用于在代码中做文件的检查和提示，因检查和提示具有个性化，不封装进公共方法内
 */
export function importJson(eleId, callback: () => void) {
  const input = document.createElement('input');
  input.id = eleId;
  input.type = 'file';
  input.accept = 'application/json';
  input.style.display = 'none';
  document.body.appendChild(input);
  input.onchange = callback;
  input.click();
}

// demo importJson方法的使用
function importFlow() {
  const inputId = 'importFlow';
  const callback = () => {
    const file: any = document.getElementById(inputId);
    const selectedFile = file.files[0]; // 从selectedFile可以获取到文件名，文件大小等
    if (selectedFile) {
      const reader: any = new FileReader();
      reader.readAsText(selectedFile);
      reader.onload = (e: any) => {
        try {
          const flowData = JSON.parse(e.target.result);
          if (
            flowData.hasOwnProperty('id') &&
            flowData.hasOwnProperty('flowName') &&
            flowData.hasOwnProperty('components') &&
            flowData.hasOwnProperty('pathDataList') &&
            flowData.hasOwnProperty('xmlContent') &&
            flowData.hasOwnProperty('errors')
          ) {
            // 文件数据符合要求
            localStorage.setItem('ivrEngineFlowData', e.target.result);
            this.fileName = selectedFile.name;
          } else {
            this.$mtd.message({
              message: '导入失败，文件内容不符，请重新选择',
              type: 'error',
            });
          }
          document.body.removeChild(file);
        } catch (err) {
          console.log('importFlow error', err);
          this.$mtd.message({
            message: '文件导入失败，请重新选择',
            type: 'error',
          });
          document.body.removeChild(file);
        }
      };
    }
  };

  importJson(inputId, callback);
}
