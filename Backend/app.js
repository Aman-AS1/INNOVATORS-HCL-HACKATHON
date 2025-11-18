import express from "express";

const app = express(); //gives methods of express to the object app

import patientRouter from "./routes/patientRoutes.js";

app.use("/api/v1/patient", patientRouter);

export default app;
