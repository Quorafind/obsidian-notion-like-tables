import { BodyRow } from "../types/types";
import { RowNotFoundError } from "./table-error";

export const rowLastEditedTime = (rows: BodyRow[], rowId: string) => {
	const row = rows.find((row) => row.id === rowId);
	if (!row) throw new RowNotFoundError(rowId);
	return row.lastEditedTime;
};

export const rowLastEditedTimeUpdate = (
	rows: BodyRow[],
	rowId: string,
	time = Date.now()
): BodyRow[] => {
	return rows.map((row) => {
		if (row.id === rowId) {
			return {
				...row,
				lastEditedTime: time,
			};
		}
		return row;
	});
};
