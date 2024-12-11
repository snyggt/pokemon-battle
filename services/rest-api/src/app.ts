import express from 'express'
import { postCreateBattleHandler } from './handlers/postCreateBattleHandler'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.post('/api/v1/battle', postCreateBattleHandler)
app.use(errorHandler)

export default app
