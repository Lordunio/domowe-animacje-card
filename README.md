# Białe duszki — karta Home Assistant

Samodzielna karta Lovelace: uśmiechnięte białe duszki przelatują nad pulpitem, lekko falując. Własny kod i grafika SVG. Bez bibliotek, filmów, dźwięku i połączeń z Internetem. Inspiracja: [Franky's Christmas Card](https://github.com/Franz1302/frankys-stuff-christmas-card); paczka nie zawiera kodu ani multimediów tamtego projektu.

## Instalacja przez HACS

Paczka jest przygotowana do HACS: zawiera `hacs.json`, a plik JavaScript jest w katalogu głównym. Najpierw trzeba opublikować jej zawartość jako publiczne repozytorium GitHub o nazwie **white-ghosts-card**. Następnie dodaj adres tego repozytorium w **HACS → ⋮ → Repozytoria niestandardowe**, typ **Dashboard**.

Pełna instrukcja publikacji i instalacji: [INSTALL-HACS.md](INSTALL-HACS.md). Sam ZIP nie jest adresem instalacyjnym HACS. Repozytorium nie zostało jeszcze opublikowane.

## Instalacja ręczna

1. Skopiuj `white-ghosts-card.js` do `/config/www/white-ghosts-card/white-ghosts-card.js`. Utwórz katalogi, jeśli ich nie ma.
2. Otwórz w Home Assistant **Ustawienia → Pulpity → menu ⋮ → Zasoby**. W razie potrzeby włącz tryb zaawansowany w swoim profilu.
3. Dodaj adres `/local/white-ghosts-card/white-ghosts-card.js?v=1.0.0`, typ **Moduł JavaScript**.
4. Odśwież stronę. Edytuj pulpit, wybierz **Dodaj kartę → Ręcznie** i wklej:

```yaml
type: custom:white-ghosts-card
```

5. Zapisz kartę. Kliknij **Pokaż duszki**, aby przetestować animację. **Włącz przeloty** uruchamia harmonogram.

Jeśli zarządzasz zasobami przez YAML, zamiast kroku 2–3 dodaj do swojej listy zasobów:

```yaml
lovelace:
  resources:
    - url: /local/white-ghosts-card/white-ghosts-card.js?v=1.0.0
      type: module
```

Nie twórz drugiej sekcji `lovelace`, jeśli już istnieje. Możliwa jest też instalacja przez HACS po publikacji repozytorium — patrz instrukcja powyżej.

## Ustawienia w YAML

Pełny przykład: `example.yaml`.

| Opcja | Domyślnie | Znaczenie |
| --- | --- | --- |
| `title` | `Białe duszki` | Tytuł karty |
| `ghosts` | `3` | Liczba duszków, 1–8 |
| `duration` | `14` | Czas przelotu jednego duszka w sekundach, 5–60 |
| `size` | `110` | Przybliżona szerokość duszka w pikselach, 40–220; ograniczana na małym ekranie |
| `interval_min` | `5` | Minimalny odstęp między początkami grup w minutach, 1–1440 |
| `interval_max` | `15` | Maksymalny odstęp, nie mniejszy niż `interval_min` |
| `schedule_start` | `"00:00"` | Początek godzin działania, czas lokalny przeglądarki |
| `schedule_end` | `"00:00"` | Koniec godzin działania; taki sam jak początek oznacza całą dobę |

Przedział może przechodzić przez północ, np. `"20:00"`–`"02:00"`. Godziny ograniczają moment rozpoczęcia animacji. Jeśli wylosowany termin wypada poza przedziałem, zostaje przesunięty na najbliższy dozwolony początek. Przycisk testowy działa także poza wyznaczonymi godzinami i przy wyłączonym harmonogramie.

## Zachowanie

- Przy pierwszym uruchomieniu automatyczne przeloty są wyłączone.
- Animacja nie blokuje klikania pulpitu; kierunek i wysokość są losowane.
- Harmonogram działa, gdy przeglądarka jest otwarta, a jej zakładka jest widoczna. Po powrocie z tła losowany jest nowy termin. Nie nadrabia pominiętych animacji.
- Po otwarciu karty harmonogram działa też po przejściu do innego widoku. Po odświeżeniu zasób odczytuje zapisane ustawienia, nawet gdy karta nie jest w bieżącym widoku.
- Włącznik i konfiguracja zapisują się w pamięci lokalnej przeglądarki. Zakładki tego samego adresu współdzielą je; osobne urządzenia mają własne ustawienia. Użyj jednej karty sterującej na przeglądarkę: przy kilku kartach ostatnio zastosowana konfiguracja steruje harmonogramem.
- Systemowe ograniczanie ruchu wstrzymuje automatyczne przeloty. Test pokazuje wtedy duszki przez dwie sekundy bez przesuwania.
- Ustawienia zmienia się w edytorze YAML. Polskie etykiety. Bez encji, automatyzacji i restartu serwera.

## Podgląd i weryfikacja

Otwórz `podglad.html` w przeglądarce i kliknij **Pokaż duszki**. To demonstracja na przykładowym pulpicie, bez połączenia z Twoim Home Assistantem.

Paczka nie została sprawdzona na rzeczywistej instalacji Home Assistanta. Po instalacji sprawdź przelot i włącznik na docelowym telefonie lub tablecie.

Oficjalna dokumentacja: [karty niestandardowe](https://contributors.home-assistant.io/frontend/custom-ui/card/).

Licencja MIT obejmuje kod i grafikę duszków.

Weryfikacja lokalna: 20 testów logiki zakończonych powodzeniem (walidacja ustawień, godziny dzienne i nocne, harmonogram, zapis ustawień, ukryta zakładka, ograniczanie ruchu, start i sprzątanie animacji). Narzędzie przeglądarki zablokowało otwarcie lokalnego pliku, więc nie wykonano kontroli wizualnej w przeglądarce.

