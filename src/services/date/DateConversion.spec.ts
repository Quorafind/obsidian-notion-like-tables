import { DateFormat } from "../tableState/types";
import DateConversion from "./DateConversion";

describe("isValidDateFormat", () => {
	it("returns true for valid MM/DD/YYYY", () => {
		expect(
			DateConversion.isValidDateFormat(
				"12/31/2023",
				DateFormat.MM_DD_YYYY
			)
		).toBe(true);
	});

	it("returns false for invalid MM/DD/YYYY", () => {
		//Test for DD/MM/YYYY
		expect(
			DateConversion.isValidDateFormat(
				"31/12/2023",
				DateFormat.MM_DD_YYYY
			)
		).toBe(false);

		//Test for YYYY/MM/DD
		expect(
			DateConversion.isValidDateFormat(
				"2023/12/31",
				DateFormat.MM_DD_YYYY
			)
		).toBe(false);

		//Test for invalid day
		expect(
			DateConversion.isValidDateFormat(
				"13/31/2023",
				DateFormat.MM_DD_YYYY
			)
		).toBe(false);

		//Test for invalid month
		expect(
			DateConversion.isValidDateFormat(
				"12/32/2023",
				DateFormat.MM_DD_YYYY
			)
		).toBe(false);

		//Test for empty string
		expect(
			DateConversion.isValidDateFormat("", DateFormat.MM_DD_YYYY)
		).toBe(false);
	});

	it("returns true for valid DD/MM/YYYY", () => {
		expect(
			DateConversion.isValidDateFormat(
				"31/12/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(true);
	});

	it("returns false for invalid DD/MM/YYYY", () => {
		//Test for MM/DD/YYYY
		expect(
			DateConversion.isValidDateFormat(
				"12/31/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for YYYY/MM/DD
		expect(
			DateConversion.isValidDateFormat(
				"2023/12/31",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for MM/DD/YYYY
		expect(
			DateConversion.isValidDateFormat(
				"31/13/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for invalid day
		expect(
			DateConversion.isValidDateFormat(
				"32/12/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for invalid month
		expect(
			DateConversion.isValidDateFormat(
				"31/13/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for invalid month
		expect(
			DateConversion.isValidDateFormat(
				"31/13/2023",
				DateFormat.DD_MM_YYYY
			)
		).toBe(false);

		//Test for empty string
		expect(
			DateConversion.isValidDateFormat("", DateFormat.DD_MM_YYYY)
		).toBe(false);
	});

	it("returns true for valid YYYY/MM/DD", () => {
		const result = DateConversion.isValidDateFormat(
			"2023/12/12",
			DateFormat.YYYY_MM_DD
		);
		expect(result).toBe(true);
	});

	it("returns false for invalid YYYY/MM/DD", () => {
		//Test for MM/DD/YYYY
		expect(
			DateConversion.isValidDateFormat(
				"12/31/2023",
				DateFormat.YYYY_MM_DD
			)
		).toBe(false);

		//Test for DD/MM/YYYY
		expect(
			DateConversion.isValidDateFormat(
				"31/12/2023",
				DateFormat.YYYY_MM_DD
			)
		).toBe(false);

		//Test for invalid month
		expect(
			DateConversion.isValidDateFormat(
				"2023/13/31",
				DateFormat.YYYY_MM_DD
			)
		).toBe(false);

		//Test for invalid day
		expect(
			DateConversion.isValidDateFormat(
				"2023/12/32",
				DateFormat.YYYY_MM_DD
			)
		).toBe(false);

		//Test for empty string
		expect(
			DateConversion.isValidDateFormat("", DateFormat.YYYY_MM_DD)
		).toBe(false);
	});
});

describe("dateStringToUnixTime", () => {
	it("returns the correct unix time for MM/DD/YYYY", () => {
		expect(
			DateConversion.dateStringToUnixTime(
				"12/31/2023",
				DateFormat.MM_DD_YYYY
			)
		).toBe(1704006000000);
	});
});

describe("unixTimeToDateString", () => {
	it("returns the correct date string for MM/DD/YYYY", () => {
		expect(
			DateConversion.unixTimeToDateString(
				1704006000000,
				DateFormat.MM_DD_YYYY
			)
		).toBe("12/31/2023");
	});

	it("returns the correct date string for DD/MM/YYYY", () => {
		expect(
			DateConversion.unixTimeToDateString(
				1704006000000,
				DateFormat.DD_MM_YYYY
			)
		).toBe("31/12/2023");
	});

	it("returns the correct date string for YYYY/MM/DD", () => {
		expect(
			DateConversion.unixTimeToDateString(
				1704006000000,
				DateFormat.YYYY_MM_DD
			)
		).toBe("2023/12/31");
	});
});

describe("unixTimeToDateTimeString", () => {
	it("returns the correct date string for MM/DD/YYYY", () => {
		expect(
			DateConversion.unixTimeToDateTimeString(
				1704006000000,
				DateFormat.MM_DD_YYYY
			)
		).toBe("12/31/2023 12:00 AM");
	});

	it("returns the correct date string for DD/MM/YYYY", () => {
		expect(
			DateConversion.unixTimeToDateTimeString(
				1704006000000,
				DateFormat.DD_MM_YYYY
			)
		).toBe("31/12/2023 12:00 AM");
	});

	it("returns the correct date string for YYYY/MM/DD", () => {
		expect(
			DateConversion.unixTimeToDateTimeString(
				1704006000000,
				DateFormat.YYYY_MM_DD
			)
		).toBe("2023/12/31 12:00 AM");
	});
});