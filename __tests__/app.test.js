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
  test("404: should respond with not found when trying to access a non-existent endpoint", () => {
    return request(app)
      .get("/apo")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This page does not exist!");
      });
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
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: should respond with array of articles objects", () => {
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
  test("200: should respond with articles sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: should respond with a relevant article object with a correct id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
        });
      });
  });
  test("400: should respond with a bad request message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("404: should respond with a not found message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This article id does not exist!");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: should respond with an array of comments for the given article id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("200: should respond with comments sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: should respond with an empty array for an existent article with no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeEmpty();
      });
  });
  test("400: should respond with a bad request message when given an invalid article id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("404: should respond with a not found message when given a valid but non-existent article id", () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This article id does not exist!");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: should respond with a posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "I am lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "I am lurker",
          article_id: 1,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
        expect(comment.created_at).toBeDateString();
      });
  });
  test("400: should respond with a bad request message when given invalid request body", () => {
    const newComment = {
      username: "lurker",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("400: should respond with a bad request message when given an invalid article id", () => {
    const newComment = {
      username: "lurker",
      body: "Banana",
    };

    return request(app)
      .post("/api/articles/banana/comments")
      .send(newComment)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("404: should respond with a not found message when given a valid but non-existent article id", () => {
    const newComment = {
      username: "lurker",
      body: "Thousand",
    };

    return request(app)
      .post("/api/articles/1000/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This article id does not exist!");
      });
  });
  test("404: should respond with a not found message when given a non-existent username", () => {
    const newComment = {
      username: "test_name",
      body: "My name is test_name",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Not found! Foreign key constraint violation");
      });
  });
});
