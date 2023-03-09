import { Connection, createConnection } from "typeorm";
import request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("Give an balance account bank", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send({
            name: "test",
            email: "test@test.com",
            password: "test",
        });

        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });

        const {token} = responseToken.body;

        await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 100,
            description: "Test description"
        })
        .set({
            Authorization: `Bearer ${token}`
        })

        
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able return all operations of an user", async () => {
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });

        const {token} = responseToken.body;

        const response = await request(app).get("/api/v1/statements/balance").set({
            Authorization: `Bearer ${token}`
        })


        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("balance")

    })

})
