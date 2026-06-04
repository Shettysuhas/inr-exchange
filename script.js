// ===== INR Live — realtime Indian Rupee comparison =====

const API_URL = "https://open.er-api.com/v6/latest/INR";
const REFRESH_MS = 60_000;

// All currencies supported by the API, to compare against INR.
const CURRENCIES = [
  // ----- Popular (shown first) -----
  { code: "USD", name: "US Dollar",        country: "United States",  flag: "🇺🇸", symbol: "$",  popular: 1 },
  { code: "EUR", name: "Euro",             country: "Eurozone",       flag: "🇪🇺", symbol: "€",  popular: 2 },
  { code: "GBP", name: "British Pound",    country: "United Kingdom", flag: "🇬🇧", symbol: "£",  popular: 3 },
  { code: "AED", name: "UAE Dirham",       country: "UAE",            flag: "🇦🇪", symbol: "د.إ", popular: 4 },
  { code: "JPY", name: "Japanese Yen",     country: "Japan",          flag: "🇯🇵", symbol: "¥",  popular: 5 },
  { code: "AUD", name: "Australian Dollar",country: "Australia",      flag: "🇦🇺", symbol: "A$", popular: 6 },
  { code: "CAD", name: "Canadian Dollar",  country: "Canada",         flag: "🇨🇦", symbol: "C$", popular: 7 },
  { code: "SGD", name: "Singapore Dollar", country: "Singapore",      flag: "🇸🇬", symbol: "S$", popular: 8 },
  { code: "CHF", name: "Swiss Franc",      country: "Switzerland",    flag: "🇨🇭", symbol: "Fr", popular: 9 },
  { code: "CNY", name: "Chinese Yuan",     country: "China",          flag: "🇨🇳", symbol: "¥",  popular: 10 },
  { code: "SAR", name: "Saudi Riyal",      country: "Saudi Arabia",   flag: "🇸🇦", symbol: "﷼",  popular: 11 },
  { code: "HKD", name: "Hong Kong Dollar", country: "Hong Kong",      flag: "🇭🇰", symbol: "HK$",popular: 12 },
  { code: "NZD", name: "NZ Dollar",        country: "New Zealand",    flag: "🇳🇿", symbol: "NZ$",popular: 13 },
  { code: "ZAR", name: "South Afr. Rand",  country: "South Africa",   flag: "🇿🇦", symbol: "R",  popular: 14 },
  { code: "MYR", name: "Malaysian Ringgit",country: "Malaysia",       flag: "🇲🇾", symbol: "RM", popular: 15 },
  { code: "QAR", name: "Qatari Riyal",     country: "Qatar",          flag: "🇶🇦", symbol: "﷼",  popular: 16 },
  { code: "KWD", name: "Kuwaiti Dinar",    country: "Kuwait",         flag: "🇰🇼", symbol: "د.ك", popular: 17 },
  { code: "THB", name: "Thai Baht",        country: "Thailand",       flag: "🇹🇭", symbol: "฿",  popular: 18 },
  { code: "RUB", name: "Russian Ruble",    country: "Russia",         flag: "🇷🇺", symbol: "₽",  popular: 19 },
  { code: "BRL", name: "Brazilian Real",   country: "Brazil",         flag: "🇧🇷", symbol: "R$", popular: 20 },

  // ----- All remaining currencies (alphabetical by code) -----
  { code: "AFN", name: "Afghan Afghani",        country: "Afghanistan",          flag: "🇦🇫", symbol: "؋",  popular: 99 },
  { code: "ALL", name: "Albanian Lek",          country: "Albania",              flag: "🇦🇱", symbol: "L",  popular: 99 },
  { code: "AMD", name: "Armenian Dram",         country: "Armenia",              flag: "🇦🇲", symbol: "֏",  popular: 99 },
  { code: "ANG", name: "Neth. Antillean Guilder",country: "Curaçao & Sint Maarten",flag: "🇨🇼", symbol: "ƒ", popular: 99 },
  { code: "AOA", name: "Angolan Kwanza",        country: "Angola",               flag: "🇦🇴", symbol: "Kz", popular: 99 },
  { code: "ARS", name: "Argentine Peso",        country: "Argentina",            flag: "🇦🇷", symbol: "$",  popular: 99 },
  { code: "AWG", name: "Aruban Florin",         country: "Aruba",                flag: "🇦🇼", symbol: "ƒ",  popular: 99 },
  { code: "AZN", name: "Azerbaijani Manat",     country: "Azerbaijan",           flag: "🇦🇿", symbol: "₼",  popular: 99 },
  { code: "BAM", name: "Bosnia Conv. Mark",     country: "Bosnia & Herzegovina", flag: "🇧🇦", symbol: "KM", popular: 99 },
  { code: "BBD", name: "Barbadian Dollar",      country: "Barbados",             flag: "🇧🇧", symbol: "$",  popular: 99 },
  { code: "BDT", name: "Bangladeshi Taka",      country: "Bangladesh",           flag: "🇧🇩", symbol: "৳",  popular: 99 },
  { code: "BGN", name: "Bulgarian Lev",         country: "Bulgaria",             flag: "🇧🇬", symbol: "лв", popular: 99 },
  { code: "BHD", name: "Bahraini Dinar",        country: "Bahrain",              flag: "🇧🇭", symbol: ".د.ب",popular: 99 },
  { code: "BIF", name: "Burundian Franc",       country: "Burundi",              flag: "🇧🇮", symbol: "FBu",popular: 99 },
  { code: "BMD", name: "Bermudian Dollar",      country: "Bermuda",              flag: "🇧🇲", symbol: "$",  popular: 99 },
  { code: "BND", name: "Brunei Dollar",         country: "Brunei",               flag: "🇧🇳", symbol: "$",  popular: 99 },
  { code: "BOB", name: "Bolivian Boliviano",    country: "Bolivia",              flag: "🇧🇴", symbol: "Bs", popular: 99 },
  { code: "BSD", name: "Bahamian Dollar",       country: "Bahamas",              flag: "🇧🇸", symbol: "$",  popular: 99 },
  { code: "BTN", name: "Bhutanese Ngultrum",    country: "Bhutan",               flag: "🇧🇹", symbol: "Nu.",popular: 99 },
  { code: "BWP", name: "Botswana Pula",         country: "Botswana",             flag: "🇧🇼", symbol: "P",  popular: 99 },
  { code: "BYN", name: "Belarusian Ruble",      country: "Belarus",              flag: "🇧🇾", symbol: "Br", popular: 99 },
  { code: "BZD", name: "Belize Dollar",         country: "Belize",               flag: "🇧🇿", symbol: "$",  popular: 99 },
  { code: "CDF", name: "Congolese Franc",       country: "DR Congo",             flag: "🇨🇩", symbol: "FC", popular: 99 },
  { code: "CLP", name: "Chilean Peso",          country: "Chile",                flag: "🇨🇱", symbol: "$",  popular: 99 },
  { code: "COP", name: "Colombian Peso",        country: "Colombia",             flag: "🇨🇴", symbol: "$",  popular: 99 },
  { code: "CRC", name: "Costa Rican Colón",     country: "Costa Rica",           flag: "🇨🇷", symbol: "₡",  popular: 99 },
  { code: "CUP", name: "Cuban Peso",            country: "Cuba",                 flag: "🇨🇺", symbol: "$",  popular: 99 },
  { code: "CVE", name: "Cape Verdean Escudo",   country: "Cape Verde",           flag: "🇨🇻", symbol: "$",  popular: 99 },
  { code: "CZK", name: "Czech Koruna",          country: "Czechia",              flag: "🇨🇿", symbol: "Kč", popular: 99 },
  { code: "DJF", name: "Djiboutian Franc",      country: "Djibouti",             flag: "🇩🇯", symbol: "Fdj",popular: 99 },
  { code: "DKK", name: "Danish Krone",          country: "Denmark",              flag: "🇩🇰", symbol: "kr", popular: 99 },
  { code: "DOP", name: "Dominican Peso",        country: "Dominican Republic",   flag: "🇩🇴", symbol: "$",  popular: 99 },
  { code: "DZD", name: "Algerian Dinar",        country: "Algeria",              flag: "🇩🇿", symbol: "دج", popular: 99 },
  { code: "EGP", name: "Egyptian Pound",        country: "Egypt",                flag: "🇪🇬", symbol: "£",  popular: 99 },
  { code: "ERN", name: "Eritrean Nakfa",        country: "Eritrea",              flag: "🇪🇷", symbol: "Nfk",popular: 99 },
  { code: "ETB", name: "Ethiopian Birr",        country: "Ethiopia",             flag: "🇪🇹", symbol: "Br", popular: 99 },
  { code: "FJD", name: "Fijian Dollar",         country: "Fiji",                 flag: "🇫🇯", symbol: "$",  popular: 99 },
  { code: "FKP", name: "Falkland Pound",        country: "Falkland Islands",     flag: "🇫🇰", symbol: "£",  popular: 99 },
  { code: "FOK", name: "Faroese Króna",         country: "Faroe Islands",        flag: "🇫🇴", symbol: "kr", popular: 99 },
  { code: "GEL", name: "Georgian Lari",         country: "Georgia",              flag: "🇬🇪", symbol: "₾",  popular: 99 },
  { code: "GGP", name: "Guernsey Pound",        country: "Guernsey",             flag: "🇬🇬", symbol: "£",  popular: 99 },
  { code: "GHS", name: "Ghanaian Cedi",         country: "Ghana",                flag: "🇬🇭", symbol: "₵",  popular: 99 },
  { code: "GIP", name: "Gibraltar Pound",       country: "Gibraltar",            flag: "🇬🇮", symbol: "£",  popular: 99 },
  { code: "GMD", name: "Gambian Dalasi",        country: "Gambia",               flag: "🇬🇲", symbol: "D",  popular: 99 },
  { code: "GNF", name: "Guinean Franc",         country: "Guinea",               flag: "🇬🇳", symbol: "FG", popular: 99 },
  { code: "GTQ", name: "Guatemalan Quetzal",    country: "Guatemala",            flag: "🇬🇹", symbol: "Q",  popular: 99 },
  { code: "GYD", name: "Guyanese Dollar",       country: "Guyana",               flag: "🇬🇾", symbol: "$",  popular: 99 },
  { code: "HNL", name: "Honduran Lempira",      country: "Honduras",             flag: "🇭🇳", symbol: "L",  popular: 99 },
  { code: "HRK", name: "Croatian Kuna",         country: "Croatia",              flag: "🇭🇷", symbol: "kn", popular: 99 },
  { code: "HTG", name: "Haitian Gourde",        country: "Haiti",                flag: "🇭🇹", symbol: "G",  popular: 99 },
  { code: "HUF", name: "Hungarian Forint",      country: "Hungary",              flag: "🇭🇺", symbol: "Ft", popular: 99 },
  { code: "IDR", name: "Indonesian Rupiah",     country: "Indonesia",            flag: "🇮🇩", symbol: "Rp", popular: 99 },
  { code: "ILS", name: "Israeli New Shekel",    country: "Israel",               flag: "🇮🇱", symbol: "₪",  popular: 99 },
  { code: "IMP", name: "Manx Pound",            country: "Isle of Man",          flag: "🇮🇲", symbol: "£",  popular: 99 },
  { code: "IQD", name: "Iraqi Dinar",           country: "Iraq",                 flag: "🇮🇶", symbol: "ع.د",popular: 99 },
  { code: "IRR", name: "Iranian Rial",          country: "Iran",                 flag: "🇮🇷", symbol: "﷼",  popular: 99 },
  { code: "ISK", name: "Icelandic Króna",       country: "Iceland",              flag: "🇮🇸", symbol: "kr", popular: 99 },
  { code: "JEP", name: "Jersey Pound",          country: "Jersey",               flag: "🇯🇪", symbol: "£",  popular: 99 },
  { code: "JMD", name: "Jamaican Dollar",       country: "Jamaica",              flag: "🇯🇲", symbol: "$",  popular: 99 },
  { code: "JOD", name: "Jordanian Dinar",       country: "Jordan",               flag: "🇯🇴", symbol: "د.ا",popular: 99 },
  { code: "KES", name: "Kenyan Shilling",       country: "Kenya",                flag: "🇰🇪", symbol: "KSh",popular: 99 },
  { code: "KGS", name: "Kyrgyzstani Som",       country: "Kyrgyzstan",           flag: "🇰🇬", symbol: "с",  popular: 99 },
  { code: "KHR", name: "Cambodian Riel",        country: "Cambodia",             flag: "🇰🇭", symbol: "៛",  popular: 99 },
  { code: "KID", name: "Kiribati Dollar",       country: "Kiribati",             flag: "🇰🇮", symbol: "$",  popular: 99 },
  { code: "KMF", name: "Comorian Franc",        country: "Comoros",              flag: "🇰🇲", symbol: "CF", popular: 99 },
  { code: "KRW", name: "South Korean Won",      country: "South Korea",          flag: "🇰🇷", symbol: "₩",  popular: 99 },
  { code: "KYD", name: "Cayman Islands Dollar", country: "Cayman Islands",       flag: "🇰🇾", symbol: "$",  popular: 99 },
  { code: "KZT", name: "Kazakhstani Tenge",     country: "Kazakhstan",           flag: "🇰🇿", symbol: "₸",  popular: 99 },
  { code: "LAK", name: "Lao Kip",               country: "Laos",                 flag: "🇱🇦", symbol: "₭",  popular: 99 },
  { code: "LBP", name: "Lebanese Pound",        country: "Lebanon",              flag: "🇱🇧", symbol: "ل.ل",popular: 99 },
  { code: "LKR", name: "Sri Lankan Rupee",      country: "Sri Lanka",            flag: "🇱🇰", symbol: "Rs", popular: 99 },
  { code: "LRD", name: "Liberian Dollar",       country: "Liberia",              flag: "🇱🇷", symbol: "$",  popular: 99 },
  { code: "LSL", name: "Lesotho Loti",          country: "Lesotho",              flag: "🇱🇸", symbol: "L",  popular: 99 },
  { code: "LYD", name: "Libyan Dinar",          country: "Libya",                flag: "🇱🇾", symbol: "ل.د",popular: 99 },
  { code: "MAD", name: "Moroccan Dirham",       country: "Morocco",              flag: "🇲🇦", symbol: "د.م.",popular: 99 },
  { code: "MDL", name: "Moldovan Leu",          country: "Moldova",              flag: "🇲🇩", symbol: "L",  popular: 99 },
  { code: "MGA", name: "Malagasy Ariary",       country: "Madagascar",           flag: "🇲🇬", symbol: "Ar", popular: 99 },
  { code: "MKD", name: "Macedonian Denar",      country: "North Macedonia",      flag: "🇲🇰", symbol: "ден",popular: 99 },
  { code: "MMK", name: "Myanmar Kyat",          country: "Myanmar",              flag: "🇲🇲", symbol: "K",  popular: 99 },
  { code: "MNT", name: "Mongolian Tögrög",      country: "Mongolia",             flag: "🇲🇳", symbol: "₮",  popular: 99 },
  { code: "MOP", name: "Macanese Pataca",       country: "Macau",                flag: "🇲🇴", symbol: "P",  popular: 99 },
  { code: "MRU", name: "Mauritanian Ouguiya",   country: "Mauritania",           flag: "🇲🇷", symbol: "UM", popular: 99 },
  { code: "MUR", name: "Mauritian Rupee",       country: "Mauritius",            flag: "🇲🇺", symbol: "₨",  popular: 99 },
  { code: "MVR", name: "Maldivian Rufiyaa",     country: "Maldives",             flag: "🇲🇻", symbol: ".ރ", popular: 99 },
  { code: "MWK", name: "Malawian Kwacha",       country: "Malawi",               flag: "🇲🇼", symbol: "MK", popular: 99 },
  { code: "MXN", name: "Mexican Peso",          country: "Mexico",               flag: "🇲🇽", symbol: "$",  popular: 99 },
  { code: "MZN", name: "Mozambican Metical",    country: "Mozambique",           flag: "🇲🇿", symbol: "MT", popular: 99 },
  { code: "NAD", name: "Namibian Dollar",       country: "Namibia",              flag: "🇳🇦", symbol: "$",  popular: 99 },
  { code: "NGN", name: "Nigerian Naira",        country: "Nigeria",              flag: "🇳🇬", symbol: "₦",  popular: 99 },
  { code: "NIO", name: "Nicaraguan Córdoba",    country: "Nicaragua",            flag: "🇳🇮", symbol: "C$", popular: 99 },
  { code: "NOK", name: "Norwegian Krone",       country: "Norway",               flag: "🇳🇴", symbol: "kr", popular: 99 },
  { code: "NPR", name: "Nepalese Rupee",        country: "Nepal",                flag: "🇳🇵", symbol: "₨",  popular: 99 },
  { code: "OMR", name: "Omani Rial",            country: "Oman",                 flag: "🇴🇲", symbol: "ر.ع.",popular: 99 },
  { code: "PAB", name: "Panamanian Balboa",     country: "Panama",               flag: "🇵🇦", symbol: "B/.",popular: 99 },
  { code: "PEN", name: "Peruvian Sol",          country: "Peru",                 flag: "🇵🇪", symbol: "S/", popular: 99 },
  { code: "PGK", name: "Papua N.G. Kina",       country: "Papua New Guinea",     flag: "🇵🇬", symbol: "K",  popular: 99 },
  { code: "PHP", name: "Philippine Peso",       country: "Philippines",          flag: "🇵🇭", symbol: "₱",  popular: 99 },
  { code: "PKR", name: "Pakistani Rupee",       country: "Pakistan",             flag: "🇵🇰", symbol: "₨",  popular: 99 },
  { code: "PLN", name: "Polish Złoty",          country: "Poland",               flag: "🇵🇱", symbol: "zł", popular: 99 },
  { code: "PYG", name: "Paraguayan Guaraní",    country: "Paraguay",             flag: "🇵🇾", symbol: "₲",  popular: 99 },
  { code: "RON", name: "Romanian Leu",          country: "Romania",              flag: "🇷🇴", symbol: "lei",popular: 99 },
  { code: "RSD", name: "Serbian Dinar",         country: "Serbia",               flag: "🇷🇸", symbol: "дин",popular: 99 },
  { code: "RWF", name: "Rwandan Franc",         country: "Rwanda",               flag: "🇷🇼", symbol: "FRw",popular: 99 },
  { code: "SBD", name: "Solomon Is. Dollar",    country: "Solomon Islands",      flag: "🇸🇧", symbol: "$",  popular: 99 },
  { code: "SCR", name: "Seychellois Rupee",     country: "Seychelles",           flag: "🇸🇨", symbol: "₨",  popular: 99 },
  { code: "SDG", name: "Sudanese Pound",        country: "Sudan",                flag: "🇸🇩", symbol: "ج.س",popular: 99 },
  { code: "SEK", name: "Swedish Krona",         country: "Sweden",               flag: "🇸🇪", symbol: "kr", popular: 99 },
  { code: "SHP", name: "St. Helena Pound",      country: "Saint Helena",         flag: "🇸🇭", symbol: "£",  popular: 99 },
  { code: "SLE", name: "Sierra Leonean Leone",  country: "Sierra Leone",         flag: "🇸🇱", symbol: "Le", popular: 99 },
  { code: "SOS", name: "Somali Shilling",       country: "Somalia",              flag: "🇸🇴", symbol: "Sh", popular: 99 },
  { code: "SRD", name: "Surinamese Dollar",     country: "Suriname",             flag: "🇸🇷", symbol: "$",  popular: 99 },
  { code: "SSP", name: "South Sudanese Pound",  country: "South Sudan",          flag: "🇸🇸", symbol: "£",  popular: 99 },
  { code: "STN", name: "São Tomé Dobra",        country: "São Tomé & Príncipe",  flag: "🇸🇹", symbol: "Db", popular: 99 },
  { code: "SYP", name: "Syrian Pound",          country: "Syria",                flag: "🇸🇾", symbol: "£",  popular: 99 },
  { code: "SZL", name: "Swazi Lilangeni",       country: "Eswatini",             flag: "🇸🇿", symbol: "L",  popular: 99 },
  { code: "TJS", name: "Tajikistani Somoni",    country: "Tajikistan",           flag: "🇹🇯", symbol: "ЅМ", popular: 99 },
  { code: "TMT", name: "Turkmenistani Manat",   country: "Turkmenistan",         flag: "🇹🇲", symbol: "m",  popular: 99 },
  { code: "TND", name: "Tunisian Dinar",        country: "Tunisia",              flag: "🇹🇳", symbol: "د.ت",popular: 99 },
  { code: "TOP", name: "Tongan Paʻanga",        country: "Tonga",                flag: "🇹🇴", symbol: "T$", popular: 99 },
  { code: "TRY", name: "Turkish Lira",          country: "Türkiye",              flag: "🇹🇷", symbol: "₺",  popular: 99 },
  { code: "TTD", name: "Trinidad & Tobago Dollar",country: "Trinidad & Tobago",  flag: "🇹🇹", symbol: "$",  popular: 99 },
  { code: "TVD", name: "Tuvaluan Dollar",       country: "Tuvalu",               flag: "🇹🇻", symbol: "$",  popular: 99 },
  { code: "TWD", name: "New Taiwan Dollar",     country: "Taiwan",               flag: "🇹🇼", symbol: "NT$",popular: 99 },
  { code: "TZS", name: "Tanzanian Shilling",    country: "Tanzania",             flag: "🇹🇿", symbol: "TSh",popular: 99 },
  { code: "UAH", name: "Ukrainian Hryvnia",     country: "Ukraine",              flag: "🇺🇦", symbol: "₴",  popular: 99 },
  { code: "UGX", name: "Ugandan Shilling",      country: "Uganda",               flag: "🇺🇬", symbol: "USh",popular: 99 },
  { code: "UYU", name: "Uruguayan Peso",        country: "Uruguay",              flag: "🇺🇾", symbol: "$",  popular: 99 },
  { code: "UZS", name: "Uzbekistani So'm",      country: "Uzbekistan",           flag: "🇺🇿", symbol: "soʻm",popular: 99 },
  { code: "VES", name: "Venezuelan Bolívar",    country: "Venezuela",            flag: "🇻🇪", symbol: "Bs", popular: 99 },
  { code: "VND", name: "Vietnamese Đồng",       country: "Vietnam",              flag: "🇻🇳", symbol: "₫",  popular: 99 },
  { code: "VUV", name: "Vanuatu Vatu",          country: "Vanuatu",              flag: "🇻🇺", symbol: "VT", popular: 99 },
  { code: "WST", name: "Samoan Tālā",           country: "Samoa",                flag: "🇼🇸", symbol: "T",  popular: 99 },
  { code: "XAF", name: "Central African CFA",   country: "CEMAC",                flag: "🌍", symbol: "FCFA",popular: 99 },
  { code: "XCD", name: "East Caribbean Dollar", country: "OECS",                 flag: "🌎", symbol: "$",  popular: 99 },
  { code: "XDR", name: "IMF Special Drawing Rights",country: "IMF",              flag: "🏳️", symbol: "SDR",popular: 99 },
  { code: "XOF", name: "West African CFA",      country: "UEMOA",                flag: "🌍", symbol: "CFA",popular: 99 },
  { code: "XPF", name: "CFP Franc",             country: "French Pacific",       flag: "🇵🇫", symbol: "₣",  popular: 99 },
  { code: "YER", name: "Yemeni Rial",           country: "Yemen",                flag: "🇾🇪", symbol: "﷼",  popular: 99 },
  { code: "ZMW", name: "Zambian Kwacha",        country: "Zambia",               flag: "🇿🇲", symbol: "ZK", popular: 99 },
  { code: "ZWL", name: "Zimbabwean Dollar",     country: "Zimbabwe",             flag: "🇿🇼", symbol: "Z$", popular: 99 },
];

