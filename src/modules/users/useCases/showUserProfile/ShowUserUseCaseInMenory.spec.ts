import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import jwt from "jsonwebtoken";
import auth from "../../../../config/auth";

let inMemoryUsersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

interface DecodedToken {
    sub: string;
  }

describe("User with token", () =>{

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
    });

    it("Should be able return an user authenticate through the token", async () => {
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

        const token = testAuthenticate.token
        const secret = auth.jwt.secret
        
        const decoded: DecodedToken = jwt.verify(token, secret) as DecodedToken;

        const user_id = decoded.sub;

        const result = await showUserProfileUseCase.execute(user_id);
        expect(result).toHaveProperty("id")
    });
})