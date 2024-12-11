import express from 'express'
import { postCreateBattleHandler } from './handlers/postCreateBattleHandler'
import { errorHandler } from './middlewares/errorHandler'
import { getAllPokemonsHandler } from './handlers/getAllPokemonsHandler'

const app = express()

app.use(express.json())
app.post('/api/v1/battle', postCreateBattleHandler)
app.get('/api/v1/pokemon', getAllPokemonsHandler)
app.use(errorHandler)

export default app