const META = Object.fromEntries(CURRENCIES.map(c => [c.code, c]));

// ---- Persistent storage (favorites + rate history for sparklines) ----
const FAV_KEY = "inr_favorites";
const HIST_KEY = "inr_rate_history";
const HIST_MAX = 24; // keep last N points per currency
let favorites = new Set(safeParse(localStorage.getItem(FAV_KEY), []));
let history = safeParse(localStorage.getItem(HIST_KEY), {}); // code -> [inrPerUnit,...]

function safeParse(str, fallback) {
  try { return str ? JSON.parse(str) : fallback; } catch { return fallback; }
}

// Light haptic feedback (Android WebView supports navigator.vibrate)
function haptic(ms = 15) {
  if (navigator.vibrate) { try { navigator.vibrate(ms); } catch {} }
}


// State
let rates = {};        // code -> INR-based rate (1 INR = rate X)
let prevRates = {};    // previous fetch for change calc
let lastUpdated = null;
let timer = null;

// DOM
const $ = (id) => document.getElementById(id);
const grid = $("grid");
const statusEl = $("status");
const statusText = statusEl.querySelector(".status-text");
const searchInput = $("searchInput");
const sortSelect = $("sortSelect");
const refreshBtn = $("refreshBtn");
const updatedEl = $("updated");

