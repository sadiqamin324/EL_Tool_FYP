import express from "express"
 
const app=express()

app.use(express.json())
import userRouter from ".backend/src/routes/user.routes.js";

app.use("/api/v1/users", userRouter)
export{
    app
}