const {subgraphCall} = require("./utils");

async function counter() {
    let query = 'query get_workerCounter{ workerCounter(id: "WorkerCounter") {id workerCounter}}'
    const {status, data} = await subgraphCall(query);

    console.log("status:", status);
    console.log("workerCounter:", data.data.workerCounter);
}
async function main() {
    let query = "query get_workerInfos{ workerInfos {id workerType name desc stakeAmount owner publicKey time status sucTasksAmount failTasksAmount delegationAmount}}"

    const {status, data} = await subgraphCall(query);
    console.log("status:", status);
    for (const d of data.data.workerInfos) {
        console.log("data:", d);
    }

    counter();
}

main();
