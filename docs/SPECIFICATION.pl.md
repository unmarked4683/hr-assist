# HR Assist — Specyfikacja Techniczno-Biznesowa Systemu

Wewnętrzna, lekka i wydajna aplikacja webowa do zarządzania danymi pracowników, ewidencją czasu pracy oraz podglądem stanów urlopowych.

---

## Architektura i Globalny Design System

### Stack Technologiczny

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS, Shadcn UI, Fuse.js (Fuzzy Search)
- **Backend:** NestJS (Node.js framework), TypeScript
- **Database & ORM:** PostgreSQL + Prisma ORM
- **DevOps & Containerization:** Docker + Docker Compose

### Środowisko Uruchomieniowe (One-Command Setup)

Aplikacja jest w pełni skonteneryzowana. Uruchomienie pełnego środowiska deweloperskiego i produkcyjnego (Frontend + Backend + Baza danych PostgreSQL) sprowadza się do wykonania pojedynczej komendy po sklonowaniu repozytorium:

```bash
docker compose up --build
```

**Korzyści: Zero konfiguracji lokalnych instancji baz danych, gwarancja identycznego środowiska dla każdego dewelopera oraz łatwe wdrożenie na serwer docelowy (Zero Configuration Overhead).**

### Zasady Inżynieryjne (System Prompt / Code Rules)

- **Single Source of Truth (Jedno Źródło Prawdy):** Całkowity zakaz duplikowania stanu i hardcodowania danych w wielu komponentach.
- **Modularność:** Ścisła zasada jednej odpowiedzialności (Single Responsibility). Pliki komponentów nie mogą przekraczać ~150–200 linii kodu.
- **Ścisły TypeScript:** Bezwzględny zakaz używania typu `any`. Wszystkie encje domenowe muszą być w pełni otypowane.
- **Stabilność Layoutu:** Stały układ dwukolumnowy (`100vh`) o zerowym przesunięciu widoku (Zero Layout Shift / CLS).

### Układ Strukturalny (Layout)

- **Panel Boczny (`Aside / Nav`):** Stały panel lewy po stronie użytkownika (szerokość 200–300px, wysokość `100vh`).
- **Obszar Główny (`Main`):** Dynamiczny panel prawy wypełniający 100% pozostałej przestrzeni ekranu (`100vh`).

---

## Release Plan & Changelog

> [!IMPORTANT] WAŻNE
> **Umowa Zakresu Prac z Zarządem i Interesariuszami (Scope Contract)**
> Funkcjonalności opisane w sekcji **`v1.0.0 (MVP)`** stanowią pełny i wiążący kontrakt na pierwszą wersję produkcyjną. Wszelkie nowe funkcjonalności, dodatkowe pola czy modyfikacje obiegów zgłoszone w trakcie trwania prac podlegają automatycznemu przesunięciu do sekcji **`v2.0.0+`**.

### `v1.0.0` — MVP (Aktualny Zakres)

#### Dostęp i Model Bezpieczeństwa

- **Pojedyncza Rola (Admin / HR):** Model oparty na zaufanym operatorze. Użytkownik z rolą HR wprowadza bezpośrednio do systemu zatwierdzony stan faktyczny. Brak skomplikowanych i wielostopniowych procesów akceptacji.

---

#### Panel Boczny (`Aside`)

- **Nagłówek:** Górny kafelek z nazwą aplikacji "HR Assist".
- **Nawigacja:** Dwie zakładki — **Pracownicy** oraz **Dni wolne** (aktywna zakładka trwale podświetlona tłem z borderem).
- **Dolny Kafelek Profilowy:**
  - Kółko z wielkimi literami inicjałów, Imię i Nazwisko oraz strzałka w prawo.
  - **Po kliknięciu:** Przyciemnia tło kafelka, obraca strzałkę i otwiera menu podręczne z opcją **Wyloguj się**.
  - **Zamknięcie:** Ponowne kliknięcie, kliknięcie poza obszar (click outside) lub wciśnięcie klawisza `Esc`.
  - **Akcja "Wyloguj się":** Czyści sesję/ciasteczka i przekierowuje do ekranu logowania.

---

#### Ekran Logowania

- Wyśrodkowany, kwadratowy kontener na środku ekranu.
- Pionowa struktura: Ikona profilu $\rightarrow$ Input `Email` $\rightarrow$ Input `Hasło` $\rightarrow$ Przycisk **Zaloguj się**.
- Przekierowanie do widoku **Pracownicy** po pomyślnej autoryzacji.

---

#### Widok: Lista Pracowników (`/employees`)

- **Górny Pasek:**
  - Wyszukiwarka oparta na **Fuse.js** (szuka po polach: _Imię, Nazwisko, Stanowisko, Lokalizacja, PESEL_).
  - Kwadratowy przycisk `+` wywołujący **Modal Dodawania Pracownika**.
