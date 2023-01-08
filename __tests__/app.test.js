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

describe("GET /api", () => {
  test("200: should respond with all available endpoints", () => {
    return request(app).get("/api").expect(200);
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
  test("200: should respond with an array of articles objects", () => {
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

  test("200: should respond with an array of articles objects related to the topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toSatisfy((articles) => {
          return articles.every(({ topic }) => topic === "cats");
        });
      });
  });
  test("200: should respond with an empty array for an existent topic with no articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeEmpty();
      });
  });
  test("404: should respond with a not found message when queried a non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This topic does not exist!");
      });
  });

  test("200: should respond with articles sorted by given valid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("400: should respond with a bad request message when given an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid sort_by query!");
      });
  });

  test("200: should respond with articles sorted by given valid order query (asc / desc)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at");
      });
  });
  test("400: should respond with a bad request message when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid order query!");
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
          comment_count: 11,
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
  test("400: should respond with a bad request message when given an invalid request body", () => {
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
        expect(message).toBe("Not found!");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should respond with an updated article", () => {
    const patchedVotes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
        });
      });
  });
  test("200: should be able to decrement article's votes property", () => {
    const patchedVotes = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedVotes)
      .expect(200)
      .then(
        ({
          body: {
            article: { votes },
          },
        }) => {
          expect(votes).toBe(0);
        }
      );
  });
  test("400: should respond with a bad request message when given an invalid request body", () => {
    const patchedVotes = {};

    return request(app)
      .patch("/api/articles/1")
      .send(patchedVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("400: should respond with a bad request message when given an invalid value type of inc_votes", () => {
    const patchedVotes = { inc_votes: "banana" };

    return request(app)
      .patch("/api/articles/1")
      .send(patchedVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("400: should respond with a bad request message when given an invalid article id", () => {
    const patchedVotes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/banana")
      .send(patchedVotes)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("404: should respond with a not found message when given a valid but non-existent article id", () => {
    const patchedVotes = { inc_votes: 1 };

    return request(app)
      .patch("/api/articles/1000")
      .send(patchedVotes)
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This article id does not exist!");
      });
  });
});

describe("GET /api/users", () => {
  test("200: should respond with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete the given comment by comment_id and and respond with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("400: should respond with a bad request message when given an invalid article id", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad request!");
      });
  });
  test("404: should respond with a not found message when given a valid but non-existent comment id", () => {
    return request(app)
      .delete("/api/comments/1000")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("This comment id does not exist!");
      });
  });
});