// Converter DOM
const baseAmount = $("baseAmount");
const targetAmount = $("targetAmount");
const targetCurrency = $("targetCurrency");
const targetFlag = $("targetFlag");
const swapBtn = $("swapBtn");
const rateLine = $("rateLine");
let invert = false; // false: INR -> target ; true: target -> INR

// ---- Init ----
function init() {
  // Populate converter dropdown
  CURRENCIES.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c.code;
    opt.textContent = c.code;
    targetCurrency.appendChild(opt);
  });
  targetCurrency.value = "USD";

  showSkeletons();

  searchInput.addEventListener("input", render);
  sortSelect.addEventListener("change", render);
  refreshBtn.addEventListener("click", () => { haptic(15); spinRefresh(); fetchRates(); });
  baseAmount.addEventListener("input", updateConverter);
  targetAmount.addEventListener("input", onTargetInput);
  targetCurrency.addEventListener("change", () => { updateTargetFlag(); updateConverter(); });
  swapBtn.addEventListener("click", () => {
    invert = !invert;
    haptic(15);
    swapBtn.classList.remove("spin-swap");
    void swapBtn.offsetWidth;
    swapBtn.classList.add("spin-swap");
    updateConverter();
  });

  // Toggle favorite when a card's star is tapped (event delegation)
  grid.addEventListener("click", (e) => {
    const star = e.target.closest(".fx-fav");
    if (star) { toggleFav(star.dataset.code); return; }
    const card = e.target.closest(".fx-card");
    if (card && card.dataset.code) openDetail(card.dataset.code);
  });

  setupPullToRefresh();

  updateTargetFlag();
  fetchRates();
  timer = setInterval(fetchRates, REFRESH_MS);
}

