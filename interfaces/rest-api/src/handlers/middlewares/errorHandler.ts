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
	const message = err.message || 'Internal Server Error'
	res.status(status).json({ success: false, message })
}
