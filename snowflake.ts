class SnowflakeGenerator {
  private readonly epoch = 1400000000000; // Twitter's snowflake epoch
  private readonly sequenceBits = 12;
  private readonly workerIdBits = 10;
  // private readonly datacenterIdBits = 5;
  private readonly maxSequence = -1 ^ (-1 << this.sequenceBits);
  private readonly maxWorkerId = -1 ^ (-1 << this.workerIdBits);
  // private readonly maxDatacenterId = -1 ^ (-1 << this.datacenterIdBits);

  private workerId: number;
  // private datacenterId: number;
  private sequence: number;
  private lastTimestamp: number;

  constructor(workerId: number) {
    if (workerId > this.maxWorkerId || workerId < 0) {
      throw new Error(`Worker ID must be between 0 and ${this.maxWorkerId}`);
    }
    // if (datacenterId > this.maxDatacenterId || datacenterId < 0) {
    //   throw new Error(
    //     `Datacenter ID must be between 0 and ${this.maxDatacenterId}`,
    //   );
    // }
    this.workerId = workerId;
    // this.datacenterId = datacenterId;
    this.sequence = 0;
    this.lastTimestamp = -1;
  }

  private timeGen(): number {
    return Date.now();
  }

  private tilNextMillis(lastTimestamp: number): number {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  }

  generate(): bigint {
    let timestamp = this.timeGen();

    if (timestamp < this.lastTimestamp) {
      throw new Error("Clock moved backwards. Refusing to generate ID.");
    }

    if (timestamp === this.lastTimestamp) {
      this.sequence = (this.sequence + 1) & this.maxSequence;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }

    this.lastTimestamp = timestamp;
    const _timestamp = BigInt(timestamp);

    const snowflakeId =
      (_timestamp << BigInt(this.sequenceBits + this.workerIdBits)) |
      // (this.datacenterId << (this.sequenceBits + this.workerIdBits)) |
      BigInt(this.workerId << this.sequenceBits) |
      BigInt(this.sequence);

    return BigInt(snowflakeId);
  }
}

export default SnowflakeGenerator;
