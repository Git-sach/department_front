import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateFormater } from 'src/app/shared/utils/date-formater';

@Component({
  selector: 'app-slider-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider-date.component.html',
  styleUrls: ['./slider-date.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderDateComponent {
  @Input({ required: true }) set selectedDate(date: Date | null) {
    this.date = String(date?.getTime());
  }
  @Output() dateEmitter = new EventEmitter<Date>();
  @ViewChild('rangeInput') rangeInput!: ElementRef;

  minTimestamp: number = new Date('01/01/2018').getTime();
  maxTimestamp: number = new Date('01/01/2023').getTime();
  stapeTimestamp: number = new Date('01/02/1970 01:00:00').getTime();

  public date: string;

  onDateChange() {
    this.dateEmitter.emit(new Date(+this.date));
  }

  get dateFormatted() {
    return DateFormater.dateFormaterApiString(new Date(+this.date));
  }

  set dateFormatted(date: string) {
    //regex qui filtre les dates de 01/01/2018 à 01/01/2023
    const regex =
      /^(?:2018|2019|2020|2021|2022)-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;

    if (regex.test(date)) {
      this.date = String(new Date(date).getTime());
      this.onDateChange();
    }
  }

  get minDateFormatted() {
    return DateFormater.dateFormaterApiString(new Date(+this.minTimestamp));
  }

  get maxDateFormatted() {
    return DateFormater.dateFormaterApiString(new Date(+this.maxTimestamp));
  }
}
