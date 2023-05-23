const app = require('./app')

const port = process.env.PORT || 3000

//Listen server
app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})
