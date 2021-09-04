const mongoose=require('mongoose');

mongoose.connect('mongodb://localhost:27017/jwttokenUsers')
.then(() => {
    console.log('Database connected');
}).catch(err=>{
    console.log(err)
});

