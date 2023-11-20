import { Test } from "@nestjs/testing";
import { AppModule } from "../../app.module";
import * as request from "supertest";
import { HttpStatus } from "@nestjs/common";

describe("WalletController (e2e)", () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("/wallet/transaction (POST)", async () => {
    const transactions = [
      { value: 110, latency: 600, customerId: "1" },
      // Add more transaction objects as needed
    ];

    const response = await request(app.getHttpServer())
      .post("/wallet/transaction")
      .send(transactions)
      .expect(HttpStatus.CREATED);

    expect(response.text).toBe("Successfully done");
  });

  afterAll(async () => {
    await app.close();
  });
});
