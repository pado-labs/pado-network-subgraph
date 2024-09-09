const {subgraphCall} = require("./utils");

async function counter() {
    let query = 'query get_taskCounter { taskCounter(id: "TaskCounter") {id pendingCount completedCount failedCount}}';

    const {data, status} = await subgraphCall(query);
    console.log("status:", status);
    console.log("taskCounter:", data.data.taskCounter);
}

async function main() {
    let query = "query get_taskInfos { taskInfos(first: 1) {id taskType consumerPk tokenSymbol dataId price t n workerIds results hasReported reportCount time status submitter code}}";

    const {data, status} = await subgraphCall(query);
    console.log("status:", status);
    for (const d of data.data.taskInfos) {
        console.log("data:", d);
    }
    counter();
}

main();
