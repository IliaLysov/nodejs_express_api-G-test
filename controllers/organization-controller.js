const organizationService = require('../service/organization-service')
const userService = require('../service/user-service')


class OrganizationController {
    async registration(req, res, next) {
        try {
            const logo = req.files
            const organizationData = req.body
            organizationData.created_at = req.user.id
            const uploadedOrganization = await organizationService.registration(organizationData, logo)
            await userService.setOrganization(req.user.id, uploadedOrganization.id)
            return res.json(uploadedOrganization)
        } catch (e) {
            next(e)
        }
    }
}

module.exports = new OrganizationController()