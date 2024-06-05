import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { LocalizationService } from './localization.service';

export const localizationInfoResolver: ResolveFn<any> = (route, state) => {
  return inject(LocalizationService).getTranslationMap()
};
