import { moment } from "obsidian";
import { ExportType } from "./types";

export const getBlobTypeForExportType = (type: ExportType) => {
	switch (type) {
		case ExportType.CSV:
			return "text/csv";
		case ExportType.MARKDOWN:
			return "text/markdown";
		default:
			throw new Error(`Unknown export type: ${type}`);
	}
};

export const getExportFileName = (viewFileName: string) => {
	const replaceSlash = viewFileName.replace(/\//g, "-");
	const replaceSpaces = replaceSlash.replace(/ /g, "_");
	const timestamp = moment().format("YYYY_MM_DD-HH_mm_ss");
	return replaceSpaces + "-" + timestamp;
};

export const downloadFile = (
	fileName: string,
	blobType: string,
	data: string
) => {
	//Create a blob object
	const blob = new Blob([data], { type: blobType });
	const url = window.URL.createObjectURL(blob);

	//Create a link element
	const el = document.createElement("a");
	el.setAttribute("href", url);
	el.setAttribute("download", fileName);
	el.style.display = "none";

	//Add the link element to the DOM
	document.body.appendChild(el);
	el.click();

	//Remove the link element from the DOM
	document.body.removeChild(el);
};