function toggleFav(code) {
  if (favorites.has(code)) favorites.delete(code);
  else favorites.add(code);
  localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
  haptic(15);
  render();
}

// ---- Pull-to-refresh (mobile) ----
function setupPullToRefresh() {
  const indicator = document.createElement("div");
  indicator.className = "ptr-indicator";
  indicator.innerHTML = `<svg viewBox="0 0 24 24" width="22" height="22"><path fill="currentColor" d="M17.65 6.35A7.95 7.95 0 0 0 12 4a8 8 0 1 0 7.73 10h-2.08A6 6 0 1 1 12 6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35Z"/></svg>`;
  document.body.appendChild(indicator);

  const THRESH = 70;
  let startY = 0, dist = 0, pulling = false, refreshing = false;

  window.addEventListener("touchstart", (e) => {
    if (refreshing) return;
    if (window.scrollY <= 0 && e.touches.length === 1) {
      startY = e.touches[0].clientY;
      pulling = true;
      dist = 0;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!pulling || refreshing) return;
    dist = e.touches[0].clientY - startY;
    if (dist > 0) {
      const pull = Math.min(dist * 0.5, 90);
      indicator.style.transform = `translateX(-50%) translateY(${pull}px)`;
      indicator.style.opacity = String(Math.min(pull / THRESH, 1));
      indicator.classList.toggle("ready", pull >= THRESH);
    }
  }, { passive: true });

  function reset() {
    indicator.style.transform = "translateX(-50%) translateY(0)";
    indicator.style.opacity = "0";
    indicator.classList.remove("ready", "refreshing");
  }

  window.addEventListener("touchend", () => {
    if (!pulling || refreshing) return;
    pulling = false;
    const pull = Math.min(dist * 0.5, 90);
    if (pull >= THRESH) {
      refreshing = true;
      haptic(20);
      indicator.classList.add("refreshing");
      indicator.style.transform = "translateX(-50%) translateY(60px)";
      indicator.style.opacity = "1";
      spinRefresh();
      Promise.resolve(fetchRates()).finally(() => {
        setTimeout(() => { reset(); refreshing = false; }, 400);
      });
    } else {
      reset();
    }
    dist = 0;
  });
}

