const {SHA256} = require('crypto-js')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const password = '123abc!'

// bcrypt.genSalt(10, (err, salt)=>{
//     bcrypt.hash(password, salt, (err, hash)=>{
//         console.log(hash)
//     })
// })

const hashedPassword = '$2a$10$wEo17TwHV/AS4iTUcaBJ4uHGFsAtg0fRJlEsCSMVV/AEp5Egq1OIW'

bcrypt.compare(password, hashedPassword, (err, res)=>{
    console.log(res)
})