- **Tabela Systemowa:**
  - Tabela HTML (`<table>`) z obramowaniem na całe wiersze (`<tr>`) i brakiem ramek pionowych (`<td>`).
  - Kolumny nagłówka (UPPERCASE, wyśrodkowane): `IMIĘ`, `NAZWISKO`, `STANOWISKO`, `LOKALIZACJA`, `STATUS`.
  - **Wiersze:** Naprzemienne tło (Zebra striping). Kliknięcie w dowolne miejsce wiersza przenosi do widoku szczegółowego pracownika.
  - **Komórka Lokalizacja:** Dedykowany badge wizualny (np. "Hala" + ikona).
  - **Wskaźniki Statusu:**
    - 🟢 **Status OK:** Zielony wskaźnik + napis `OK`.
    - 🔴 **Status NN:** Czerwony wskaźnik + napis `NN` + **stonowane, wyraziste czerwone pulsowanie całego wiersza** (aktywowane przy nieobecności nieusprawiedliwionej).
  - **Przewijanie:** Niezależny przewijany kontener (`overflow-y: auto`) z przyklejonym, nieprześwitującym nagłówkiem (`sticky header`).

---

#### Widok: Szczegóły Pracownika (`/employees/[id]`)

##### Górna Strefa: Zakładki (Tabs)

- **Zakładka 1: "Dane pracownika"**
  - Wiersz 1: Imię i Nazwisko (UPPERCASE, np. `JAN KOWALSKI`).
  - Wiersz 2: `PESEL: 85071812345 (18.07.1985)` (PESEL + wyliczona data urodzenia).
  - Wiersz 3: `Stanowisko • Lokalizacja • Dział/Byt prawny` (np. `Magazynier • Hala • Dział Konstrukcji`).
  - Wiersz 4: `Godziny pracy • Wymiar etatu • Typ umowy` (np. `08:00 - 16:00 • 8 godz./dzień (Pełen etat) • UoP`).
  - **Pasek Akcji (Prawy Górny Róg):** 4 przyciski ikoniczne — `Edytuj`, `Raport`, `Zwolnij/Archiwizuj`, `Usuń` (podpięte pod zaślepki `alert("Funkcja w przygotowaniu")`).
- **Zakładka 2: "Urlopy"**
  - Stały układ dwukolumnowy (`grid-cols-2`):
    - **Lewa kolumna:** Urlop zaległy (np. `Zaległy: 10 / 20 dni`) + pasek postępu `Progress` (50%).
    - **Prawa kolumna:** Urlop bieżący (np. `Aktualny: 0 / 26 dni`) + pasek postępu `Progress` (0%).
  - **Obsługa stanu Null / Brak puli:** Wyświetla `- / - dni` oraz pasek postępu 0%. Wartości procentowe zaokrąglane do 2 miejsc po przecinku (np. `66,67%`).

##### Dolna Strefa: Moduł Kalendarza (Persystentny)

_Zawsze widoczny pod sekcją zakładek, niezależnie od wybranej zakładki na górze._

- **Nawigacja Czasowa (Góra-Lewo):**
  - Przycisk `<` $\rightarrow$ Select Miesiąca (`STYCZEŃ`–`GRUDZIEŃ`) $\rightarrow$ Select Roku (`2026`–`2036`) $\rightarrow$ Przycisk `>`.
  - Strzałki stają się nieaktywne na krańcach zakresu (Styczeń 2026 / Grudzień 2036).
- **Mechanizm Blokady / Kłódka (Góra-Prawo):**
  - **Trwający miesiąc:** Ikona kłódki wyszarzona z podpowiedzią (_"Nie można zablokować miesiąca, gdyż jeszcze trwa"_).
  - **Dni 1–10 kolejnego miesiąca:** Ikona kłódki aktywna z zielonym akcentem. Kliknięcie wywołuje modal potwierdzenia w celu nieodwracalnej blokady edycji.
  - **Od 11. dnia (godz. 00:00):** Automatyczna blokada systemowa (Czerwona, zamknięta kłódka).
  - **Efekt blokady:** Przezroczystość tabeli kalendarza spada (`opacity`), interakcje zostają zablokowane, a kursor zmienia się na `not-allowed`.
- **Siatka Kalendarza:**
  - 6 Kolumn: `Dzień` | `Dzień tygodnia` | `Godziny pracy` | `Nominalny czas` | `Realny czas` | `Status`.
  - Statusy: `OB` (Obecny - Zielony), `NN` (Nieobecność nieusprawiedliwiona - Czerwony + podświetlenie wiersza), `USP` (Nieobecność usprawiedliwiona / Urlop - Pomarańczowy).

##### Reguły Klikalności, Edycji i Słownika Frekwencji

###### Dostępność Edycji Dnia

Dzień w kalendarzu jest klikalny (cursor-pointer + efekt hover) wyłącznie wtedy, gdy:

- Miesiąc nie jest zablokowany.
- Dzień nie jest Sobotą ani Niedzielą.
- Dzień nie jest Świętem Ustawowo Wolnym.
- Dzień nie jest Odgórnym Dniem Wolnym Firmowym (zapisywanym automatycznie w bazie pod maską jako UW — Urlop Wypoczynkowy, bez możliwości ręcznej edycji).

Dni niedostępne enforce cursor: not-allowed.

###### Słownik Statusów Frekwencji (16)

OB (Obecność - domyślny, brak wpisu w bazie), CH (Chorobowe), NN (Nieobecność nieusprawiedliwiona), UB (Urlop bezpłatny), UW (Urlop wypoczynkowy / Wolne firmowe), UM (Urlop macierzyński), NUN (Nieobecność usprawiedliwiona niepłatna), NUP (Nieobecność usprawiedliwiona płatna), UO (Urlop ojcowski), OP (Opieka), REH (Świadczenie rehabilitacyjne), UR (Urlop rodzicielski), UŻ (Urlop na żądanie), UOK (Urlop okolicznościowy), WZS (Dzień wolny za święto), WYC (Urlop wychowawczy).

###### Modal Edycji Frekwencji Dnia

Nagłówek: Data wybranego dnia w formacie D MIESIĄC ROK (np. 1 LIPCA 2026).

Układ UI: 3 równorzędne, wyrównane pod względem szerokości elementy rozłożone symetrycznie:

- Select Frekwencji: Rozwijana lista z opcjami Nazwa (SKRÓT).
- Przycisk "Usuń frekwencję": Usuwa wyjątek z bazy, przywracając stan domyślny OB.
- Przycisk "Aktualizuj": Zapisuje wybrany wyjątek w bazie.

##### Blokada UX: Modal zamyka się automatycznie dopiero po otrzymaniu odpowiedzi z backendu i re-renderze siatki

#### Reużywalny Komponent Modala (`<Modal />`)

- Wyśrodkowany kontener z rozmytym tłem (`backdrop-blur`).
- Nagłówek: Wyśrodkowany tytuł + przycisk zamykający `[X]` po prawej stronie.
- Stopka: Główny przycisk akcji, zablokowany do momentu przejścia pełnej walidacji formularza.
- **Podwójne Potwierdzenie (`confirmConfig`):** Opcjonalny prop wywołujący wewnętrzne okno ostrzegawcze (_"Czy na pewno kontynuować?"_) przed wykonaniem nieodwracalnych akcji.

##### Modal Dodawania Pracownika (Siatka 4 Rzędów)

- **Rząd 1:** `Imię` | `Nazwisko` | `PESEL` (11 cyfr + walidacja NPM + wyliczana w czasie rzeczywistym data urodzenia pod spodem).
- **Rząd 2:** `Typ umowy` (sztywno: `UoP`) | `Wymiar etatu` (1/8 do 8/8 + wyliczane godziny) | `Godzina rozpoczęcia` | `Godzina zakończenia`.
  - _Synchronizacja:_ Zmiana godziny rozpoczęcia przesuwa godzinę zakończenia wg etatu. Dozwolone widełki: `04:00`–`22:00`. Wyjście poza zakres podświetla pola na czerwono i blokuje wysyłkę.
- **Rząd 3:** `Lokalizacja` (Segmented Control: `Biuro` | `Hala`) | `Stanowisko` (Combobox z podpowiedziami + opcja własnego wpisu) | `Firma / Byt prawny` (Dropdown rozwijany).
- **Rząd 4:** `Urlop zaległy` (Input numeryczny $0$–$26$ dni) | `Pula roczna` (Przełącznik: `20 dni` | `26 dni`).

---

### `v2.0.0+` — Roadmapa (Przyszłe Wersje)

Funkcjonalności zaplanowane do wdrażania w kolejnych iteracjach. **Wyłączone z zakresu `v1.0.0 (MVP)`**:

- **`v2.1.0` — Kontrola Dostępów Multi-Role (RBAC)**
  - Role użytkowników: `Pracownik`, `Kierownik / HR`, `Admin / Dyrekcja`.
  - Panel akceptacji wniosków urlopowych i obieg statusów (`PENDING` $\rightarrow$ `APPROVED` / `REJECTED`).
- **`v2.2.0` — Moduł Raportowania i Eksportu**
  - Aktywacja przycisku `Raport` na karcie pracownika.
  - Automatyczny eksport zestawień ewidencji czasu pracy do plików PDF / XLSX.
- **`v2.3.0` — Zarządzanie Profilami i Powiadomienia**
  - Modale edycji danych pracowników, archiwizacji oraz usuwania kartotek z bazy.
  - Integracja powiadomień Email / Slack dla blokad miesięcy oraz zgłoszeń NN.
