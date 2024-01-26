import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss'],
})
export class ChartLineComponent {
  @ViewChild('chartContainer') chartContainer?: ElementRef;
  private myChart?: echarts.ECharts;

  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.chartContainer?.nativeElement);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        left: '30',
        right: '10',
        bottom: '20',
        top: '10',
      },
      xAxis: {
        type: 'category',
        data: [
          '01-01-2021',
          '01-02-2021',
          '01-03-2021',
          '01-04-2021',
          '01-05-2021',
          '01-06-2021',
          '01-07-2021',
          '01-08-2021',
          'Feb',
          'Mar',
          'Apr',
          '01-01-2021',
          '01-02-2021',
          '01-03-2021',
          '01-04-2021',
          '01-05-2021',
          '01-06-2021',
          '01-07-2021',
          '01-08-2021',
          'Feb',
          'Mar',
          'Apr',
          '01-01-2021',
          '01-02-2021',
          '01-03-2021',
          '01-04-2021',
          '01-05-2021',
          '01-06-2021',
          '01-07-2021',
          '01-08-2021',
          'Feb',
          'Mar',
          'Apr',
        ],
      },
      yAxis: {
        type: 'value',
        minInterval: 25,
      },
      series: [
        {
          lineStyle: { width: 1 },
          data: [
            0, 2, -12, 18, 35, 47, 20, 0, 30, 30, 40, 45, 2, -12, 18, 35, 47,
            20, 0, 30, 30, 40, 45, 2, -12, 18, 35, 47, 20, 0, 30, 30, 40, 45,
          ],
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: '#f76b15',
          },
        },
      ],
    };

    this.myChart.setOption(option);
    this.myChart?.resize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event): void {
    this.myChart?.resize();
  }
}
