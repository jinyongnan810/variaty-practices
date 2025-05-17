import fasteners
import multiprocessing
import time
import os

# Lock file path (shared across processes)
lock_file = '/tmp/my_lock_file.lock'

def worker(process_id):
    lock = fasteners.InterProcessLock(lock_file)
    print(f"[Process {process_id}] Trying to acquire lock...")

    if lock.acquire(blocking=True):
        try:
            print(f"[Process {process_id}] Lock acquired by PID {os.getpid()}!")
            # Simulate some work
            time.sleep(2)
            print(f"[Process {process_id}] Work done.")
        finally:
            print(f"[Process {process_id}] Releasing lock...")
            lock.release()
    else:
        print(f"[Process {process_id}] Could not acquire lock.")

def worker_non_block(process_id):
    lock = fasteners.InterProcessLock(lock_file)
    print(f"[Process {process_id}] Trying to acquire lock...")

    if lock.acquire(blocking=False):
        try:
            print(f"[Process {process_id}] Lock acquired by PID {os.getpid()}!")
            # Simulate some work
            time.sleep(2)
            print(f"[Process {process_id}] Work done.")
        finally:
            print(f"[Process {process_id}] Releasing lock...")
            lock.release()
    else:
        print(f"[Process {process_id}] Could not acquire lock.")

if __name__ == '__main__':
    # Launch multiple processes to test the lock
    processes = []

    for i in range(3):  # Create 3 worker processes
        p = multiprocessing.Process(target=worker, args=(i,))
        p.start()
        processes.append(p)

    # Wait for all processes to complete
    for p in processes:
        p.join()

    print("All processes completed.")

    print()
    # Now test non-blocking lock acquisition
    processes = []
    for i in range(3):  # Create 3 worker processes
        p = multiprocessing.Process(target=worker_non_block, args=(i,))
        p.start()
        processes.append(p)
    # Wait for all processes to complete
    for p in processes:
        p.join()

    print("All processes completed.")
