<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="Phân loại" active>
        <div class="chart-container">
          <apexchart
            type="pie"
            height="320"
            :options="pieChartOptions"
            :series="pieChartSeries"
          ></apexchart>
        </div>
      </b-tab>
      <b-tab title="Xu hướng">
        <div class="chart-container">
          <apexchart
            type="bar"
            height="320"
            :options="columnChartOptions"
            :series="columnChartSeries"
          ></apexchart>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VueApexCharts from 'vue-apexcharts';

export default {
  name: 'EmailStatsChart',
  components: {
    apexchart: VueApexCharts
  },
  computed: {
    ...mapState(['stats', 'loading']),
    
    pieChartSeries() {
      if (!this.stats || !this.stats.categories) {
        return [0, 0, 0, 0, 0];
      }
      
      return [
        this.stats.categories.safe?.count || 0,
        this.stats.categories.suspicious?.count || 0,
        this.stats.categories.spam?.count || 0,
        this.stats.categories.phishing?.count || 0,
        this.stats.categories.unknown?.count || 0
      ];
    },
    
    pieChartOptions() {
      return {
        chart: {
          type: 'pie',
          fontFamily: 'Roboto, sans-serif',
          toolbar: {
            show: false
          }
        },
        labels: ['An toàn', 'Đáng ngờ', 'Spam', 'Lừa đảo', 'Chưa phân loại'],
        colors: ['#28a745', '#ffc107', '#6c757d', '#dc3545', '#17a2b8'],
        legend: {
          position: 'bottom',
          horizontalAlign: 'center'
        },
        plotOptions: {
          pie: {
            dataLabels: {
              offset: -10
            }
          }
        },
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex];
            const count = opts.w.globals.seriesTotals[opts.seriesIndex];
            return [name, `${count} (${val.toFixed(1)}%)`];
          }
        },
        tooltip: {
          y: {
            formatter: (value) => {
              return `${value} email`;
            }
          }
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                height: 300
              },
              legend: {
                position: 'bottom'
              }
            }
          }
        ]
      };
    },

    // Biểu đồ cột cho phân loại email
    columnChartSeries() {
      return [{
        name: 'Số lượng email',
        data: [
          this.stats.categories?.safe?.count || 0,
          this.stats.categories?.suspicious?.count || 0,
          this.stats.categories?.spam?.count || 0,
          this.stats.categories?.phishing?.count || 0,
          this.stats.categories?.unknown?.count || 0
        ]
      }];
    },

    columnChartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 320,
          fontFamily: 'Roboto, sans-serif',
          toolbar: {
            show: false
          }
        },
        colors: ['#28a745', '#ffc107', '#6c757d', '#dc3545', '#17a2b8'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
            distributed: true // Mỗi cột có màu khác nhau
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + ' email';
          }
        },
        xaxis: {
          categories: ['An toàn', 'Đáng ngờ', 'Spam', 'Lừa đảo', 'Chưa phân loại'],
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          labels: {
            formatter: (value) => {
              return Math.floor(value);
            }
          }
        },
        legend: {
          show: false // Ẩn legend vì đã có label trên trục x
        },
        tooltip: {
          y: {
            formatter: (value) => {
              return `${value} email`;
            }
          }
        }
      };
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const options = { day: '2-digit', month: '2-digit' };
      return new Date(dateStr).toLocaleDateString('vi-VN', options);
    }
  }
};
</script>

<style scoped>
.chart-container {
  min-height: 320px;
  position: relative;
}
</style> 