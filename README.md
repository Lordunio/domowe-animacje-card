# Domowe Animacje 1.2.1

Sześć animacji do pulpitu Home Assistanta: duszki, machający robocik, Mikołaj z saniami, wielkanocny króliczek, motylki oraz wyścigówki. Tryb losowy pozwala zaznaczyć, które sceny mają się pojawiać. Własne rysunki SVG i kod JavaScript, bez zewnętrznych bibliotek i pobierania multimediów.

## Poprawki w 1.2.1

- Mikołaj został przerysowany: czytelna twarz, broda, pełna czapka zakrywająca górę głowy, rękawiczki i łagodniejsze machanie.
- Renifer ma smuklejszą szyję, bardziej szczegółową głowę, rozbudowane poroże, uszy i cztery nogi z niezależnymi, przeciwległymi fazami ruchu.
- Sanie mają łagodniejsze kształty, delikatne cieniowanie i złote zdobienia; poprawiono też uprząż i proporcje sceny.
- Scena sań jest nieco większa dla tej samej wartości rozmiaru. Ustawienia godzin i pozostałe animacje pozostają dostępne.

## Aktualizacja w Twoim repozytorium domowe-animacje-card

1. Rozpakuj paczkę `domowe-animacje-card-1.2.1.zip`.
2. Na GitHubie w repozytorium **domowe-animacje-card** wybierz **Add file → Upload files**.
3. Wgraj nowy **domowe-animacje-card.js** do katalogu głównego i zatwierdź zmianę. Możesz też wgrać README i pozostałe pliki z paczki. Manifest `hacs.json` ma nadal tę samą nazwę pliku.
4. W HACS otwórz **Domowe Animacje**, wybierz **Aktualizuj informacje**, a następnie **Pobierz ponownie / Redownload**, pobierając aktualną domyślną gałąź.
5. Odśwież interfejs Home Assistanta przez **Ctrl+F5**. Wybierz **Ustawienia → Animacja → Mikołaj z saniami**, zapisz i kliknij **Pokaż teraz**.

Jeżeli nadal widać stary rysunek, po ponownym pobraniu sprawdź zasób pulpitu. Dla obecnej instalacji z nowego repozytorium powinien wskazywać na:

```text
/hacsfiles/domowe-animacje-card/domowe-animacje-card.js?v=1.2.1
```

Zmień istniejący wpis zamiast dodawać duplikat. Typ: **Moduł JavaScript**. Usuń nieaktualne zasoby poprzedniej instalacji `white-ghosts-card`, jeśli wciąż są ładowane, i odśwież cały interfejs. Pierwsza linia nowego pliku na GitHubie zawiera `Domowe Animacje 1.2.1`.

Paczka jest przygotowana lokalnie. Nie została automatycznie opublikowana w Twoim repozytorium ani zainstalowana w HACS.

## Ustawienia na pulpicie

Rozwiń **Ustawienia** w karcie. Możesz zmienić nazwę, wybrać animację lub tryb losowy, zaznaczyć sceny do losowania, ustawić kierunek ruchu, róg robocika, częstotliwość, godziny działania, czas wyświetlania, rozmiar i liczbę duszków, motylków lub aut. Kliknij **Zapisz ustawienia**. Zapis jest lokalny dla tej przeglądarki i przetrwa odświeżenie.

Oba odstępy ustawione na **2** oznaczają wizyty co dwie minuty. Godziny **06:00** i **22:00** ograniczają moment rozpoczęcia wizyt. Przycisk testowy działa także poza tymi godzinami. Pulpit musi pozostawać otwarty i widoczny. Systemowe ograniczenie ruchu wstrzymuje automatyczne wizyty, a test pokazuje nieruchomą postać przez dwie sekundy.

Wizualny edytor karty zapisuje wartości bazowe w konfiguracji pulpitu po kliknięciu **Zastosuj w konfiguracji** i zapisaniu karty. **Przywróć z YAML** w karcie usuwa lokalne nadpisania i przywraca konfigurację bazową.

Przykład YAML, wszystkie sceny co dwie minuty między 06:00 a 22:00: `example.yaml`. Minimalna karta:

```yaml
type: custom:domowe-animacje-card
```

Poprzednia nazwa `type: custom:white-ghosts-card` również jest obsługiwana. Nie zmieniaj nazw pliku JavaScript ani repozytorium podczas zwykłej aktualizacji. Zapisane ustawienia przeglądarki korzystają z tego samego klucza co wcześniejsze wersje.

## Pierwsza instalacja

Opublikuj zawartość tej paczki w publicznym repozytorium **domowe-animacje-card**, z plikiem JavaScript i `hacs.json` w katalogu głównym. W HACS dodaj adres repozytorium jako repozytorium niestandardowe typu **Dashboard**, pobierz **Domowe Animacje** i zarejestruj powyższy zasób jako moduł JavaScript, jeśli HACS nie zrobi tego automatycznie. Dodaj kartę na pulpicie i włącz animacje przyciskiem.

## Podgląd i sprawdzenie

`podglad.html` pokazuje kartę z całym panelem ustawień. `sanie-1.2.1.png` przedstawia poprawioną scenę sań. Sprawdzono jej statyczny wygląd po wyrenderowaniu SVG, także przy małym rozmiarze. Przeszły 52 testy logiki, w tym zapis ustawień, harmonogram, oba typy karty, sceny, losowanie, geometria, unikalne identyfikatory cieniowania i poprawione proporcje sceny sań. Nie wykonano testu animacji w przeglądarce ani w działającej instalacji Home Assistant; sprawdź przycisk testowy na docelowym urządzeniu.

Kod i ilustracje: licencja MIT. Dokumentacja: [karty Home Assistant](https://contributors.home-assistant.io/frontend/custom-ui/card/), [HACS](https://www.hacs.xyz/docs/publish/plugin/).
