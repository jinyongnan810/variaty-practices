import threading
import time

# Create a global lock
lock = threading.Lock()

def critical_section(thread_id):
    print(f"[Thread {thread_id}] Trying to acquire lock...")
    with lock:
        print(f"[Thread {thread_id}] Lock acquired.")
        time.sleep(2)  # Simulate work in the critical section
        print(f"[Thread {thread_id}] Releasing lock...")

if __name__ == '__main__':
    threads = []

    # Launch multiple threads
    for i in range(3):
        t = threading.Thread(target=critical_section, args=(i,))
        t.start()
        threads.append(t)

    # Wait for all threads to complete
    for t in threads:
        t.join()

    print("All threads completed.")
