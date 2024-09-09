const {subgraphCall} = require("./utils");

async function counter() {
    let query = 'query get_feeTokenCounter { feeTokenCounter(id: "FeeTokenCounter") { id tokenCount}}'

    const {data, status} = await subgraphCall(query);
    console.log("status:", status);

    console.log("tokenCounter:", data.data.feeTokenCounter);
}

async function main() {
    let query = "query get_feeTokenInfos { feeTokenInfos(first: 2) {id symbol tokenAddress computingPrice}}";
    const {data, status} = await subgraphCall(query);

    console.log("status:", status);
    for (const d of data.data.feeTokenInfos) {
        console.log("data:", d);
    }

    counter();
}

main();
