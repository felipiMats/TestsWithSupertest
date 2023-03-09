import { Connection, createConnection } from "typeorm";
import request = require("supertest");
import { app } from "../../../../app";

let connection: Connection;
describe("Return user with Token", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("Should be able return the user with Token ", async () => {
        const responseUser = await request(app).post("/api/v1/users").send({
            name: "test",
            email: "test@test.com",
            password: "test",
        });

        const response = await request(app).post("/api/v1/sessions").send({
            email: "test@test.com",
            password: "test",
        });

        const {token} = response.body;
        
        const result = await request(app).get("/api/v1/profile").set({
            Authorization: `Bearer ${token}`,
        });

        expect(result.status).toBe(200);
        expect(result.body).toHaveProperty("id");

    })

})
