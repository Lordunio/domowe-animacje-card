# Domowe Animacje 1.5.2

Osiem animacji do pulpitu Home Assistanta: duszki, machający i latający robocik, Mikołaj z saniami, wielkanocny króliczek, straszne dynie, motylki oraz wyścigówki. Do każdej sceny możesz dodać własny napis. Tryb losowy pozwala zaznaczyć, które sceny mają się pojawiać. Własne rysunki SVG i kod JavaScript, bez zewnętrznych bibliotek i pobierania multimediów.

## Nowości w 1.5.2

- Nowe grafiki robotów 3D z dużą stertą liści i śniegu. Obie grafiki są osadzone w pliku JavaScript; nie trzeba przesyłać dodatkowych obrazów. Sceny przesuwają się po ekranie jako całość.
- Weryfikacja: sprawdzono składnię i logikę ustawień. Nie udało się sprawdzić tej wersji wizualnie w przeglądarce ani w Home Assistant — prosimy przetestować obie sceny przyciskiem „Pokaż teraz”.

## Poprawki w 1.5.1

- Przerysowane roboty mają większe, bardziej szczegółowe obudowy i wyraźniejsze twarze. Sceny zawierają znacznie więcej liści i większą zaspę śniegu.

## Nowości w 1.5.0

- **Robot sprzątający liście** i **Robot odśnieżający** przejeżdżają wzdłuż dołu ekranu. Oba mają symbol Home Assistant. Kierunek, rozmiar i czas wizyty są regulowane tak jak dla pozostałych scen. Można je dodać do losowania.
- **Lampki choinkowe** to osobna, niezależna dekoracja przy górnej krawędzi ekranu. W ustawieniach karty wybierz „Lampki choinkowe → Włączone niezależnie” i zapisz. Działają z dowolną sceną i także wtedy, gdy automatyczne animacje są wyłączone. Ich ustawienie jest lokalne dla przeglądarki albo można je ustawić bazowo w YAML: `lights: true`. Lampki pozostają widoczne do wyłączenia; nie korzystają z harmonogramu wizyt. Nie przechwytują kliknięć, a przy ograniczeniu ruchu świecą bez migania.
- Wcześniej zapisane listy losowania pozostają bez zmian. Aby uwzględnić nowe roboty w istniejącej konfiguracji losowej, zaznacz je ręcznie.

## Aktualizacja do 1.5.1

1. W repozytorium domowe-animacje-card umieść w katalogu głównym pliki z paczki, w szczególności `domowe-animacje-card.js`, `README.md` i `hacs.json`.
2. Zatwierdź zmianę na GitHubie. W HACS odśwież informacje i pobierz ponownie właściwą gałąź lub wydanie, a następnie odśwież przeglądarkę.
3. Jeśli przeglądarka nadal pokazuje stary kod, zmień wersję istniejącego zasobu na `/hacsfiles/domowe-animacje-card/domowe-animacje-card.js?v=1.5.2` i odśwież stronę. Nie dodawaj drugiego zasobu.
4. W ustawieniach wybierz robota i kliknij „Pokaż teraz”. Lampki włącz osobno i zapisz ustawienia. Sprawdź też działanie na tablecie.

## Nowości w 1.4.0

- Nowa scena **Latający robocik**: mniejszy, okrągły pomocnik z jednym okiem, antenką i dyszą — unosi się, mruga i delikatnie przechyla, inaczej niż machający robocik w rogu ekranu.
- Nowa scena **Straszne dynie**: świecące, wyrzeźbione dynie w trzech odcieniach, z podświetlanym wnętrzem i kołysaniem; liczbę dyni ustawiasz tak jak duszków (1–8).
- Nowa opcja **Napis na animacji**: własny tekst (do 60 znaków) wyświetlany pod postacią podczas każdej wizyty, np. „Wesołych Świąt!”. Działa też z robocikiem w rogu ekranu, a tekst jest bezpiecznie escapowany.
- Nowe sceny są dostępne w trybie losowym i w edytorze karty. Domyślna lista losowania zawiera je wszystkie.

## Nowości w 1.3.0

- Karta ma nowy wygląd: ikona wybranej sceny w nagłówku, kolorowa plakietka stanu (wyłączone, włączone, wstrzymane), chipy z częstotliwością i godzinami oraz przyciski w dwóch kolumnach, które na wąskiej karcie układają się jeden pod drugim.
- Ikona trybu losowego to kostka, wcześniej zawsze pokazywał się rysunek robocika.
- Panel ustawień jest lżejszy wizualnie: obramowana sekcja z chevronem, łagodniejsze pola formularza i czytelne zaznaczanie scen w losowaniu.
- Wyścigówki są przerysowane: gradientowe nadwozie, jaśniejsze szyby, felgi z obracającymi się szprychami, światła z poświatą i płynniejsze zawieszenie zamiast drgania.
- Przyciski i plakietki zachowują rozmiar 44–48 px, a animacje nadal respektują systemowe ograniczenie ruchu.

## Poprawki w 1.2.1

- Mikołaj został przerysowany: czytelna twarz, broda, pełna czapka zakrywająca górę głowy, rękawiczki i łagodniejsze machanie.
- Renifer ma smuklejszą szyję, bardziej szczegółową głowę, rozbudowane poroże, uszy i cztery nogi z niezależnymi, przeciwległymi fazami ruchu.
- Sanie mają łagodniejsze kształty, delikatne cieniowanie i złote zdobienia; poprawiono też uprząż i proporcje sceny.
- Scena sań jest nieco większa dla tej samej wartości rozmiaru. Ustawienia godzin i pozostałe animacje pozostają dostępne.

## Aktualizacja w Twoim repozytorium domowe-animacje-card

1. Rozpakuj paczkę `domowe-animacje-card-1.4.0.zip`.
2. Na GitHubie w repozytorium **domowe-animacje-card** wybierz **Add file → Upload files**.
3. Wgraj nowy **domowe-animacje-card.js** do katalogu głównego i zatwierdź zmianę. Możesz też wgrać README i pozostałe pliki z paczki. Manifest `hacs.json` ma nadal tę samą nazwę pliku.
4. W HACS otwórz **Domowe Animacje**, wybierz **Aktualizuj informacje**, a następnie **Pobierz ponownie / Redownload**, pobierając aktualną domyślną gałąź.
5. Odśwież interfejs Home Assistanta przez **Ctrl+F5**. Wybierz **Ustawienia → Animacja → Mikołaj z saniami**, zapisz i kliknij **Pokaż teraz**.

Jeżeli nadal widać stary rysunek, po ponownym pobraniu sprawdź zasób pulpitu. Dla obecnej instalacji z nowego repozytorium powinien wskazywać na:

```text
/hacsfiles/domowe-animacje-card/domowe-animacje-card.js?v=1.4.0
```

Zmień istniejący wpis zamiast dodawać duplikat. Typ: **Moduł JavaScript**. Usuń nieaktualne zasoby poprzedniej instalacji `white-ghosts-card`, jeśli wciąż są ładowane, i odśwież cały interfejs. Pierwsza linia nowego pliku na GitHubie zawiera `Domowe Animacje 1.4.0`.

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
