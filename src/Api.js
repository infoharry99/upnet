import axios from "axios";
import CryptoJS from "crypto-js";

export const COLORS = {
  APPBLUE: "#3F7EFF",
  APPORANGE: "#EB4328",
};
const developmentBaseUrl = "https://www.smartcloudvm.com/api"
export const UPNTurl = "https://upntcld.com/api";
const instance = axios.create({
  baseURL: UPNTurl,
});

export default instance;

export const CAPTCHKEY = {
  siteKey: "0x4AAAAAAAgB7aivTPOuPMOd", // LIVE
  //siteKey: "0x4AAAAAAAgCoGKKTiB0EtI5"    //LOCAL
};

window.getUserIP = async () => {
  // return "103.240.168.48";

  try {
    const response = await fetch("http://ip-api.com/json/"); // "https://ipinfo.io"
    const data = await response.json();
    return data;
  } catch (error) {
    return { IPv4: "Unknown", country_name: "Unknown" };
  }
};

// window.fetchGeoIP = async (ip) => {
//   const username = "YOUR_ACCOUNT_ID"; // Replace with your actual MaxMind account ID
//   const password = "YOUR_LICENSE_KEY"; // Replace with your actual MaxMind license key

//   try {
//     const response = await fetch(
//       `https://geoip.maxmind.com/geoip/v2.1/city/${ip}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: "Basic " + btoa(`${username}:${password}`), // Encode credentials
//           Accept: "application/json",
//         },
//       }
//     );

//     if (!response.ok) throw new Error("Failed to fetch GeoIP data");

//     const data = await response.json();
//     console.log("GeoIP Data:", data);
//   } catch (error) {
//     console.error("Error fetching GeoIP data:", error);
//   }
// };

