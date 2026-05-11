const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
 
}, { strict: false, timestamps: true });

const Student = mongoose.model("Student", StudentSchema);
module.exports = Student;
