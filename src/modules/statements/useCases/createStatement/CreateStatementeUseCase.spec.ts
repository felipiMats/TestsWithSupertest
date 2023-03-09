import { Connection, createConnection } from "typeorm";
import request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("movimentation in a account bank", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        await request(app).post("/api/v1/users").send({
            name: "test",
            email: "test@test.com",
            password: "test",
        });

    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able to deposit money in account bank", async () => {
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });
        const {token} = responseToken.body;

        const response = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 130,
            description: "Deposit description",
        })
        .set({Authorization: `Bearer ${token}`,});

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should be able to withdraw money in account bank", async () => {
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });
        const {token} = responseToken.body;

        await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 130,
            description: "Deposit description",
        })
        .set({Authorization: `Bearer ${token}`,});

        const response = await request(app).post("/api/v1/statements/withdraw")
        .send({
            amount: 50,
            description: "Whithdraw description",
        })
        .set({Authorization: `Bearer ${token}`,});


        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
    })

    it("Should be able review deposit or withdraw of money in account bank", async () => {
        
        const responseToken = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });
        const {token} = responseToken.body;

        const result = await request(app).post("/api/v1/statements/deposit")
        .send({
            amount: 130,
            description: "Deposit description",
        })
        .set({Authorization: `Bearer ${token}`,});

        const statement_id = result.body.id;
        
        const response = await request(app).get(`/api/v1/statements/${statement_id}`)
        .set({Authorization: `Bearer ${token}`,});

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
    })
    

})
