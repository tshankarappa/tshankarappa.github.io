    const STUDENT_LIST_KEY = "studentList";
    const attendanceKey = "offline_attendance";

    async function refreshStudentList() {
    if (!navigator.onLine) return console.log("Offline, skip fetch");
    try {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await res.json();
        const studentMap = {};
        users.forEach((u) => (studentMap[String(u.id)] = u.name));
        localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(studentMap));
        console.log("🔄 Refreshed student list:", studentMap);
        document.getElementById("log").innerText = "Student list updated.";
    } catch (err) {
        console.warn("⚠️ Failed to fetch student list", err);
    }
    }

    function getStudentName(id) {
    const map = JSON.parse(localStorage.getItem(STUDENT_LIST_KEY) || "{}");
    return map[id] || "Unknown";
    }

    function saveAttendance(id) {
    const name = getStudentName(id);
    const old = JSON.parse(localStorage.getItem(attendanceKey) || "[]");
    old.push({ id, name, time: new Date().toLocaleString() });
    localStorage.setItem(attendanceKey, JSON.stringify(old));
    document.getElementById("log").innerText = `✅ ${name} (${id}) @ ${old[old.length - 1].time}`;
    }

    function setupQR() {
    const reader = new Html5Qrcode("reader");
    const startButton = document.getElementById("start-scan");

    startButton.addEventListener("click", () => {
        Html5Qrcode.getCameras().then((devices) => {
        if (devices && devices.length) {
            const camId = devices[0].id;
            reader
            .start(
                camId,
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                reader.stop();
                saveAttendance(decodedText);
                setTimeout(() => reader.start(camId), 1000);
                },
                (err) => {}
            )
            .catch(console.error);
        } else {
            alert("No camera found");
        }
        });
    });
    }

    function setupUpload() {
    document.getElementById("upload-students").addEventListener("change", (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
        try {
            const arr = JSON.parse(reader.result);
            const map = {};
            arr.forEach((s) => (map[String(s.id)] = s.name));
            localStorage.setItem(STUDENT_LIST_KEY, JSON.stringify(map));
            alert("✅ Uploaded student list.");
        } catch {
            alert("⚠️ Invalid file format");
        }
        };
        reader.readAsText(file);
    });
    }

    function setupSyncButton() {
    document.getElementById("syncBtn").addEventListener("click", refreshStudentList);
    }

    window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
    }
    setupUpload();
    setupSyncButton();
    setupQR();
    refreshStudentList();
    window.addEventListener("online", refreshStudentList);
    });
