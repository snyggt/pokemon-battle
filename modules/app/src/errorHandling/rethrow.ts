import { EOL } from 'os'

export const rethrow = (msg: string) => (e: Error) => {
	console.log(e.message)
	throw aggregateError(e, msg)
}

function aggregateError(msg: string): Error

function aggregateError(
	error: Error | Record<string, unknown>,
	msg: string
): Error

function aggregateError(
	errorOrMessage: Error | Record<string, unknown> | string,
	msg?: string
) {
	const aggregatedError = new Error()
	aggregatedError.message = [
		msg,
		typeof errorOrMessage === 'string' && errorOrMessage,
		isError(errorOrMessage) && errorOrMessage.message,
		!isError(errorOrMessage) &&
			isObject(errorOrMessage) &&
			JSON.stringify(errorOrMessage),
	]
		.filter(Boolean)
		.join(' => ')

	aggregatedError.stack = isError(errorOrMessage)
		? (replaceStackHeader(errorOrMessage.stack, aggregatedError.message) ?? '')
		: removeThisStackCall(aggregatedError?.stack)

	return aggregatedError
}

const removeThisStackCall = (str: string | undefined) => {
	const [first, , ...restOfMessage] = str?.split(EOL) ?? []
	return [first, ...restOfMessage].join(EOL)
}

const replaceStackHeader = (
	oldStack: string | undefined,
	newHeaderMessage: string
) => {
	const [, ...restOfMessage] = oldStack?.split(EOL) ?? []
	return `Error: ${newHeaderMessage}${EOL}${restOfMessage.join(EOL)}`
}

const isError = (e: unknown): e is Error => e instanceof Error

const isObject = (
	possibleObject: unknown
): possibleObject is Record<string, unknown> =>
	possibleObject !== null &&
	possibleObject !== undefined &&
	typeof possibleObject === 'object'
