import {DataRegistered, DataDeleted, DataMgt} from "../generated/DataMgt/DataMgt";
import {DataInfo} from "../generated/schema";

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
    dataInfo.permissions = [];

    for (let i = 0; i < data.permissions.length; i++) {
        dataInfo.permissions.push(data.permissions[i]);
    }

    dataInfo.save();
}

export function handleDataDeleted(event: DataDeleted): void {
    const dataMgt = DataMgt.bind(event.address);
    const data = dataMgt.getDataById(event.params.dataId);

    const dataInfo = DataInfo.load(event.params.dataId);

    if (dataInfo !== null) {
        dataInfo.status = data.status;
        dataInfo.save();
    }
}
