# Domowe Animacje 1.2.0

Karta Home Assistant z sześcioma animacjami i ustawieniami na pulpicie. Własne rysunki SVG, bez bibliotek, filmów, dźwięku i połączeń z Internetem.

| Animacja | Zachowanie |
| --- | --- |
| Białe duszki | Falują i przelatują przez ekran |
| Machający robocik | Wysuwa się z wybranego rogu, macha i chowa |
| Mikołaj z saniami | Przelatuje z reniferem i prezentami; Mikołaj macha |
| Wielkanocny króliczek | Podskakuje przy dolnej krawędzi, z koszyczkiem pisanek |
| Motylki | Lecą falującym torem i poruszają skrzydłami; różne kolory |
| Wyścigówki | Jadą przy dolnej krawędzi, z obracającymi się kołami; różne kolory i tempo |
| Losowo z wybranych | Losuje jedną z zaznaczonych scen przy każdej wizycie |

Losowanie unika tej samej sceny dwa razy z rzędu, jeśli zaznaczono więcej niż jedną. Wszystkie sceny są dostępne przez cały rok. Dobór scen nie zależy automatycznie od świąt.

## Aktualizacja Twojego istniejącego dodatku

1. Rozpakuj paczkę **domowe-animacje-1.2.0.zip**.
2. Wejdź do swojego dotychczasowego repozytorium GitHub **white-ghosts-card**.
3. Wybierz **Add file → Upload files** i wgraj do katalogu głównego repozytorium dwa pliki: **white-ghosts-card.js** oraz **hacs.json**. Zatwierdź przyciskiem **Commit changes / Zatwierdź zmiany**. Możesz także wgrać nowy README i pozostałą dokumentację.
4. W HACS otwórz obecny dodatek. Wybierz **Pobierz ponownie / Redownload** z jego menu i pobierz domyślną gałąź; jeśli pojawi się aktualizacja, możesz ją zainstalować.
5. Odśwież interfejs Home Assistanta, na komputerze najlepiej **Ctrl+F5**. W aplikacji mobilnej może być potrzebne ponowne załadowanie interfejsu.
6. Rozwiń **Ustawienia** w karcie i wybierz nową animację. Po zmianie kliknij **Zapisz ustawienia**, a następnie **Pokaż teraz**.

Nazwa wyświetlana w HACS zmienia się na **Domowe Animacje** po odświeżeniu informacji o dodatku. Adres repozytorium i plik `white-ghosts-card.js` pozostają zgodne z obecną instalacją. Nie trzeba zmieniać nazwy repozytorium, zasobu pulpitu ani tworzyć drugiej karty.

Dotychczasowy `type: custom:white-ghosts-card` nadal działa. Nowe karty mogą używać nazwy `type: custom:domowe-animacje-card`. Własny tytuł karty zachowuje się; jeśli w YAML masz wpisane `title: Białe duszki`, zmień nazwę w ustawieniach lub edytorze karty na **Domowe Animacje**.

Wgrywanie do publicznego GitHuba i instalację w HACS wykonuje właściciel repozytorium. Przygotowanie tej paczki nie aktualizuje automatycznie plików na GitHubie.

## Ustawienia w karcie

- **Nazwa karty** — dowolny tytuł.
- **Animacja** — sześć scen lub **Losowo z wybranych**.
- **Animacje w losowaniu** — zaznacz sceny; lista pojawia się po wyborze trybu losowego. Co najmniej jedna musi zostać zaznaczona.
- **Róg ekranu** — dotyczy robocika; pozostałe sceny poruszają się przez ekran.
- **Kierunek ruchu** — losowy, z lewej do prawej lub odwrotnie; dotyczy scen przemieszczających się.
- **Odstęp: minimum / maksimum** — w minutach. Ustaw oba na **2**, aby animacje zaczynały się co dwie minuty.
- **Aktywne od / do** — ustaw np. **06:00**–**22:00**. Czas lokalny urządzenia z pulpitem. Jednakowe godziny oznaczają całą dobę; można podać przedział przez północ.
- **Czas wyświetlania** — 5–60 sekund. Dla grup to czas pojedynczej postaci; kolejne mogą zaczynać z niewielkim opóźnieniem. Część aut jedzie szybciej.
- **Rozmiar** — 40–220 px jako rozmiar bazowy. Sceny mają różne proporcje: sanie są szersze, motyle mniejsze. Na małych ekranach postacie są dodatkowo ograniczane.
- **Liczba duszków / motylków / aut** — 1–8. Robocik, króliczek oraz sanie są pojedynczymi scenami.

