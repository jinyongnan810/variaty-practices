# Python Practices

Examples of Python concurrency patterns including threading, thread pools, and locking mechanisms.

## Technologies

- **threading** - Python's built-in threading module
- **concurrent.futures** - High-level thread pool interface
- **fasteners** - Cross-process and reader-writer locks

## Key Practices

### Thread Pool Executor
```python
import concurrent.futures

def task(n):
    time.sleep(2)
    return n * n

with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
    futures = {executor.submit(task, i): i for i in range(5)}
    for future in concurrent.futures.as_completed(futures):
        n = futures[future]
        try:
            result = future.result()
            print(f"Result of task {n}: {result}")
        except Exception as e:
            print(f"Task {n} generated an exception: {e}")
```

**Tips:**
- `max_workers` limits concurrent threads
- `as_completed()` yields futures as they finish
- Use `future.result()` to get return value or raise exception

### Basic Threading Lock
```python
import threading

lock = threading.Lock()

def critical_section(thread_id):
    with lock:
        print(f"[Thread {thread_id}] Lock acquired.")
        time.sleep(2)
        print(f"[Thread {thread_id}] Releasing lock...")

threads = [threading.Thread(target=critical_section, args=(i,)) for i in range(3)]
for t in threads:
    t.start()
for t in threads:
    t.join()
```

**Tips:**
- Use `with lock:` context manager for automatic release
- `lock.acquire(blocking=False)` returns immediately if lock unavailable

### Reader-Writer Lock (Thread-level)
```python
import fasteners

rw_lock = fasteners.ReaderWriterLock()

def write_task():
    with rw_lock.write_lock():
        # Exclusive access - no readers or writers
        time.sleep(2)

def read_task():
    with rw_lock.read_lock():
        # Shared access - multiple readers OK
        time.sleep(1)
```

**Behavior:**
- `write_lock()` - Exclusive: no other reader or writer can proceed
- `read_lock()` - Shared: multiple readers can hold simultaneously

### Inter-Process Lock
```python
import fasteners
import multiprocessing

lock_file = '/tmp/my_lock_file.lock'

def worker(process_id):
    lock = fasteners.InterProcessLock(lock_file)

    if lock.acquire(blocking=True):
        try:
            time.sleep(2)  # Critical section
        finally:
            lock.release()
    else:
        print("Could not acquire lock")

# Non-blocking version
def worker_non_block(process_id):
    lock = fasteners.InterProcessLock(lock_file)
    if lock.acquire(blocking=False):
        try:
            # Work
        finally:
            lock.release()
    else:
        print("Lock busy, skipping")
```

**Tips:**
- Uses file-based locking for cross-process synchronization
- `blocking=True` waits indefinitely
- `blocking=False` returns immediately if lock unavailable
- Always release in `finally` block

## Lock Comparison

| Lock Type | Scope | Use Case |
|-----------|-------|----------|
| `threading.Lock` | Threads in same process | Simple mutex |
| `fasteners.ReaderWriterLock` | Threads in same process | Multiple readers, single writer |
| `fasteners.InterProcessLock` | Processes on same machine | Cross-process synchronization |

## Folder Structure

```
python-practices/
├── thread-pool-practices/
│   └── thread_practice.py      # ThreadPoolExecutor example
└── lock-practices/
    ├── threading-practices.py          # Basic threading.Lock
    ├── fasteners-thread-lock-practices.py   # Reader-Writer lock
    └── fasteners-process-lock-practices.py  # Inter-process lock
```

## Setup

```bash
pip install fasteners

# Run examples
python thread-pool-practices/thread_practice.py
python lock-practices/threading-practices.py
```
