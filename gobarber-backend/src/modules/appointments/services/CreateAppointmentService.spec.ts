import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to create a new appoitment', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 26, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 7, 26, 13),
      provider_id: '1234',
      user_id: '2234',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234');
  });

  it('should not be able to create two appoitments on the same time', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 26, 12).getTime();
    });

    const appointmentDate = new Date(2020, 7, 26, 13);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234',
      user_id: '2234',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234',
        user_id: '2234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 26, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 26, 10),
        provider_id: '1234',
        user_id: '2234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 26, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 26, 13),
        provider_id: '1234',
        user_id: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 7, 26, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 27, 6),
        provider_id: '1234',
        user_id: '2234',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 7, 27, 18),
        provider_id: '1234',
        user_id: '2234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
