import Transfer from "../models/transfer.js";
import { Status, statuses } from "./data.js";

/**
 * 
 * @param { String } email 
 * @param { String } licensePlate 
 * @param { Transfer[] } transfers 
 * @returns { Transfer }
 */
const findByEmailAndPatent = (email, licensePlate, transfers) => {
    return transfers.find(transfer => transfer.email === email && transfer.licensePlate === licensePlate);
}

/** 
 * @param { String } licensePlate
 * @param { Transfer[] } transfers 
 * @returns { Transfer[] }
 * */
const getAllTransferByPatent = (licensePlate, transfers) => {
    return transfers.filter(transfer => transfer.licensePlate === licensePlate);
}

/**
 * @param { Transfer } currentTransfer
 * @param { Transfer[] } transfers
 * @returns { Boolean }
 * */
const isTransferExist = (currentTransfer, transfers) => {

    let exist = false;
    const transferList = transfers.filter(t => t.licensePlate === currentTransfer.licensePlate && t.email === currentTransfer.email);

    if (transferList.length === 0)
        return false;

    transferList.forEach(transfer => {
        if (transfer.status === Status.CREATED) {
            exist = true;
        }
    });

    if (!exist) {
        transferList.forEach(transfer => {
            if (transfer.status === Status.FINISHED || transfer.status === Status.ABORTED) {
                exist = false;
            }
        });

    }
    return exist;
}

/** @param { String } status */
const isTransferPaid = (status) => {
    return status === Status.PAID;
}

/**
 * @param { String } licensePlate
 * @param { Transfer[] } transfers
 * @returns { Boolean }
 * */
const isTransferPaidByPatent = (licensePlate, transfers) => {
    const transfer = transfers.find(t => t.licensePlate === licensePlate && t.status === Status.PAID);
    
    if (!transfer)
        return false;

    return true;
}

/** 
 * @param { String } licensePlate 
 * @returns { Boolean }
 * */
const validatePatent = (licensePlate) => {
    const regexPatente1 = /^[A-Z]{4}\d{2}$/;
    const regexPatente2 = /^[A-Z]{2}\d{4}$/;

    return regexPatente1.test(licensePlate) || regexPatente2.test(licensePlate);
}

const emailIsValid = (email) => {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    return regexEmail.test(email);
}

const abortTransfers = (licensePlate, transfers) => {
    const transfersByPatent = getAllTransferByPatent(licensePlate, transfers);

    transfersByPatent.forEach(transfer => {
        transfer.abortTransfer();
    });

    return transfersByPatent;
}

/** @param { String } status */
const returnStatus = (status) => {
    return statuses.find(s => s.id === status);
}

const isNull = (value) => {
    return value === null || value === undefined || value === '';
}

export {
    findByEmailAndPatent,
    getAllTransferByPatent,
    isTransferExist,
    isTransferPaid,
    isTransferPaidByPatent,
    validatePatent,
    emailIsValid,
    abortTransfers,
    returnStatus,
    isNull
}