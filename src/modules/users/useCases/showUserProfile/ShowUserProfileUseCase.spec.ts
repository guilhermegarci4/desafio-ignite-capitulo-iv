import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Authenticate User", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    })

    it("should be able show a user", async () => {
        const user = await createUserUseCase.execute({
            name: "Teste",
            email: "teste@testes.com",
            password: "1234"
        });

        const response = await showUserProfileUseCase.execute(user.id!);

        expect(response).toHaveProperty("email");
        expect(response.name).toBe(user.name);
    })
})