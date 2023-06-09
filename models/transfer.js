import { Status } from "../utils/data.js";
import { isNull } from "../utils/helper.js";

class Transfer {
    constructor(email, licensePlate, status = Status.CREATED) {
        this.id = Math.floor(Math.random() * 1000000);
        this.email = email;
        this.licensePlate = licensePlate;
        this.status = status;
    }

    payTransfer() {
        this.status = Status.PAID;
    }

    abortTransfer() {
        this.status = Status.ABORTED;
    }

    isTransferFinished() {
        return this.estado === Status.FINISHED || this.estado === Status.ABORTED;
    }

    validateTransfer() {
        const isNullFields = Object.keys(this).some(key => isNull(this[key]));

        if (isNullFields)
            return false;

        return true;
    }

}

export default Transfer;