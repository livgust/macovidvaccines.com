import { formatPhoneNumber } from "./index";

it("formats the phone number", () => {
    const test_cases = [
        ["1", ""],
        ["2", "(2"],
        ["2344", "(234) 4"],
        ["2344567890", "(234) 456-7890"],
        ["23445678900", "(234) 456-78900"],
    ];
    test_cases.forEach(([input, expectedOutput]) => {
        expect(formatPhoneNumber(input)).toBe(expectedOutput);
    });
});
