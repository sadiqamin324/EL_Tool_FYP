import { Router } from "express";

const router=Router()

router.route("./register_user").post(registerUser)