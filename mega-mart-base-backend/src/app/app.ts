import cors from "cors";
import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import notFound from "./middlewares/notFound";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import router from "./routes";
import expressSession from "express-session";
import passport from "passport";
import config from "./config";
import "./../app/config/passport";
const app: Application = express();

app.use(
  expressSession({
    secret: config.EXPRESS_SESSION as string,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//parsers
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true })); 

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://mega-mart-base-customer.vercel.app',
      'https://mega-mart-base-admin-panel.vercel.app',
      'https://dressen-admin-panel-dev.vercel.app',
      'https://dressen-home-dev.vercel.app',
       'https://faymo-customer.vercel.app',
      'https://faymo-admin-panel.vercel.app',
      'https://admin.faymo.shop',
      'https://admin.faymo.store',
      'https://www.faymo.shop',
      'https://www.faymo.store',
      'https://syed-aowlia-online-website-customer-psi.vercel.app',
      'https://syed-aowlia-online-website-admin-12.vercel.app'
    ],
    credentials: true,
  })
);

//app routes
app.use("/api/v1", router);

//root route
app.get("/", (req: Request, res: Response) => {
  res.send("MegaMart server boosted on....🔥🔥🚀");
});

// //global error handler
app.use(globalErrorHandler);

// //not found route
app.use(notFound);

export default app;
