const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');

// Test Blogs Routes

describe('Blogs CRUD Operations', () => {
  afterAll(() => {
    mongoose.connection.close(true);
  });

  test('Return a list of published blogs', async () => {
    const res = await request(app).get('/api/blogs');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toEqual(true);
  }, 1000000);

  test('Adds a new Blog in draft state to the database.', async () => {
    const res = await request(app)
      .post(
        '/api/blogs/?blog_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2YTk5YTEwODNhOTQ3OTk1YzU1YmQiLCJlbWFpbCI6InVnb0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiJ1Z28iLCJmaXJzdF9uYW1lIjoidWdvIiwiaWF0IjoxNjY3NzI2Mzk0LCJleHAiOjE2Njc3Mjk5OTR9.f0Em_ABqOyNx2sNB9Ai293pffPh0AQ8oyx65TqzzE9Y'
      )
      .send({
        title: 'asynchronously(token1222)',
        description: ' A sample blog',
        tags: 'javascript, programming',
        body: '(Asynchronous) If a callback is supplied, function acts asynchronously. The callback is called with the decoded payload if the signature is valid and optional expiration, audience, or issuer are valid. If not, it will be called with the error.',
      });

    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('authorId');
    expect(res.body).toHaveProperty('state');
    expect(res.body).toHaveProperty('tags');
    expect(res.body).toHaveProperty('read_count');
    expect(res.body).toHaveProperty('reading_time');
    expect(res.body).toHaveProperty('body');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
  }, 1000000);

  test('Gets a blog.', async () => {
    const res = await request(app).get('/api/blogs/63677ecfc71ba6d363511db9');

    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('authorId');
    expect(res.body).toHaveProperty('state');
    expect(res.body).toHaveProperty('tags');
    expect(res.body).toHaveProperty('read_count');
    expect(res.body).toHaveProperty('reading_time');
    expect(res.body).toHaveProperty('body');
    expect(res.body).toHaveProperty('_id');
    expect(res.body).toHaveProperty('createdAt');
    expect(res.body).toHaveProperty('updatedAt');
    expect(res.body).toHaveProperty('infos');
  }, 1000000);

  test('Updates a blog.', async () => {
    const res = await request(app)
      .patch(
        '/api/blogs/63677ea567710329ca55c258/?blog_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2YTk5YTEwODNhOTQ3OTk1YzU1YmQiLCJlbWFpbCI6InVnb0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiJ1Z28iLCJmaXJzdF9uYW1lIjoidWdvIiwiaWF0IjoxNjY3NzI2Mzk0LCJleHAiOjE2Njc3Mjk5OTR9.f0Em_ABqOyNx2sNB9Ai293pffPh0AQ8oyx65TqzzE9Y'
      )
      .send({ state: 'published' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('updateInfo');
    expect(res.body).toHaveProperty('message');
  }, 1000000);

  test('Delets a blog.', async () => {
    const res = await request(app).delete(
      '/api/blogs/6367839b58757b1265561084/?blog_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2YTk5YTEwODNhOTQ3OTk1YzU1YmQiLCJlbWFpbCI6InVnb0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiJ1Z28iLCJmaXJzdF9uYW1lIjoidWdvIiwiaWF0IjoxNjY3NzI2Mzk0LCJleHAiOjE2Njc3Mjk5OTR9.f0Em_ABqOyNx2sNB9Ai293pffPh0AQ8oyx65TqzzE9Y'
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('deleteInfo');
    expect(res.body).toHaveProperty('message');
  }, 1000000);
});

//Auth tests

describe('Sign up and login a user:', () => {
  afterAll(() => {
    mongoose.connection.close(true);
  });
  test('It should sign up user.', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      email: 'exam@gmail.com',
      last_name: 'exam',
      first_name: 'exam',
      password: 'exam',
    });
    console.log(res.statusCode);
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('loggedIn');
    expect(res.body).toHaveProperty('profile');
    expect(res.body).toHaveProperty('token');
  }, 1000000);

  test('It should login a user.', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'iy@gmail.com',
      password: 'iysoft',
    });
    console.log(res.statusCode);
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('loggedIn');
    expect(res.body).toHaveProperty('profile');
    expect(res.body).toHaveProperty('token');
  }, 1000000);
});

// // //Author routes tests

describe('Author CRUD operations', () => {
  test('Returns a list of blogs in draft and puplished state.', async () => {
    const res = await request(app).get(
      '/api/authors/6366a99a1083a947995c55bd/blogs/?blog_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2YTk5YTEwODNhOTQ3OTk1YzU1YmQiLCJlbWFpbCI6InVnb0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiJ1Z28iLCJmaXJzdF9uYW1lIjoidWdvIiwiaWF0IjoxNjY3NzI2Mzk0LCJleHAiOjE2Njc3Mjk5OTR9.f0Em_ABqOyNx2sNB9Ai293pffPh0AQ8oyx65TqzzE9Y'
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('blogLists');
  }, 1000000);

  test('Returns a list of blogs in draft and puplished state.', async () => {
    const res = await request(app).get(
      '/api/authors/6366a99a1083a947995c55bd/blogs/63677ecfc71ba6d363511db9/?blog_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzY2YTk5YTEwODNhOTQ3OTk1YzU1YmQiLCJlbWFpbCI6InVnb0BnbWFpbC5jb20iLCJsYXN0X25hbWUiOiJ1Z28iLCJmaXJzdF9uYW1lIjoidWdvIiwiaWF0IjoxNjY3NzI2Mzk0LCJleHAiOjE2Njc3Mjk5OTR9.f0Em_ABqOyNx2sNB9Ai293pffPh0AQ8oyx65TqzzE9Y'
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('description');
    expect(res.body).toHaveProperty('author');
    expect(res.body).toHaveProperty('authorId');
    expect(res.body).toHaveProperty('state');
    expect(res.body).toHaveProperty('tags');
    expect(res.body).toHaveProperty('read_count');
    expect(res.body).toHaveProperty('reading_time');
    expect(res.body).toHaveProperty('body');
    expect(res.body).toHaveProperty('_id');
  }, 1000000);
});
