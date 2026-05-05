# Flowza — Aplikacion për Menaxhimin e Projekteve

Flowza është një aplikacion web për menaxhimin e projekteve bazuar në role, frontend i të cilit është ndërtuar me React dhe TypeScript. Ai lejon ekipet të menaxhojnë projektet dhe detyrat përmes tre panelave të ndryshme sipas roleve.

---

## Rolet & Panelet

### Admin
- Shikon statistika të përgjithshme: projekte totale, projekte aktive dhe anëtarë të ekipit
- Krijon projekte të reja me emër, përshkrim, prioritet, status, datë fillimi dhe afat
- Cakton udhëheqës ekipi për projektet

### Udhëheqës Ekipi
- Shikon statistika për projektet e caktuara: detyra totale, në progres, në rishikim dhe të përfunduara
- Menaxhon projektet e veta dhe përditëson statusin e tyre
- Krijon detyra dhe i cakton programuesve me prioritet, afat dhe status

### Programues
- Shikon tabelën personale të detyrave të ndarë në: Të Reja, Në Progres, Në Rishikim dhe Të Përfunduara
- Përditëson statusin e detyrave të caktuara
- Ngarkon skedarë të lidhur me detyrat
- Shikon historikun e ndryshimeve të statusit për çdo detyrë

---

## Struktura e Projektit

```
src/
├── app/
│   ├── features/
│   │   ├── auth/                  # Logjika dhe komponentët  e autentifikimit (Login)
│   │   ├── dashboard/             # Panelet sipas roleve (Admin, Team Leader, Programues)
│   │   └── ui/                    # Komponentët e ripërdorshëm të ndërfaqes (button, table, etj.)
│   ├── utils/                     # Të dhëna mock dhe funksione ndihmëse
│   ├── App.tsx                    # Komponenti kryesor i aplikacionit
│   └── styles/                    # Stilet globale
├── main.tsx                       # Pika e hyrjes së aplikacionit
├── index.html                     # Faqja kryesore HTML
├── default_shadcn_theme.css       # Tema e shadcn/ui
├── postcss.config.mjs             # Konfigurimi i PostCSS
├── vite.config.ts                 # Konfigurimi i Vite
├── package.json                   # Varësitë dhe skriptet
└── README.md                      # Dokumentacioni i projektit
```

---

## Llogaritë Demo

| Emri | Email | Fjalëkalimi | Roli |
|---|---|---|---|
| Admin User | admin@flowza.com | admin123 | Admin |
| Helena Kace | team1@flowza.com | team123 | Udhëheqës Ekipi |
| Erjeta Rrapaj | team2@flowza.com | team123 | Udhëheqës Ekipi |
| Isnalda Sylaj | dev1@flowza.com | dev123 | Programuese |
| Jonalda Gjoka | dev2@flowza.com | dev123 | Programuese |

---

## Teknologjitë e Përdorura

- **React** me TypeScript
- **Tailwind CSS** për stilizim
- **Lucide React** për ikona
- **Radix UI** për komponentë të arritshëm (dialog, etiketa, slots)
- **React Hook Form** për menaxhimin e gjendjeve të formularëve
- **React Day Picker** për komponentin e kalendarit
- **Class Variance Authority (CVA)** për menaxhimin e varianteve të butonit
- **Embla Carousel** për mbështetjen e karuselit

---

## Si të Filloni

```bash
# Instaloni varësitë
npm install

# Nisni serverin
npm run dev
```

Pastaj hapni shfletuesin dhe shkoni te `http://localhost:5173` (ose portën që cakton Vite).

---

## Veçoritë

- Rrugëzim bazuar në role — çdo përdorues sheh vetëm panelin e tij pas hyrjes
- Menaxhimi i statusit të detyrave me historik të ndryshimeve
- Simulim i ngarkimit të skedarëve për çdo detyrë
- Krijimi i projekteve dhe caktimi i udhëheqësit të ekipit (vetëm Admin)
- Krijimi i detyrave dhe caktimi i programuesve (vetëm Udhëheqës Ekipi)
- Kolonat e detyrave në stil Kanban për programuesit
- Paraqitje responsive në të gjitha panelet (desktop, mobile etj)

---

## Kontribuesit

### Frontend
- Helena Kace
- Erjeta Rrapaj
- Isnalda Sylaj