function showSkeletons() {
  grid.innerHTML = "";
  for (let i = 0; i < 8; i++) {
    const s = document.createElement("div");
    s.className = "skeleton";
    grid.appendChild(s);
  }
}

function setStatus(kind, text) {
  statusEl.className = `status status--${kind}`;
  statusText.textContent = text;
}

function spinRefresh() {
  refreshBtn.classList.remove("spin");
  void refreshBtn.offsetWidth; // reflow to restart animation
  refreshBtn.classList.add("spin");
}

// ---- Fetch ----
async function fetchRates() {
  setStatus("loading", "Updating…");
  try {
    const res = await fetch(API_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.result !== "success" || !data.rates) throw new Error("Bad response");

    prevRates = { ...rates };
    rates = data.rates;
    lastUpdated = data.time_last_update_utc
      ? new Date(data.time_last_update_utc)
      : new Date();

    recordHistory();
    setStatus("live", "Live");
    render();
    updateConverter();
    const t = lastUpdated.toLocaleString();
    updatedEl.textContent = `Source last updated: ${t} · Next refresh in 60s`;
  } catch (err) {
    console.error(err);
    setStatus("error", "Offline");
    if (Object.keys(rates).length === 0) {
      grid.innerHTML = `<div class="empty">⚠️ Couldn't load live rates. Check your connection and try Refresh.</div>`;
    }
  }
}

