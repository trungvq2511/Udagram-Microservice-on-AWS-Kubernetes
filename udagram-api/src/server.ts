import cors from 'cors';
import express from 'express';
import {sequelize} from './sequelize';

import {IndexRouter} from './controllers/v0/index.router';

import bodyParser from 'body-parser';
import {config} from './config/config';
import {V0_FEED_MODELS, V0_USER_MODELS} from './controllers/v0/model.index';


(async () => {
  //Check environment variables
  console.log('POSTGRES_USERNAME=' + process.env.POSTGRES_USERNAME)
  console.log('POSTGRES_PASSWORD=' + process.env.POSTGRES_PASSWORD)
  console.log('POSTGRES_HOST=' + process.env.POSTGRES_HOST)
  console.log('POSTGRES_DB=' + process.env.POSTGRES_DB)
  console.log('AWS_BUCKET=' + process.env.AWS_BUCKET)
  console.log('AWS_REGION=' + process.env.AWS_REGION)
  console.log('AWS_PROFILE=' + process.env.AWS_PROFILE)
  console.log('JWT_SECRET=' + process.env.JWT_SECRET)
  console.log('URL=' + process.env.URL)
  await sequelize.addModels(V0_FEED_MODELS);
  await sequelize.addModels(V0_USER_MODELS);

  console.debug("Initialize database connection...");
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080;

  app.use(bodyParser.json());

  // We set the CORS origin to * so that we don't need to
  // worry about the complexities of CORS this lesson. It's
  // something that will be covered in the next course.
  app.use(cors({
    allowedHeaders: [
      'Origin', 'X-Requested-With',
      'Content-Type', 'Accept',
      'X-Access-Token', 'Authorization',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    origin: '*',
  }));

  app.use('/api/v0/', IndexRouter);

  // Root URI call
  app.get( '/', async ( req, res ) => {
    res.send( '/api/v0/' );
  } );


  // Start the Server
  app.listen( port, () => {
    console.log( `server running ${config.url}` );
    console.log( `press CTRL+C to stop server` );
  } );
})();
