// Bilingual content for the Aysha & Raees wedding site.
// Each key carries { en, ml }. Strings with "\n" are rendered as multiple
// lines (see the <Multi> helper in components).

export type Lang = "en" | "ml";
export type Entry = Record<Lang, string>;

export const content: Record<string, Entry> = {
  // ---- Hero ----
  hero_eyebrow: { en: "The wedding of", ml: "വിവാഹം" },
  hero_bride: { en: "Aysha Samiya", ml: "ആയിഷ സമിയ" },
  hero_groom: { en: "Raees Mohamed Ali", ml: "റഈസ് മുഹമ്മദ് അലി" },
  hero_intro: {
    en: "Together with their beloved families,\nrequest the honour of your presence",
    ml: "ഇരു കുടുംബങ്ങളോടൊപ്പം,\nനിങ്ങളുടെ സാന്നിധ്യം ആഗ്രഹിക്കുന്നു",
  },
  hero_date: { en: "August 2026", ml: "ഓഗസ്റ്റ് 2026" },
  hero_scroll: { en: "Scroll", ml: "താഴേക്ക്" },
  music_prompt: { en: "Play our music", ml: "സംഗീതം കേൾക്കൂ" },

  // ---- Verse ----
  verse_eyebrow: { en: "In the name of Allah", ml: "അല്ലാഹുവിന്റെ നാമത്തിൽ" },
  verse_text: {
    en: "And among His signs is that He created for you mates from among yourselves, that you may find tranquillity in them; and He has placed between you affection and mercy.",
    ml: "അവന്റെ ദൃഷ്ടാന്തങ്ങളിൽ പെട്ടതാണ്, നിങ്ങൾക്ക് സമാധാനമടയാൻ വേണ്ടി നിങ്ങളിൽ നിന്നുതന്നെ ഇണകളെ അവൻ സൃഷ്ടിച്ചതും, നിങ്ങൾക്കിടയിൽ സ്നേഹവും കാരുണ്യവും ഉണ്ടാക്കിയതും.",
  },
  verse_ref: { en: "Surah Ar-Rum · 30 : 21", ml: "സൂറത്ത് അർ-റൂം · 30 : 21" },

  // ---- Bond ----
  bond_eyebrow: { en: "Hand in hand", ml: "കൈകോർത്ത്" },
  bond_title: { en: "Two Hearts, One Bond", ml: "രണ്ട് ഹൃദയങ്ങൾ, ഒരു ബന്ധം" },
  bond_text: {
    en: "Two souls, joined by faith and love,\nbeginning a lifetime as one.",
    ml: "വിശ്വാസത്താലും സ്നേഹത്താലും ചേർന്ന്,\nഒരുമിച്ച് ഒരു ജീവിതയാത്ര.",
  },

  // ---- Countdown ----
  count_eyebrow: { en: "Counting the days until", ml: "കാത്തിരിക്കുന്നു" },
  count_title: { en: "we say  I do", ml: "ആ ധന്യ മുഹൂർത്തം" },
  count_days: { en: "Days", ml: "ദിവസം" },
  count_hours: { en: "Hours", ml: "മണിക്കൂർ" },
  count_mins: { en: "Minutes", ml: "മിനിറ്റ്" },
  count_secs: { en: "Seconds", ml: "സെക്കൻഡ്" },
  count_done: { en: "Today is the day · Alhamdulillah", ml: "ഇന്നാണ് ആ ദിനം · അൽഹംദുലില്ലാഹ്" },

  // ---- Families ----
  fam_eyebrow: { en: "By the grace of Allah", ml: "അല്ലാഹുവിന്റെ അനുഗ്രഹത്താൽ" },
  fam_title: { en: "Our Families", ml: "ഞങ്ങളുടെ കുടുംബങ്ങൾ" },

  bride_label: { en: "The Bride", ml: "വധു" },
  bride_name: { en: "Aysha Samiya", ml: "ആയിഷ സമിയ" },
  bride_parents: {
    en: "Daughter of\nAbdul Salim  &  Rahiyanath Abdul Salim",
    ml: "മകൾ\nഅബ്ദുൽ സലിം  &  റഹിയാനത്ത് അബ്ദുൽ സലിം",
  },
  bride_grand: {
    en: "Granddaughter of\nLate Panattakayil Mohamed Ali Haji  &  Late Rayammarakkar Veetil Beevi\nand  Late Thindikkel Kochu Mohamed  &  Late Valiyapurayil Nafeesa",
    ml: "പേരക്കുട്ടി\nപരേതരായ പനാട്ടക്കയിൽ മുഹമ്മദ് അലി ഹാജി  &  പരേതയായ റയമ്മരക്കാർ വീട്ടിൽ ബീവി\nഒപ്പം  പരേതരായ തിണ്ടിക്കൽ കൊച്ചു മുഹമ്മദ്  &  പരേതയായ വലിയപുരയിൽ നഫീസ",
  },
  bride_address: {
    en: "Panattakayil House · Masjid Road · P.O. Nattika",
    ml: "പനാട്ടക്കയിൽ ഹൗസ് · മസ്ജിദ് റോഡ് · പി.ഒ. നാട്ടിക",
  },

  groom_label: { en: "The Groom", ml: "വരൻ" },
  groom_name: { en: "Raees Mohamed Ali", ml: "റഈസ് മുഹമ്മദ് അലി" },
  groom_parents: {
    en: "C Mohamed Ali  &  Ramla Mohamed Ali",
    ml: "സി. മുഹമ്മദ് അലി  &  റംല മുഹമ്മദ് അലി",
  },
  groom_grand: {
    en: "Grandson of\nLate Anjukandath Yusaf Haji  &  Late Aysha Kutty Chinganath\nand  Late Mohammedunni Paliyath  &  Late Fathima Nariyammal",
    ml: "പേരക്കുട്ടി\nപരേതനായ അഞ്ചുകണ്ടത്ത് യൂസഫ് ഹാജി  &  പരേതയായ ആയിഷക്കുട്ടി ചിങ്ങനാത്ത്\nഒപ്പം  പരേതനായ മുഹമ്മദുണ്ണി പാലിയത്ത്  &  പരേതയായ ഫാത്തിമ നരിയമ്മൽ",
  },
  groom_address: {
    en: "Chinganath House · P.O. Punnayoor",
    ml: "ചിങ്ങനാത്ത് ഹൗസ് · പി.ഒ. പുന്നയൂർ",
  },

  // ---- Events ----
  events_eyebrow: { en: "We invite you to celebrate", ml: "ആഘോഷത്തിലേക്ക് ക്ഷണിക്കുന്നു" },
  events_title: { en: "The Celebrations", ml: "ചടങ്ങുകൾ" },

  nikah_label: { en: "Nikah", ml: "നികാഹ്" },
  nikah_day: { en: "Thursday", ml: "വ്യാഴാഴ്ച" },
  nikah_date: { en: "6 August 2026", ml: "2026 ഓഗസ്റ്റ് 6" },
  nikah_note: {
    en: "Solemnised in the company of close family",
    ml: "അടുത്ത കുടുംബാംഗങ്ങളുടെ സാന്നിധ്യത്തിൽ",
  },

  recep_label: { en: "Reception", ml: "സ്വീകരണം" },
  recep_day: { en: "Friday", ml: "വെള്ളിയാഴ്ച" },
  recep_date: { en: "7 August 2026", ml: "2026 ഓഗസ്റ്റ് 7" },
  recep_time: { en: "5:00  –  8:00 in the evening", ml: "വൈകീട്ട് 5:00  –  8:00" },
  recep_venue: { en: "Vanneri Palace", ml: "വന്നേരി പാലസ്" },
  recep_place: { en: "", ml: "" },

  btn_directions: { en: "Get Directions", ml: "വഴി കാണിക്കുക" },

  // ---- Footer ----
  footer_eyebrow: { en: "With joy in our hearts", ml: "സന്തോഷത്തോടെ" },
  footer_text: {
    en: "We would be honoured to share this blessed day with you",
    ml: "ഈ ധന്യ ദിനം നിങ്ങളോടൊപ്പം പങ്കിടാൻ ഞങ്ങൾ ആഗ്രഹിക്കുന്നു",
  },
  footer_names: { en: "Raees  &  Aysha", ml: "റഈസ്  &  ആയിഷ" },
  footer_dua_t: { en: "May Allah bless you both", ml: "അല്ലാഹു നിങ്ങളെ ഇരുവരെയും അനുഗ്രഹിക്കട്ടെ" },
};

// Static (non-translated) strings used directly in components.
export const ARABIC = {
  bismillah: "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
  verse: "وَمِنْ اٰيٰتِهٖۤ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْۤا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً",
  dua: "بَارَكَ اللّٰهُ لَكُمَا",
};

// Google Maps direction links for each venue.
export const MAP_LINKS = {
  nikah: "https://www.google.com/maps/search/?api=1&query=Majestic+Triprayar+Thrissur",
  reception: "https://www.google.com/maps/search/?api=1&query=Vanneri+Palace+Convention+Centre",
};

// Countdown target: Nikah, 6 August 2026, daytime (10:00 IST).
export const TARGET_ISO = "2026-08-06T10:00:00+05:30";
