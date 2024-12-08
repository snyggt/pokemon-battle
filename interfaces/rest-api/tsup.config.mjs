import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/server.ts'],
	dts: true,
	format: ['cjs', 'esm'],
	treeshake: true,
	platform: 'node',
	loader: {
		'.node': 'file',
	},
})
