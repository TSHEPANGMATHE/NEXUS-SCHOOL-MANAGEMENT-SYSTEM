// Nexus School Management System
// Arrays store the school data. localStorage keeps it after a refresh.

let students = [];
let teachers = [];
let classes = [];
let attendance = [];
let marks = [];
let activity = [];
let schoolName = "Nexus High School";
let editingStudentId = "";
let editingTeacherId = "";

function demoData() {
    return {
        students: [
            { id: "ST001", name: "John", surname: "Mokoena", grade: "10", className: "10A", email: "john@example.com" },
            { id: "ST002", name: "Aisha", surname: "Patel", grade: "10", className: "10A", email: "aisha@example.com" },
            { id: "ST003", name: "Thabo", surname: "Nkosi", grade: "11", className: "11B", email: "thabo@example.com" },
            { id: "ST004", name: "Lerato", surname: "Dlamini", grade: "9", className: "9A", email: "lerato@example.com" }
        ],
        teachers: [
            { id: "T001", name: "Mr Mokoena", subject: "Mathematics", className: "10A" },
            { id: "T002", name: "Ms Jacobs", subject: "English", className: "11B" },
            { id: "T003", name: "Mrs Pillay", subject: "Computer Science", className: "10A" }
        ],
        classes: [
            { name: "9A", grade: "9", teacher: "Ms Ndlovu" },
            { name: "10A", grade: "10", teacher: "Mr Mokoena" },
            { name: "11B", grade: "11", teacher: "Ms Jacobs" }
        ],
        attendance: [
            { studentId: "ST001", date: "2026-09-20", status: "Present" },
            { studentId: "ST002", date: "2026-09-20", status: "Absent" },
            { studentId: "ST003", date: "2026-09-20", status: "Present" }
        ],
        marks: [
            { id: 1, studentId: "ST001", subject: "Mathematics", assessment: "Test 1", mark: 70 },
            { id: 2, studentId: "ST001", subject: "Computer Science", assessment: "Test 1", mark: 80 },
            { id: 3, studentId: "ST001", subject: "English", assessment: "Essay", mark: 65 },
            { id: 4, studentId: "ST002", subject: "Mathematics", assessment: "Test 1", mark: 88 },
            { id: 5, studentId: "ST003", subject: "English", assessment: "Essay", mark: 55 }
        ],
        activity: ["Demo data loaded"],
        schoolName: "Nexus High School"
    };
}

function applyData(data) {
    students = data.students;
    teachers = data.teachers;
    classes = data.classes;
    attendance = data.attendance;
    marks = data.marks;
    activity = data.activity;
    schoolName = data.schoolName;
}

function saveData() {
    // localStorage can only store text, so the arrays are converted with JSON.stringify.
    localStorage.setItem("students", JSON.stringify(students));
    localStorage.setItem("teachers", JSON.stringify(teachers));
    localStorage.setItem("classes", JSON.stringify(classes));
    localStorage.setItem("attendance", JSON.stringify(attendance));
    localStorage.setItem("marks", JSON.stringify(marks));
    localStorage.setItem("activity", JSON.stringify(activity));
    localStorage.setItem("schoolName", schoolName);
}

function loadData() {
    // JSON.parse turns the saved text back into arrays and objects.
    if (localStorage.getItem("students")) {
        students = JSON.parse(localStorage.getItem("students"));
        teachers = JSON.parse(localStorage.getItem("teachers")) || [];
        classes = JSON.parse(localStorage.getItem("classes")) || [];
        attendance = JSON.parse(localStorage.getItem("attendance")) || [];
        marks = JSON.parse(localStorage.getItem("marks")) || [];
        activity = JSON.parse(localStorage.getItem("activity")) || ["Data loaded"];
        schoolName = localStorage.getItem("schoolName") || "Nexus High School";
        // Older saved versions used firstName, so convert it to the simpler name field.
        students.forEach(function (student) {
            if (!student.name && student.firstName) {
                student.name = student.firstName;
            }
            if (!student.className && student.class) {
                student.className = student.class;
            }
        });
    } else {
        applyData(demoData());
        saveData();
    }
}

function showMessage(text) {
    const box = document.getElementById("message");
    box.textContent = text;
    box.classList.remove("hidden");
    setTimeout(function () {
        box.classList.add("hidden");
    }, 2500);
}

function getStudent(id) {
    return students.find(function (student) {
        return student.id === id;
    });
}

function getStudentName(id) {
    const student = getStudent(id);
    if (student) {
        return student.name + " " + student.surname;
    }
    return id;
}

