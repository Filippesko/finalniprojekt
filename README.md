1. Účel aplikace
Aplikace SmartCook je inteligentní kuchyňský asistent. Jejím hlavním účelem je pomoci uživatelům najít recepty na základě surovin, které mají právě k dispozici, nebo podle preferovaných nutričních hodnot. Cílem je minimalizovat plýtvání potravinami a usnadnit plánování jídelníčku.

2. Struktura projektu
Projekt je rozdělen do následujících souborů:

index.html: Hlavní struktura aplikace

style.css: Styly pro moderní a responzivní design.

app.js: Logika aplikace, asynchronní volání API.

sw.js: Service Worker zajišťující offline dostupnost.

manifest.json: Web App Manifest definující instalovatelnost aplikace (PWA).

offline.html: Stránka zobrazená uživateli při ztrátě připojení.

3. Princip fungování
Aplikace funguje na principu klientského zpracování dat a komunikace s externím API:

Výběr surovin: Uživatel si v rozhraní vybere ingredience, které má v lednici.

Komunikace s API: Po stisknutí tlačítka pro vyhledání odešle app.js asynchronní požadavek (fetch) na Spoonacular API.

Zpracování odpovědi: API vrátí seznam receptů, které aplikace následně transformuje na HTML karty a zobrazí uživateli.

Audit ledničky: Uživatel může ke každé surovině zadat počet dní do expirace. Aplikace následně doporučí recepty, které suroviny využijí dříve, než se zkazí.

4. API Endpoints
Aplikace využívá tyto endpointy rozhraní Spoonacular API:

GET /recipes/findByIngredients: Vyhledávání receptů podle seznamu surovin.

GET /recipes/findByNutrients: Vyhledávání receptů dle zadaného rozmezí kalorií a bílkovin.

GET /recipes/complexSearch: Fulltextové vyhledávání dle názvu, kuchyně nebo typu jídla.

GET /recipes/{id}/information: Načtení detailních informací o konkrétním receptu.

5. Možnost instalace
Aplikaci je možné nainstalovat do mobilního nebo stolního zařízení jako PWA.