// ---- Render cards ----
function render() {
  if (Object.keys(rates).length === 0) return;

  const q = searchInput.value.trim().toLowerCase();
  let list = CURRENCIES.filter(c => rates[c.code] != null);

  if (q) {
    list = list.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q)
    );
  }

  // inrPerUnit = how many INR for 1 unit of currency = 1 / rate
  const inrPer = (c) => 1 / rates[c.code];

  const sort = sortSelect.value;
  list.sort((a, b) => {
    // Pinned favorites always float to the top
    const fa = favorites.has(a.code) ? 0 : 1;
    const fb = favorites.has(b.code) ? 0 : 1;
    if (fa !== fb) return fa - fb;
    if (sort === "name") return a.name.localeCompare(b.name);
    if (sort === "high") return inrPer(b) - inrPer(a);
    if (sort === "low") return inrPer(a) - inrPer(b);
    return a.popular - b.popular;
  });

  if (list.length === 0) {
    grid.innerHTML = `<div class="empty">No currencies match “${escapeHtml(q)}”.</div>`;
    return;
  }

  grid.innerHTML = "";
  list.forEach((c, i) => grid.appendChild(buildCard(c, i)));
}

function buildCard(c, index) {
  const inrPerUnit = 1 / rates[c.code];        // 1 <CUR> = X INR
  const unitPerInr = rates[c.code];            // 1 INR  = Y <CUR>

  // Change vs previous fetch (based on INR-per-unit)
  let changeHtml = `<span class="fx-change flat">•</span>`;
  let flashClass = "";
  let up = true;
  if (prevRates[c.code]) {
    const prevInrPer = 1 / prevRates[c.code];
    const diff = inrPerUnit - prevInrPer;
    const pct = (diff / prevInrPer) * 100;
    if (Math.abs(pct) > 0.0001) {
      up = diff > 0;
      changeHtml = `<span class="fx-change ${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%</span>`;
      flashClass = up ? "flash-up" : "flash-down";
    }
  }

  const isFav = favorites.has(c.code);
  const spark = buildSparkline(c.code, up);

  const card = document.createElement("div");
  card.className = `fx-card ${flashClass} ${isFav ? "pinned" : ""}`;
  card.dataset.code = c.code;
  card.style.animationDelay = `${Math.min(index * 30, 300)}ms`;
  card.innerHTML = `
    <button class="fx-fav ${isFav ? "active" : ""}" data-code="${c.code}" title="${isFav ? "Unpin" : "Pin to top"}" aria-label="Toggle favorite">
      <svg viewBox="0 0 24 24" width="16" height="16"><path fill="currentColor" d="m12 17.27 5.18 3.13-1.37-5.9 4.59-3.97-6.04-.52L12 4.5 9.64 10.1l-6.04.52 4.59 3.97-1.37 5.9z"/></svg>
    </button>
    <div class="fx-top">
      <div class="fx-flag">${c.flag}</div>
      <div class="fx-meta">
        <h3>${c.code}</h3>
        <span>${c.name}</span>
      </div>
    </div>
    <div class="fx-rate-row">
      <div class="fx-rate"><span class="sym">₹</span>${formatNum(inrPerUnit)}</div>
      ${changeHtml}
    </div>
    <div class="fx-sub">1 ${c.code} = ₹${formatNum(inrPerUnit)} &nbsp;·&nbsp; ₹1 = ${c.symbol}${formatNum(unitPerInr, true)}</div>
    ${spark}
  `;
  return card;
}

// Record current INR-per-unit values into rolling history (for sparklines)
function recordHistory() {
  CURRENCIES.forEach(c => {
    if (rates[c.code] == null) return;
    const inrPer = 1 / rates[c.code];
    if (!history[c.code]) history[c.code] = [];
    const arr = history[c.code];
    const last = arr[arr.length - 1];
    if (last == null || Math.abs(last - inrPer) > 1e-12) {
      arr.push(inrPer);
      if (arr.length > HIST_MAX) arr.shift();
    }
  });
  try { localStorage.setItem(HIST_KEY, JSON.stringify(history)); } catch {}
}

