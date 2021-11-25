const express =required('express')

const app =express()

app.get('', (req,res) => {
    res.sendFile(__dirname+ '/index.html')
})

app.get('/about',(req,res) => {
    res.send(<h1> this is about page</h1>)
})

app.listen(3000, () => {
        console.log('app.js')
 })