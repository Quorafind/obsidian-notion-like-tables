import esbuild from "esbuild";
import process from "process";
import builtins from "builtin-modules";
import * as fs from "fs";

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/
`;

const prod = process.argv[2] === "production";

esbuild
	.build({
		banner: {
			js: banner,
		},
		entryPoints: ["src/main.ts"],
		bundle: true,
		external: [
			"obsidian",
			"electron",
			"@codemirror/autocomplete",
			"@codemirror/closebrackets",
			"@codemirror/collab",
			"@codemirror/commands",
			"@codemirror/comment",
			"@codemirror/fold",
			"@codemirror/gutter",
			"@codemirror/highlight",
			"@codemirror/history",
			"@codemirror/language",
			"@codemirror/lint",
			"@codemirror/matchbrackets",
			"@codemirror/panel",
			"@codemirror/rangeset",
			"@codemirror/rectangular-selection",
			"@codemirror/search",
			"@codemirror/state",
			"@codemirror/stream-parser",
			"@codemirror/text",
			"@codemirror/tooltip",
			"@codemirror/view",
			...builtins,
		],
		format: "cjs",
		watch: prod
			? false
			: {
					onRebuild(error) {
						if (error) console.error("watch build failed:", error);
						else
							fs.rename("main.css", "styles.css", (err) => {
								if (err) console.log(err);
							});
					},
			  },
		target: "es2016",
		logLevel: "info",
		sourcemap: !prod,
		treeShaking: true,
		outfile: "main.js",
	})
	.then(() => {
		if (prod) {
			fs.rename("main.css", "styles.css", (err) => {
				if (err) console.log(err);
			});
		}
	})
	.catch(() => process.exit(1));
