export const panic = (
	cause: string,
	{ removeCallerFromStack = false }: { removeCallerFromStack?: boolean } = {}
) => {
	const error = new Error(cause)
	error.stack = removeThisStackCall(error.stack)
	if (removeCallerFromStack) {
		error.stack = removeThisStackCall(error.stack)
	}
	throw error
}

const removeThisStackCall = (str: string | undefined) => {
	const [first, , ...restOfMessage] = str?.split('\n') ?? []
	return [first, ...restOfMessage].join('\n')
}
