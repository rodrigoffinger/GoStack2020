import AppError from '@shared/errors/AppError';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfileService = new UpdateProfileService(
      fakeHashProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Rodrigo Fernando Grings Finger',
      email: 'rodrigo2@example.com',
    });

    expect(updatedUser.name).toBe('Rodrigo Fernando Grings Finger');
    expect(updatedUser.email).toBe('rodrigo2@example.com');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Finger 2',
      email: 'rodrigo2@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Rodrigo Fernando Grings Finger',
        email: 'rodrigo@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without old passoword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Rodrigo Finger',
        email: 'rodrigo@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old passoword', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Rodrigo Finger',
      email: 'rodrigo@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Rodrigo Finger',
        email: 'rodrigo@example.com',
        old_password: 'wrong-pass',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update profile from non-existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'non-existing-id',
        name: 'Rodrigo Finger',
        email: 'rodrigo@example.com',
        old_password: 'wrong-pass',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
