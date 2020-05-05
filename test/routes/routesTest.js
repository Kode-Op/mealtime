const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");
const fs = require("fs");

// Configure chai
chai.use(chaiHttp);
chai.should();

let tempCard = "";
let tempItem = "";
let tempOrder = "";
let tempRestaurant = "";
let tempToken = "";

// Unit Tests for CreditCard

describe("CreditCard", function () {
  it("GET api/creditCards/User._id should return all credit cards for user", async function () {
    let res = await chai
      .request(app)
      .get("/api/creditCards/5e8cf3b3cc4ff418b8388973");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("GET api/creditCards/User._id/showDeleted=true should return all credit cards for user, even deleted ones", async function () {
    let res = await chai
      .request(app)
      .get("/api/creditCards/5e8cf3b3cc4ff418b8388973/showDeleted=true");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/creditCards/add should be able to create a credit card", async function () {
    let pkg = {
      userId: "5e8cf3b3cc4ff418b8388973",
      firstName: "David",
      lastName: "Allison",
      number: "6545315321651456",
      exMonth: "01",
      exYear: "2021",
      ccv: "123",
      address: "123 Main",
      isDeleted: false,
    };

    let res = await chai.request(app).post("/api/creditCards/add").send(pkg);

    res.should.have.status(200);
    tempCard = res.body.id;
    res.body.id.length.should.equal(24);
  });

  it("DELETE api/creditCards/CreditCard._id should be able to delete a credit card", async function () {
    let res = await chai.request(app).delete("/api/creditCards/" + tempCard);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});

describe("File", function () {
  it("POST api/files/upload should be able to upload a file to the s3 bucket", async function () {
    let res = await chai
      .request(app)
      .post("/api/files/upload")
      .field("path", "test/10.png")
      .attach("file", fs.readFileSync("test/images/10.png"), "10.png");

    res.should.have.status(200);
    res.body.should.be.a("object");
  });
});

describe("MenuItem", function () {
  it("GET api/menuItems/Restaurant._id should return all menuItems for a restaurant", async function () {
    let res = await chai
      .request(app)
      .get("/api/menuItems/5ea27026200dd800170da05c");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/menuItems/add should be able to create a menuItem", async function () {
    let pkg = {
      restaurantId: "notARealRestaurant",
      name: "Test Item",
      price: "599",
      preptime: "2",
      description: "This is a test item",
      category: "Test Category",
    };

    let res = await chai.request(app).post("/api/menuItems/add").send(pkg);

    res.should.have.status(200);
    tempItem = res.body.id;
    res.body.id.length.should.equal(24);
  });

  it("POST api/menuItems/update/MenuItem._id should be able to update a menuItem", async function () {
    let pkg = {
      name: "Test Item",
      price: "599",
      preptime: "2",
      description: "This is a changed test item",
      category: "Test Category",
    };

    let res = await chai
      .request(app)
      .post("/api/menuItems/update/" + tempItem)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("DELETE api/menuItems/MenuItem._id should be able to delete a menuItem", async function () {
    let res = await chai.request(app).delete("/api/menuItems/" + tempItem);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});

describe("Order", function () {
  it("GET api/orders/byUser/User._id should return all orders", async function () {
    this.timeout(10000);
    let res = await chai
      .request(app)
      .get("/api/orders/byUser/5e8cf3b3cc4ff418b8388973");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("GET api/orders/byRestuarant/Restaurant._id should return all orders", async function () {
    this.timeout(10000);
    let res = await chai
      .request(app)
      .get("/api/orders/byRestaurant/5ea27026200dd800170da05c");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/orders/add should be able to create an order", async function () {
    let pkg = {
      userId: "5e8cf3b3cc4ff418b8388973",
      restaurantId: "5ea27026200dd800170da05c",
      creditCardId: tempCard,
      menuItems: [tempItem],
      quantity: [1],
      address: "123 Main St, Anywhere USA",
      totalPaid: 600,
    };

    let res = await chai.request(app).post("/api/orders/add").send(pkg);

    res.should.have.status(200);
    tempOrder = res.body.id;
    res.body.id.length.should.equal(24);
  });

  it("GET api/orders/Order._id should return all info on a specific order", async function () {
    let res = await chai.request(app).get("/api/orders/" + tempOrder);

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("GET api/orders/cancel/Order._id should cancel a specific order", async function () {
    let res = await chai.request(app).get("/api/orders/cancel/" + tempOrder);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});

describe("Restaurant", function () {
  it("GET api/restaurants/ should return all restaurants", async function () {
    let res = await chai.request(app).get("/api/restaurants/");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/filter should return all restaurants if no limiting criteria is given", async function () {
    let pkg = {
      tags: [],
      priceLow: 0,
      priceHigh: 0,
      ratings: 0,
    };

    let res = await chai.request(app).post("/api/restaurants/filter").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/filter should return all restaurants sorted by user preference if user is logged in and no limiting criteria are given", async function () {
    let pkg = {
      userId: "5e8cf3b3cc4ff418b8388973",
      tags: [],
      priceLow: 0,
      priceHigh: 0,
      ratings: 0,
    };

    let res = await chai.request(app).post("/api/restaurants/filter").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/filter should return restaurants filtered by scpecified criteria if limiting criteria are given", async function () {
    let pkg = {
      tags: [2, 4],
      priceLow: 2,
      priceHigh: 4,
      ratings: 3,
    };

    let res = await chai.request(app).post("/api/restaurants/filter").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/filter should return restaurants filtered by limiting criteria and sort them if user is logged in", async function () {
    let pkg = {
      userId: "5e8cf3b3cc4ff418b8388973",
      tags: [2, 4],
      priceLow: 2,
      priceHigh: 4,
      ratings: 3,
    };

    let res = await chai.request(app).post("/api/restaurants/filter").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/add should create a new restaurant", async function () {
    let pkg = {
      ownerId: "5e8cf3b3cc4ff418b8388973",
      name: "Test's Restaurant",
      price: 3,
      rating: 8,
      description: "Just another restaurant",
      hoursofoperation: [
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
      ],
      tags: [2, 4],
    };
    let res = await chai.request(app).post("/api/restaurants/add").send(pkg);

    res.should.have.status(200);
    tempRestaurant = res.body.id;
    res.body.id.length.should.equal(24);
  });

  it("GET api/restaurants/Restaurant._id should return info on a specific restaurant", async function () {
    let res = await chai.request(app).get("/api/restaurants/" + tempRestaurant);

    res.should.have.status(200);
    res.body.should.be.a("object");
  });

  it("GET api/restaurants/byOwner/User._id should return info on restaurants owned by a user", async function () {
    let res = await chai
      .request(app)
      .get("/api/restaurants/byOwner/5e8cf3b3cc4ff418b8388973");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/restaurants/update should be able to update a specified restaurant", async function () {
    let pkg = {
      address: "123 Main St, Anywhere USA",
      minorder: 2,
      name: "Test's Restaurant",
      price: 3,
      rating: 8,
      description: "Just another restaurant",
      hoursofoperation: [
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
        ["0000", "0100", "0900", "2359"],
      ],
      tags: [2, 4],
    };
    let res = await chai
      .request(app)
      .post("/api/restaurants/update/" + tempRestaurant)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("DELETE api/restaurants/Restaurant._id should be able to delete a restaurant", async function () {
    let res = await chai
      .request(app)
      .delete("/api/restaurants/" + tempRestaurant);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});

describe("User", function () {
  it("GET api/users/ should return all users", async function () {
    let res = await chai.request(app).get("/api/users/");

    res.should.have.status(200);
    res.body.should.be.a("array");
  });

  it("POST api/users/add should create a new user", async function () {
    let pkg = {
      email: "test@testing.com",
      firstName: "Test",
      lastName: "Tester",
      password: "badPassword!1",
    };
    let res = await chai.request(app).post("/api/users/add").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("POST api/users/add should return a 403 if user's email already exists", async function () {
    let pkg = {
      email: "test@testing.com",
      firstName: "Test",
      lastName: "Tester",
      password: "badPassword!1",
    };
    let res = await chai.request(app).post("/api/users/add").send(pkg);

    res.should.have.status(403);
    res.body.should.be.a("string");
  });

  it("POST api/users/login should log a user into the service", async function () {
    let pkg = {
      email: "test@testing.com",
      password: "badPassword!1",
    };
    let res = await chai.request(app).post("/api/users/login").send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("object");
    tempToken = res.body.token;
  });

  it("POST api/users/login should return a 404 if user is not found", async function () {
    let pkg = {
      email: "test@testing.com",
      password: "badPassword!",
    };
    let res = await chai.request(app).post("/api/users/login").send(pkg);

    res.should.have.status(404);
  });

  it("GET api/users/verify/UserSession._id should confirm if a token exists", async function () {
    let res = await chai.request(app).get("/api/users/verify/" + tempToken);

    res.should.have.status(200);
    res.body.should.be.a("object");
    tempUser = res.body.data._id;
  });

  it("GET api/users/verify/UserSession._id should return a 404 if token doesn't exist", async function () {
    let res = await chai
      .request(app)
      .get("/api/users/verify/000000000000000000000000");

    res.should.have.status(404);
  });

  it("GET api/users/verify/UserSession._id should return a 500 if token is expired (logged out)", async function () {
    let res = await chai
      .request(app)
      .get("/api/users/verify/5e729826f62c9c45d442ab94");

    res.should.have.status(500);
  });

  it("GET api/users/logout/UserSession._id should deactivate a valid token", async function () {
    let res = await chai.request(app).get("/api/users/logout/" + tempToken);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/makeOwner/User._id should make a user an owner", async function () {
    let res = await chai.request(app).get("/api/users/makeOwner/" + tempUser);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/makeOwner/User._id should return a 404 if user doesn't exist", async function () {
    let res = await chai
      .request(app)
      .get("/api/users/makeOwner/000000000000000000000000");

    res.should.have.status(404);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateName/User._id should update a user's name", async function () {
    let pkg = {
      firstName: "Testy",
      lastName: "Testest",
      password: "badPassword!1",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateName/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateName/User._id should return a 404 if user doesn't exist", async function () {
    let pkg = {
      firstName: "Testy",
      lastName: "Testest",
      password: "badPassword!1",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateName/000000000000000000000000")
      .send(pkg);

    res.should.have.status(404);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateName/User._id should return a 500 if password is incorrect", async function () {
    let pkg = {
      firstName: "Testy",
      lastName: "Testest",
      password: "badPassword!",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateName/" + tempUser)
      .send(pkg);

    res.should.have.status(500);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateEmail/User._id should update a user's email", async function () {
    let pkg = {
      email: "newEmail@test.com",
      password: "badPassword!1",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateEmail/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/updatePhone/User._id should update a user's phone number", async function () {
    let pkg = {
      phone: "555-521-1234",
      password: "badPassword!1",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updatePhone/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateAddress/User._id should update a user's address", async function () {
    let pkg = {
      address: "555-521-1234",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateAddress/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/updateTags/User._id should update a user's preference tags", async function () {
    let pkg = {
      tags: [2, 4, 5],
    };
    let res = await chai
      .request(app)
      .post("/api/users/updateTags/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("GET api/users/updatePassword/User._id should update a user's password", async function () {
    let pkg = {
      newPassword: "worsePassword!2",
      oldPassword: "badPassword!1",
    };
    let res = await chai
      .request(app)
      .post("/api/users/updatePassword/" + tempUser)
      .send(pkg);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });

  it("DELETE api/users/User._id should be able to delete a user", async function () {
    let res = await chai.request(app).delete("/api/users/" + tempUser);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});
