const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//Routes
const todosRoutes = require('./routes/api/todos_controller');
const labelsRoutes = require('./routes/api/labels_controller');

//env config
dotenv.config();

const app = express();

//BodyParser Middleware 
app.use(express.json());
app.use(cors());

//User routes 
app.use('/api/todos', todosRoutes);
app.use('/api/labels', labelsRoutes);

//connect to mongo
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));

const PORT = process.env.HTTP_PORT;

app.listen(PORT, () => console.log(`Server run at port ${PORT}`));