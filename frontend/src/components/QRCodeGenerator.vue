<template>
  <div class="qr-code-container">
    <div class="text-center">
      <h5 class="mb-3">
        <b-icon-qr-code class="mr-2"></b-icon-qr-code>
        Quét mã QR để truy cập website
      </h5>
      
      <div class="qr-code-wrapper mb-3">
        <canvas ref="qrCanvas" class="qr-canvas"></canvas>
      </div>
      
      <div class="mb-3">
        <small class="text-muted">{{ websiteUrl }}</small>
      </div>
      
      <div class="d-flex justify-content-center gap-2">
        <b-button 
          variant="primary" 
          size="sm" 
          @click="downloadQR"
          :disabled="!qrGenerated"
        >
          <b-icon-download class="mr-1"></b-icon-download>
          Tải xuống
        </b-button>
        
        <b-button 
          variant="outline-secondary" 
          size="sm" 
          @click="copyUrl"
        >
          <b-icon-clipboard class="mr-1"></b-icon-clipboard>
          Copy URL
        </b-button>
      </div>
      
      <b-alert 
        :show="showCopyAlert" 
        variant="success" 
        dismissible 
        class="mt-3 mb-0"
        @dismissed="showCopyAlert = false"
      >
        URL đã được copy vào clipboard!
      </b-alert>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode-generator';

export default {
  name: 'QRCodeGenerator',
  props: {
    url: {
      type: String,
      default: 'https://email-analyzer-frontend.onrender.com'
    },
    size: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      qrGenerated: false,
      showCopyAlert: false,
      websiteUrl: this.url
    };
  },
  mounted() {
    this.generateQR();
  },
  watch: {
    url() {
      this.websiteUrl = this.url;
      this.generateQR();
    }
  },
  methods: {
    generateQR() {
      try {
        const canvas = this.$refs.qrCanvas;
        if (!canvas) return;
        
        const qr = QRCode(0, 'M');
        qr.addData(this.websiteUrl);
        qr.make();
        
        const ctx = canvas.getContext('2d');
        const moduleCount = qr.getModuleCount();
        const cellSize = this.size / moduleCount;
        
        canvas.width = this.size;
        canvas.height = this.size;
        
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, this.size, this.size);
        
        ctx.fillStyle = '#000000';
        for (let row = 0; row < moduleCount; row++) {
          for (let col = 0; col < moduleCount; col++) {
            if (qr.isDark(row, col)) {
              ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }
          }
        }
        
        this.qrGenerated = true;
      } catch (error) {
        console.error('Lỗi tạo QR code:', error);
      }
    },
    
    downloadQR() {
      if (!this.qrGenerated) return;
      
      const canvas = this.$refs.qrCanvas;
      const link = document.createElement('a');
      link.download = 'email-analyzer-qr-code.png';
      link.href = canvas.toDataURL();
      link.click();
    },
    
    async copyUrl() {
      try {
        await navigator.clipboard.writeText(this.websiteUrl);
        this.showCopyAlert = true;
        
        setTimeout(() => {
          this.showCopyAlert = false;
        }, 3000);
      } catch (error) {
        console.error('Lỗi copy URL:', error);
      }
    }
  }
};
</script>

<style scoped>
.qr-code-container {
  padding: 20px;
}

.qr-code-wrapper {
  display: inline-block;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e9ecef;
}

.qr-canvas {
  display: block;
  border-radius: 4px;
}

.gap-2 {
  gap: 0.5rem;
}

@media (max-width: 576px) {
  .qr-code-container {
    padding: 15px;
  }
  
  .qr-code-wrapper {
    padding: 10px;
  }
}
</style>
