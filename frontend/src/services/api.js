import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const predictStudent = (data) => api.post("predict/", data);

export const getStudents = (params = {}) => api.get("students/", { params });

export const getStudent = (id) => api.get(`students/${id}/`);

export const createStudent = (data) => api.post("students/", data);

export const updateStudent = (id, data) => api.put(`students/${id}/`, data);

export const deleteStudent = (id) => api.delete(`students/${id}/`);

export const uploadCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAnalytics = () => api.get("analytics/");

export default api;