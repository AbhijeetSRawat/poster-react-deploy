import express, { urlencoded } from 'express';

import path from 'path';
import cors from 'cors'
import { connectionDataBase } from './dbConnection/database_connection.js';
import { fileURLToPath } from 'url';
import { app } from './app/app.js';

import {productRoutes} from "./routes/productRoutes.js";
import { userRoutes2 } from './routes/UserRoutes2.js';
import { userRoutes } from './routes/userRoutes.js';
// import { userRoutes } from './routes/userRoutes.js';
import dotenv from 'dotenv';
import { cloudinaryConnect } from './config/cloudinary.js';
import fileUpload from 'express-fileupload';
dotenv.config();

app.use(cors({ origin: 'http://localhost:5173',credentials:true }));


//Middleware
// app.use(fileUpload({
//   useTempFiles: true,
//   tempFileDir: '/tmp/',
// }));
app.use(express.json());
app.use(urlencoded({extended: false}))
cloudinaryConnect();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Static files serving


app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use(express.static(path.join(__dirname, "../")));

// Home route to send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});



connectionDataBase()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`App is Listening On Url http://localhost:${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database connection failed. Server not started:", error);
    });

    app.use("",productRoutes);
    app.use("",userRoutes);
    app.use("",userRoutes2);

