export default class Compat {
    static browserType() {
        let userAgent = navigator.userAgent.toLowerCase();
        // The order is matter. Do not change it! 
        // You should know what you are doing.
        if (userAgent.indexOf("edg") !== -1)
            return "edge";
        if (userAgent.indexOf("chrome") !== -1)
            return "chrome";
        if (userAgent.indexOf("safari") !== -1)
            return "safari";
        if (userAgent.indexOf("gecko") !== -1)
            return "firefox";
        return "unknown";
    }

    static isRunningInWebExtension() {
        return typeof chrome === "object" && chrome.runtime
    }

    static omniboxPageSize() {
        return { "firefox": 6, "edge": 7, "chrome": 8, "unknown": 6 }[Compat.browserType()];
    }

    // Escape the special characters to display them as text.
    static escape(str) {
        str = str || "";
        if (Compat.browserType() === "firefox") {
            // Firefox support <,> in omnibox and doesn't support escaped characters.
            // So we can unescape them.
            return str
                .replace(/&amp;/g, "&")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&quot;/g, '"')
                .replace(/&#039;/g, "'");
        } else {
            // Chromium based browsers not support <,> in omnibox.
            // We should escape them to avoid xml parse error.
            return Compat.escapeAmpersand(str)
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
    }

    // Escape ampersand & (with spaces around) to &amp;.
    // For example, "a & b" => "a &amp; b"
    static escapeAmpersand(str) {
        return str.replace(" & ", " &amp; ");
    }

    static normalizeDate(date) {
        let month = '' + (date.getMonth() + 1), day = '' + date.getDate(), year = date.getFullYear();
        return [year, month.padStart(2, "0"), day.padStart(2, "0")].join('-');
    }

    static capitalize(value) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return "";
    }

    static eliminateTags(value) {
        if (value) {
            return value.replace(/<\/?(match|dim|code|em|strong|span)>/g, "");
        }
        return "";
    }
};
