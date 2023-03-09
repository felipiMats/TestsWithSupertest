    
 import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
 import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"; 
 
 let inMemoryUsersRepository: InMemoryUsersRepository;
 let authenticateUserUseCase: AuthenticateUserUseCase;
 let createUserUseCase: CreateUserUseCase;
 
 describe("Authenticate User", () => {
     beforeEach(() => {
         inMemoryUsersRepository = new InMemoryUsersRepository();
         authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
         createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
     });
    
    
    it("should be able to authenticate an user existing in the repository", async () => {
        const user = {
            name: "UserTest",
            email: "email@test.com",
            password: "testPassword"
        }

        await createUserUseCase.execute(user);

        const testAuthenticate = await authenticateUserUseCase.execute({
            email: user.email,
            password: user.password
        })


        expect(testAuthenticate).toHaveProperty("token")

    });
 });