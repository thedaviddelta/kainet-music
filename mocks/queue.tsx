import { FC } from "react";
import { useQueue } from "@contexts/queue";

type QueueType = ReturnType<typeof useQueue>;

const queueSetup = () => {
    const queue = {} as QueueType;
    const QueueWrapper: FC = ({ children }) => {
        const tempQueue = useQueue();
        Object.assign(queue, tempQueue);
        return <>{children}</>;
    };
    return { QueueWrapper, queue } as const;
};

export default queueSetup;
