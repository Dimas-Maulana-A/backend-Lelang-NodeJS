const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const cors = require('cors')

const app = express()
dotenv.config()

app.use(express())
app.use(bodyParser.json())
app.use(cors())

const Role = require('./controller/role/role.router')
app.use('/api/role', Role)

const User = require('./controller/user/user.router')
app.use('/api/user', User)

const Product = require('./controller/product/product.router')
app.use('/api/product', Product)

const Transaction = require('./controller/transaction/transaction.router')
app.use('/api/transaction', Transaction)

app.listen(8888, ()=> console.log('server run at port 8888'))