const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("Request to non-existent route", () => {
  test('404: should respond with not found when trying to access a non-existent endpoint', () => {
    return request(app)
      .get("/apo")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This page does not exist!");
      })
  });
});

describe("GET /api/topics", () => {
  test("200: should respond with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String)
            })
          );
        });
      });
  });
});

describe('GET /api/articles', () => {
  test('200: should respond with array of article objects', () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
