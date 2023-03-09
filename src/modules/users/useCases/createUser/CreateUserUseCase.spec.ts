import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    });

    it("should be able to create a new user", async () => {
        const user = {
            name: "UserTest",
            email: "email@test.com",
            password: "testPassword"
        }

        await createUserUseCase.execute(user);

        const UserCreated = await inMemoryUsersRepository.findByEmail(user.email);

        expect(UserCreated).toHaveProperty("id")
    });


})