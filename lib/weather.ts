export function getWeatherCodeDescriptionPl(code: number): string {
  const map: Record<number, string> = {
    0: "Bezchmurnie",
    1: "Przewa?nie pogodnie",
    2: "Cz??ciowe zachmurzenie",
    3: "Pochmurno",
    45: "Mg?a",
    48: "Mg?a osadzaj?ca szad?",
    51: "M?awka s?aba",
    53: "M?awka umiarkowana",
    55: "M?awka intensywna",
    56: "Marzn?ca m?awka s?aba",
    57: "Marzn?ca m?awka intensywna",
    61: "Deszcz s?aby",
    63: "Deszcz umiarkowany",
    65: "Deszcz intensywny",
    66: "Marzn?cy deszcz s?aby",
    67: "Marzn?cy deszcz intensywny",
    71: "?nieg s?aby",
    73: "?nieg umiarkowany",
    75: "?nieg intensywny",
    77: "Ziarnisty ?nieg",
    80: "Przelotne opady deszczu s?abe",
    81: "Przelotne opady deszczu umiarkowane",
    82: "Przelotne opady deszczu intensywne",
    85: "Przelotne opady ?niegu s?abe",
    86: "Przelotne opady ?niegu intensywne",
    95: "Burza",
    96: "Burza z gradem s?aba/umiarkowana",
    99: "Burza z gradem silna"
  };
  if (code in map) return map[code];
  if (code >= 1 && code <= 3) return map[code];
  return "Pogoda nieznana";
}

export function formatTemperatureC(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  return `${Math.round(value)}?C`;
}
