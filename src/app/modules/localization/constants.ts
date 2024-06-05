import { InjectionToken } from "@angular/core";

export const URL = 'http://localhost:4200';

export const LOCALIZATION_TOKEN = new InjectionToken<string>('LOCALIZATION_TOKEN');

export const LOCALIZATION_LANGUAGE_KEY = 'LANGUAGE';

export const LANGUAGES = [
    {name: 'English', shortcut: 'en'},
    {name: 'Ukrainian', shortcut: 'uk'},
    {name: 'Polish', shortcut: 'pl'},
]

