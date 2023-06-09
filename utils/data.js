// List of possible statuses for a transfer.
export const statuses = [
    {
        id: 1,
        name: 'CREADA'
    },
    {
        id: 2,
        name: 'PAGADA'
    },
    {
        id: 3,
        name: 'ABORTADA'
    },
    {
        id: 4,
        name: 'FINALIZADA'
    }
];

export const Status = {
    CREATED: 1,
    PAID: 2,
    ABORTED: 3,
    FINISHED: 4
};


// Initial list of transfers
export const initDataTransfers = [
    {
        id: 1,
        licensePlate: 'LFTS34',
        email: 'usuario1@autored.cl',
        status: Status.CREATED,
    },
    {
        id: 2,
        licensePlate: 'LFTS35',
        email: 'usuario1@autored.cl',
        status: Status.ABORTED,
    },
    {
        id: 3,
        licensePlate: 'BDLS99',
        email: 'usuario3@autored.cl',
        status: Status.CREATED,
    },
    {
        id: 4,
        licensePlate: 'LFTS34',
        email: 'usuario4@autored.cl',
        status: Status.CREATED,
    },
    {
        id: 5,
        licensePlate: 'BDLS99',
        email: 'usuario5@autored.cl',
        status: Status.FINISHED,
    }
];