Po zmianach kliknij **Zapisz ustawienia**. Ustawienia i włącznik są zapamiętywane w tej przeglądarce. Przetrwają odświeżenie; inne urządzenie ma własne ustawienia. **Przywróć z YAML** usuwa lokalne nadpisania i przywraca wartości z konfiguracji karty.

Wartości bazowe można też zapisać przez wizualny edytor karty: **Zastosuj w konfiguracji**, a następnie zapisz kartę w Home Assistant. Zmiana bazowej konfiguracji zastępuje poprzednie lokalne ustawienia. Jedna przeglądarka ma jeden harmonogram — używaj jednej karty sterującej.

## Przykład YAML: wszystkie sceny, co dwie minuty, 06:00–22:00

```yaml
type: custom:domowe-animacje-card
title: Domowe Animacje
character: random
random_pool:
  - ghosts
  - robot
  - santa
  - bunny
  - butterflies
  - cars
corner: random
direction: random
duration: 10
size: 150
ghosts: 3
interval_min: 2
interval_max: 2
schedule_start: "06:00"
schedule_end: "22:00"
```

Wersja zapisana w pliku: `example.yaml`. Dostępne `character`: `ghosts`, `robot`, `santa`, `bunny`, `butterflies`, `cars`, `random`. Dostępne `corner`: `random`, `bottom-right`, `bottom-left`, `top-right`, `top-left`. Dostępne `direction`: `random`, `left-to-right`, `right-to-left`.

Minimalna konfiguracja `type: custom:domowe-animacje-card` ma domyślnie duszki, 3 postacie, 14 sekund, rozmiar 110, losowy kierunek i róg, odstępy 5–15 minut oraz aktywność przez całą dobę. Pierwsze uruchomienie ma wyłączony harmonogram; włącz go przyciskiem w karcie. Aktualizacja zachowuje zapisany stan włącznika.

## Zachowanie i ograniczenia

Przycisk **Pokaż teraz** działa poza wyznaczonymi godzinami. Godziny ograniczają rozpoczęcie animacji; rozpoczęta wizyta kończy się normalnie. Termin wypadający poza godzinami zostaje przesunięty na najbliższy dozwolony początek.

Pulpit musi pozostać otwarty i widoczny. W tle harmonogram jest wstrzymany, a po powrocie losowany jest nowy termin. Harmonogram działa także po przejściu do innego widoku. Zasób przywraca ustawienia po odświeżeniu. Wyłączenie lub zmiana ustawień od razu chowa bieżącą postać. Animacje przepuszczają kliknięcia do pulpitu.

Systemowe ograniczenie ruchu wstrzymuje automatyczne animacje. Ręczny test pokazuje wtedy nieruchome postacie przez dwie sekundy. Brak dźwięku, encji, automatyzacji i kont w chmurze.

## Nowa instalacja i podgląd

Pierwsza instalacja: [INSTALL-HACS.md](INSTALL-HACS.md). `podglad.html` pokazuje prawdziwą kartę z całym panelem ustawień na przykładowym pulpicie. Nie łączy się z Twoją instalacją Home Assistanta.

## Weryfikacja i licencja

50 testów logiki zakończonych powodzeniem: godziny, harmonogram, migracja zapisanych ustawień i nazwy, stary i nowy typ karty, formularz, losowanie, kierunek, geometria na małych ekranach, start i sprzątanie animacji. Sprawdzono statyczny wygląd wszystkich sześciu rysunków po wyrenderowaniu SVG. Nie wykonano testu w rzeczywistej instalacji Home Assistant ani kontroli animacji w przeglądarce. Po aktualizacji sprawdź każdą scenę przyciskiem **Pokaż teraz** na swoim urządzeniu.

Kod i ilustracje: MIT. Pomysł pierwotnych przelotów inspirowany [Franky's Christmas Card](https://github.com/Franz1302/frankys-stuff-christmas-card); brak kodu i multimediów z tamtego projektu. Dokumentacja: [API kart Home Assistant](https://contributors.home-assistant.io/frontend/custom-ui/card/), [wymagania HACS](https://www.hacs.xyz/docs/publish/plugin/).
