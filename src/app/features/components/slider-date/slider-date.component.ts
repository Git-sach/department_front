import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-slider-date',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slider-date.component.html',
  styleUrls: ['./slider-date.component.scss']
})
export class SliderDateComponent {
  @Output() dateEmitter = new EventEmitter<Date>();
  //TODO: Faire un output qui indique lorsque l'utilisateur n'est plus focus sur la slider
  @ViewChild('rangeInput') rangeInput!: ElementRef;

  minTimestamp : number = new Date('01/01/2018').getTime();
  maxTimestamp : number = new Date('01/01/2023').getTime();
  stapeTimestamp : number = new Date('01/02/1970 01:00:00').getTime();
  initialValue: number = this.maxTimestamp;

  onDateChange() {
    this.dateEmitter.emit(new Date(+this.rangeInput.nativeElement.value));
  }
}
