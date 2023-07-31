module.exports = class UserDto {
    username
    organization
    email
    name
    surname
    avatar
    isActivated
    id

    constructor(model) {
        this.name = model.name
        this.surname = model.surname
        this.email = model.email
        this.id = model._id
        this.isActivated = model.isActivated
        this.avatar = model.avatar
        this.username = model.username
        this.organization = model.organization
    }
}