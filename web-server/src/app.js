import fs from 'fs';
import path from 'path';

import Koa from 'koa';
import Router from 'koa-router';
import Helmet from 'koa-helmet';
import Cors from '@koa/cors';
import BodyParser from 'koa-bodyparser';
import Logger from 'koa-logger';
import serve from 'koa-static';
import mount from 'koa-mount';
import views from 'koa-views';

import connectToDB from 'database/utils/connect';

import ApolloServer from './graphql-api/index.js';

import { passport, SteamAuth } from './auth/index.js';

const inProduction = process.env.NODE_ENV;

connectToDB();

const app = new Koa();
const router = new Router();

app.use(Helmet());
app.use(Cors());
app.use(
  BodyParser({
    enableTypes: ['json'],
    jsonLimit: '5mb',
    strict: true,
    onerror: function(err, ctx) {
      if (err) console.log(err);
      ctx.throw('body parse error', 422);
    }
  })
);

if (!inProduction) app.use(Logger());

app.use(passport.initialize());

const clientPath = path.join('../../client');

if (inProduction)
  app.use(mount('/static', serve(path.join(clientPath, '/build/static'))));
else app.use(serve(path.join(clientPath, '/public')));

if (inProduction) app.use(views(path.join(clientPath, '/build')));

ApolloServer.applyMiddleware({ app });

router.use('/auth', SteamAuth.routes(), SteamAuth.allowedMethods());

if (inProduction) {
  router.get('/manifest.json', async ctx => {
    ctx.body = fs.readFileSync(path.join(clientPath, '/build/manifest.json'));
  });

  router.get('/favicon.png', async ctx => {
    ctx.body = fs.readFileSync(path.join(clientPath, '/build/favicon.png'));
  });

  router.get('*', async ctx => {
    await ctx.render('index.html', {});
  });
}

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
