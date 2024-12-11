import express from 'express'
import { createBattleHandler } from './handlers/battleRequestHandler'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.use('/api/v1/battle', createBattleHandler)
app.use(errorHandler)

export default app
