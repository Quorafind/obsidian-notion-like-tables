import React, { useState, useEffect, useCallback } from "react";
import { Notice } from "obsidian";

import CellEditMenu from "../CellEditMenu";
import TextCell from "../TextCell";
import TagCell from "../TagCell";
import ErrorCell from "../ErrorCell";

import { randomColor, addPound } from "../../services/utils";
import { Tag } from "../../services/state";

import { CELL_TYPE } from "../../constants";

import "./styles.css";

interface Props {
	cellId: string;
	headerId: string;
	width: string;
	content: string;
	isFocused: boolean;
	tags: Tag[];
	type: string;
	expectedType: string | null;
	onRemoveTagClick: (cellId: string, tagId: string) => void;
	onTagClick: (cellId: string, tagId: string) => void;
	onContentChange: (
		cellId: string,
		inputText: string,
		tabPress: boolean
	) => void;
	onAddTag: (
		cellId: string,
		headerId: string,
		inputText: string,
		color: string
	) => void;
	onFocusClick: (cellId: string) => void;
}

export default function EditableTd({
	cellId,
	headerId,
	width,
	content,
	isFocused,
	tags,
	type,
	expectedType,
	onRemoveTagClick,
	onTagClick,
	onFocusClick,
	onContentChange,
	onAddTag,
}: Props) {
	const [inputText, setInputText] = useState("");

	const initialCellMenuState = {
		isOpen: false,
		top: 0,
		left: 0,
		width: "",
		height: "",
		tagColor: "",
	};
	const [cellMenu, setCellMenu] = useState(initialCellMenuState);

	useEffect(() => {
		if (isFocused) {
			if (cellMenu.isOpen) return;
			openMenu();
		}
	}, [isFocused]);

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

							return {
								...prevState,
								width:
									type === CELL_TYPE.TAG
										? "fit-content"
										: `${width}px`,
								height:
									type === CELL_TYPE.TAG
										? "fit-content"
										: `${height}px`,
							};
						});
					}, 1);
				}
			}
		},
		[content.length, cellMenu.isOpen]
	);

	function handleTabPress() {
		console.log("[HANDLER] handleTabPress");
		updateContent(true);
	}

	async function handleCellContextClick(e: React.MouseEvent<HTMLElement>) {
		try {
			let text = content;
			if (type === CELL_TYPE.TAG) {
				const tag = tags.find((tag) => tag.selected.includes(cellId));
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

		onFocusClick(cellId);
		openMenu();
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
		console.log("ADD TAG");
		onAddTag(cellId, headerId, text, cellMenu.tagColor);
		setInputText("");
		closeMenu();
	}

	function handleTagClick(id: string) {
		console.log("TAG CLICK!");
		onTagClick(cellId, id);
		closeMenu();
	}

	function updateContent(tabPress: boolean) {
		if (content !== inputText) {
			switch (type) {
				case CELL_TYPE.TEXT:
					onContentChange(cellId, inputText, tabPress);
					setInputText("");
					break;
				case CELL_TYPE.NUMBER:
					onContentChange(cellId, inputText, tabPress);
					setInputText("");
					break;
				case CELL_TYPE.TAG:
					const tag = tags.find((tag) => tag.content === inputText);
					console.log(tag);
					if (tag) {
						onTagClick(cellId, tag.id);
					} else {
						onAddTag(
							cellId,
							headerId,
							inputText,
							cellMenu.tagColor
						);
					}
					setInputText("");
					break;
				default:
					break;
			}
		}
		closeMenu();
	}

	function handleOutsideClick() {
		console.log("[HANDLER] handleOusideClick");
		updateContent(false);
	}

	function renderCell() {
		switch (type) {
			case CELL_TYPE.TEXT:
			case CELL_TYPE.NUMBER:
				return <TextCell content={content} />;
			case CELL_TYPE.TAG: {
				const tag = tags.find((tag) => tag.selected.includes(cellId));
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
					minHeight: "3rem",
					height: cellMenu.height,
					width: cellMenu.width,
					top: `${cellMenu.top}px`,
					left: `${cellMenu.left}px`,
				}}
				isOpen={cellMenu.isOpen}
				cellType={type}
				tags={tags}
				cellId={cellId}
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