function addActivity(text) {
    activity.unshift(text);
    if (activity.length > 6) {
        activity.pop();
    }
}

function calculateAverage(studentId) {
    const list = marks.filter(function (mark) {
        return mark.studentId === studentId;
    });
    if (list.length === 0) {
        return null;
    }
    let total = 0;
    for (let i = 0; i < list.length; i++) {
        total += Number(list[i].mark);
    }
    return total / list.length;
}

function overallAverage() {
    if (marks.length === 0) {
        return 0;
    }
    let total = 0;
    for (let i = 0; i < marks.length; i++) {
        total += Number(marks[i].mark);
    }
    return total / marks.length;
}

function performanceStatus(average) {
    if (average === null) {
        return "No marks yet";
    }
    if (average >= 80) {
        return "Excellent";
    }
    if (average >= 70) {
        return "Good";
    }
    if (average >= 50) {
        return "Satisfactory";
    }
    return "Needs Improvement";
}

function attendancePercentage() {
    if (attendance.length === 0) {
        return 0;
    }
    let attended = 0;
    for (let i = 0; i < attendance.length; i++) {
        if (attendance[i].status !== "Absent") {
            attended++;
        }
    }
    return (attended / attendance.length) * 100;
}

function updateDashboard() {
    document.getElementById("dash-students").textContent = students.length;
    document.getElementById("dash-teachers").textContent = teachers.length;
    document.getElementById("dash-classes").textContent = classes.length;
    document.getElementById("dash-average").textContent = overallAverage().toFixed(1) + "%";
    document.getElementById("activity-list").innerHTML = activity.map(function (item) {
        return "<li>" + item + "</li>";
    }).join("");
}

function showPage(pageName) {
    const pages = document.querySelectorAll(".page");
    for (let i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }
    document.getElementById("page-" + pageName).classList.add("active");

    const links = document.querySelectorAll(".nav-link");
    for (let i = 0; i < links.length; i++) {
        if (links[i].dataset.page === pageName) {
            links[i].classList.add("active");
        } else {
            links[i].classList.remove("active");
        }
    }
    document.getElementById("page-title").textContent = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    closeMenu();
}

function displayStudents() {
    const search = document.getElementById("student-search").value.toLowerCase();
    const grade = document.getElementById("grade-filter").value;
    const list = students.filter(function (student) {
        const text = (student.id + " " + student.name + " " + student.surname + " " + student.className).toLowerCase();
        const matchesSearch = text.indexOf(search) !== -1;
        const matchesGrade = grade === "" || student.grade === grade;
        return matchesSearch && matchesGrade;
    });

    let html = "";
    for (let i = 0; i < list.length; i++) {
        const s = list[i];
        html += "<tr><td>" + s.id + "</td><td>" + s.name + "</td><td>" + s.surname +
            "</td><td>" + s.grade + "</td><td>" + s.className + "</td><td>" + s.email +
            "</td><td><button type='button' class='btn btn-small' data-edit-student='" + s.id +
            "'>Edit</button> <button type='button' class='btn btn-small btn-danger' data-delete-student='" +
            s.id + "'>Delete</button></td></tr>";
    }
    document.getElementById("students-body").innerHTML = html;
    document.getElementById("no-students").classList.toggle("hidden", list.length > 0);
}

function openStudentForm(student) {
    document.getElementById("student-form").classList.remove("hidden");
    document.getElementById("student-error").textContent = "";
    if (student) {
        editingStudentId = student.id;
        document.getElementById("student-form-title").textContent = "Edit Student";
        document.getElementById("st-id").value = student.id;
        document.getElementById("st-id").disabled = true;
        document.getElementById("st-name").value = student.name;
        document.getElementById("st-surname").value = student.surname;
        document.getElementById("st-grade").value = student.grade;
        document.getElementById("st-class").value = student.className;
        document.getElementById("st-email").value = student.email;
    } else {
        editingStudentId = "";
        document.getElementById("student-form").reset();
        document.getElementById("student-form-title").textContent = "Add Student";
        document.getElementById("st-id").disabled = false;
    }
}

