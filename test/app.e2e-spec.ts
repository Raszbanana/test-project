import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
    await app.init();

    prisma = app.get(PrismaService)
    await prisma.cleanDb()
  })

  describe('Auth', () => {
    describe('Signup', () => {
      test('Should signup a user', async () => {
        const user = {
          email: 'user@example.com',
          password: 'password'
        }
        await request(app)
          .post('http://localhost:3333/signup')
          .send(user)
          .then(async (response) => {
            console.log('test')
          })
      })
    })

    describe('Signin', () => {

    })
  })

  describe('User', () => {
    describe('Get me', () => {

    })

    describe('Edit user', () => {

    })
  })

  describe('Bookmarks', () => {
    describe('Create bookmarks', () => {

    })

    describe('Get bookmark', () => {

    })

    describe('Get bookmark by id', () => {

    })

    describe('Delete bookmark', () => {

    })
  })

  afterAll(async () => {
    app.close();
  })
});
