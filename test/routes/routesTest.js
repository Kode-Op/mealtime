const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../../server");

// Configure chai
chai.use(chaiHttp);
chai.should();

let tempCard = "";

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
    pkg = {
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

    res = await chai.request(app).post("/api/creditCards/add").send(pkg);

    res.should.have.status(200);
    tempCard = res.body.id;
    res.body.id.length.should.equal(24);
  });

  it("DELETE api/creditCards/CreditCard._id should be able to delete a credit card", async function () {
    res = await chai.request(app).delete("/api/creditCards/" + tempCard);

    res.should.have.status(200);
    res.body.should.be.a("string");
  });
});
