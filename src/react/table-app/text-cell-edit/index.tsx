import React from "react";

import { TFile } from "obsidian";

import { useCompare, useInputSelection } from "src/shared/hooks";
import { useOverflow } from "src/shared/spacing/hooks";

import { useMenu } from "src/shared/menu/hooks";
import { useMenuTriggerPosition, useShiftMenu } from "src/shared/menu/utils";
import { MenuCloseRequest, MenuLevel } from "src/shared/menu/types";
import SuggestMenu from "../../shared/suggest-menu/suggest-menu";
import {
	addClosingBracket,
	doubleBracketsInnerReplace,
	getFilterValue,
	isSurroundedByDoubleBrackets,
	removeClosingBracket,
} from "../../shared/suggest-menu/utils";
import { isSpecialActionDown } from "src/shared/keyboard-event";

import "./styles.css";

interface Props {
	menuCloseRequest: MenuCloseRequest | null;
	value: string;
	shouldWrapOverflow: boolean;
	onChange: (value: string) => void;
	onMenuClose: () => void;
}

export default function TextCellEdit({
	shouldWrapOverflow,
	menuCloseRequest,
	value,
	onChange,
	onMenuClose,
}: Props) {
	const {
		menu,
		isMenuOpen,
		menuRef,
		openMenu,
		forceCloseAllMenus,
		closeTopMenu,
	} = useMenu(MenuLevel.TWO);
	const { triggerRef, triggerPosition } = useMenuTriggerPosition();
	useShiftMenu(triggerRef, menuRef, isMenuOpen, {
		topOffset: 35,
	});

	const [localValue, setLocalValue] = React.useState(value);
	const inputRef = React.useRef<HTMLTextAreaElement | null>(null);
	const { setPreviousSelectionStart, previousSelectionStart } =
		useInputSelection(inputRef, localValue);

	const previousValue = React.useRef("");

	const hasCloseRequestTimeChanged = useCompare(
		menuCloseRequest?.requestTime
	);

	React.useEffect(() => {
		if (hasCloseRequestTimeChanged && menuCloseRequest !== null) {
			onChange(localValue);
			onMenuClose();
		}
	}, [localValue, hasCloseRequestTimeChanged, menuCloseRequest, onMenuClose]);

	function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
		const el = e.target as HTMLTextAreaElement;

		if (e.key === "Enter") {
			if (isSpecialActionDown(e)) return;
			e.preventDefault();
		} else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
			const cursorPosition = el.selectionStart;

			if (isMenuOpen) {
				//Close menu if cursor is outside of double brackets
				if (!isSurroundedByDoubleBrackets(value, cursorPosition))
					closeTopMenu();
			}

			//Update cursor position for filterValue calculation
			setPreviousSelectionStart(cursorPosition);
		}
	}

	function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const inputValue = e.target.value;
		let newValue = inputValue;

		if (inputRef.current) {
			const inputEl = inputRef.current;

			if (inputValue.length > previousValue.current.length) {
				newValue = addClosingBracket(newValue, inputEl.selectionStart);
			} else {
				newValue = removeClosingBracket(
					previousValue.current,
					inputValue,
					inputEl.selectionStart
				);
			}

			if (
				isSurroundedByDoubleBrackets(newValue, inputEl.selectionStart)
			) {
				if (!isMenuOpen) {
					openMenu(menu);
				}
			}

			if (inputEl.selectionStart)
				setPreviousSelectionStart(inputEl.selectionStart);
		}

		previousValue.current = newValue;
		setLocalValue(newValue);
	}

	function handleSuggestItemClick(
		file: TFile | null,
		isFileNameUnique: boolean
	) {
		if (file) {
			//The basename does not include an extension
			let fileName = file.basename;
			//The name includes an extension
			if (file.extension !== "md") fileName = file.name;
			//If the file name is not unique, add the path so that the system can find it
			if (!isFileNameUnique) fileName = `${file.path}|${fileName}`;

			const newValue = doubleBracketsInnerReplace(
				localValue,
				previousSelectionStart,
				fileName
			);

			onChange(newValue);
		}
		forceCloseAllMenus();
	}

	const overflowStyle = useOverflow(shouldWrapOverflow);
	const filterValue =
		getFilterValue(localValue, previousSelectionStart) ?? "";

	return (
		<>
			<div className="NLT__text-cell-edit" ref={triggerRef}>
				<textarea
					autoFocus
					css={overflowStyle}
					ref={inputRef}
					value={localValue}
					onKeyDown={handleKeyDown}
					onChange={handleTextareaChange}
				/>
			</div>
			<SuggestMenu
				id={menu.id}
				ref={menuRef}
				isOpen={isMenuOpen}
				top={triggerPosition.top}
				left={triggerPosition.left}
				filterValue={filterValue}
				onItemClick={handleSuggestItemClick}
			/>
		</>
	);
}
