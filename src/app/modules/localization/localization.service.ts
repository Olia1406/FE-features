import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Inject, Injectable, afterNextRender } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  LANGUAGES,
  LOCALIZATION_LANGUAGE_KEY,
  LOCALIZATION_TOKEN,
} from './constants';
import { Languages } from './enums';
import { LocalizationConfig } from './interfaces/localization-config.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalizationService {
  translationData: any = {};
  localizationConfig: LocalizationConfig;
  selectedLanguage = 'en';
  languages!: { name: string; shortcut: string }[];

  constructor(
    @Inject(LOCALIZATION_TOKEN) data: LocalizationConfig,
    private http: HttpClient,
  ) {
    this.localizationConfig = data;
    afterNextRender(() => {
      this.selectedLanguage =
        this.getLanguage() ?? this.localizationConfig.language;
    });
    this.languages = LANGUAGES;
  }

  getTranslationMap(language = this.selectedLanguage): Observable<any> {
    return this.http
      .get(`${this.localizationConfig.path}/translation-${language}.json`)
      .pipe(
        tap((data) => {
          this.translationData = data;
        }),
      );
  }

  setLanguage(language: string) {
    return localStorage.setItem(LOCALIZATION_LANGUAGE_KEY, language);
  }

  getLanguage() {
    return localStorage.getItem(LOCALIZATION_LANGUAGE_KEY);
  }
}
