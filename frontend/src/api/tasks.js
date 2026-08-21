const API_URL = "http://localhost:4000/api/tasks";

const getToken = () => {
  return localStorage.getItem("token");
};

const request = async (url, options = {}) => {
  const token = getToken();

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        data.error ||
        "Something went wrong"
    );
  }

  return data;
};

export async function fetchTasks() {
  return request(API_URL, {
    method: "GET",
  });
}

export async function createTask(task) {
  return request(API_URL, {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export async function updateTask(taskId, changes) {
  return request(`${API_URL}/${taskId}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export async function deleteTask(taskId) {
  return request(`${API_URL}/${taskId}`, {
    method: "DELETE",
  });
}