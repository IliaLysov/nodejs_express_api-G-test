module.exports = class OrganizationDto {
    name
    nickname
    description
    email
    site
    whatsApp
    telegram
    approved
    logo
    created_at
    editors
    id

    constructor(model) {
        this.name = model.name
        this.nickname = model.nickname
        this.nickname = model.nickname
        this.email = model.email
        this.site = model.site
        this.whatsApp = model.whatsApp
        this.telegram = model.telegram
        this.approved = model.approved
        this.logo = model.logo
        this.created_at = model.created_at
        this.editors = model.editors
        this.id = model._id
    }
}