import express, { response } from 'express';
import { getRepository } from 'typeorm'
import './database/connection'

import Orphanage from './models/Orphanage'

const app = express()
app.use(express.json())

app.post("/orphanages", async (request, response) => {
	try {
		const {
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends
		} = request.body 

		console.log(request.body )

		const OrphanagesRepository = getRepository(Orphanage)

		const orphanage = OrphanagesRepository.create({
			name,
			latitude,
			longitude,
			about,
			instructions,
			opening_hours,
			open_on_weekends
		})

		await OrphanagesRepository.save(orphanage)

		return response.send(orphanage)
	} catch (error) {
		console.log(error)
		return response.status(401).send("erro")

	}
})

app.listen(3333)