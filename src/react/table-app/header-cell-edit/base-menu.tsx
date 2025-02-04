import Divider from "src/react/shared/divider";
import MenuItem from "src/react/shared/menu-item";
import Padding from "src/react/shared/padding";
import Stack from "src/react/shared/stack";
import { CellType, SortDir } from "src/shared/types/types";
import { SubmenuType } from "./types";
import { useCompare, useInputSelection } from "src/shared/hooks";
import { getDisplayNameForCellType } from "src/shared/table-state/display-name";
import { css } from "@emotion/react";
import { getTableBackgroundColor, getTableBorderColor } from "src/shared/color";
import React from "react";
import Flex from "src/react/shared/flex";
import Switch from "src/react/shared/switch";
import Text from "src/react/shared/text";
import { MenuCloseRequest } from "src/shared/menu/types";

interface Props {
	canDeleteColumn: boolean;
	columnId: string;
	shouldWrapOverflow: boolean;
	columnName: string;
	cellId: string;
	columnType: CellType;
	columnSortDir: SortDir;
	menuCloseRequest: MenuCloseRequest | null;
	onColumnNameChange: (value: string) => void;
	onSortClick: (value: SortDir) => void;
	onSubmenuChange: (value: SubmenuType) => void;
	onWrapOverflowToggle: (columnId: string, value: boolean) => void;
	onDeleteClick: () => void;
}

export default function BaseMenu({
	shouldWrapOverflow,
	columnName,
	columnId,
	columnType,
	columnSortDir,
	canDeleteColumn,
	onSortClick,
	onSubmenuChange,
	onWrapOverflowToggle,
	onDeleteClick,
	onColumnNameChange,
}: Props) {
	const inputRef = React.useRef<HTMLInputElement | null>(null);
	const { setPreviousSelectionStart } = useInputSelection(
		inputRef,
		columnName
	);

	function handleInputChange(
		inputValue: string,
		setSelectionToLength = false
	) {
		//When we press the menu key, an extra character will be added
		//we need to update the selection to be after this character
		//Otherwise keep the selection where it was
		if (inputRef.current) {
			if (setSelectionToLength) {
				setPreviousSelectionStart(inputValue.length);
			} else if (inputRef.current.selectionStart) {
				setPreviousSelectionStart(inputRef.current.selectionStart);
			}
		}
		onColumnNameChange(inputValue);
	}

	const tableBackgroundColor = getTableBackgroundColor();
	const tableBorderColor = getTableBorderColor();
	const hasOptions =
		columnType === CellType.DATE ||
		columnType === CellType.CURRENCY ||
		columnType === CellType.LAST_EDITED_TIME ||
		columnType === CellType.CREATION_TIME;

	return (
		<Stack spacing="sm" isVertical>
			<Stack spacing="sm" isVertical>
				<Padding px="md" py="sm">
					<input
						autoFocus
						css={css`
							background-color: ${tableBackgroundColor};
							border: 1px solid ${tableBorderColor};
							padding: 4px 10px;
							font-size: 0.95rem;
							width: 100%;
						`}
						ref={inputRef}
						value={columnName}
						onChange={(e) => handleInputChange(e.target.value)}
					/>
				</Padding>
				<MenuItem
					lucideId="list"
					name="Type"
					value={getDisplayNameForCellType(columnType)}
					onClick={() => {
						onSubmenuChange(SubmenuType.TYPE);
					}}
				/>
				{hasOptions && (
					<MenuItem
						lucideId="settings"
						name="Options"
						onClick={() => {
							onSubmenuChange(SubmenuType.OPTIONS);
						}}
					/>
				)}
			</Stack>
			<Divider />
			<MenuItem
				lucideId="arrow-up"
				name="Ascending"
				onClick={() => onSortClick(SortDir.ASC)}
				isSelected={columnSortDir === SortDir.ASC}
			/>
			<MenuItem
				lucideId="arrow-down"
				name="Descending"
				onClick={() => onSortClick(SortDir.DESC)}
				isSelected={columnSortDir === SortDir.DESC}
			/>
			{canDeleteColumn && (
				<>
					<Divider />
					<MenuItem
						lucideId="trash"
						name="Delete"
						onClick={() => onDeleteClick()}
					/>
				</>
			)}
			<Divider />
			<Padding px="lg" py="md">
				<Flex justify="space-between" align="center">
					<Text value="Wrap overflow" />
					<Switch
						isChecked={shouldWrapOverflow}
						onToggle={(value) =>
							onWrapOverflowToggle(columnId, value)
						}
					/>
				</Flex>
			</Padding>
		</Stack>
	);
}
