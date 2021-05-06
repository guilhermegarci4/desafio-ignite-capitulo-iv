import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
       });

    it("should be able to create a new user", async () => {
        const user = await createUserUseCase.execute({
            name: "Teste",
            email: "teste@testes.com",
            password: "1234"
        });

        expect(user).toHaveProperty("id")
    });

    it("should not be possible to create a new user with an existing email", () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: "Teste",
                email: "teste@testes.com",
                password: "1234"
            });

            await createUserUseCase.execute({
                name: "Teste",
                email: "teste@testes.com",
                password: "1234"
            });
        }).rejects.toBeInstanceOf(CreateUserError)
    })
});