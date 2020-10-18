import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import orphanageView from '../view/orphanages_view'
import Orphanage from '../models/Orphanage'

export default {
  async index(request: Request, response: Response) {
   try {
    const OrphanagesRepository = getRepository(Orphanage)

    const orphanages = await OrphanagesRepository.find({
      relations: ['images']
    })

    return response.json(orphanageView.renderMany(orphanages))
   } catch (error) {
     return response.status(401).json(error)
   }
  },
  async show(request: Request, response: Response) {
    try {
      const { id } = request.params

      const OrphanagesRepository = getRepository(Orphanage)
  
      const orphanage = await OrphanagesRepository.findOneOrFail(id , {
        relations: ['images']
      })
  
      return response.json(orphanageView.render(orphanage))
    } catch (error) {
      return response.status(401).json(error)
    }
  },
  async create(request: Request, response: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = request.body 

    const OrphanagesRepository = getRepository(Orphanage)
    
    const requestImages = request.files as Express.Multer.File[];

    const images = requestImages.map(image => {
      return {
        path: image.filename,
      }
    });

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    }

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(Yup.object().shape({
        path: Yup.string().required()
      }))
    })

    await schema.validate(data, {
      abortEarly: false
    })

    const orphanage = OrphanagesRepository.create(data)

    await OrphanagesRepository.save(orphanage)

    return response.status(201).send(orphanage)
     
  }
}