import request from "supertest"
import { Connection, createConnection } from "typeorm"
import { app } from "../../../../app";

let con: Connection;

describe ('AuthenticateUseController', () => {

    beforeAll( async () => {
        con = await createConnection();
        await con.runMigrations();
    })

    afterAll(async () => {
        await con.dropDatabase();
        await con.close();
    })

    it('should be able to create a new user', async () => {
        const response = await request(app)
        .post('/api/v1/users')
        .send({
            name: 'create a new user',
            email: 'user@test1.com',
            password: 'test1234'
        });

        expect(response.status).toBe(201)
    })

    it('should not be able to create a new user with exists email', async () => {
        await request(app)
        .post('/api/v1/users')
        .send({
            name: 'create a new user',
            email: 'user@test.com',
            password: 'test1234'
        });
        
        const response = await request(app)
        .post('/api/v1/users')
        .send({
            name: 'create a new user',
            email: 'user@test.com',
            password: 'test1234'
        });

        expect(response.status).toBe(400)
        expect(response.body.message).toEqual('User already exists');
    })
})