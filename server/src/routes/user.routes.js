import { Router } from "express";
import { registerUser } from "../controller/user.controller";


const router=Router()

router.route("./register_user").post(registerUser)