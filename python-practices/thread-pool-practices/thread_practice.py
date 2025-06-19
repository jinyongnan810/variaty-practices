import concurrent.futures
import time
def task(n):
    print(f"Task {n} is starting.")
    time.sleep(2)  # Simulate a long-running task
    print(f"Task {n} is completed.")
    return n * n
def main():
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = {executor.submit(task, i): i for i in range(5)}
        for future in concurrent.futures.as_completed(futures):
            n = futures[future]
            try:
                result = future.result()
                print(f"Result of task {n}: {result}")
            except Exception as e:
                print(f"Task {n} generated an exception: {e}")
if __name__ == "__main__":
    main()