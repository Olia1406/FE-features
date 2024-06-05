import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from './translate.pipe';
import { LocalizationConfig } from './interfaces/localization-config.interface';
import { LOCALIZATION_TOKEN } from './constants';

@NgModule({
  declarations: [TranslatePipe],
  imports: [CommonModule],
  exports: [TranslatePipe],
})
export class LocalizationModule {
  public static forRoot(config: LocalizationConfig): ModuleWithProviders<LocalizationModule> {
    return {
      ngModule: LocalizationModule,
      providers: [{ provide: LOCALIZATION_TOKEN, useValue: config }],
    };
  }
}

