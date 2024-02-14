import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { TemperatureType } from '../../states/temperature-departments-state.service';

@Component({
  selector: 'app-select-temperature-type',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-temperature-type.component.html',
  styleUrls: ['./select-temperature-type.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectTemperatureTypeComponent implements AfterViewInit {
  @ViewChild('selectInput') selectInput!: ElementRef<HTMLSelectElement>;
  @ViewChild('optionsBox') optionsBox!: ElementRef<HTMLDivElement>;
  @Input({ required: true })
  set selectedTemperatureType(temperatureType: TemperatureType) {
    this._selectedTemperatureType = temperatureType;
    this.synchroniseSelectedTemperatureType();
  }
  @Output() selectEmitter = new EventEmitter<TemperatureType>();

  public options = [
    { name: 'moyenne', value: 'tmoy', active: false },
    { name: 'maximale', value: 'tmax', active: false },
    { name: 'minimale', value: 'tmin', active: false },
  ];

  private _selectedTemperatureType!: TemperatureType;

  ngAfterViewInit(): void {
    this.synchroniseSelectedTemperatureType();
  }

  synchroniseSelectedTemperatureType() {
    if (this.selectInput) {
      const selectedOption = this.options.find(
        (x) => x.value === this._selectedTemperatureType
      );

      this.selectInput.nativeElement.innerHTML = selectedOption!.name;
      selectedOption!.active = true;
    }
  }

  onClickSelect() {
    const selectInputElement = this.selectInput.nativeElement;
    if (selectInputElement.className.includes('active')) {
      selectInputElement.classList.remove('active');
    } else {
      selectInputElement.classList.add('active');
    }

    const optionsBoxElement = this.optionsBox.nativeElement;
    if (optionsBoxElement.className.includes('active')) {
      optionsBoxElement.classList.remove('active');
    } else {
      optionsBoxElement.classList.add('active');
    }
  }

  onClickOption(index: number) {
    this.options.forEach((x) => (x.active = false));
    this.options[index].active = true;
    this.selectEmitter.emit(this.options[index].value as TemperatureType);
    this.optionsBox.nativeElement.classList.remove('active');
    this.selectInput.nativeElement.classList.remove('active');
  }
}
