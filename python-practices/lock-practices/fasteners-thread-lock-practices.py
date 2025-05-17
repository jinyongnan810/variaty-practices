import fasteners
import threading
import time
###
### write_lock() is exclusive: no other reader or writer can proceed while held.
### read_lock() is shared: multiple readers can hold it simultaneously if no writer holds the lock.

# Create a shared reader-writer lock for threads
rw_lock = fasteners.ReaderWriterLock()

def write_task(thread_id):
    print(f"[Thread {thread_id}] Trying to acquire write lock...")
    with rw_lock.write_lock():
        print(f"[Thread {thread_id}] Write lock acquired.")
        time.sleep(2)
        print(f"[Thread {thread_id}] Done writing.")

def read_task(thread_id):
    print(f"[Thread {thread_id}] Trying to acquire read lock...")
    with rw_lock.read_lock():
        print(f"[Thread {thread_id}] Read lock acquired.")
        time.sleep(1)
        print(f"[Thread {thread_id}] Done reading.")

if __name__ == '__main__':
    threads = []

    # Start 2 writer and 2 readers
    t1 = threading.Thread(target=write_task, args=(1,))
    t2 = threading.Thread(target=read_task, args=(2,))
    t3 = threading.Thread(target=read_task, args=(3,))
    t4 = threading.Thread(target=write_task, args=(4,))
    
    threads.extend([t1, t2, t3, t4])
    
    # Start all threads
    for t in threads:
        t.start()

    # Wait for all threads to finish
    for t in threads:
        t.join()

    print("All threads completed.")
