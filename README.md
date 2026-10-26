# Duszki i domowy pomocnik — wersja 1.1.0

Karta Home Assistant z dwiema postaciami: białymi duszkami przelatującymi nad pulpitem lub białym, uśmiechniętym robocikiem z niebieską buźką, domkiem na antenie i machającą ręką. Robocik wysuwa się z rogu, macha, mruga i chowa. Grafika SVG i animacja są częścią pliku JavaScript. Bez bibliotek, filmów, dźwięku i połączeń z Internetem.

## Aktualizacja istniejącej instalacji przez HACS

1. Rozpakuj nową paczkę ZIP.
2. W swoim istniejącym repozytorium GitHub **white-ghosts-card** wybierz **Add file → Upload files**.
3. Wgraj nowy `white-ghosts-card.js` bezpośrednio do katalogu głównego repozytorium. Zatwierdź zastąpienie pliku przyciskiem **Commit changes / Zatwierdź zmiany**. Możesz też zaktualizować pozostałe pliki dokumentacji z paczki.
4. W Home Assistant otwórz HACS i istniejący dodatek **Białe duszki — White Ghosts Card**. W jego menu wybierz **Pobierz ponownie / Redownload** i pobierz aktualną wersję domyślnej gałęzi. Jeśli HACS wyświetli aktualizację, możesz ją zainstalować.
5. Odśwież stronę Home Assistanta. Na komputerze użyj **Ctrl+F5**. Jeśli w aplikacji mobilnej nadal jest stara karta, ponownie załaduj interfejs lub wyczyść jego pamięć podręczną.
6. Pod przyciskami karty pojawi się rozwijana sekcja **Ustawienia**. Wybierz **Postać → Machający robocik** i kliknij **Zapisz ustawienia**.
7. Kliknij **Pokaż teraz**, aby sprawdzić wygląd. **Włącz animacje** uruchamia harmonogram.

Nie twórz drugiego repozytorium ani drugiej karty. Techniczna nazwa `custom:white-ghosts-card` pozostaje taka sama. Dotychczasowa konfiguracja duszków nadal działa.

## Ustawienia bezpośrednio w karcie

Rozwiń **Ustawienia** pod przyciskami. Możesz zmienić:

- nazwę karty i postać: duszki / robocik;
- róg ekranu robocika: losowy albo jeden z czterech rogów;
- minimalny i maksymalny odstęp w minutach — ustaw oba na **2**, aby postać pojawiała się co dwie minuty;
- godziny aktywności — np. **06:00**–**22:00**;
- czas wyświetlania w sekundach i rozmiar postaci;
- liczbę duszków w trybie duszków.

Po zmianach kliknij **Zapisz ustawienia**. Te ustawienia i stan włącznika są lokalne dla tej przeglądarki. Przetrwają odświeżenie strony. Inny telefon lub tablet ma własne ustawienia. **Przywróć z YAML** cofa lokalne zmiany do konfiguracji karty.

Wbudowany edytor wizualny karty również pozwala ustawić te wartości: edytuj kartę, kliknij **Zastosuj w konfiguracji**, a następnie zapisz kartę w Home Assistant. W ten sposób zapisujesz wartości bazowe w konfiguracji pulpitu. Zmiana bazowej konfiguracji zastępuje wcześniejsze lokalne ustawienia przy jej zastosowaniu. Jeden wspólny harmonogram w przeglądarce: używaj jednej karty sterującej.

## Przykład: robocik co dwie minuty, 06:00–22:00

```yaml
type: custom:white-ghosts-card
title: Domowy pomocnik
character: robot
corner: random
duration: 10
size: 180
interval_min: 2
interval_max: 2
schedule_start: "06:00"
schedule_end: "22:00"
```

Ten przykład jest też w `example-robot.yaml`. Wybierz `bottom-right`, `bottom-left`, `top-right` albo `top-left` zamiast `random`, aby ustawić stały róg. Robocik jest jedną postacią; opcja `ghosts` dotyczy tylko duszków.

## Nowa instalacja

Publikacja i pierwsza instalacja HACS: [INSTALL-HACS.md](INSTALL-HACS.md). Manifest i nazwa pliku nadal pasują do istniejącego repozytorium `white-ghosts-card`.

Ręcznie: skopiuj `white-ghosts-card.js` do `/config/www/white-ghosts-card/white-ghosts-card.js`, a w zasobach pulpitu dodaj `/local/white-ghosts-card/white-ghosts-card.js?v=1.1.0` jako **Moduł JavaScript**. Dodaj kartę z typem `custom:white-ghosts-card`. Przy HACS użyj zasobu `/hacsfiles/white-ghosts-card/white-ghosts-card.js`, jeśli nie został zarejestrowany automatycznie. Nie ładuj jednocześnie wersji ręcznej i HACS.

## Wszystkie opcje YAML

| Opcja | Domyślnie | Znaczenie |
| --- | --- | --- |
| `title` | `Białe duszki` / `Domowy pomocnik` | Nazwa karty, zależna od postaci przy braku jawnego tytułu |
| `character` | `ghosts` | `ghosts` lub `robot` |
| `corner` | `random` | Róg robocika, jak w przykładzie powyżej |
| `ghosts` | `3` | Liczba duszków, 1–8 |
| `duration` | `14` | Sekundy wizyty robocika albo przelotu jednego duszka, 5–60 |
| `size` | `110` | Szerokość postaci w pikselach, 40–220; ograniczana na małym ekranie |
| `interval_min` | `5` | Minimalny odstęp między początkami animacji w minutach, 1–1440 |
| `interval_max` | `15` | Maksymalny odstęp, nie mniejszy niż `interval_min` |
| `schedule_start` | `"00:00"` | Początek godzin aktywności, lokalny czas przeglądarki |
| `schedule_end` | `"00:00"` | Koniec godzin; jednakowe godziny oznaczają całą dobę |

Przedział może przechodzić przez północ. Termin wylosowany poza przedziałem zostaje przesunięty na najbliższy dozwolony początek. Godziny ograniczają rozpoczęcie wizyty; rozpoczęta animacja kończy się normalnie. Przycisk **Pokaż teraz** działa też poza tymi godzinami.

## Zachowanie i weryfikacja

Pulpit musi pozostać otwarty i widoczny. W tle harmonogram jest wstrzymany; po powrocie losowany jest nowy termin. Po otwarciu karty działa też po przejściu do innego widoku. Zasób przywraca zapisane ustawienia po odświeżeniu. Wyłączenie animacji od razu chowa postać. Warstwa postaci nie blokuje klikania pulpitu. Systemowe ograniczenie ruchu wstrzymuje automatyczne animacje, a test pokazuje nieruchomą postać przez dwie sekundy.

`podglad.html` zawiera działającą kartę z nowym panelem ustawień. `pomocnik.svg` to statyczny rysunek robocika.

Przeprowadzono 32 testy logiki: harmonogram i zakresy godzin, migrację starszych ustawień, zapis i przywracanie opcji z panelu, wybór postaci, rogi ekranu, odczyt formularza i sprzątanie animacji. Nie wykonano kontroli wizualnej w przeglądarce ani testu w działającym Home Assistant. Wcześniejsza próba otwarcia lokalnego podglądu została zablokowana przez narzędzie przeglądarki. Sprawdź przycisk testowy po instalacji na docelowym urządzeniu.

Pomysł przelotów inspirowany [Franky's Christmas Card](https://github.com/Franz1302/frankys-stuff-christmas-card). Własny kod i grafika; licencja MIT. Dokumentacja API: [karty Home Assistant](https://contributors.home-assistant.io/frontend/custom-ui/card/).
