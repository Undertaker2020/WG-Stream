require('dotenv/config')
const {SERVER_URL} = require("./src/libs/constants/url.constants");

module.exports = {
    service: {
        endpoint: {
            url: SERVER_URL,
            skipSSLValidation: true
        }
    }
}