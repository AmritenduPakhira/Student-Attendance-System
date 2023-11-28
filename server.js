const express= require('express')
const app = express()
const teacherSchema = require('./models/teacher.schema')
const studentSchema = require('./models/student.schema')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/myDB')
.then(()=>{
    console.log(
        'db connected'
    )
})

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

const teacherRouter = express.Router();
app.use('/teacher', teacherRouter);

const studentRouter = express.Router();
app.use('/student', studentRouter);


app.get("/",(req,res)=>{
    res.render('loginpage');
})

teacherRouter.get('/', (req,res)=>{
    res.render('teacherlogin')
})

studentRouter.get('/', (req,res)=>{
    res.render('studentlogin')
})

teacherRouter.get('/addstudent', (req,res)=>{
    res.render('teacher')
})

teacherRouter.get('/students', async (req, res) => {
    try {
        const amritendu = await teacherSchema.findOne({ username: "Amritendu Pakhira" }).populate('students');

        if (!amritendu) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        res.render('students', { students: amritendu.students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

studentRouter.post('/login',async(req,res)=>{
    try {
        const { roll_number } = req.body;
    
        // Find the student by roll number in the database
        const student = await studentSchema.findOne({ roll_number });
    
        if (!student) {
          return res.status(404).json({ message: 'Student not found' });
        }
    
        // Redirect or send the student data as needed
        res.render('student',{ student });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
})

teacherRouter.post('/post-attendance/:studentId', async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await studentSchema.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const { attendanceDate, status } = req.body;

        student.attendance.push({
            date: new Date(attendanceDate),
            isPresent: status === 'present',    
        });

        await student.save();

        res.redirect('/teacher/studentdata');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

teacherRouter.post('/', async (req,res)=>{
    console.log(req.body)
    const {username, roll, date:myDate} = req.body;
    const newStudent = await studentSchema.create({
        name: username,  // Assuming the student's name is the same as the username
        roll_number: roll,
        attendance: [
           { date: myDate,
            isPresent:true
            }
          ]
      });

      const amritendu = await teacherSchema.findOne({
        username:"Amritendu Pakhira",
      })
      
      amritendu.students.push(newStudent);
      await amritendu.save().then(()=> console.log('student saved'));
      const fetchAmritendu = await teacherSchema.findOne({
        username:"Amritendu Pakhira",
      })
    //   res.json(Object.create(fetchAmritendu));
      

      res.redirect('/teacher/students')

})

teacherRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const teacher = await teacherSchema.findOne({ username });

        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }

        if (password !== teacher.password) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        res.redirect('/teacher/addstudent');

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

teacherRouter.get('/studentdata', async (req, res) => {
    try {
        const allStudents = await studentSchema.find();

        res.render('studentdata', { students: allStudents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.listen(3001, ()=> console.log('server started'))