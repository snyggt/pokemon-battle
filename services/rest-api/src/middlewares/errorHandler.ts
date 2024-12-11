import { Request, Response, NextFunction } from 'express'

interface HttpError extends Error {
	status?: number
}

export const errorHandler = (
	err: HttpError,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	const status = err.status || 500
	const message = err.message || 'Empty error message'
	console.error({ status, message }, 'Unexpected error')
	res.status(status).json({ success: false, message: 'Internal Server Error' })
}
