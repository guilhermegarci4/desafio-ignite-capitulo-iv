import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let createStatamentUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

describe('Create Statement', () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();

        createStatamentUseCase = new CreateStatementUseCase(
            usersRepository,
            statementsRepository
        );
    })

    it('should be able to create a new statement with deposit type', async () => {
        const user = await usersRepository.create({
            name: 'test_user',
            email: 'user@test.com',
            password: 'test',
        });

        const statement = await createStatamentUseCase.execute({
            user_id: user.id!,
            amount: 100,
            type: 'deposit' as any,
            description: 'deposit_test_description'
        });

        expect(statement).toHaveProperty('id');
    });

    it('should not able to create a new statement for a user that does not exists', async () => {
       await expect(
        createStatamentUseCase.execute({
            user_id: 'non-existstent_user_id',
            amount: 100,
            type: 'deposit' as any,
            description: 'deposit_test_description'
        }),
       ).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    })

    it('should be able to create a new statement when user have enough balance', async () => {
        const user = await usersRepository.create({
            name: 'test_user',
            email: 'user@test.com',
            password: 'test',
        });

        await createStatamentUseCase.execute({
            user_id: user.id!,
            type: 'deposit' as any,
            amount: 1000,
            description: 'test_description',
          });

        const statement = await createStatamentUseCase.execute({
            user_id: user.id!,
            type: 'withdraw' as any,
            amount: 100,
            description: 'deposit_test_description'
        });

        expect(statement).toHaveProperty('id');
    });

    it('should be able to create a new statement when user do not have enough balance', async () => {
        const user = await usersRepository.create({
            name: 'test_user',
            email: 'user@test.com',
            password: 'test',
        });

        await createStatamentUseCase.execute({
            user_id: user.id!,
            type: 'deposit' as any,
            amount: 500,
            description: 'test_description',
          });

        expect(
            createStatamentUseCase.execute({
                user_id: user.id!,
                type: 'withdraw' as any,
                amount: 1000,
                description: 'test_description',
            }),
        ).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);       
    });
})