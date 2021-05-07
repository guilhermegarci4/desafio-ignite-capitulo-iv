import { hash } from 'bcryptjs'
import request from 'supertest'
import { Connection, createConnection } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { app } from '../../../../app'

let con: Connection
let authToken: string


describe('CreateStatementController', () => {
    beforeAll( async () => {
        con = await createConnection();
        await con.runMigrations();

        const password = await hash('test', 8)

        await con.query(
          `INSERT INTO users(id, name, email, password, created_at, updated_at)
          VALUES('${uuid()}', 'test_user', 'user@test.com', '${password}', 'now()', 'now()')
          `
        )

        const responseToken = await request(app).post('/api/v1/sessions').send({
            email: 'user@test.com',
            password: 'test',
          })      

        authToken = responseToken.body.token
    })

    afterAll(async () => {
        await con.dropDatabase();
        await con.close();
    })

    it('should be able to show the user balance', async () => {
        const response = await request(app)
          .get('/api/v1/statements/balance')
          .set({
            Authorization: `Bearer ${authToken}`,
          })
        
        expect(response.body).toHaveProperty('balance')
      })

      it('should not be able to show the balance of a non-existent user', async () => {
          const response = await request(app)
          .get('/api/v1/statements/balance')
          .set({ 
              Authorization: ''
            })

        expect(response.status).toBe(401)
        expect(response.body.message).toEqual('JWT token is missing!');
      })
    
})