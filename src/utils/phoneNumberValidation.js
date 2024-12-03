export const countryCodes = [
    '+1',    // USA, Canada
    '+7',    // Russia, Kazakhstan
    '+20',   // Egypt
    '+27',   // South Africa
    '+30',   // Greece
    '+31',   // Netherlands
    '+32',   // Belgium
    '+33',   // France
    '+34',   // Spain
    '+36',   // Hungary
    '+39',   // Italy
    '+40',   // Romania
    '+41',   // Switzerland
    '+43',   // Austria
    '+44',   // UK
    '+45',   // Denmark
    '+46',   // Sweden
    '+47',   // Norway
    '+48',   // Poland
    '+49',   // Germany
    '+51',   // Peru
    '+52',   // Mexico
    '+53',   // Cuba
    '+54',   // Argentina
    '+55',   // Brazil
    '+56',   // Chile
    '+57',   // Colombia
    '+58',   // Venezuela
    '+60',   // Malaysia
    '+61',   // Australia
    '+62',   // Indonesia
    '+63',   // Philippines
    '+64',   // New Zealand
    '+65',   // Singapore
    '+66',   // Thailand
    '+81',   // Japan
    '+82',   // South Korea
    '+84',   // Vietnam
    '+86',   // China
    '+90',   // Turkey
    '+91',   // India
    '+92',   // Pakistan
    '+93',   // Afghanistan
    '+94',   // Sri Lanka
    '+95',   // Myanmar
    '+98',   // Iran
    '+212',  // Morocco
    '+213',  // Algeria
    '+216',  // Tunisia
    '+218',  // Libya
    '+220',  // Gambia
    '+221',  // Senegal
    '+222',  // Mauritania
    '+223',  // Mali
    '+224',  // Guinea
    '+225',  // Côte d'Ivoire
    '+226',  // Burkina Faso
    '+227',  // Niger
    '+228',  // Togo
    '+229',  // Benin
    '+230',  // Mauritius
    '+231',  // Liberia
    '+232',  // Sierra Leone
    '+233',  // Ghana
    '+234',  // Nigeria
    '+235',  // Chad
    '+236',  // Central African Republic
    '+237',  // Cameroon
    '+238',  // Cape Verde
    '+239',  // São Tomé and Príncipe
    '+240',  // Equatorial Guinea
    '+241',  // Gabon
    '+242',  // Republic of the Congo
    '+243',  // Democratic Republic of the Congo
    '+244',  // Angola
    '+245',  // Guinea-Bissau
    '+246',  // British Indian Ocean Territory
    '+247',  // Ascension Island
    '+248',  // Seychelles
    '+249',  // Sudan
    '+250',  // Rwanda
    '+251',  // Ethiopia
    '+252',  // Somalia
    '+253',  // Djibouti
    '+254',  // Kenya
    '+255',  // Tanzania
    '+256',  // Uganda
    '+257',  // Burundi
    '+258',  // Mozambique
    '+260',  // Zambia
    '+261',  // Madagascar
    '+262',  // Réunion, Mayotte
    '+263',  // Zimbabwe
    '+264',  // Namibia
    '+265',  // Malawi
    '+266',  // Lesotho
    '+267',  // Botswana
    '+268',  // Eswatini
    '+269',  // Comoros
    '+290',  // Saint Helena
    '+291',  // Eritrea
    '+292',  // South Sudan
    '+293',  // Nauru
    '+294',  // Seychelles
    '+295',  // French Guiana
    '+296',  // Saint Pierre and Miquelon
    '+297',  // Aruba
    '+298',  // Faroe Islands
    '+299',  // Greenland
    '+350',  // Gibraltar
    '+351',  // Portugal
    '+352',  // Luxembourg
    '+353',  // Ireland
    '+354',  // Iceland
    '+355',  // Albania
    '+356',  // Malta
    '+357',  // Cyprus
    '+358',  // Finland
    '+359',  // Bulgaria
    '+370',  // Lithuania
    '+371',  // Latvia
    '+372',  // Estonia
    '+373',  // Moldova
    '+374',  // Armenia
    '+375',  // Belarus
    '+376',  // Andorra
    '+377',  // Monaco
    '+378',  // San Marino
    '+379',  // Vatican City
    '+380',  // Ukraine
    '+381',  // Serbia
    '+382',  // Montenegro
    '+383',  // Kosovo
    '+385',  // Croatia
    '+386',  // Slovenia
    '+387',  // Bosnia and Herzegovina
    '+388',  // Yugoslavia
    '+389',  // North Macedonia
    '+390',  // Vatican City
    '+391',  // San Marino
    '+392',  // Andorra
    '+393',  // Monaco
    '+394',  // Kosovo
    '+395',  // Vatican City
    '+396',  // San Marino
    '+397',  // Andorra
    '+398',  // Monaco
    '+399',  // Kosovo
    '+971',  // UAE
    '+1869', // Saint Kitts and Nevis
    '+1876', // Jamaica
    '+1954', // Venezuela
];

