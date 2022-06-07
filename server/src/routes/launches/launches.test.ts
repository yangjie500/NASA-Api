import request from 'supertest';

import app from '../../app';
import { mongoConnect, mongoDisconnect } from '../../services/mongo';
import { loadPlanetsData } from '../../models/planets.model'


describe('Launches API', () => {
  // Will run before all the test in this (Launches API) describe block is run
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
    
  });

  afterAll(async () => {
    await mongoDisconnect();
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      // SuperTest abstract the logic of calling listen function on the app object, then allow you to make request against the HTTP server
      const response = await request(app)
        .get('/v1/launches')
        // Using regex to check if 'json' word is present in 'Content-Type'
        .expect('Content-Type', /json/)
        .expect(200);
      // Using with Jest is below code which is optional
      // expect(response.statusCode).toBe(200);
    });
  })
  
  describe('Test POST /launch', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028'
    };
  
    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    };
  
    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'zoot'
    };
  
    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201);
  
      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
  
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDataWithoutDate);
  
      
    });
  
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Missing requiried launch property'
      });
    })
  
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post('/v1/launches')
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400);
  
      expect(response.body).toStrictEqual({
        error: 'Invalid launch date'
      });
    })
  })
  
  
})
