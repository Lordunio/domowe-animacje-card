# Domowe Animacje 1.7.1

Poprawki: przejazdy bez cofania oraz świetlisty pył pod saniami i kopytami renifera.

## Wgranie na GitHub

W repozytorium Lordunio/domowe-animacje-card zastąp pliki zawartością tego folderu. Plik `domowe-animacje-card.js` i `hacs.json` muszą pozostać w katalogu głównym repozytorium. Nie umieszczaj ich wewnątrz dodatkowego folderu `domowe-animacje-card-1.7.1`.

Grafiki są osadzone w pliku JavaScript. HACS nadal używa tego samego pliku `domowe-animacje-card.js`. Do ręcznej aktualizacji HA przygotowano też zgodną kopię `domowe-animacje-card.js.gz`.

## Aktualizacja w Home Assistant

1. Zachowaj kopię poprzedniej karty.
2. Po publikacji na GitHub pobierz ponownie kartę w HACS. Przy ręcznym kopiowaniu zastąp oba pliki: `domowe-animacje-card.js` i `domowe-animacje-card.js.gz` w `/config/www/community/domowe-animacje-card/`.
3. W ustawieniach paneli → Zasoby edytuj istniejący wpis tej karty i ustaw adres `/local/community/domowe-animacje-card/domowe-animacje-card.js?v=1.7.1`. Typ: Moduł JavaScript. Nie dodawaj drugiego wpisu.
4. Otwórz ponownie cały panel. W karcie wybierz animację i kierunek ruchu, zapisz ustawienia, a potem włącz animacje. Tryb „Stale” powtarza przejazdy od krawędzi, bez jazdy do tyłu.

## Weryfikacja tej paczki

- Kontrola składni JavaScript i 8 testów logiki zakończone powodzeniem.
- Chrome: 34 przejazdy sprawdzone w obu kierunkach i w kolejnych pętlach, bez wstecznego ruchu.
- Potwierdzony ruch pyłu i nóg renifera, działanie 10 postaci, losowania, lampek i girlandy, zapisu przez formularz, ograniczenia ruchu oraz widoku o szerokości 360 px.
- Brak błędów JavaScript w testach przeglądarki. Obejrzano zrzuty sań, robotów i widoku mobilnego.
- Sprawdzono zgodność plików paczki, folderów na pulpicie i ZIP-u; kopia gzip odtwarza dokładnie ten sam plik JavaScript.

Tej wersji 1.7.1 nie instalowano automatycznie w Home Assistant i nie publikowano na GitHubie. Testy przeglądarki odbyły się na lokalnym podglądzie karty.
