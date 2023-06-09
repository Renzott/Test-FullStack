import Transfer from "../models/transfer";
import TransferSystem from "../service/TransferSystemService";


describe("Transfer System, Some points to consider", () => {

  // test: Se puede crear múltiples transferencias con una misma patente y distinto correo.
  test('Multiple transfers can be created with the same patent and different mail.', () => {
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('person.1@mail.com', 'LFTS99');
    const newTransfer2 = new Transfer('person.2@mail.com', 'LFTS99');
    const newTransfer3 = new Transfer('person.3@mail.com', 'LFTS99');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const response2 = transferSystem.createTransfer(newTransfer2);
    expect(response2.message).toBe('Transferencia creada exitosamente');

    const response3 = transferSystem.createTransfer(newTransfer3);
    expect(response3.message).toBe('Transferencia creada exitosamente');


  });

  // Se puede crear solo 1 transferencia con misma patente y mismo correo.
  test('Only 1 transfer can be created with the same patent and the same email.', () => {
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('person.1@mail.com', 'LFTS99');
    const newTransfer2 = new Transfer('person.1@mail.com', 'LFTS99');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const responseThrow = () => transferSystem.createTransfer(newTransfer2);
    expect(responseThrow).toThrowError('Ya existe una transferencia con la misma patente y correo');
  });

  // test: Si la transferencia está en estado 'FINALIZADA' o 'ABORTADA', entonces se permite crear otra transferencia con misma patente y mismo correo.
  test('If the transfer is in the "FINISHED" or "ABORTED" state, then it is allowed to create another transfer with the same patent and the same email.', () => {
    /* Init Data:
     {
        id: 2,
        licensePlate: 'LFTS35',
        email: 'usuario1@autored.cl',
        status: Status.ABORTED,
    },
    {
        id: 5,
        licensePlate: 'BDLS99',
        email: 'usuario5@autored.cl',
        status: Status.FINISHED,
    }
     */
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('usuario1@autored.cl', 'LFTS35');
    const newTransfer2 = new Transfer('usuario1@autored.cl', 'LFTS35');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const responseThrow = () => transferSystem.createTransfer(newTransfer2);
    expect(responseThrow).toThrowError('Ya existe una transferencia con la misma patente y correo');
  });

  // test: Si una de las transferencias está 'PAGADA', entonces no se permiten crear más transferencias con la misma patente (sin importar el correo del usuario)
  test('If one of the transfers is "PAID", then it is not allowed to create more transfers with the same patent (regardless of the user\'s email)', () => {
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('person.1@mail.com', 'LFTX77');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const payTransfer = transferSystem.payTransfer('person.1@mail.com', 'LFTX77');
    expect(payTransfer.message).toBe('Transferencia pagada exitosamente');

    const newTransfer2 = new Transfer('person.2@mail.com', 'LFTX77');


    const responseThrow = () => transferSystem.createTransfer(newTransfer2);
    expect(responseThrow).toThrowError('Ya existe una transferencia pagada con la misma patente');
  });

  // test: Si hay múltiples transferencias con misma patente y distinto correo, y una de estas transferencias avanza al estado 'PAGADA', entonces todas las otras transferencias cambian al estado 'ABORTADA'.
  test('If there are multiple transfers with the same patent and different email, and one of these transfers advances to the "PAID" state, then all other transfers change to the "ABORTED" state.', () => {
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('person.1@mail.com', 'LFTS99');
    const newTransfer2 = new Transfer('person.2@mail.com', 'LFTS99');
    const newTransfer3 = new Transfer('person.3@mail.com', 'LFTS99');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const response2 = transferSystem.createTransfer(newTransfer2);
    expect(response2.message).toBe('Transferencia creada exitosamente');

    const response3 = transferSystem.createTransfer(newTransfer3);
    expect(response3.message).toBe('Transferencia creada exitosamente');

    const payTransfer = transferSystem.payTransfer('person.3@mail.com', 'LFTS99');
    expect(payTransfer.message).toBe('Transferencia pagada exitosamente');

    const transfersList1 = transferSystem.listTransfersByEmail('person.1@mail.com');

    transfersList1.forEach(transfer => {
      // ABORTED = 3
      expect(transfer.status).toBe(3);
    });

    const transfersList2 = transferSystem.listTransfersByEmail('person.2@mail.com');

    transfersList2.forEach(transfer => {
      // ABORTED = 3
      expect(transfer.status).toBe(3);
    });

    const transfersList3 = transferSystem.listTransfersByEmail('person.3@mail.com');

    transfersList3.forEach(transfer => {
      // PAID = 2
      expect(transfer.status).toBe(2);
    });
  });

  // test: Todos los campos de la transferencia son requeridos.
  test('All fields of the transfer are required.', () => {
    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('', 'LFTS99');
    const newTransfer2 = new Transfer('','');
    const newTransfer3 = new Transfer('person.1@mail.com', '');

    const responseThrow1 = () => transferSystem.createTransfer(newTransfer1);
    expect(responseThrow1).toThrowError('Todos los campos son obligatorios');

    const responseThrow2 = () => transferSystem.createTransfer(newTransfer2);
    expect(responseThrow2).toThrowError('Todos los campos son obligatorios');

    const responseThrow3 = () => transferSystem.createTransfer(newTransfer3);
    expect(responseThrow3).toThrowError('Todos los campos son obligatorios');
  });

  // test: Una patente válida tiene las siguientes características: AAAA00 => 4 letras y 2 números. AA0000 => 2 letras y 4 números.
  test('A valid patent has the following characteristics: AAAA00 => 4 letters and 2 numbers. AA0000 => 2 letters and 4 numbers.', () => {

    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('person.1@mail.com', 'LFTS99');
    const newTransfer2 = new Transfer('person.1@mail.com', 'LFTS999');

    const response1 = transferSystem.createTransfer(newTransfer1);
    expect(response1.message).toBe('Transferencia creada exitosamente');

    const responseThrow = () => transferSystem.createTransfer(newTransfer2);
    expect(responseThrow).toThrowError('La Patente es inválida');
  });
});