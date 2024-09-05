import {DataPrepareRegistry, DataRegistered, DataDeleted, DataMgt} from "../generated/DataMgt/DataMgt";
import {DataInfo, DataCounter} from "../generated/schema";
import {Bytes} from "@graphprotocol/graph-ts";

const counterName = "DataCounter";
export function handleDataRegistered(event: DataRegistered): void {
    const dataInfo = new DataInfo(event.params.dataId);
    const dataMgt = DataMgt.bind(event.address);

    const data = dataMgt.getDataById(event.params.dataId);
    dataInfo.id = data.dataId;
    dataInfo.tokenSymbol = data.priceInfo.tokenSymbol;
    dataInfo.price = data.priceInfo.price;
    dataInfo.dataContent = data.dataContent;
    dataInfo.t = data.encryptionSchema.t;
    dataInfo.n = data.encryptionSchema.n;
    dataInfo.workerIds = data.workerIds;
    dataInfo.registeredTimestamp = data.registeredTimestamp;
    dataInfo.owner = data.owner;
    dataInfo.status = data.status;
    dataInfo.permissions = changetype<Bytes[]>(data.permissions);
    dataInfo.purchaseCount = 0;

    dataInfo.save();

    // update data counter
    increaseValidDataCounter();
}

export function handleDataDeleted(event: DataDeleted): void {
    const dataMgt = DataMgt.bind(event.address);
    const data = dataMgt.getDataById(event.params.dataId);

    const dataInfo = DataInfo.load(event.params.dataId);

    if (dataInfo !== null) {
        dataInfo.status = data.status;
        dataInfo.save();

        // update data counter
        decreaseValidDataCounter();
    }
}

function increaseValidDataCounter(): void {
    let dataCounter = DataCounter.load(counterName);
    if (dataCounter === null) {
        dataCounter = new DataCounter(counterName);
        dataCounter.validCount = 0;
        dataCounter.deletedCount = 0;
    }
    dataCounter.validCount += 1
    dataCounter.save();
}

function decreaseValidDataCounter(): void {
    const dataCounter = DataCounter.load(counterName);
    if (dataCounter !== null) {
        dataCounter.validCount -= 1;
        dataCounter.deletedCount += 1;
        dataCounter.save();
    }
}
