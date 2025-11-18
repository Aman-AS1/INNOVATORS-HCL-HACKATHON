import express from "express";
import cors from "cors";
const app= express();
import dotenv from "dotenv";
import connectDb from "./config/db.js";
dotenv.config({path:'./.env'});
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import adminRouter from "./routes/admin.route.js";
import utilsRouter from "./routes/utils.routes.js";

app.use(cors({
    origin:'http://localhost:5173'
}));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('dist'));
connectDb();






app.get('/',(req,res)=>{
    res.send("Hello World");
})


app.use('/api/v1/users',userRouter);

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/utils", utilsRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