function saveStudent(event) {
    event.preventDefault();
    const id = document.getElementById("st-id").value.trim();
    const name = document.getElementById("st-name").value.trim();
    const surname = document.getElementById("st-surname").value.trim();
    const grade = document.getElementById("st-grade").value;
    const className = document.getElementById("st-class").value.trim();
    const email = document.getElementById("st-email").value.trim();
    const error = document.getElementById("student-error");

    if (!id || !name || !surname || !grade || !className || !email) {
        error.textContent = "Please complete all fields.";
        return;
    }
    if (!editingStudentId && getStudent(id)) {
        error.textContent = "Student ID already exists.";
        return;
    }
    if (email.indexOf("@") === -1) {
        error.textContent = "Please enter a valid email.";
        return;
    }

    const student = { id: id, name: name, surname: surname, grade: grade, className: className, email: email };
    if (editingStudentId) {
        for (let i = 0; i < students.length; i++) {
            if (students[i].id === editingStudentId) {
                students[i] = student;
            }
        }
        addActivity("Student updated");
    } else {
        students.push(student);
        addActivity("Student added");
    }
    saveData();
    closeForm("student-form");
    updateEverything();
    showMessage("Student saved.");
}

function deleteStudent(id) {
    if (!confirm("Are you sure you want to delete this student?")) {
        return;
    }
    students = students.filter(function (student) {
        return student.id !== id;
    });
    addActivity("Student deleted");
    saveData();
    updateEverything();
    showMessage("Student deleted.");
}

function displayTeachers() {
    const search = document.getElementById("teacher-search").value.toLowerCase();
    let html = "";
    for (let i = 0; i < teachers.length; i++) {
        const t = teachers[i];
        const text = (t.id + " " + t.name + " " + t.subject + " " + t.className).toLowerCase();
        if (text.indexOf(search) === -1) {
            continue;
        }
        html += "<tr><td>" + t.id + "</td><td>" + t.name + "</td><td>" + t.subject +
            "</td><td>" + t.className + "</td><td><button type='button' class='btn btn-small' data-edit-teacher='" +
            t.id + "'>Edit</button> <button type='button' class='btn btn-small btn-danger' data-delete-teacher='" +
            t.id + "'>Delete</button></td></tr>";
    }
    document.getElementById("teachers-body").innerHTML = html;
}

function openTeacherForm(teacher) {
    document.getElementById("teacher-form").classList.remove("hidden");
    document.getElementById("teacher-error").textContent = "";
    if (teacher) {
        editingTeacherId = teacher.id;
        document.getElementById("teacher-form-title").textContent = "Edit Teacher";
        document.getElementById("t-id").value = teacher.id;
        document.getElementById("t-id").disabled = true;
        document.getElementById("t-name").value = teacher.name;
        document.getElementById("t-subject").value = teacher.subject;
        document.getElementById("t-class").value = teacher.className;
    } else {
        editingTeacherId = "";
        document.getElementById("teacher-form").reset();
        document.getElementById("teacher-form-title").textContent = "Add Teacher";
        document.getElementById("t-id").disabled = false;
    }
}

function saveTeacher(event) {
    event.preventDefault();
    const id = document.getElementById("t-id").value.trim();
    const name = document.getElementById("t-name").value.trim();
    const subject = document.getElementById("t-subject").value.trim();
    const className = document.getElementById("t-class").value.trim();
    const error = document.getElementById("teacher-error");

    if (!id || !name || !subject || !className) {
        error.textContent = "Please complete all fields.";
        return;
    }
    if (!editingTeacherId) {
        for (let i = 0; i < teachers.length; i++) {
            if (teachers[i].id === id) {
                error.textContent = "Teacher ID already exists.";
                return;
            }
        }
    }

    const teacher = { id: id, name: name, subject: subject, className: className };
    if (editingTeacherId) {
        for (let i = 0; i < teachers.length; i++) {
            if (teachers[i].id === editingTeacherId) {
                teachers[i] = teacher;
            }
        }
    } else {
        teachers.push(teacher);
    }
    addActivity("Teacher saved");
    saveData();
    closeForm("teacher-form");
    updateEverything();
    showMessage("Teacher saved.");
}

function deleteTeacher(id) {
    if (!confirm("Delete this teacher?")) {
        return;
    }
    teachers = teachers.filter(function (teacher) {
        return teacher.id !== id;
    });
    saveData();
    updateEverything();
    showMessage("Teacher deleted.");
}

function displayClasses() {
    let html = "";
    for (let i = 0; i < classes.length; i++) {
        const item = classes[i];
        let count = 0;
        for (let j = 0; j < students.length; j++) {
            if (students[j].className === item.name) {
                count++;
            }
        }
        html += "<tr><td>" + item.name + "</td><td>" + item.grade + "</td><td>" + item.teacher +
            "</td><td>" + count + " Students</td><td><button type='button' class='btn btn-small btn-danger' data-delete-class='" +
            item.name + "'>Delete</button></td></tr>";
    }
    document.getElementById("classes-body").innerHTML = html;
}

