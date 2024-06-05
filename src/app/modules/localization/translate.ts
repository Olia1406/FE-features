export function translate(value: string, localizationData: any): string {
   console.log('value', value)
   console.log('localizationData', localizationData)
   return localizationData[value] ?? value
}