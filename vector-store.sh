# Check if there is a command line argument passed for filepath
if [ $# -eq 0 ]; then
    echo "Usage: ./vector-store.sh <MI_HOME_PATH>"
    exit 1
fi

# Get the file path from the command line argument
file_path=$1

# Check if the folder exists
if [ ! -d "$file_path" ]; then
    echo "Folder does not exist"
    exit 1
fi

# Check if the folder is empty
if [ ! "$(ls -A $file_path)" ]; then
    echo "Folder is empty"
    exit 1
fi

mkdir -p .temp/mi

cp -r $file_path/* .temp/mi

cp *.car .temp/mi/repository/deployment/server/carbonapps/

./.temp/mi/bin/micro-integrator.sh &
MI_PID=$!

cd server
java -jar ./simple-webserver-1.0-SNAPSHOT.jar &
WEB_PID=$!
cd ..

cleanup() {
    echo "Cleaning Up the Processes"
    ps --ppid $MI_PID -o pid= | xargs kill # Kill all child processes of MI_PID
    kill -9 $WEB_PID
    wait $MI_PID
    wait $WEB_PID
    rm -rf .temp
    echo "Processes are cleaned up"
}

trap cleanup EXIT


wait $MI_PID
wait $WEB_PID
