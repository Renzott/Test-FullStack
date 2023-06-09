import Transfer from "./models/transfer.js";
import TransferSystem from "./service/TransferSystemService.js";
import { initDataTransfers } from "./utils/data.js";

function main() {

    const transferSystem = new TransferSystem();

    const newTransfer1 = new Transfer('usuario1@autored.cl','LFTS35');
    
    const response1 = transferSystem.createTransfer(newTransfer1);

    console.log(response1);

    const payTransfer = transferSystem.payTransfer('usuario1@autored.cl','LFTS35');
    console.log(payTransfer);
}

main();