function saveClass(event) {
    event.preventDefault();
    const name = document.getElementById("c-name").value.trim();
    const grade = document.getElementById("c-grade").value;
    const teacher = document.getElementById("c-teacher").value.trim();
    const error = document.getElementById("class-error");

    if (!name || !grade || !teacher) {
        error.textContent = "Please complete all fields.";
        return;
    }
    for (let i = 0; i < classes.length; i++) {
        if (classes[i].name === name) {
            error.textContent = "Class already exists.";
            return;
        }
    }
    classes.push({ name: name, grade: grade, teacher: teacher });
    saveData();
    closeForm("class-form");
    updateEverything();
    showMessage("Class saved.");
}

function displayAttendance() {
    let present = 0;
    let html = "";
    for (let i = 0; i < attendance.length; i++) {
        const item = attendance[i];
        if (item.status !== "Absent") {
            present++;
        }
        html += "<tr><td>" + getStudentName(item.studentId) + "</td><td>" + item.date +
            "</td><td>" + item.status + "</td></tr>";
    }
    document.getElementById("att-total").textContent = attendance.length;
    document.getElementById("att-present").textContent = present;
    document.getElementById("att-percent").textContent = attendancePercentage().toFixed(0) + "%";
    document.getElementById("attendance-body").innerHTML = html;
}

function addAttendance(event) {
    event.preventDefault();
    attendance.push({
        studentId: document.getElementById("att-student").value,
        date: document.getElementById("att-date").value,
        status: document.getElementById("att-status").value
    });
    addActivity("Attendance recorded");
    saveData();
    updateEverything();
    showMessage("Attendance saved.");
}

function displayMarks() {
    let html = "";
    for (let i = 0; i < marks.length; i++) {
        const mark = marks[i];
        html += "<tr><td>" + getStudentName(mark.studentId) + "</td><td>" + mark.subject +
            "</td><td>" + mark.assessment + "</td><td>" + mark.mark +
            "</td><td><button type='button' class='btn btn-small btn-danger' data-delete-mark='" +
            mark.id + "'>Delete</button></td></tr>";
    }
    document.getElementById("marks-body").innerHTML = html;
    displayAverages();
}

function displayAverages() {
    let html = "";
    for (let i = 0; i < students.length; i++) {
        const average = calculateAverage(students[i].id);
        if (average === null) {
            continue;
        }
        html += "<div class='average-item'><strong>" + getStudentName(students[i].id) +
            "</strong> — " + average.toFixed(1) + "% — " + performanceStatus(average) + "</div>";
    }
    document.getElementById("averages").innerHTML = html || "No marks recorded.";
}

function addMark(event) {
    event.preventDefault();
    const value = Number(document.getElementById("mk-value").value);
    const error = document.getElementById("mark-error");
    if (value < 0 || value > 100) {
        error.textContent = "Mark must be between 0 and 100.";
        return;
    }
    error.textContent = "";
    marks.push({
        id: Date.now(),
        studentId: document.getElementById("mk-student").value,
        subject: document.getElementById("mk-subject").value,
        assessment: document.getElementById("mk-assessment").value.trim(),
        mark: value
    });
    addActivity("Mark added");
    saveData();
    document.getElementById("mark-form").reset();
    updateEverything();
    showMessage("Mark saved.");
}

function updateReports() {
    document.getElementById("rep-students").textContent = students.length;
    document.getElementById("rep-teachers").textContent = teachers.length;
    document.getElementById("rep-classes").textContent = classes.length;
    document.getElementById("rep-average").textContent = overallAverage().toFixed(1) + "%";
    document.getElementById("rep-attendance").textContent = attendancePercentage().toFixed(0) + "%";

    const subjects = ["Mathematics", "Computer Science", "English", "Science"];
    let html = "";
    for (let i = 0; i < subjects.length; i++) {
        let total = 0;
        let count = 0;
        for (let j = 0; j < marks.length; j++) {
            if (marks[j].subject === subjects[i]) {
                total += Number(marks[j].mark);
                count++;
            }
        }
        const average = count === 0 ? 0 : total / count;
        html += "<div class='bar'><span>" + subjects[i] + "</span><div class='bar-bg'><div class='bar-fill' style='width:" +
            average + "%'></div></div><b>" + average.toFixed(0) + "%</b></div>";
    }
    document.getElementById("subject-bars").innerHTML = html;
}

function fillStudentSelects() {
    let options = "<option value=''>Select student</option>";
    for (let i = 0; i < students.length; i++) {
        options += "<option value='" + students[i].id + "'>" + getStudentName(students[i].id) + "</option>";
    }
    document.getElementById("att-student").innerHTML = options;
    document.getElementById("mk-student").innerHTML = options;
}

