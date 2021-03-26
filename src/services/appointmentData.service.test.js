import {
    combineMoreInformation,
    hasSameInformationText,
} from "./appointmentData.service";
describe("hasSameInformationText", function () {
    test("returns true when same text", function () {
        const info = {
            date1: "same text",
            date2: "same text",
        };
        expect(hasSameInformationText(info)).toBeTruthy();
    });
    test("returns false when different text", function () {
        const info = {
            date1: "same text",
            date3: "same text",
            date2: "not same text",
        };
        expect(hasSameInformationText(info)).toBeFalsy();
    });
});

describe("combineMoreInformation", function () {
    test("returns text if same across all dates", function () {
        const info = {
            date1: "same text",
            date2: "same text",
        };
        expect(combineMoreInformation(info)).toBe("same text");
    });
    test("returns all text if different across dates", function () {
        const info = {
            date1: "same text",
            date2: "not same text",
        };
        expect(combineMoreInformation(info)).toBe(
            "date1: same text&#10;&#13;date2: not same text"
        );
    });
});
