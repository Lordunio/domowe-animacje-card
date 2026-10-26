# Pierwsza instalacja Domowych Animacji przez HACS

Jeśli masz już white-ghosts-card, użyj instrukcji aktualizacji w README. Nowe repozytorium nie jest potrzebne.

1. Utwórz publiczne repozytorium GitHub o nazwie **white-ghosts-card**. Dodaj opis `Domowe Animacje — animated characters for Home Assistant` i tematy `home-assistant`, `hacs`, `lovelace`, `custom-card`.
2. Wgraj zawartość tego katalogu do katalogu głównego repozytorium. Pliki `hacs.json` i `white-ghosts-card.js` muszą być widoczne bezpośrednio po wejściu do repozytorium. Nie wgrywaj samego ZIP-a ani dodatkowego folderu nadrzędnego.
3. Zatwierdź zmiany. Wydanie GitHub Release nie jest potrzebne do pierwszej instalacji z domyślnej gałęzi.
4. W Home Assistant otwórz **HACS → ⋮ → Repozytoria niestandardowe**. Dodaj rzeczywisty adres repozytorium, typ **Dashboard**.
5. Odszukaj **Domowe Animacje** i wybierz **Pobierz / Download**.
6. Odśwież interfejs Home Assistanta. Jeżeli zasób nie został dodany automatycznie, w zasobach pulpitu dodaj `/hacsfiles/white-ghosts-card/white-ghosts-card.js` jako **Moduł JavaScript**.
7. Dodaj ręcznie kartę:

```yaml
type: custom:domowe-animacje-card
```

8. Rozwiń **Ustawienia**, wybierz scenę i godziny, kliknij **Zapisz ustawienia**, a następnie **Pokaż teraz** oraz **Włącz animacje**.

Do ręcznej instalacji skopiuj plik JavaScript do `/config/www/white-ghosts-card/white-ghosts-card.js` i dodaj zasób `/local/white-ghosts-card/white-ghosts-card.js?v=1.2.0` jako moduł JavaScript. Nie ładuj jednocześnie kopii ręcznej i kopii z HACS.

## Nazwa wyświetlana a adres

W HACS i wyborze kart dodatek nazywa się **Domowe Animacje**. Nazwa repozytorium i pliku pozostaje `white-ghosts-card`, żeby zachować prostą aktualizację istniejących instalacji i zgodność struktury z HACS. Jeśli później zmienisz adres repozytorium, będzie to osobna migracja, wymagająca aktualizacji ścieżek i konfiguracji HACS.

## Późniejsze aktualizacje

Wgrywaj nowy plik JavaScript do tego samego repozytorium. Bez wydań HACS śledzi domyślną gałąź. Jeżeli zaczniesz publikować wydania GitHub Release, dołączaj aktualny plik `white-ghosts-card.js` jako zasób każdego wydania.

Dokumentacja: [struktura kart HACS](https://www.hacs.xyz/docs/publish/plugin/), [manifest](https://www.hacs.xyz/docs/publish/start/), [repozytoria niestandardowe](https://www.hacs.xyz/docs/faq/custom_repositories/).
