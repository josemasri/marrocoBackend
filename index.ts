import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import Server from "./classes/server";
import productRoutes from './routes/product';
import fileUpload from 'express-fileupload';


const server = new Server;


// Middlewares
server.app.use(cors());
server.app.use(bodyParser.urlencoded({limit: '200mb', extended: false }));
server.app.use(bodyParser.json());
server.app.use(fileUpload());

// App routes
server.app.use('/product', productRoutes);

// Connect mongoose
mongoose.connect('mongodb://localhost:27017/marrocoshop', {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if (err) {
        throw err;
    }
    console.log('DB Online');
});

// Start express

server.start(() => {
    console.log(`Server running on port ${server.port}`);
});

