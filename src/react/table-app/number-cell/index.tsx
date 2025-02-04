import { useOverflow } from "src/shared/spacing/hooks";

import "./styles.css";
import { isNumber } from "src/shared/validators";

interface Props {
	value: string;
	shouldWrapOverflow: boolean;
}

export default function NumberCell({ value, shouldWrapOverflow }: Props) {
	const overflowStyle = useOverflow(shouldWrapOverflow);

	let valueString = "";
	if (isNumber(value)) valueString = value;

	return (
		<div className="NLT__number-cell" css={overflowStyle}>
			{valueString}
		</div>
	);
}
