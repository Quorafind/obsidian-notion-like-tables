import { useTableState } from "src/shared/table-state/table-state-context";
import { useDragContext } from "src/shared/dragging/drag-context";
import { dropDrag, getRowId } from "src/shared/dragging/utils";

interface TableBodyRowProps {
	children?: React.ReactNode;
}

export default function TableBodyRow({
	children,
	...props
}: TableBodyRowProps) {
	const { tableState, setTableState } = useTableState();
	const { dragData, setDragData } = useDragContext();

	function handleDragStart(e: React.DragEvent) {
		const el = e.target as HTMLElement;

		const rowId = getRowId(el);
		if (!rowId) return;

		setDragData({
			type: "row",
			id: rowId,
		});
	}

	function handleDragEnd(e: React.DragEvent) {
		const el = e.target as HTMLElement;
		el.draggable = false;
		setDragData(null);
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();

		//The target will be the td element
		//The current target will be the parent tr element
		const target = e.currentTarget as HTMLElement;

		const targetId = getRowId(target);
		if (!targetId) return;

		dropDrag(targetId, dragData, tableState, setTableState);
	}

	function handleDragOver(e: React.DragEvent) {
		//Alow drop
		e.preventDefault();
	}

	return (
		<tr
			onDrop={handleDrop}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
			onDragOver={handleDragOver}
			{...props}
		>
			{children}
		</tr>
	);
}
