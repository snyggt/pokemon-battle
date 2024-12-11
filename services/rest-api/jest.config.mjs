import base from '@snyggt/base/jest'

export default {
	...base,
	modulePaths: ['src'],
	moduleNameMapper: {
		'@infra/*': '@snyggt/pokemon-battle-infra',
		'@app/*': 'identity-obj-proxy',
	},
}
