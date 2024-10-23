import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import categoryRoute from "./routes/route.category.js";
import connectDB from "./config/db.js";
import { v2 as cloudinary } from 'cloudinary';
// Environment Variable configuration
dotenv.config();


cloudinary.config({ 
cloud_name: 'dgtfws9hh', 
    api_key: '568544827222935', 
    api_secret: `${process.env.CLOUDINARY_SECRET}` // Click 'View API Keys' above to copy your API secret
});

const app = express();


// Middlewares
app.use(cors());
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static('public'));
app.use(cookieParser());

// app.use(errorHandler)



// app.use(Routes)
app.use('/api/category', categoryRoute)


// Database Connection 
connectDB();

// Routes
app.get('/', () => console.log(`working at port ${process.env.PORT}`));



app.listen(process.env.PORT)
// let person = {
//     name: 'some',
//     age : 21,
//     print:()=>{
//         console.log(`${this.name} is ${this.age} yrs old `)
//     }
// }
// person.print()