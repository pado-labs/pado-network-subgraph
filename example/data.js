const {subgraphCall} = require("./utils");

async function counter() {
    let query = 'query getdataCounter { dataCounter(id: "DataCounter") {id validCount deletedCount}}'

    const {data, status} = await subgraphCall(query);
    console.log("status:", status);
    console.log("dataCount:", data.data.dataCounter);
}
async function main() {
    let query = "query get_dataInfos { dataInfos(first: 2) {id dataTag tokenSymbol price dataContent t n workerIds registeredTimestamp owner status permissions purchaseCount}}"

    const {data, status} = await subgraphCall(query);
    console.log("status:", status);
    for (const d of data.data.dataInfos) {
        console.log("data:", d);
    }
    counter();
}

main();
