import {
  FeeTokenAdded as FeeTokenAddedEvent,
  FeeTokenDeleted as FeeTokenDeletedEvent,
  FeeTokenUpdated as FeeTokenUpdatedEvent,
  FeeMgt
} from "../generated/FeeMgt/FeeMgt"
import {
  FeeTokenInfo,
  FeeTokenCounter
} from "../generated/schema"
import {Bytes, Address, store} from "@graphprotocol/graph-ts";

const counterName = "FeeTokenCounter";
export function handleFeeTokenAdded(event: FeeTokenAddedEvent): void {
    const entity = new FeeTokenInfo(event.params.tokenId.toHexString());
    const feeMgt = FeeMgt.bind(event.address);
    const feeTokenInfo = feeMgt.getFeeTokenById(event.params.tokenId);

    entity.symbol = feeTokenInfo.symbol;
    entity.tokenAddress = feeTokenInfo.tokenAddress;
    entity.computingPrice = feeTokenInfo.computingPrice;
    entity.save();

    // update fee token counter
    increaseFeeTokenCount();
}

export function handleFeeTokenDeleted(event: FeeTokenDeletedEvent): void {
    const feeTokenInfo = FeeTokenInfo.load(event.params.tokenId.toHexString());
    if (feeTokenInfo !== null) {
        store.remove("FeeTokenInfo", event.params.tokenId.toHexString());

        // update fee token counter
        decreaseFeeTokenCount();
    }
}

export function handleFeeTokenUpdated(event: FeeTokenUpdatedEvent): void {
    let entity = FeeTokenInfo.load(event.params.tokenId.toHexString());
    let isAdded = false;
    if (entity === null) {
        entity = new FeeTokenInfo(event.params.tokenId.toHexString());
        isAdded = true;
    }

    const feeMgt = FeeMgt.bind(event.address);
    const feeTokenInfo = feeMgt.getFeeTokenById(event.params.tokenId);

    entity.symbol = feeTokenInfo.symbol;
    entity.tokenAddress = feeTokenInfo.tokenAddress;
    entity.computingPrice = feeTokenInfo.computingPrice;
    entity.save();

    // update fee token count
    if (isAdded) {
        increaseFeeTokenCount();
    }
}

function increaseFeeTokenCount() : void {
    let feeTokenCounter = FeeTokenCounter.load(counterName);
    if (feeTokenCounter === null) {
        feeTokenCounter = new FeeTokenCounter(counterName);
        feeTokenCounter.tokenCount = 0;
    }
    feeTokenCounter.tokenCount += 1;
    feeTokenCounter.save();
}

function decreaseFeeTokenCount(): void {
    const feeTokenCounter = FeeTokenCounter.load(counterName);
    if (feeTokenCounter !== null) {
        feeTokenCounter.tokenCount -= 1;
        feeTokenCounter.save();
    }
}
