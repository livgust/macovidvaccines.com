import Cookies from "universal-cookie";

const cookies = new Cookies();
const cookieMaxAge = 365 * 86400;
const cookieName = "macovidvaccines";

let ourCookie = {};

export function getCookie(key) {
    const theCookie = cookies.get(cookieName, { doNotParse: true });
    if (theCookie) {
        try {
            ourCookie = JSON.parse(cookieDecipher(theCookie));
        } catch (e) {
            // Unable to decode and parse a bad cookie!
            ourCookie = {};
        }
    }
    return ourCookie[key];
}

export function setCookie(key, value) {
    ourCookie[key] = value;
    const enc = cookieCipher(JSON.stringify(ourCookie));
    cookies.set(cookieName, enc, {
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
