import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import * as echarts from 'echarts';
import { TemperatureDepartment } from 'src/app/shared/interfaces/temperatureDepartment';
import { DateFormater } from 'src/app/shared/utils/date-formater';
import { TemperatureType } from '../../states/temperature-departments-state.service';

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
  @Input({ required: true }) selectedTemperatureType!: TemperatureType;

  @Output() dateEmitter = new EventEmitter();

  @ViewChild('chartContainer') chartContainer?: ElementRef;

  private myChart?: echarts.ECharts;
  private echartOption?: echarts.EChartsOption;

  ngAfterViewInit(): void {
    this.myChart = echarts.init(this.chartContainer?.nativeElement);
    if (this.echartOption) {
      this.myChart.setOption(this.echartOption);
    }
  }

  ngOnChanges() {
    let temperatureOfselectedDate: number = 0;

    const selectedTemperatureDepartment = this.data?.find(
      (x) =>
        this.dateFormatter(x.date_obs) == this.dateFormatter(this.selectedDate!)
    );

    if (selectedTemperatureDepartment) {
      temperatureOfselectedDate =
        selectedTemperatureDepartment[this.selectedTemperatureType];
    }

    if (this.data && this.selectedDate && temperatureOfselectedDate) {
      const dateListe = this.data.map((x) => this.dateFormatter(x.date_obs));
      const valueList = this.data?.map((x) => x[this.selectedTemperatureType]);

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
            id: 1,
            triggerLineEvent: true,
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
                    temperatureOfselectedDate,
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

      this.myChart!.on('click', (e) => {
        const mouseX = e.event!.offsetX;

        const pointInGrid = this.myChart!.convertFromPixel({ seriesIndex: 0 }, [
          mouseX,
        ]);
        const xValue = pointInGrid[0];
        this.dateEmitter.emit(this.data![xValue].date_obs);
      });
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
