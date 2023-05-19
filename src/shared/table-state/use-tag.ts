import { useLogger } from "../logger";
import { Color } from "../types";
import TagDeleteCommand from "../commands/tag-delete-command";
import { useTableState } from "./table-state-context";
import TagUpdateCommand from "../commands/tag-update-command";
import TagAddCommand from "../commands/tag-add-command";
import TagCellRemoveCommand from "../commands/tag-cell-remove-command";
import TagCellAddCommand from "../commands/tag-cell-add-command";
import TagCellMultipleRemoveCommand from "../commands/tag-cell-multiple-remove-command";

export const useTag = () => {
	const { doCommand } = useTableState();
	const logFunc = useLogger();

	function handleTagAdd(
		cellId: string,
		columnId: string,
		rowId: string,
		markdown: string,
		color: Color,
		isMultiTag: boolean
	) {
		logFunc("handleTagAdd", {
			cellId,
			columnId,
			rowId,
			markdown,
			color,
			isMultiTag,
		});
		doCommand(
			new TagAddCommand(
				cellId,
				columnId,
				rowId,
				markdown,
				color,
				isMultiTag
			)
		);
	}

	function handleTagCellAdd(
		cellId: string,
		rowId: string,
		tagId: string,
		isMultiTag: boolean
	) {
		logFunc("handleTagCellAdd", {
			cellId,
			rowId,
			tagId,
			isMultiTag,
		});
		doCommand(new TagCellAddCommand(cellId, rowId, tagId, isMultiTag));
	}

	function handleTagCellRemove(cellId: string, rowId: string, tagId: string) {
		logFunc("handleTagCellRemove", {
			cellId,
			rowId,
			tagId,
		});
		doCommand(new TagCellRemoveCommand(cellId, rowId, tagId));
	}

	function handleTagCellMultipleRemove(
		cellId: string,
		rowId: string,
		tagIds: string[]
	) {
		logFunc("handleTagCellMultipleRemove", {
			cellId,
			rowId,
			tagIds,
		});
		doCommand(new TagCellMultipleRemoveCommand(cellId, rowId, tagIds));
	}

	function handleTagDeleteClick(tagId: string) {
		logFunc("handleTagDeleteClick", {
			tagId,
		});
		doCommand(new TagDeleteCommand(tagId));
	}

	function handleTagColorChange(tagId: string, color: Color) {
		logFunc("handleTagColorChange", {
			tagId,
			color,
		});
		doCommand(new TagUpdateCommand(tagId, "color", color));
	}

	return {
		handleTagCellAdd,
		handleTagAdd,
		handleTagCellRemove,
		handleTagColorChange,
		handleTagCellMultipleRemove,
		handleTagDeleteClick,
	};
};