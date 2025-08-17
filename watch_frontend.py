import os
import subprocess
from time import sleep
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Directory to watch
frontend_dir = 'live-documentation-frontend-bundle/src'

class FrontendChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith(('.js', '.css', '.html')):
            print(f"Detected change in: {event.src_path}")
            self.build_frontend()

    def build_frontend(self):
        print("Running npm run build...")
        # Run npm run build to rebuild frontend
        subprocess.run(["npm", "run", "build"], cwd="live-documentation-frontend-bundle", check=True)
        print("Frontend build complete.")

# Create an observer to watch the frontend directory
event_handler = FrontendChangeHandler()
observer = Observer()
observer.schedule(event_handler, frontend_dir, recursive=True)

# Start observing in the background
observer.start()

# Flask Server Process
try:
    while True:
        sleep(1)  # Keep the process running
except KeyboardInterrupt:
    observer.stop()
    print("Stopped watching frontend files.")
observer.join()
