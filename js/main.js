document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalFile = null;

    // 点击上传区域触发文件选择
    dropZone.addEventListener('click', () => fileInput.click());

    // 文件拖拽处理
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#0071e3';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#c7c7c7';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#c7c7c7';
        const files = e.dataTransfer.files;
        if (files.length) handleFile(files[0]);
    });

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) handleFile(e.target.files[0]);
    });

    // 质量滑块变化处理
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) compressImage(originalFile, e.target.value / 100);
    });

    // 处理选择的文件
    function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png)/)) {
            alert('请选择 PNG 或 JPG 格式的图片！');
            return;
        }

        originalFile = file;
        originalSize.textContent = formatFileSize(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            compressImage(file, qualitySlider.value / 100);
        };
        reader.readAsDataURL(file);
        
        previewContainer.style.display = 'block';
    }

    // 压缩图片
    function compressImage(file, quality) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    compressedPreview.src = URL.createObjectURL(blob);
                    compressedSize.textContent = formatFileSize(blob.size);
                    
                    // 设置下载按钮
                    downloadBtn.onclick = () => {
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `compressed_${file.name}`;
                        link.click();
                    };
                }, file.type, quality);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 