export const phoneValidationRules = {
    '1': /^\d{10}$/,                // USA/Canada: 10 digits
    '44': /^(\d{10}|\d{11})$/,      // UK: 10 or 11 digits
    '33': /^\d{10}$/,                // France: 10 digits
    '49': /^\d{11,14}$/,             // Germany: 11 to 14 digits (including country code)
    '91': /^[6-9]\d{9}$/,            // India: 10 digits, starts with 6-9
    '81': /^\d{10}$/,                // Japan: 10 digits
    '82': /^\d{10}$/,                // South Korea: 10 digits
    '61': /^(\d{9}|\d{10})$/,        // Australia: 9 or 10 digits
    '971': /^\d{7,9}$/,             // UAE: 7 to 9 digits /^[5-9][0-9]{8}$/
    '55': /^\d{10,11}$/,             // Brazil: 10 or 11 digits
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '52': /^\d{10}$/,                // Mexico: 10 digits
    '46': /^\d{6,11}$/,              // Sweden: 6 to 11 digits
    '34': /^\d{9}$/,                 // Spain: 9 digits
    '64': /^\d{9}$/,                 // New Zealand: 9 digits
    '39': /^\d{10}$/,                // Italy: 10 digits
    '55': /^\d{11}$/,                // Brazil: 11 digits (often with 2-digit area code, note that '55' is duplicated)
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '53': /^\d{8}$/,                 // Cuba: 8 digits
    '20': /^\d{10}$/,                // Egypt: 10 digits
    '90': /^\d{10}$/,                // Turkey: 10 digits
    '7': /^(\d{10}|\d{11})$/,        // Russia: 10 or 11 digits
    '44': /^(\d{10}|\d{11})$/,       // UK: 10 or 11 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits, starts with 6-9
    '52': /^\d{10}$/,                // Mexico: 10 digits
    '55': /^\d{11}$/,                // Brazil: 11 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits
    '971': /^\d{7,9}$/,              // UAE: 7 to 9 digits
    '60': /^\d{9,10}$/,              // Malaysia: 9 or 10 digits
    '62': /^\d{10,13}$/,             // Indonesia: 10 to 13 digits
    '63': /^\d{10}$/,                // Philippines: 10 digits
    '86': /^\d{11}$/,                // China: 11 digits
    '90': /^\d{10}$/,                // Turkey: 10 digits
    '98': /^\d{10}$/,                // Iran: 10 digits
    '92': /^\d{10}$/,                // Pakistan: 10 digits
    '94': /^\d{10}$/,                // Sri Lanka: 10 digits
    '91': /^[6-9]\d{9}$/,            // India: 10 digits
    '20': /^\d{10}$/,                // Egypt: 10 digits
    '27': /^\d{10}$/,                // South Africa: 10 digits
    '41': /^\d{10}$/,                // Switzerland: 10 digits
    '47': /^\d{8}$/,                 // Norway: 8 digits
    '48': /^\d{9}$/,                 // Poland: 9 digits
    '30': /^\d{10}$/,                // Greece: 10 digits
    '31': /^\d{10}$/,                // Netherlands: 10 digits
    '32': /^\d{9}$/,                 // Belgium: 9 digits
    '33': /^\d{10}$/,                // France: 10 digits
    '34': /^\d{9}$/,                 // Spain: 9 digits
    '35': /^\d{8,9}$/,              // Portugal: 8 or 9 digits
    '36': /^\d{9}$/,                // Hungary: 9 digits
    '37': /^\d{8}$/,                // Moldova: 8 digits
    '38': /^\d{9}$/,                // Slovenia:

    '38': /^\d{9}$/,                // Slovenia: 9 digits
    '39': /^\d{10}$/,               // Italy: 10 digits
    '40': /^\d{10}$/,               // Romania: 10 digits
    '41': /^\d{10}$/,               // Switzerland: 10 digits
    '42': /^\d{9}$/,                // Slovakia: 9 digits
    '43': /^\d{10}$/,               // Austria: 10 digits
    '44': /^(\d{10}|\d{11})$/,     // UK: 10 or 11 digits (note this is duplicated in the list)
    '45': /^\d{8}$/,                // Denmark: 8 digits
    '46': /^\d{6,11}$/,             // Sweden: 6 to 11 digits
    '47': /^\d{8}$/,                // Norway: 8 digits
    '48': /^\d{9}$/,                // Poland: 9 digits
    '49': /^\d{11,14}$/,            // Germany: 11 to 14 digits (including country code)
    '50': /^\d{10}$/,               // Mongolia: 10 digits
    '51': /^\d{9}$/,                // Peru: 9 digits
    '52': /^\d{10}$/,               // Mexico: 10 digits
    '53': /^\d{8}$/,                // Cuba: 8 digits
    '54': /^\d{10}$/,               // Argentina: 10 digits
    '55': /^\d{11}$/,               // Brazil: 11 digits
    '56': /^\d{9}$/,                // Chile: 9 digits
    '57': /^\d{10}$/,               // Colombia: 10 digits
    '58': /^\d{11}$/,               // Venezuela: 11 digits
    '60': /^\d{9,10}$/,             // Malaysia: 9 or 10 digits
    '61': /^(\d{9}|\d{10})$/,       // Australia: 9 or 10 digits
    '62': /^\d{10,13}$/,            // Indonesia: 10 to 13 digits
    '63': /^\d{10}$/,               // Philippines: 10 digits
    '64': /^\d{9}$/,                // New Zealand: 9 digits
    '65': /^\d{8}$/,                // Singapore: 8 digits
    '66': /^\d{9,10}$/,             // Thailand: 9 or 10 digits
    '81': /^\d{10}$/,               // Japan: 10 digits
    '82': /^\d{10}$/,               // South Korea: 10 digits
    '84': /^\d{10}$/,               // Vietnam: 10 digits
    '86': /^\d{11}$/,               // China: 11 digits
    '90': /^\d{10}$/,               // Turkey: 10 digits
    '92': /^\d{10}$/,               // Pakistan: 10 digits
    '93': /^\d{9}$/,                // Afghanistan: 9 digits
    '94': /^\d{10}$/,               // Sri Lanka: 10 digits
    '98': /^\d{10}$/,               // Iran: 10 digits
    '992': /^\d{9}$/,              // Tajikistan: 9 digits
    '993': /^\d{9}$/,              // Turkmenistan: 9 digits
    '994': /^\d{9}$/,              // Azerbaijan: 9 digits
    '995': /^\d{9}$/,              // Georgia: 9 digits
    '996': /^\d{9}$/,              // Kyrgyzstan: 9 digits
    '998': /^\d{9}$/,              // Uzbekistan: 9 digits
    '213': /^\d{9}$/,              // Algeria: 9 digits
    '216': /^\d{8}$/,              // Tunisia: 8 digits
    '218': /^\d{9}$/,              // Libya: 9 digits
    '220': /^\d{7}$/,              // Gambia: 7 digits
    '221': /^\d{9}$/,              // Senegal: 9 digits
    '222': /^\d{8}$/,              // Mauritania: 8 digits
    '223': /^\d{8}$/,              // Mali: 8 digits
    '224': /^\d{9}$/,              // Guinea: 9 digits
    '225': /^\d{8}$/,              // Côte d'Ivoire: 8 digits
    '226': /^\d{8}$/,              // Burkina Faso: 8 digits
    '227': /^\d{8}$/,              // Niger: 8 digits
    '228': /^\d{8}$/,              // Togo: 8 digits
    '229': /^\d{8}$/,              // Benin: 8 digits
    '230': /^\d{7}$/,              // Mauritius: 7 digits
    '231': /^\d{7}$/,              // Liberia: 7 digits
    '232': /^\d{8}$/,              // Sierra Leone: 8 digits
    '233': /^\d{10}$/,             // Ghana: 10 digits
    '234': /^\d{10}$/,             // Nigeria: 10 digits
    '235': /^\d{8}$/,              // Chad: 8 digits
    '236': /^\d{8}$/,              // Central African Republic: 8 digits
    '237': /^\d{9}$/,              // Cameroon: 9 digits
    '238': /^\d{7}$/,              // Cape Verde: 7 digits
    '239': /^\d{7}$/,              // São Tomé and Príncipe: 7 digits
}