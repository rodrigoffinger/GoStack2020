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
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: '1234',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1234');
  });

  it('should not be able to create two appoitments on the same time', async () => {
    const appointmentDate = new Date(2020, 7, 19, 11);

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: '1234',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
