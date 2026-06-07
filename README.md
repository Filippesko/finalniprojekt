# SmartCook

Aplikace pro inteligentní správu surovin a vyhledávání receptů.

## 1. Účel aplikace
Aplikace SmartCook pomáhá uživatelům efektivně využívat suroviny v domácnosti. Umožňuje vyhledávat recepty podle surovin, které mají k dispozici, nebo podle nutričních hodnot, čímž minimalizuje plýtvání potravinami.

## 2. Struktura projektu
- `index.html`: Hlavní HTML struktura aplikace.
- `style.css`: Styly pro responzivní design.
- `app.js`: Logika aplikace, komunikace s API a PWA registrace.
- `sw.js`: Service Worker pro offline dostupnost.
- `manifest.json`: Konfigurace PWA.
- `offline.html`: Stránka pro režim offline.
- `logo.png`: Ikona aplikace.

## 3. Princip fungování
Aplikace využívá asynchronní volání Spoonacular API. Uživatel vybere suroviny, které jsou následně odeslány na server. Výsledky jsou dynamicky vykresleny jako karty. Funkce "Audit ledničky" hlídá expiraci a navrhuje recepty pro okamžité zpracování surovin.



## 4. API Endpoints
- `GET /recipes/findByIngredients`: Vyhledání receptů podle ingrediencí.
- `GET /recipes/findByNutrients`: Vyhledání receptů podle kalorií a bílkovin.
- `GET /recipes/complexSearch`: Hledání podle názvu a typu jídla.
- `GET /recipes/{id}/information`: Detail receptu.

## 5. Instalace
Aplikaci lze nainstalovat do zařízení jako PWA pomocí volby „Přidat na plochu“ v menu prohlížeče.
