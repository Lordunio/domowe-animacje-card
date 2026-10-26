# Domowe Animacje — repozytorium domowe-animacje-card

Ta paczka jest przeznaczona do repozytorium GitHub o nowej nazwie **domowe-animacje-card**. Zawiera te same sześć animacji co wersja 1.2.0. Zmienia nazwę głównego pliku i manifest HACS, bez zmiany logiki animacji i ustawień.

## Zmiana nazwy repozytorium na GitHubie

1. Otwórz swoje repozytorium `white-ghosts-card`.
2. Wejdź w zakładkę **Settings / Ustawienia** przy górnym pasku repozytorium.
3. W sekcji **General / Ogólne**, w polu **Repository name / Nazwa repozytorium**, wpisz **domowe-animacje-card**.
4. Kliknij **Rename / Zmień nazwę**.
5. Rozpakuj tę paczkę. W zmienionym repozytorium wybierz **Add file → Upload files** i wgraj zawartość folderu, w szczególności `domowe-animacje-card.js` i `hacs.json`. Zatwierdź zmiany.
6. Usuń z katalogu głównego repozytorium poprzedni plik `white-ghosts-card.js` i zatwierdź usunięcie. Zachowaj nowy `domowe-animacje-card.js`. Historię starego pliku nadal przechowuje GitHub.

Nowy adres po zmianie nazwy na koncie Lordunio:

```text
https://github.com/Lordunio/domowe-animacje-card
```

Repozytorium ma pozostać publiczne. Pliki mają być bezpośrednio w katalogu głównym, a nie w dodatkowym folderze. Nie wgrywaj samego ZIP-a.

## Przejście w HACS i Home Assistant

GitHub przekierowuje wiele starych adresów po zmianie nazwy, ale należy też sprawdzić adres repozytorium i zasobu w swojej instalacji HACS. Nie zakładaj, że sama zmiana nazwy przełączy pobrane pliki.

1. Zachowaj YAML obecnej karty. Nazwa `type: custom:white-ghosts-card` nadal jest obsługiwana; możesz też używać `type: custom:domowe-animacje-card`.
2. W HACS przy dodatku wybierz **⋮ → Aktualizuj informacje**. Jeśli jego adres wskazuje już na `Lordunio/domowe-animacje-card`, wybierz **Pobierz ponownie / Redownload** i pobierz bieżącą domyślną gałąź.
3. Jeżeli HACS nadal ma poprzedni wpis albo nie pozwala pobrać zmienionego repozytorium, usuń dotychczasowy dodatek przez menu HACS, a potem dodaj nowy adres w **⋮ → Repozytoria niestandardowe**, typ **Dashboard**, i pobierz **Domowe Animacje**. Usunięcie dodatku usuwa pobrane pliki; zachowaj konfigurację samej karty na pulpicie.
4. Otwórz **Ustawienia → Pulpity → ⋮ → Zasoby**. Po instalacji z nowego adresu powinien być ładowany jeden moduł:

```text
/hacsfiles/domowe-animacje-card/domowe-animacje-card.js?v=1.2.0
```

5. Usuń nieaktualne wpisy wskazujące na `/hacsfiles/white-ghosts-card/…` albo ręczną kopię `/local/white-ghosts-card/…`. Jeśli HACS dodał już nowy zasób, edytuj ten wpis zamiast dodawać drugi. Typ zasobu: **Moduł JavaScript**.
6. Odśwież cały interfejs przez **Ctrl+F5**, a na telefonie ponownie załaduj interfejs aplikacji. W karcie powinno być pole **Animacja** z siedmioma pozycjami: sześć scen i tryb losowy.

Jeżeli HACS zachował stary katalog instalacyjny mimo aktualizacji informacji, skorzystaj z ponownej instalacji z nowego adresu w kroku 3. Nowa ścieżka zasobu musi odpowiadać faktycznie pobranej instalacji.

Zapisane ustawienia przeglądarki pozostają pod dotychczasowym kluczem; sama zmiana nazwy pliku ich nie kasuje. Ustawienia YAML i lokalne nadal współdziałają tak samo jak w wersji 1.2.0.

## Obsługa

Rozwiń **Ustawienia** w karcie. Wybierz jedną animację lub **Losowo z wybranych**, zaznacz sceny do losowania, ustaw przedział godzin, odstępy, czas, rozmiar, kierunek i róg robocika. Kliknij **Zapisz ustawienia**. Test: **Pokaż teraz**. Harmonogram: **Włącz animacje**.

Przykład co dwie minuty od 06:00 do 22:00 znajduje się w `example.yaml`. `podglad.html` pokazuje kartę na przykładowym pulpicie.

## Weryfikacja

Kod JavaScript jest identyczny z wersją 1.2.0, dla której przeszło 50 testów logiki. Sprawdzono zgodność nazwy głównego pliku, manifestu i repozytorium oraz składnię pliku JavaScript. Migracji nie wykonywano w Twoim GitHubie ani HACS; wykonaj ją według powyższych kroków. Licencja MIT obejmuje kod i ilustracje.

Dokumentacja: [zmiana nazwy repozytorium GitHub](https://docs.github.com/en/repositories/creating-and-managing-repositories/renaming-a-repository), [wymagania kart HACS](https://www.hacs.xyz/docs/publish/plugin/), [obsługa repozytoriów HACS](https://www.hacs.xyz/docs/use/repositories/dashboard/).
