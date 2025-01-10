"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// In your other TypeScript files like addtask.ts, auth.ts, etc.
var config_1 = require("./config");
// Function to add a new task
function addTask(title, description) {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, newTask, errorMessage, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token');
                    if (!token) {
                        alert('You are not authorized. Please log in.');
                        window.location.href = 'login.html';
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, fetch(config_1.API_URL, {
                            method: 'POST',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ title: title, description: description }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    newTask = _a.sent();
                    addTaskToDOM(newTask); // Add the task dynamically to the DOM
                    alert('Task added successfully!');
                    return [3 /*break*/, 7];
                case 4:
                    if (!(response.status === 401)) return [3 /*break*/, 5];
                    alert('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, response.text()];
                case 6:
                    errorMessage = _a.sent();
                    console.error('Error adding task:', errorMessage);
                    alert('Failed to add task. Please try again.');
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('Network error:', error_1);
                    alert('An error occurred. Please check your connection and try again.');
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Function to dynamically render a task in the DOM
function addTaskToDOM(task) {
    var _a;
    var tasksList = document.getElementById('tasksList');
    var taskHTML = "\n    <div class=\"col-md-4 mb-4\" id=\"task-".concat(task._id, "\">\n      <div class=\"card\">\n        <div class=\"card-body\">\n          <h5 class=\"card-title\">").concat(task.title, "</h5>\n          <p class=\"card-text\">").concat(task.description, "</p>\n          <button class=\"btn btn-warning btn-sm\" id=\"editButton-").concat(task._id, "\">Edit</button>\n          <button class=\"btn btn-danger btn-sm ms-2\" onclick=\"deleteTask('").concat(task._id, "')\">Delete</button>\n        </div>\n      </div>\n    </div>\n  ");
    tasksList.innerHTML += taskHTML;
    // Attach the edit functionality to the newly added "Edit" button
    (_a = document
        .getElementById("editButton-".concat(task._id))) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        editTask(task._id, task.title, task.description);
    });
}
// Fetch tasks from the backend
function fetchTasks() {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, data, tasksList, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = localStorage.getItem('token');
                    if (!token) {
                        alert('Please login to continue');
                        window.location.href = 'login.html';
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch(config_1.API_URL, {
                            method: 'GET',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                            },
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _a.sent();
                    console.log('Fetched Data:', data);
                    tasksList = document.getElementById('tasksList');
                    tasksList.innerHTML = ''; // Clear existing tasks
                    if (Array.isArray(data)) {
                        // If data is an array, iterate over it
                        data.forEach(function (task) {
                            addTaskToDOM(task); // Render tasks if valid
                        });
                    }
                    else {
                        console.error('Expected an array of tasks, but received:', data);
                        alert('Failed to load tasks. Please try again.');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    if (response.status === 401) {
                        alert('Session expired. Please login again.');
                        localStorage.removeItem('token');
                        window.location.href = 'login.html';
                    }
                    else {
                        alert('Failed to load tasks');
                    }
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.error('Error fetching tasks:', error_2);
                    alert('An error occurred while fetching tasks.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
// Edit a task
function editTask(id, title, description) {
    // Store the task ID in localStorage for editing
    localStorage.setItem('editTaskId', id);
    window.location.href = 'add-task.html'; // Redirect to the add-task page
}
// Delete a task
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function () {
        var token, response, error_3;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    token = localStorage.getItem('token');
                    if (!token) {
                        window.location.href = 'login.html';
                        return [2 /*return*/];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(config_1.API_URL, "/").concat(id), {
                            method: 'DELETE',
                            headers: {
                                Authorization: "Bearer ".concat(token),
                            },
                        })];
                case 2:
                    response = _b.sent();
                    if (response.ok) {
                        (_a = document.getElementById("task-".concat(id))) === null || _a === void 0 ? void 0 : _a.remove(); // Remove task from DOM
                        // alert('Task deleted successfully!');
                    }
                    else {
                        alert('Failed to delete task. Please try again.');
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _b.sent();
                    console.error('Network error:', error_3);
                    alert('An error occurred while deleting the task.');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Add event listener to the add task form
(_a = document.getElementById('addTaskForm')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', function (event) {
    event.preventDefault();
    var taskTitle = document.getElementById('taskTitle').value;
    var taskDescription = document.getElementById('taskDescription').value;
    addTask(taskTitle, taskDescription); // Add task and render it
});
// Call fetchTasks when the page loads
fetchTasks();