window.fetchIPData = async () => {
  const apiKey = "b342806ff34d4c9786b6a2cb024654d6";
  try {
    const response = await fetch(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    console.error("Error fetching IP data:", error);
    return null;
  }
};

export const apiEncryptRequest = async (payload) => {
  try {
    const response = await instance.post("/encrypt", payload);
    return response.data;
  } catch (error) {
    throw error; 
  }
};

export const apiDecrypteRequest = async (payload) => {
  try {
    const response = await instance.post("/decrypte", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const encryptData = async (data) => {
  const cipher = "AES-256-CBC";
  const secretKey = "12345678901234567890123456789012";
  const iv = "1234567891234567"; //CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptoJS.enc.Hex.parse(secretKey),
    {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return encrypted.toString();
};

export const currencyReturn = (data) => {
  // console.log(data.price, data.symbol, data.rates);
  const { price, symbol, rates } = data;
  let finalString = "";

  if (symbol === "EUR") {
    finalString = `€ ${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "GBP") {
    finalString = `£ ${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "INR") {
    finalString = `₹ ${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "USD") {
    finalString = `$ ${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "AED") {
    finalString = `د.إ ${(price / parseFloat(rates)).toFixed(2)}`;
  }

  return finalString;
};

export const currencyReturnOnlyAmount = (data) => {
  // console.log(data.price, data.symbol, data.rates);
  const { price, symbol, rates } = data;
  let finalString = "";

  if (symbol === "EUR") {
    finalString = `${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "GBP") {
    finalString = `${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "INR") {
    finalString = `${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "USD") {
    finalString = `${(price / parseFloat(rates)).toFixed(2)}`;
  } else if (symbol === "AED") {
    finalString = `${(price / parseFloat(rates)).toFixed(2)}`;
  }

  return finalString;
};

export const getCurrencySymbol = (symbol) => {
  // console.log(data.price, data.symbol, data.rates);

  if (symbol === "EUR") {
    return `€`;
  } else if (symbol === "GBP") {
    return `£`;
  } else if (symbol === "INR") {
    return `₹`;
  } else if (symbol === "USD") {
    return `$`;
  } else if (symbol === "AED") {
    return `د.إ`;
  }
};

export const decryptData = async (encryptedJson) => {
  const cipher = "AES-256-CBC";
  const secretKey = "12345678901234567890123456789012";
  const iv = "1234567891234567";
 
  const bytes = CryptoJS.AES.decrypt(
    encryptedJson,
    CryptoJS.enc.Utf8.parse(secretKey),
    {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
};

export const AllCountryList = [
  { value: "1", name: "Afghanistan" },
  { value: "2", name: "Aland Islands" },
  { value: "3", name: "Albania" },
  { value: "4", name: "Algeria" },
  { value: "5", name: "AmericanSamoa" },
  { value: "6", name: "Andorra" },
  { value: "7", name: "Angola" },
  { value: "8", name: "Anguilla" },
  { value: "9", name: "Antarctica" },
  { value: "10", name: "Antigua and Barbuda" },
  { value: "11", name: "Argentina" },
  { value: "12", name: "Armenia" },
  { value: "13", name: "Aruba" },
  { value: "14", name: "Australia" },
  { value: "15", name: "Austria" },
  { value: "16", name: "Azerbaijan" },
  { value: "17", name: "Bahamas" },
  { value: "18", name: "Bahrain" },
  { value: "19", name: "Bangladesh" },
  { value: "20", name: "Barbados" },
  { value: "21", name: "Belarus" },
  { value: "22", name: "Belgium" },
  { value: "23", name: "Belize" },
  { value: "24", name: "Benin" },
  { value: "25", name: "Bermuda" },
  { value: "26", name: "Bhutan" },
  { value: "27", name: "Bolivia, Plurination" },
  { value: "28", name: "Bosnia and Herzegovi" },
  { value: "29", name: "Botswana" },
  { value: "30", name: "Brazil" },
  { value: "31", name: "British Indian Ocean" },
  { value: "32", name: "Brunei Darussalam" },
  { value: "33", name: "Bulgaria" },
  { value: "34", name: "Burkina Faso" },
  { value: "35", name: "Burundi" },
  { value: "36", name: "Cambodia" },
  { value: "37", name: "Cameroon" },
  { value: "38", name: "Canada" },
  { value: "39", name: "Cape Verde" },
  { value: "40", name: "Cayman Islands" },
  { value: "41", name: "Central African Repu" },
  { value: "42", name: "Chad" },
  { value: "43", name: "Chile" },
  { value: "44", name: "China" },
  { value: "45", name: "Christmas Island" },
  { value: "46", name: "Cocos (Keeling) Isla" },
  { value: "47", name: "Colombia" },
  { value: "48", name: "Comoros" },
  { value: "49", name: "Congo" },
  { value: "50", name: "Congo, The Democrati" },
  { value: "51", name: "Cook Islands" },
  { value: "52", name: "Costa Rica" },
  { value: "53", name: "Cote d'Ivoire" },
  { value: "54", name: "Croatia" },
  { value: "55", name: "Cuba" },
  { value: "56", name: "Cyprus" },
  { value: "57", name: "Czech Republic" },
  { value: "58", name: "Denmark" },
  { value: "59", name: "Djibouti" },
  { value: "60", name: "Dominica" },
  { value: "61", name: "Dominican Republic" },
  { value: "62", name: "Ecuador" },
  { value: "63", name: "Egypt" },
  { value: "64", name: "El Salvador" },
  { value: "65", name: "Equatorial Guinea" },
  { value: "66", name: "Eritrea" },
  { value: "67", name: "Estonia" },
  { value: "68", name: "Ethiopia" },
  { value: "69", name: "Falkland Islands (Ma" },
  { value: "70", name: "Faroe Islands" },
  { value: "71", name: "Fiji" },
  { value: "72", name: "Finland" },
  { value: "73", name: "France" },
  { value: "74", name: "French Guiana" },
  { value: "75", name: "French Polynesia" },
  { value: "76", name: "Gabon" },
  { value: "77", name: "Gambia" },
  { value: "78", name: "Georgia" },
  { value: "79", name: "Germany" },
  { value: "80", name: "Ghana" },
  { value: "81", name: "Gibraltar" },
  { value: "82", name: "Greece" },
  { value: "83", name: "Greenland" },
  { value: "84", name: "Grenada" },
  { value: "85", name: "Guadeloupe" },
  { value: "86", name: "Guam" },
  { value: "87", name: "Guatemala" },
  { value: "88", name: "Guernsey" },
  { value: "89", name: "Guinea" },
  { value: "90", name: "Guinea-Bissau" },
  { value: "91", name: "Guyana" },
  { value: "92", name: "Haiti" },
  { value: "93", name: "Holy See (Vatican Ci" },
  { value: "94", name: "Honduras" },
  { value: "95", name: "Hong Kong" },
  { value: "96", name: "Hungary" },
  { value: "97", name: "Iceland" },
  { value: "98", name: "India" },
  { value: "99", name: "Indonesia" },
  { value: "100", name: "Iran, Islamic Republ" },
  { value: "101", name: "Iraq" },
  { value: "102", name: "Ireland" },
  { value: "103", name: "Isle of Man" },
  { value: "104", name: "Israel" },
  { value: "105", name: "Italy" },
  { value: "106", name: "Jamaica" },
  { value: "107", name: "Japan" },
  { value: "108", name: "Jersey" },
  { value: "109", name: "Jordan" },
  { value: "110", name: "Kazakhstan" },
  { value: "111", name: "Kenya" },
  { value: "112", name: "Kiribati" },
  { value: "113", name: "Korea, Democratic Pe" },
  { value: "114", name: "Korea, Republic of S" },
  { value: "115", name: "Kuwait" },
  { value: "116", name: "Kyrgyzstan" },
  { value: "117", name: "Laos" },
  { value: "118", name: "Latvia" },
  { value: "119", name: "Lebanon" },
  { value: "120", name: "Lesotho" },
  { value: "121", name: "Liberia" },
  { value: "122", name: "Libyan Arab Jamahiri" },
  { value: "123", name: "Liechtenstein" },
  { value: "124", name: "Lithuania" },
  { value: "125", name: "Luxembourg" },
  { value: "126", name: "Macao" },
  { value: "127", name: "Macedonia" },
  { value: "128", name: "Madagascar" },
  { value: "129", name: "Malawi" },
  { value: "130", name: "Malaysia" },
  { value: "131", name: "Maldives" },
  { value: "132", name: "Mali" },
  { value: "133", name: "Malta" },
  { value: "134", name: "Marshall Islands" },
  { value: "135", name: "Martinique" },
  { value: "136", name: "Mauritania" },
  { value: "137", name: "Mauritius" },
  { value: "138", name: "Mayotte" },
  { value: "139", name: "Mexico" },
  { value: "140", name: "Micronesia, Federate" },
  { value: "141", name: "Moldova" },
  { value: "142", name: "Monaco" },
  { value: "143", name: "Mongolia" },
  { value: "144", name: "Montenegro" },
  { value: "145", name: "Montserrat" },
  { value: "146", name: "Morocco" },
  { value: "147", name: "Mozambique" },
  { value: "148", name: "Myanmar" },
  { value: "149", name: "Namibia" },
  { value: "150", name: "Nauru" },
  { value: "151", name: "Nepal" },
  { value: "152", name: "Netherlands" },
  { value: "153", name: "Netherlands Antilles" },
  { value: "154", name: "New Caledonia" },
  { value: "155", name: "New Zealand" },
  { value: "156", name: "Nicaragua" },
  { value: "157", name: "Niger" },
  { value: "158", name: "Nigeria" },
  { value: "159", name: "Niue" },
  { value: "160", name: "Norfolk Island" },
  { value: "161", name: "Northern Mariana Isl" },
  { value: "162", name: "Norway" },
  { value: "163", name: "Oman" },
  { value: "164", name: "Pakistan" },
  { value: "165", name: "Palau" },
  { value: "166", name: "Palestinian Territor" },
  { value: "167", name: "Panama" },
  { value: "168", name: "Papua New Guinea" },
  { value: "169", name: "Paraguay" },
  { value: "170", name: "Peru" },
  { value: "171", name: "Philippines" },
  { value: "172", name: "Pitcairn" },
  { value: "173", name: "Poland" },
  { value: "174", name: "Portugal" },
  { value: "175", name: "Puerto Rico" },
  { value: "176", name: "Qatar" },
  { value: "177", name: "Romania" },
  { value: "178", name: "Russia" },
  { value: "179", name: "Rwanda" },
  { value: "180", name: "Reunion" },
  { value: "181", name: "Saint Barthelemy" },
  { value: "182", name: "Saint Helena, Ascens" },
  { value: "183", name: "Saint Kitts and Nevi" },
  { value: "184", name: "Saint Lucia" },
  { value: "185", name: "Saint Martin" },
  { value: "186", name: "Saint Pierre and Miq" },
  { value: "187", name: "Saint Vincent and th" },
  { value: "188", name: "Samoa" },
  { value: "189", name: "San Marino" },
  { value: "190", name: "Sao Tome and Princip" },
  { value: "191", name: "Saudi Arabia" },
  { value: "192", name: "Senegal" },
  { value: "193", name: "Serbia" },
  { value: "194", name: "Seychelles" },
  { value: "195", name: "Sierra Leone" },
  { value: "196", name: "Singapore" },
  { value: "197", name: "Slovakia" },
  { value: "198", name: "Slovenia" },
  { value: "199", name: "Solomon Islands" },
  { value: "200", name: "Somalia" },
  { value: "201", name: "South Africa" },
  { value: "202", name: "South Georgia and th" },
  { value: "203", name: "Spain" },
  { value: "204", name: "Sri Lanka" },
  { value: "205", name: "Sudan" },
  { value: "206", name: "Suriname" },
  { value: "207", name: "Svalbard and Jan May" },
  { value: "208", name: "Swaziland" },
  { value: "209", name: "Sweden" },
  { value: "210", name: "Switzerland" },
  { value: "211", name: "Syrian Arab Republic" },
  { value: "212", name: "Taiwan" },
  { value: "213", name: "Tajikistan" },
  { value: "214", name: "Tanzania, United Rep" },
  { value: "215", name: "Thailand" },
  { value: "216", name: "Timor-Leste" },
  { value: "217", name: "Togo" },
  { value: "218", name: "Tokelau" },
  { value: "219", name: "Tonga" },
  { value: "220", name: "Trinidad and Tobago" },
  { value: "221", name: "Tunisia" },
  { value: "222", name: "Turkey" },
  { value: "223", name: "Turkmenistan" },
  { value: "224", name: "Turks and Caicos Isl" },
  { value: "225", name: "Tuvalu" },
  { value: "226", name: "Uganda" },
  { value: "227", name: "Ukraine" },
  { value: "228", name: "United Arab Emirates" },
  { value: "229", name: "United Kingdom" },
  { value: "230", name: "United States" },
  { value: "231", name: "Uruguay" },
  { value: "232", name: "Uzbekistan" },
  { value: "233", name: "Vanuatu" },
  { value: "234", name: "Venezuela, Bolivaria" },
  { value: "235", name: "Vietnam" },
  { value: "236", name: "Virgin Islands, Brit" },
  { value: "237", name: "Virgin Islands, U.S." },
  { value: "238", name: "Wallis and Futuna" },
  { value: "239", name: "Yemen" },
  { value: "240", name: "Zambia" },
  { value: "241", name: "Zimbabwe" },
];

// Function to convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Function to convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// AES-CBC Encryption function
export const Encrypt = async (data) => {
  const algorithm = {
    name: "AES-CBC",
    iv: crypto.getRandomValues(new Uint8Array(16)),
  };

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("12345678901234567890123456789012"),
    algorithm,
    false,
    ["encrypt"]
  );

  const encodedData = new TextEncoder().encode(data);
  const encryptedData = await crypto.subtle.encrypt(
    algorithm,
    key,
    encodedData
  );

  return arrayBufferToBase64(encryptedData);
};

// Function to convert base64 to ArrayBuffer
const base64ToArrayBufferDec = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
export const Decrypt = async (encryptedData) => {
  console.log(encryptedData, "encryptedData");
  const algorithm = {
    name: "AES-CBC",
    iv: new Uint8Array(16), // Ensure this matches the IV used during encryption
  };
  console.log(algorithm, "encryptedData");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("12345678901234567890123456789012"),
    algorithm,
    false,
    ["decrypt"]
  );
  console.log(key, "encryptedData");
  try {
    const buffer = base64ToArrayBufferDec(encryptedData);
    console.log(buffer, "buffer");
    const decryptedArrayBuffer = await crypto.subtle.decrypt(
      algorithm,
      key,
      buffer
    );
    console.log(decryptedArrayBuffer, "decryptedArrayBuffer");
    const decryptedData = new TextDecoder().decode(decryptedArrayBuffer);

    return decryptedData;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error; // Propagate the error further if needed
  }
};

export const getTimeDifference = (datetime) => {
  const givenDateTime = new Date(datetime);
  const currentTime = new Date();

  const difference = currentTime - givenDateTime;

  const hours = Math.floor(difference / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
};
