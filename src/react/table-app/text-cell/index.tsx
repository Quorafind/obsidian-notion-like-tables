import { useRenderMarkdown } from "src/shared/markdown/hooks";
import { useOverflow } from "src/shared/spacing/hooks";
import "./styles.css";
interface Props {
	markdown: string;
	shouldWrapOverflow: boolean;
}

export default function TextCell({ markdown, shouldWrapOverflow }: Props) {
	const { containerRef, markdownRef, appendOrReplaceFirstChild } =
		useRenderMarkdown(markdown, shouldWrapOverflow);

	const overflowStyle = useOverflow(shouldWrapOverflow);
	return (
		<div className="NLT__text-cell" css={overflowStyle}>
			<div
				ref={(node) => {
					containerRef.current = node;
					appendOrReplaceFirstChild(node, markdownRef.current);
				}}
			/>
		</div>
	);
}
