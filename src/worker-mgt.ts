import {
  WorkerMgt,
  WorkerRegistry as WorkerRegistryEvent
} from "../generated/WorkerMgt/WorkerMgt"
import {
  WorkerInfo
} from "../generated/schema"

export function handleWorkerRegistry(event: WorkerRegistryEvent): void {
    let entity = new WorkerInfo(event.params.workerId);

    let workerMgt = WorkerMgt.bind(event.address);
    let worker = workerMgt.getWorkerById(event.params.workerId);
    entity.workerType = worker.workerType;
    entity.name = worker.name;
    entity.desc = worker.desc;
    entity.stakeAmount = worker.stakeAmount;
    entity.owner = worker.owner;
    entity.publicKey = worker.publicKey;
    entity.time = worker.time;
    entity.status = worker.status;
    entity.sucTasksAmount = worker.sucTasksAmount;
    entity.failTasksAmount = worker.failTasksAmount;
    entity.delegationAmount = worker.delegationAmount;

    entity.save();
}
