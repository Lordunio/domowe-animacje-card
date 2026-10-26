# Instalacja przez HACS

Paczka zawiera manifest `hacs.json` i plik `white-ghosts-card.js` w katalogu głównym. Jest przygotowana do publikacji jako repozytorium niestandardowe typu **Dashboard**. HACS pobiera pliki z publicznego repozytorium GitHub; nie przyjmuje lokalnego pliku ZIP jako adresu repozytorium.

## 1. Jednorazowa publikacja na GitHubie

1. Zaloguj się na GitHub i utwórz **publiczne** repozytorium o nazwie **white-ghosts-card**.
2. Dodaj opis, np. `Animated white ghosts for Home Assistant dashboards`, oraz tematy `home-assistant`, `hacs`, `lovelace`, `custom-card`.
3. Rozpakuj paczkę ZIP. Wgraj **zawartość** katalogu `white-ghosts-card` do katalogu głównego repozytorium. Nie wgrywaj samego ZIP-a ani dodatkowego katalogu nadrzędnego.
4. Zapisz pliki (Commit changes) na domyślnej gałęzi. Na początek wydanie GitHub Release nie jest potrzebne.

Struktura na GitHubie:

```text
white-ghosts-card/
├── hacs.json
├── white-ghosts-card.js
├── README.md
├── INSTALL-HACS.md
├── LICENSE
├── example.yaml
└── podglad.html
```

Nazwa repozytorium i pliku JavaScript są celowo takie same. Paczka nie publikuje się automatycznie. Nie jest jeszcze dodana do domyślnego katalogu HACS.

## 2. Dodanie w Home Assistant

1. W HACS wybierz menu **⋮ → Repozytoria niestandardowe / Custom repositories**.
2. Wklej adres utworzonego repozytorium, w formie `https://github.com/TWOJ_LOGIN/white-ghosts-card` — zastąp `TWOJ_LOGIN` rzeczywistym loginem.
3. Wybierz typ **Dashboard** (w starszych interfejsach: Lovelace / Plugin), a następnie **Dodaj**.
4. Odszukaj **Białe duszki — White Ghosts Card** i wybierz **Pobierz / Download**.
5. Odśwież stronę Home Assistanta.
6. Sprawdź zasoby pulpitu. Jeśli HACS nie zarejestrował zasobu automatycznie, dodaj adres `/hacsfiles/white-ghosts-card/white-ghosts-card.js` jako **Moduł JavaScript**.
7. Dodaj ręcznie kartę na pulpicie:

```yaml
type: custom:white-ghosts-card
```

Kliknij **Pokaż duszki**, aby przetestować animację. Przycisk **Włącz przeloty** uruchamia harmonogram.

## Przejście z instalacji ręcznej

Jeśli wcześniej dodano zasób `/local/white-ghosts-card/white-ghosts-card.js`, usuń jego wpis z zasobów po instalacji przez HACS. Pozostaw jeden zasób tej karty, z adresem `/hacsfiles/…`, i odśwież przeglądarkę. Konfiguracja YAML karty pozostaje taka sama.

## Aktualizacje

Wgrywaj nową wersję pliku JavaScript do tego samego repozytorium. Bez wydań HACS śledzi domyślną gałąź. Jeśli zaczniesz publikować wydania GitHub Release, dołączaj do każdego z nich aktualny plik `white-ghosts-card.js` jako zasób wydania. Użytkownicy pobiorą aktualizację przez HACS.

Przygotowanie struktury nie zastępuje próby instalacji: tej paczki nie instalowano jeszcze w działającym HACS ani Home Assistant.

Dokumentacja HACS: [wymagania ogólne](https://www.hacs.xyz/docs/publish/start/), [karty Dashboard](https://www.hacs.xyz/docs/publish/plugin/), [repozytoria niestandardowe](https://www.hacs.xyz/docs/faq/custom_repositories/).
