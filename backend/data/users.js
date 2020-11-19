const brcrypt = require("bcryptjs");

const users = [
    {
        name: "Mujtaba Basheer",
        email: "contact@mujtababasheer.com",
        password: brcrypt.hashSync("123456", 10),
        isAdmin: true,
    },
    {
        name: "Richard Rozzario",
        email: "richard@mujtababasheer.com",
        password: brcrypt.hashSync("123456", 10),
    },
    {
        name: "Ahaan Iqbal",
        email: "ahaan@mujtababasheer.com",
        password: brcrypt.hashSync("123456", 10),
    },
];

module.exports = users;
