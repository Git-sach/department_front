import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { DateFormater } from 'src/app/shared/utils/date-formater';

@Component({
  selector: 'app-chart-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart-line.component.html',
  styleUrls: ['./chart-line.component.scss'],
})
export class ChartLineComponent {
  @Input({ required: true }) data: TemperatureDepartment[] | null = null;
  @Input({ required: true }) selectedDate: Date | null = null;

  @ViewChild('chartContainer') chartContainer?: ElementRef;

  private myChart?: echarts.ECharts;
  private echartOption?: echarts.EChartsOption;

  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.chartContainer?.nativeElement);
    if (this.echartOption) {
      this.myChart?.setOption(this.echartOption);
    }
  }

  ngOnChanges() {
    const tMoyOfselectedDate = this.data?.find(
      (x) =>
        this.dateFormatter(x.date_obs) == this.dateFormatter(this.selectedDate!)
    )?.tmoy;

    if (this.data && this.selectedDate && tMoyOfselectedDate) {
      const dateListe = this.data
        .map((x) => this.dateFormatter(x.date_obs))
        .reverse();
      const valueList = this.data?.map((x) => x.tmoy).reverse();

      this.echartOption = {
        tooltip: {
          trigger: 'axis',
          formatter: '{c0}C°<br />{b0}',
        },
        grid: {
          left: '30',
          right: '10',
          bottom: '20',
          top: '10',
        },
        xAxis: {
          type: 'category',
          data: dateListe,
        },
        yAxis: {
          type: 'value',
          minInterval: 3,
        },
        series: [
          {
            lineStyle: { width: 1 },
            data: valueList,
            type: 'line',
            markPoint: {
              symbol: 'circle',
              symbolSize: 5,
              data: [
                {
                  name: 'mark',
                  coord: [
                    this.dateFormatter(this.selectedDate),
                    tMoyOfselectedDate,
                  ],
                },
              ],
            },
            smooth: true,
            symbol: 'none',
            itemStyle: {
              color: '#f76b15',
            },
          },
        ],
      };

      this.myChart?.setOption(this.echartOption);
    }
  }

  @HostListener('window:resize', ['$event'])
  private onWindowResize(event: Event): void {
    this.myChart?.resize();
  }

  private dateFormatter(date: Date) {
    return DateFormater.dateFormatedShortString(date);
  }
}
