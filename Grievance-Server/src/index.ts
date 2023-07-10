import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { Response } from 'express';
import { AuthMiddleWare } from './middleware/AuthMiddleware';
import { changeGrievanceStatusController, getGrievancesController } from './controllers/GrievancesControllers';
import { statusOkay } from './views/view';
import { deleteController, issueToken, loginController } from './controllers/AuthControllers';
import { postUserGrievancesController } from './controllers/userControllers/GrievancesControllers';
import { changePasswordController, checkOTPController, sendOTPController } from './controllers/PasswordControllers';
import getAdminTagsController from './controllers/getAdminTagsController';
import getProfileDataController from './controllers/getProfileDataController';
import compression from 'compression';
import { registerUserController } from './controllers/userControllers/AuthControllers';
import { registerAdminController } from './controllers/adminControllers/AuthControllers';
import { redisClient } from './redisClient';

config();
const app = express();
app.use(express.json());
app.use(cors());
// Uncomment in the final commit
// app.use(cors({
//     origin: "https://vitb-grievances.aayush65.com/"
// }));
app.use(compression({ level: 6, threshold: 1024 }));


app.get('/ping', (_, res: Response) => statusOkay(res, {message: "Server Running"}));
app.get('/accesstoken', issueToken);
app.get('/forget-password/:no', sendOTPController);
app.post('/otp-check', checkOTPController);
app.post('/login', loginController);
app.post('/register', registerUserController);
app.get('/tags', getAdminTagsController);

app.use(AuthMiddleWare);

app.get('/grievances', getGrievancesController);
app.post('/grievances', postUserGrievancesController);
app.post('/grievances/change-status/', changeGrievanceStatusController),
app.delete('/grievances/:no', deleteController);

app.get('/profile', getProfileDataController);
app.post('/register-admins', registerAdminController);
app.post('/change-password', changePasswordController);
app.delete('/delete/:no', deleteController);

mongoose.connect(process.env.MONGO_URL!)
    .then(() => {
        console.clear();
        console.log(`Connected to MongoDB and Listening on Port ${process.env.PORT}`);
        app.listen(process.env.PORT);
    })
    .then(() => redisClient.on('error', err => console.log('Redis Client', err)))
    .then(() => redisClient.connect())
    .then(() => console.log('Connected to Redis'))
    .catch((err) => {
        console.clear();
        console.log("Can't connect to the MongoDB");
        console.log(err);
    })