// Build a tiny inline SVG sparkline from stored history
function buildSparkline(code, up) {
  const data = history[code] || [];
  if (data.length < 2) return "";
  const w = 100, h = 26;
  const min = Math.min(...data), max = Math.max(...data);
  const range = (max - min) || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const color = up ? "var(--up)" : "var(--down)";
  return `<svg class="fx-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}

// ---- Converter ----
function updateTargetFlag() {
  const c = META[targetCurrency.value];
  targetFlag.textContent = c ? c.flag : "🏳️";
}

function updateConverter() {
  const code = targetCurrency.value;
  const rate = rates[code];
  if (rate == null) { rateLine.textContent = "—"; return; }

  const inrPerUnit = 1 / rate;

  if (!invert) {
    // INR -> target
    const amt = parseFloat(baseAmount.value) || 0;
    targetAmount.value = round(amt * rate);
    rateLine.innerHTML = `<strong>1 INR</strong> = ${formatNum(rate, true)} ${code} &nbsp;|&nbsp; <strong>1 ${code}</strong> = ₹${formatNum(inrPerUnit)}`;
  } else {
    // target -> INR  (baseAmount field now means target amount source)
    const amt = parseFloat(baseAmount.value) || 0;
    targetAmount.value = round(amt * inrPerUnit);
    rateLine.innerHTML = `<strong>1 ${code}</strong> = ₹${formatNum(inrPerUnit)} &nbsp;|&nbsp; <strong>1 INR</strong> = ${formatNum(rate, true)} ${code}`;
  }
  syncConverterLabels();
}

function onTargetInput() {
  const code = targetCurrency.value;
  const rate = rates[code];
  if (rate == null) return;
  const amt = parseFloat(targetAmount.value) || 0;
  if (!invert) {
    baseAmount.value = round(amt / rate);   // target -> INR back
  } else {
    baseAmount.value = round(amt * rate);   // INR -> target back
  }
}

function syncConverterLabels() {
  // Swap flags/codes shown based on direction
  const code = targetCurrency.value;
  const c = META[code];
  const leftFlag = document.querySelector(".conv-flag"); // first flag (base)
  const leftCode = document.querySelector(".conv-code"); // base code label
  if (!invert) {
    leftFlag.textContent = "🇮🇳";
    leftCode.textContent = "INR";
    targetFlag.textContent = c.flag;
  } else {
    leftFlag.textContent = c.flag;
    leftCode.textContent = code;
    targetFlag.textContent = "🇮🇳";
  }
}

// ---- Helpers ----
function formatNum(n, smart = false) {
  if (!isFinite(n)) return "—";
  if (smart && n < 1) {
    return n.toLocaleString("en-IN", { maximumFractionDigits: 4 });
  }
  return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: n < 1 ? 4 : 2 });
}
function round(n) {
  return Math.round((n + Number.EPSILON) * 10000) / 10000;
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// ---- Detail chart modal ----
const RANGES = [
  { label: "7D", days: 7 },
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
];
let detailModal = null;
let detailCode = null;
let detailDays = 30;
let currentChart = null; // { points, xs, ys, W, H } for crosshair interaction

function ensureModal() {
  if (detailModal) return detailModal;
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="md-head">
        <span class="md-flag">🏳️</span>
        <div class="md-head-text">
          <h3 class="md-code">—</h3>
          <span class="md-name">—</span>
        </div>
      </div>
      <div class="md-rate">—</div>
      <div class="md-ranges">
        ${RANGES.map(r => `<button class="md-range" data-days="${r.days}">${r.label}</button>`).join("")}
      </div>
      <div class="md-chart"></div>
      <div class="md-stats"></div>
    </div>`;
  document.body.appendChild(overlay);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.closest(".modal-close")) { closeDetail(); return; }
    const rb = e.target.closest(".md-range");
    if (rb) {
      detailDays = parseInt(rb.dataset.days, 10);
      setActiveRange();
      loadChart(detailCode, detailDays);
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDetail();
  });

  // Crosshair / scrubbing interaction on the chart
  const chartEl = overlay.querySelector(".md-chart");
  const moveCross = (clientX) => {
    if (!currentChart) return;
    const svg = chartEl.querySelector("svg");
    const tip = chartEl.querySelector(".md-tip");
    if (!svg || !tip) return;
    const rect = chartEl.getBoundingClientRect();
    let rel = (clientX - rect.left) / rect.width;
    rel = Math.max(0, Math.min(1, rel));
    const n = currentChart.points.length;
    const idx = Math.round(rel * (n - 1));
    const p = currentChart.points[idx];
    const cx = currentChart.xs[idx], cy = currentChart.ys[idx];

    const lineEl = svg.querySelector(".md-cross");
    const dotEl = svg.querySelector(".md-dot");
    lineEl.setAttribute("x1", cx); lineEl.setAttribute("x2", cx);
    dotEl.setAttribute("cx", cx); dotEl.setAttribute("cy", cy);
    svg.classList.add("active");

    const dateStr = p.t
      ? p.t.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" })
      : "";
    tip.innerHTML = `<b>₹${formatNum(p.v)}</b>${dateStr ? `<span>${dateStr}</span>` : ""}`;
    const leftPx = (cx / currentChart.W) * rect.width;
    const half = tip.offsetWidth / 2;
    const clamped = Math.max(half, Math.min(rect.width - half, leftPx));
    tip.style.left = `${clamped}px`;
    tip.classList.add("show");
  };
  const hideCross = () => {
    const svg = chartEl.querySelector("svg");
    const tip = chartEl.querySelector(".md-tip");
    if (svg) svg.classList.remove("active");
    if (tip) tip.classList.remove("show");
  };
  chartEl.addEventListener("touchstart", (e) => moveCross(e.touches[0].clientX), { passive: true });
  chartEl.addEventListener("touchmove", (e) => moveCross(e.touches[0].clientX), { passive: true });
  chartEl.addEventListener("touchend", hideCross);
  chartEl.addEventListener("touchcancel", hideCross);
  chartEl.addEventListener("mousemove", (e) => moveCross(e.clientX));
  chartEl.addEventListener("mouseleave", hideCross);

  detailModal = overlay;
  return overlay;
}

