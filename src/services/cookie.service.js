import Cookies from "universal-cookie";

const cookies = new Cookies();
const cookieMaxAge = 365 * 86400;
const cookieName = "macovidvaccines";

let plaintextCookie = {};

export function getCookie(key) {
    const encryptedCookie = cookies.get(cookieName, { doNotParse: true });
    if (encryptedCookie) {
        try {
            plaintextCookie = JSON.parse(cookieDecipher(encryptedCookie));
        } catch (e) {
            // Unable to decode and parse a bad cookie!
            plaintextCookie = {};
        }
    }
    return plaintextCookie[key];
}

export function setCookie(key, value) {
    plaintextCookie[key] = value;
    const encryptedCookie = cookieCipher(JSON.stringify(plaintextCookie));
    cookies.set(cookieName, encryptedCookie, {
        path: "/",
        secure: true,
        maxAge: cookieMaxAge,
    });
}

const cipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
        text
            .split("")
            .map(textToChars)
            .map(applySaltToChar)
            .map(byteHex)
            .join("");
};

const decipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
        textToChars(salt).reduce((a, b) => a ^ b, code);

    return (encoded) =>
        encoded
            .match(/.{1,2}/g)
            .map((hex) => parseInt(hex, 16))
            .map(applySaltToChar)
            .map((charCode) => String.fromCharCode(charCode))
            .join("");
};

// To create a cipher
const cookieSalt = "XDpUY3ti0uEh8wUnWv6t";
const cookieCipher = cipher(cookieSalt);
const cookieDecipher = decipher(cookieSalt);
