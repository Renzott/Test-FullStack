import Transfer from "../models/transfer.js";
import { initDataTransfers } from "../utils/data.js";
import { abortTransfers, emailIsValid, findByEmailAndPatent, isTransferExist, isTransferPaid, isTransferPaidByPatent, validatePatent } from "../utils/helper.js";

class TransferSystem {
    constructor() {
        /** @type { Transfer[] } */
        this.transfers = initDataTransfers.map(transfer => {
            return new Transfer(transfer.email, transfer.licensePlate, transfer.status);
        });
    }

    /** @param { String } email */
    listTransfersByEmail(email) {
        return this.transfers.filter(transfer => transfer.email === email);
    }

    /** @param { Transfer } transfer */
    createTransfer(transfer) {
        if (!transfer.validateTransfer())
            throw new Error('Todos los campos son obligatorios');

        if (!validatePatent(transfer.licensePlate))
            throw new Error('La Patente es inválida');

        if (!emailIsValid(transfer.email))
            throw new Error('El correo es inválido');
        
        if (isTransferExist(transfer, this.transfers))
            throw new Error('Ya existe una transferencia con la misma patente y correo');

        if (isTransferPaidByPatent(transfer.licensePlate, this.transfers))
            throw new Error('Ya existe una transferencia pagada con la misma patente');

        this.transfers.push(transfer);

        return {
            message: 'Transferencia creada exitosamente',
            data: transfer
        };
    }

    /**
     * @param { String } email 
     * @param { String } licensePlate
    */
    payTransfer(email, licensePlate) {
        if (!validatePatent(licensePlate))
            throw new Error('La Patente es inválida');

        if (!emailIsValid(email))
            throw new Error('El correo es inválido');

        const currentTransfer = findByEmailAndPatent(email, licensePlate, this.transfers);

        if (!currentTransfer)
            throw new Error('No existe una transferencia con el correo y patente ingresada');

        if (isTransferPaid(currentTransfer.status))
            throw new Error('La transferencia ya se encuentra pagada');

        currentTransfer.payTransfer();

        const abortTransfersList = this.transfers.filter(transfer => transfer.licensePlate === licensePlate && transfer.id !== currentTransfer.id);
        abortTransfers(licensePlate, abortTransfersList);

        return {
            message: 'Transferencia pagada exitosamente',
            data: currentTransfer
        };
    }

}

export default TransferSystem;