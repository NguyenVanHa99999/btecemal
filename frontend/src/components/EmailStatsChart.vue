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
        <div v-if="stats.recent_trend && stats.recent_trend.length > 0" class="chart-container">
          <apexchart
            type="bar"
            height="350"
            :options="trendChartOptions"
            :series="trendChartSeries"
          ></apexchart>
        </div>
        <div v-else class="text-center p-5">
          <b-icon-graph-down font-scale="3"></b-icon-graph-down>
          <p class="mt-3">Không đủ dữ liệu để hiển thị xu hướng</p>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import VueApexCharts from 'vue-apexcharts';
import { BIconGraphDown } from 'bootstrap-vue';

export default {
  name: 'EmailStatsChart',
  components: {
    apexchart: VueApexCharts,
    BIconGraphDown
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
    
    trendChartSeries() {
      if (!this.stats || !this.stats.recent_trend || this.stats.recent_trend.length === 0) {
        return [];
      }
      
      return [
        {
          name: 'An toàn',
          data: this.stats.recent_trend.map(day => day.safe || 0)
        },
        {
          name: 'Đáng ngờ',
          data: this.stats.recent_trend.map(day => day.suspicious || 0)
        },
        {
          name: 'Spam',
          data: this.stats.recent_trend.map(day => day.spam || 0)
        },
        {
          name: 'Lừa đảo',
          data: this.stats.recent_trend.map(day => day.phishing || 0)
        },
        {
          name: 'Chưa phân loại',
          data: this.stats.recent_trend.map(day => day.unknown || 0)
        }
      ];
    },
    
    trendChartOptions() {
      return {
        chart: {
          type: 'bar',
          height: 350,
          fontFamily: 'Roboto, sans-serif',
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        colors: ['#28a745', '#ffc107', '#6c757d', '#dc3545', '#17a2b8'],
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '60%',
            endingShape: 'rounded',
            borderRadius: 4,
            dataLabels: {
              position: 'top'
            }
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val > 0 ? val : '';
          },
          offsetY: -20,
          style: {
            fontSize: '10px',
            colors: ['#304758'],
            fontWeight: 'bold'
          }
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        grid: {
          show: true,
          borderColor: '#e7e7e7',
          strokeDashArray: 3,
          position: 'back',
          xaxis: {
            lines: {
              show: false
            }
          },
          yaxis: {
            lines: {
              show: true
            }
          }
        },
        xaxis: {
          categories: this.stats.recent_trend ? this.stats.recent_trend.map(day => this.formatDate(day.date)) : [],
          axisBorder: {
            show: true,
            color: '#e7e7e7'
          },
          axisTicks: {
            show: true,
            color: '#e7e7e7'
          },
          labels: {
            style: {
              colors: '#6c757d',
              fontSize: '12px',
              fontWeight: 500
            }
          },
          title: {
            text: 'Ngày',
            style: {
              color: '#6c757d',
              fontSize: '13px',
              fontWeight: 600
            }
          }
        },
        yaxis: {
          min: 0,
          forceNiceScale: true,
          labels: {
            formatter: (value) => {
              return Math.floor(value);
            },
            style: {
              colors: '#6c757d',
              fontSize: '12px'
            }
          },
          title: {
            text: 'Số lượng email',
            style: {
              color: '#6c757d',
              fontSize: '13px',
              fontWeight: 600
            }
          }
        },
        legend: {
          position: 'top',
          horizontalAlign: 'center',
          offsetY: -10,
          fontSize: '12px',
          fontWeight: 500,
          markers: {
            width: 12,
            height: 12,
            radius: 3
          },
          itemMargin: {
            horizontal: 15,
            vertical: 5
          }
        },
        tooltip: {
          shared: true,
          intersect: false,
          theme: 'light',
          style: {
            fontSize: '12px'
          },
          y: {
            formatter: (value) => {
              return `${value} email`;
            }
          },
          marker: {
            show: true
          }
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: {
                height: 300
              },
              plotOptions: {
                bar: {
                  columnWidth: '70%'
                }
              },
              legend: {
                position: 'bottom',
                offsetY: 10
              },
              dataLabels: {
                enabled: false
              }
            }
          }
        ]
      };
    }
  },
  methods: {
    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      // Kiểm tra nếu là hôm nay
      if (date.toDateString() === today.toDateString()) {
        return 'Hôm nay';
      }

      // Kiểm tra nếu là hôm qua
      if (date.toDateString() === yesterday.toDateString()) {
        return 'Hôm qua';
      }

      // Hiển thị ngày/tháng cho các ngày khác
      const options = { day: '2-digit', month: '2-digit' };
      return date.toLocaleDateString('vi-VN', options);
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