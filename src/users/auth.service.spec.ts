import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  beforeEach(async () => {
    // Create a fake copy of usersService(dependencies)
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    // Create a DI container for a class and his dependencies -> Temprary DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    // Reach the DI container and get the service -> Create an instance from AuthService and initialized his dependencie
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    // Make sure we successfully create a service
    expect(service).toBeDefined();
  });
});
