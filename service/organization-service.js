const OrganizationModel = require('../models/schemas/organization-model')
const ApiError = require('../exceptions/api-error')
const {Types} = require('mongoose')

const s3 = require('./YC-service')
const OrganizationDto = require('../dtos/organization-dto')

class OrganizationService {
    async registration({nickname, created_at, ...props}, uploadedLogo) {
        const candidateCreated_at = await OrganizationModel.findOne({created_at})
        if (candidateCreated_at) {
            if (candidateCreated_at.approved) {
                throw ApiError.BadRequest(`У вас уже есть утвержденный питомник - ${candidateCreated_at.nickname}, на данный момент нельзя создавать больше одного питомника от одного аккаунта`)
            }
            throw ApiError.BadRequest(`Ваш питомник ${candidateCreated_at.nickname} в очереди на утверждение, на данный момент нельзя создавать больше одного питомника от одного аккаунта`)
        }
        
        const candidateNickname = await OrganizationModel.findOne({nickname})
        if (candidateNickname && candidateNickname.approved) {
            throw ApiError.BadRequest(`Организация с именем ${nickname} уже существует`)
        }

        const logo = uploadedLogo.length === 0 ? [] : await this.uploadLogo(uploadedLogo, nickname)

        const organization = await OrganizationModel.create({nickname, approved: false, logo, created_at, ...props})

        const organizationDto = new OrganizationDto(organization)
        //поместить в очередь на одобрение (в бот или в админ аккаунт) или уведомить о заявке
        return organizationDto
        // return 'ok'
    }

    async uploadLogo(imgData, organizationNickname) {
        const document = await OrganizationModel.findOne({nickname: organizationNickname})
        
        if (document?.logo.Key) {
            await s3.Remove(document.logo.Key)
        }
        const logo = await Promise.all(imgData.map(async image => await s3.Upload({buffer: image.buffer}, '/logo/')))
        
        return logo[0]
    }

    async getOrganizationByCreated_atId(userId) {
        const document = await OrganizationModel.findOne({created_at: userId})
        return document
    }
}

module.exports = new OrganizationService()