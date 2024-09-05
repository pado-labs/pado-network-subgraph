import {TaskDispatched, ResultReported, TaskCompleted, TaskFailed, TaskMgt} from "../generated/TaskMgt/TaskMgt"
import {TaskInfo, TaskCounter, DataInfo} from "../generated/schema"
import {Bytes} from "@graphprotocol/graph-ts"

const counterName = "TaskCounter";

export function handleTaskDispatched(event: TaskDispatched): void {
    const taskInfo = new TaskInfo(event.params.taskId);
    const taskMgt = TaskMgt.bind(event.address);

    const task = taskMgt.getTaskById(event.params.taskId);
    taskInfo.taskType = task.taskType;
    taskInfo.consumerPk = task.consumerPk;
    taskInfo.tokenSymbol = task.tokenSymbol;
    taskInfo.dataId = task.dataId;
    taskInfo.price = task.computingInfo.price;
    taskInfo.t = task.computingInfo.t;
    taskInfo.n = task.computingInfo.n;
    taskInfo.workerIds = task.computingInfo.workerIds;
    taskInfo.results = task.computingInfo.results;
    taskInfo.hasReported = task.computingInfo.hasReported;
    taskInfo.reportCount = task.computingInfo.reportCount;
    taskInfo.time = task.time;
    taskInfo.status = task.status;
    taskInfo.submitter = task.submitter;
    taskInfo.code = task.code;

    taskInfo.save();

    // update task counter
    increasePendingTaskCount();

    // update data info
    increaseDataPurchaseCount(task.dataId);
}

export function handleResultReported(event: ResultReported): void {
    const taskMgt = TaskMgt.bind(event.address);
    const task = taskMgt.getTaskById(event.params.taskId);

    const taskInfo = TaskInfo.load(event.params.taskId);
    if (taskInfo != null) {
        taskInfo.results = task.computingInfo.results;
        taskInfo.hasReported = task.computingInfo.hasReported;
        taskInfo.reportCount = task.computingInfo.reportCount;

        taskInfo.save();
    }
}

export function handleTaskCompleted(event: TaskCompleted): void {
    const taskMgt = TaskMgt.bind(event.address);
    const task = taskMgt.getTaskById(event.params.taskId);

    const taskInfo = TaskInfo.load(event.params.taskId);
    if (taskInfo != null) {
        taskInfo.status = task.status;
        taskInfo.save();

        // update task counter
        decreasePendingTaskCount(true);
    }
}

export function handleTaskFailed(event: TaskFailed): void {
    const taskMgt = TaskMgt.bind(event.address);
    const task = taskMgt.getTaskById(event.params.taskId);

    const taskInfo = TaskInfo.load(event.params.taskId);
    if (taskInfo != null) {
        taskInfo.status = task.status;
        taskInfo.save();

        // update task counter
        decreasePendingTaskCount(false);
    }
}

function increasePendingTaskCount(): void {
    let taskCounter = TaskCounter.load(counterName);
    if (!taskCounter) {
        taskCounter = new TaskCounter(counterName);
        taskCounter.pendingCount = 0;
        taskCounter.completedCount = 0;
        taskCounter.failedCount = 0;
    }
    taskCounter.pendingCount += 1;
    taskCounter.save();
}

function decreasePendingTaskCount(isSuccess: bool): void {
    const taskCounter = TaskCounter.load(counterName);
    if (taskCounter !== null) {
        taskCounter.pendingCount -= 1;
        if (isSuccess) {
            taskCounter.completedCount += 1;
        }
        else {
            taskCounter.failedCount += 1;
        }
        taskCounter.save();
    }
}

function increaseDataPurchaseCount(dataId: Bytes): void {
    let dataInfo = DataInfo.load(dataId);
    if (dataInfo !== null) {
        dataInfo.purchaseCount += 1;
        dataInfo.save();
    }
}