function closeForm(id) {
    document.getElementById(id).classList.add("hidden");
}

function resetData() {
    if (!confirm("Reset all data to the original demo data?")) {
        return;
    }
    applyData(demoData());
    saveData();
    document.getElementById("school-title").textContent = schoolName;
    document.getElementById("set-name").value = schoolName;
    updateEverything();
    showMessage("Demo data reset.");
}

function updateEverything() {
    fillStudentSelects();
    displayStudents();
    displayTeachers();
    displayClasses();
    displayAttendance();
    displayMarks();
    updateDashboard();
    updateReports();
}

function login(event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    if (username === "admin" && password === "1234") {
        document.getElementById("login-error").textContent = "";
        document.getElementById("login-page").classList.add("hidden");
        document.getElementById("app").classList.remove("hidden");
        updateEverything();
    } else {
        document.getElementById("login-error").textContent = "Incorrect username or password.";
    }
}

function logout() {
    document.getElementById("app").classList.add("hidden");
    document.getElementById("login-page").classList.remove("hidden");
    document.getElementById("login-form").reset();
    document.getElementById("login-error").textContent = "";
}

function openMenu() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("overlay").classList.remove("hidden");
}

function closeMenu() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("overlay").classList.add("hidden");
}

document.getElementById("login-form").addEventListener("submit", login);
document.getElementById("logout-btn").addEventListener("click", logout);
document.getElementById("menu-btn").addEventListener("click", openMenu);
document.getElementById("overlay").addEventListener("click", closeMenu);
document.getElementById("student-search").addEventListener("input", displayStudents);
document.getElementById("grade-filter").addEventListener("change", displayStudents);
document.getElementById("show-student-form").addEventListener("click", function () {
    openStudentForm();
});
document.getElementById("cancel-student").addEventListener("click", function () {
    closeForm("student-form");
});
document.getElementById("student-form").addEventListener("submit", saveStudent);
document.getElementById("teacher-search").addEventListener("input", displayTeachers);
document.getElementById("show-teacher-form").addEventListener("click", function () {
    openTeacherForm();
});
document.getElementById("cancel-teacher").addEventListener("click", function () {
    closeForm("teacher-form");
});
document.getElementById("teacher-form").addEventListener("submit", saveTeacher);
document.getElementById("show-class-form").addEventListener("click", function () {
    document.getElementById("class-form").classList.remove("hidden");
    document.getElementById("class-error").textContent = "";
});
document.getElementById("cancel-class").addEventListener("click", function () {
    closeForm("class-form");
});
document.getElementById("class-form").addEventListener("submit", saveClass);
document.getElementById("attendance-form").addEventListener("submit", addAttendance);
document.getElementById("mark-form").addEventListener("submit", addMark);
document.getElementById("settings-form").addEventListener("submit", function (event) {
    event.preventDefault();
    schoolName = document.getElementById("set-name").value.trim() || "Nexus High School";
    document.getElementById("school-title").textContent = schoolName;
    saveData();
    showMessage("Settings saved.");
});
document.getElementById("reset-btn").addEventListener("click", resetData);

const navLinks = document.querySelectorAll(".nav-link");
for (let i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        showPage(this.dataset.page);
    });
}

document.addEventListener("click", function (event) {
    const target = event.target;
    if (target.dataset.editStudent) {
        openStudentForm(getStudent(target.dataset.editStudent));
    }
    if (target.dataset.deleteStudent) {
        deleteStudent(target.dataset.deleteStudent);
    }
    if (target.dataset.editTeacher) {
        openTeacherForm(getStudentTeacher(target.dataset.editTeacher));
    }
    if (target.dataset.deleteTeacher) {
        deleteTeacher(target.dataset.deleteTeacher);
    }
    if (target.dataset.deleteClass) {
        if (confirm("Delete this class?")) {
            classes = classes.filter(function (item) {
                return item.name !== target.dataset.deleteClass;
            });
            saveData();
            updateEverything();
        }
    }
    if (target.dataset.deleteMark) {
        if (confirm("Delete this mark?")) {
            marks = marks.filter(function (item) {
                return String(item.id) !== target.dataset.deleteMark;
            });
            saveData();
            updateEverything();
        }
    }
});

function getStudentTeacher(id) {
    for (let i = 0; i < teachers.length; i++) {
        if (teachers[i].id === id) {
            return teachers[i];
        }
    }
    return null;
}

loadData();
document.getElementById("school-title").textContent = schoolName;
document.getElementById("set-name").value = schoolName;
document.getElementById("att-date").value = new Date().toISOString().slice(0, 10);
