import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"


let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to authenticate a user", async () => {
        const user = await createUserUseCase.execute({
            name: "Teste",
            email: "teste@testes.com",
            password: "1234"
        });

        const authenticate = await authenticateUserUseCase.execute({
            email: "teste@testes.com",
            password: "1234"
        });

        expect(authenticate).toHaveProperty("user.id")
        expect(authenticate).toHaveProperty("token")
    })
})