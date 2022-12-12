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
  test('404: should response with not found when trying to access a non-existent endpoint', () => {
    return request(app)
      .get("/apo")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This page does not exist!");
      })
  });
});

describe("GET /api/topics", () => {
  test("200: should response with all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics).toBeInstanceOf(Array);
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
