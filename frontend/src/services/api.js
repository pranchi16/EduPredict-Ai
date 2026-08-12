import axios from "axios";
const api=axios.create({baseURL:"http://127.0.0.1:8000/api/",headers:{"Content-Type":"application/json"}});
export const predictStudent=(data)=>api.post("predict/",data);
export const getStudents=()=>api.get("students/");
export const createStudent=(data)=>api.post("students/",data);
export default api;