function setActiveRange() {
  detailModal.querySelectorAll(".md-range").forEach(b => {
    b.classList.toggle("active", parseInt(b.dataset.days, 10) === detailDays);
  });
}

function openDetail(code) {
  detailCode = code;
  const modal = ensureModal();
  const c = META[code];
  modal.querySelector(".md-flag").textContent = c.flag;
  modal.querySelector(".md-code").textContent = code;
  modal.querySelector(".md-name").textContent = c.name;
  const inrPer = rates[code] ? 1 / rates[code] : null;
  modal.querySelector(".md-rate").innerHTML = inrPer
    ? `₹${formatNum(inrPer)} <span>per 1 ${code}</span>`
    : "—";
  setActiveRange();
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
  haptic(12);
  // Clear any chart from a previously opened currency so its data
  // doesn't linger for a frame before the new data loads.
  currentChart = null;
  modal.querySelector(".md-chart").innerHTML = `<div class="md-loading">Loading chart…</div>`;
  modal.querySelector(".md-stats").innerHTML = "";
  loadChart(code, detailDays);
}

function closeDetail() {
  if (!detailModal) return;
  detailModal.classList.remove("open");
  document.body.style.overflow = "";
}

async function fetchHistory(code, days) {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const iso = (d) => d.toISOString().slice(0, 10);
  const url = `https://api.frankfurter.dev/v1/${iso(start)}..${iso(end)}?from=INR&to=${code}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`hist HTTP ${res.status}`);
  const data = await res.json();
  if (!data.rates || Object.keys(data.rates).length === 0) throw new Error("no rates");
  return Object.keys(data.rates).sort().map((date) => ({
    t: new Date(date),
    v: 1 / data.rates[date][code], // INR per 1 unit
  }));
}

async function loadChart(code, days) {
  const chartEl = detailModal.querySelector(".md-chart");
  const statsEl = detailModal.querySelector(".md-stats");
  const hasChart = !!chartEl.querySelector("svg");
  if (!hasChart) {
    chartEl.innerHTML = `<div class="md-loading">Loading chart…</div>`;
    statsEl.innerHTML = "";
  }
  chartEl.classList.add("loading");
  try {
    const points = await fetchHistory(code, days);
    if (detailCode !== code || detailDays !== days) return; // stale request
    renderChart(points, statsEl, false);
  } catch {
    const arr = history[code] || [];
    const points = arr.map((v) => ({ t: null, v }));
    if (points.length >= 2) {
      renderChart(points, statsEl, true);
    } else {
      currentChart = null;
      chartEl.innerHTML = `<div class="md-empty">Historical chart isn't available for ${code} yet.<br><small>A live mini-trend builds as you keep the app open.</small></div>`;
      statsEl.innerHTML = "";
    }
  } finally {
    chartEl.classList.remove("loading");
  }
}

function renderChart(points, statsEl, isLocal) {
  const chartEl = detailModal.querySelector(".md-chart");
  if (!points || points.length < 2) {
    chartEl.innerHTML = `<div class="md-empty">Not enough data to draw a chart.</div>`;
    return;
  }
  const W = 320, H = 170, padL = 4, padR = 4, padT = 12, padB = 4;
  const vals = points.map((p) => p.v);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = (max - min) || (max * 0.001) || 1;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i) => padL + (i / (points.length - 1)) * innerW;
  const y = (v) => padT + (1 - (v - min) / range) * innerH;
  const up = vals[vals.length - 1] >= vals[0];
  const color = up ? "var(--up)" : "var(--down)";
  const fillTop = up ? "rgba(25,195,125,.30)" : "rgba(255,93,108,.30)";

  const line = points.map((p, i) => `${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join(" ");
  const area = `${padL.toFixed(1)},${(padT + innerH).toFixed(1)} ${line} ${(padL + innerW).toFixed(1)},${(padT + innerH).toFixed(1)}`;

  chartEl.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" class="md-svg">
      <defs>
        <linearGradient id="cgrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${fillTop}"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
        </linearGradient>
      </defs>
      <polygon points="${area}" fill="url(#cgrad)"/>
      <polyline points="${line}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      <line class="md-cross" x1="0" y1="${padT}" x2="0" y2="${(padT + innerH).toFixed(1)}" stroke="${color}"/>
      <circle class="md-dot" cx="0" cy="0" r="4" fill="${color}"/>
    </svg>
    <div class="md-tip"></div>`;

  // Store geometry for crosshair interaction
  currentChart = {
    points,
    xs: points.map((p, i) => x(i)),
    ys: points.map((p) => y(p.v)),
    W, H,
  };

  const first = vals[0], last = vals[vals.length - 1];
  const pct = ((last - first) / first) * 100;
  const fmtDate = (d) => d ? d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "";
  const startLbl = points[0].t ? fmtDate(points[0].t) : "start";
  const endLbl = points[points.length - 1].t ? fmtDate(points[points.length - 1].t) : "now";

  statsEl.innerHTML = `
    <div class="md-dates"><span>${startLbl}</span><span>${endLbl}</span></div>
    <div class="md-stat-row">
      <div class="md-stat"><label>Change</label><b class="${up ? "up" : "down"}">${up ? "▲" : "▼"} ${Math.abs(pct).toFixed(2)}%</b></div>
      <div class="md-stat"><label>High</label><b>₹${formatNum(max)}</b></div>
      <div class="md-stat"><label>Low</label><b>₹${formatNum(min)}</b></div>
    </div>
    ${isLocal ? `<div class="md-note">Live in-app trend (real history unavailable for this currency).</div>` : ""}`;
}

window.addEventListener("DOMContentLoaded", init);
