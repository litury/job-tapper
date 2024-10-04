export interface QueueItem {
  accessToken: string;
  vacancyId: string;
  resumeId: string;
  socketId: string;
}

export class Queue {
  private items: QueueItem[] = [];

  enqueue(item: QueueItem): void {
    this.items.push(item);
  }

  dequeue(): QueueItem | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}