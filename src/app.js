

import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
const fileStore = FileStore(session);
import exphbs from "express-handlebars";
const app = express();
const PUERTO = 8080;
import "./database.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
const miAltaClaveSecreta = "Lapepona";
app.use(cookieParser(miAltaClaveSecreta));
//Le paso la palabra secreta al middleware de Cookie Parser.
app.use(express.static("./src/public"));

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Middleware de Session: 
app.use(session({
    secret: "secretCoder",
    resave: true,
    //Esta configuración me permite mantener activa la sesion frente a la inactividad del usuario. 

    saveUninitialized: true,
    //Me permite guardar cualquier sesión aun cuando el objeto de sesion no tenga nada para contener. 

    //2) Utilizando el File Storage: 
    //store: new fileStore({path: "./src/sessions", ttl: 100000, retries:1})
    //path: la ruta en donde se van a guardar los archivitos de sesiones. 
    //ttl: Time To Live ( en segundos lo colocamos)
    //retries: cantidad de veces que el servidor tratara de leer el archivo. 

    //3)Utilizando Mongo Store
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://tavito:andajaran@cluster0.n6cfiqy.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    })
}))

//Rutas

app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);





//Listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

