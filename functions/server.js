/*
 * Copyright (c) 2019. Orchestra-team.
 */

import Koa from "koa";
import KoaRouter from "koa-router";
import koaCors from "@koa/cors";
import bodyParser from "koa-bodyparser";
import { graphqlHTTP } from "./graph/graphql";
import { BaseModel } from "./models/baseModel";
import fbadmin from "firebase-admin";
import { heartbeatController } from "./controllers/heartbeat";

const app = new Koa();
const router = new KoaRouter();
const serviceAccount = require("./orchestra-suncode-firebase-adminsdk-mfqkb-83ab056f09");
fbadmin.initializeApp({
  credential: fbadmin.credential.cert(serviceAccount),
  databaseURL: "https://orchestra-suncode.firebaseio.com"
});

// for the front
router.all("graphql", "/graphql", graphqlHTTP);
// for the back
router.post("/heartbeat", heartbeatController);
router.post("/config", ctx => {});

app
  .use(async (ctx, next) => {
    ctx.db = new BaseModel(fbadmin);
    return next();
  })

  .use(bodyParser())
  .use(koaCors())
  .use(router.routes())
  .use(router.allowedMethods({ throw: true }));

const start = async () => {
  app.listen(8088);
  app.on("error", (err, ctx) => {
    console.error(err);
  });
  console.info("Listening on 8088");
};

(async () => {
  await start();
})();
