import { Pipe, PipeTransform } from '@angular/core';
import { LocalizationService } from './localization.service';

@Pipe({
  name: 'translate',
	pure: false
})
export class TranslatePipe implements PipeTransform {
  
  constructor(private localizationServ: LocalizationService) {}

  transform(value: string): string {
    return this.localizationServ.translationData[value] ?? value;
  }
}
