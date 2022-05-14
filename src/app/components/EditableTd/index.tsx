import React, { useState, useEffect, useCallback, useRef } from "react";
import { Notice } from "obsidian";

import CellEditMenu from "../CellEditMenu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";

import { randomColor } from "src/app/services/random";
import { addPound } from "src/app/services/string/adders";
import { Tag } from "src/app/services/appData/state/tag";

import { CELL_TYPE } from "../../constants";

import "./styles.css";
import { Cell } from "src/app/services/appData/state/cell";

interface Props {
	cell: Cell;
	width: string;
	isFocused: boolean;
	tags: Tag[];
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (
		cellId: string,
		shouldLock: boolean,
		...rest: any
	) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	onFocusClick: (cellId: string) => void;
	onOutsideClick: () => void;
}

export default function EditableTd({
	cell,
	width,
	isFocused,
	tags,
	onOutsideClick,
	onRemoveTagClick,
	onTagClick,
	onFocusClick,
	onContentChange,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");
	const closingMenu = useRef(false);

	const initialCellMenuState = {
		isOpen: false,
		top: 0,
		left: 0,
		width: "",
		height: "",
		tagColor: "",
	};
	const [cellMenu, setCellMenu] = useState(initialCellMenuState);

	const content = cell.toString();
	const { id, headerId, type, expectedType } = cell;

	useEffect(() => {
		if (isFocused) {
			if (cellMenu.isOpen) return;
			openMenu();
		} else {
			if (!cellMenu.isOpen) return;
			closeMenu();
		}
	}, [isFocused, cellMenu.isOpen]);

	const tdRef = useCallback(
		(node) => {
			if (node) {
				if (node instanceof HTMLElement) {
					//Set timeout to overcome bug where all values in the node are 0
					//See: https://github.com/facebook/react/issues/13108
					setTimeout(() => {
						setCellMenu((prevState) => {
							const { width, height } =
								node.getBoundingClientRect();

							function findWidth() {
								switch (type) {
									case CELL_TYPE.TAG:
										return "fit-content";
									case CELL_TYPE.TEXT:
										return `${width}px`;
									default:
										return `${width}px`;
								}
							}

							function findHeight() {
								switch (type) {
									case CELL_TYPE.TEXT:
									case CELL_TYPE.TAG:
										return "fit-content";
									case CELL_TYPE.NUMBER:
										return "3rem";
									default:
										return `${height}px`;
								}
							}
							return {
								...prevState,
								width: findWidth(),
								height: findHeight(),
							};
						});
					}, 1);
				}
			}
		},
		[inputText, cellMenu.isOpen]
	);

	function handleTabPress() {
		updateContent(true);
	}

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		try {
			let text = content;
			if (type === CELL_TYPE.TAG) {
				const tag = tags.find((tag) => tag.selected.includes(id));
				text = addPound(tag.content);
			}
			await navigator.clipboard.writeText(text);
			new Notice("Cell text copied");
		} catch (err) {
			console.log(err);
		}
	}

	function handleCellClick(e: React.MouseEvent<HTMLElement>) {
		const el = e.target as HTMLInputElement;

		//If we clicked on the link for a file or tag, return
		if (el.nodeName === "A") return;
		if (type === CELL_TYPE.ERROR) return;

		onFocusClick(id);
		//openMenu();
	}

	function closeMenu() {
		setCellMenu(initialCellMenuState);
	}

	function openMenu() {
		setCellMenu((prevState) => {
			return {
				...prevState,
				isOpen: true,
				left: -10,
				top: -5,
				tagColor: randomColor(),
			};
		});
		setInputText(content);
	}

	function handleAddTag(text: string) {
		onAddTag(id, headerId, text, cellMenu.tagColor);
		setInputText("");
		onOutsideClick();
	}

	function handleTagClick(id: string) {
		onTagClick(id, id);
		onOutsideClick();
	}

	function updateContent(shouldLock: boolean) {
		if (content !== inputText) {
			switch (type) {
				case CELL_TYPE.TEXT:
					onContentChange(id, shouldLock, inputText);
					setInputText("");
					break;
				case CELL_TYPE.NUMBER:
					onContentChange(id, shouldLock, parseInt(inputText));
					setInputText("");
					break;
				case CELL_TYPE.DATE:
					onContentChange(id, shouldLock);
					setInputText("");
					break;
				//TODO add lock
				case CELL_TYPE.TAG: {
					const tag = tags.find((tag) => tag.content === inputText);
					if (tag) {
						onTagClick(id, tag.id);
					} else {
						onAddTag(id, headerId, inputText, cellMenu.tagColor);
					}
					setInputText("");
					break;
				}
				default:
					break;
			}
		}
	}

	function handleOutsideClick() {
		closingMenu.current = true;
		onOutsideClick();
	}

	//Synchronous handler
	//Runs after handle outside click
	useEffect(() => {
		if (closingMenu.current && !isFocused) {
			//Set updated false
			//handle update
			closingMenu.current = false;
			updateContent(false);
		}
	}, [isFocused, closingMenu.current]);

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
			case CELL_TYPE.DATE:
				return <TextCell content={content} />;
			case CELL_TYPE.TAG: {
				const tag = tags.find((tag) => tag.selected.includes(id));
				if (tag)
					return (
						<TagCell
							style={{ overflow: "hidden" }}
							content={tag.content}
							color={tag.color}
							showLink={true}
						/>
					);
				return <></>;
			}
			case CELL_TYPE.ERROR:
				return <ErrorCell type={expectedType} />;
			default:
				return <></>;
		}
	}

	let tdClassName = "NLT__td";
	if (type === CELL_TYPE.NUMBER) tdClassName += " NLT__td--number";

	return (
		<td
			className={tdClassName}
			ref={tdRef}
			onClick={handleCellClick}
			onContextMenu={handleCellContextClick}
		>
			<CellEditMenu
				style={{
					minWidth: type === CELL_TYPE.TAG ? "15rem" : "100px",
					height: cellMenu.height,
					width: cellMenu.width,
					top: `${cellMenu.top}px`,
					left: `${cellMenu.left}px`,
				}}
				isOpen={cellMenu.isOpen}
				cellType={type}
				tags={tags}
				cellId={id}
				tagColor={cellMenu.tagColor}
				inputText={inputText}
				onInputChange={setInputText}
				onOutsideClick={handleOutsideClick}
				onTabPress={handleTabPress}
				onAddTag={handleAddTag}
				onRemoveTagClick={onRemoveTagClick}
				onTagClick={handleTagClick}
			/>
			<div className="NLT__td-content-container" style={{ width }}>
				{renderCell()}
			</div>
		</td>
	);
}
