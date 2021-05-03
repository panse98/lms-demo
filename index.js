const Joi =require('joi');
const express= require('express');
const { response } = require('express');
const app = express();

const bodyParser=require('body-parser');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.static('./public'))






let courses=[];
let students=[];
let courseID=0;
let studentID=0;

function validateCourse(course) {
        const schema={

                name: Joi.string().min(5).required(),
                
                code: Joi.string().required().regex(/[A-Za-z]{3}[0-9]{3}/).length(6),
                
                description:Joi.string().max(200).optional().allow("")
                
                }
        return Joi.validate(course, schema);
    }



app.get('/api/courses',(req,res)=>
{
res.send(courses);
});

// get one course
app.get('/api/courses/:id',(req,res)=>
{
const course=courses.find(c=>c.id===parseInt(req.params.id));
if(!course)
{
        res.status(404).send('The course with given id was not found!');
        return;    
}
res.send(course);
});


app.get('/web/courses/create',(req,res)=>{
        res.sendFile('/public/courses_form.html',{root:__dirname});
});


app.post('/api/courses',(req,res)=>
{


        const { error } = validateCourse(req.body);
        if (error) {
        res.status(400).send(error.details[0].message);

return;
        }       

var new_course = {
        id: courses.length + 1,
        name: req.body.name ,
        code: req.body.code,
    };

if(req.body.description)
    { 
        new_course.description = req.body.description;
    }
    
courses.push(new_course);
res.send(new_course);
res.end();

});



app.delete('/api/courses/:id',(req,res)=>
{
 const course = courses.find(c => c.id === parseInt(req.params.id));
if (!course) // error 404 object not found
        {
            res.status(404).send('THe course with the given id was not found.');
            return;
        }
        const index=courses.indexOf(course);
        courses.splice(index,1);
        res.send(course)
});


app.put('/api/courses/:id',(req,res)=>{

        const course = courses.find(c => c.id === parseInt(req.params.id));
        if (!course) // error 404 object not found
                {
                    res.status(404).send('THe course with the given id was not found.');
                    return;
                }

                const { error } = validateCourse(req.body); // result.error
                if (error) {
                    res.status(400).send(error.details[0].message);
                    return;
                }
                course.name = req.body.name;
                course.id=req.body.id
                if(req.body.description)
                { 
                    course.description = req.body.description;
                }
            
                res.send(course);

                
            
});

/****************************************** */

function validateStudent(student) {
        const schema={

                name: Joi.string().required().regex(/^([A-Za-z]|,|-)*$/i),
                code:Joi.string().required().length(7)
        
        }

        return Joi.validate(student, schema);
}


app.get('/api/students',(req,res)=>
{
res.send(students);
});
// get one student

app.get('/api/students/:id',(req,res)=>
{

const student = students.find(s=>s.id===parseInt(req.params.id));
if(!student)
{
        res.status(404).send('The student with given id was not found!');
        return;    
}
res.send(student);

});
/**************************** */

app.get('/web/students/create',(req,res)=>{
        res.sendFile('/public/students_form.html',{root:__dirname});
});


app.post('/api/students',(req,res)=>
{


const result = validateStudent(req.body);
if (result.error) {
        res.status(400).send(result.error.details[0].message);
}

const new_student = {
        id: students.length + 1,
        name: req.body.name ,
        code: req.body.code
    };


    
students.push(new_student)
res.send(new_student);
res.end()
//res.json({"students":students})

});





app.delete('/api/students/:id',(req,res)=>
{
 const student = students.find(s => s.id === parseInt(req.params.id));
if (!student) // error 404 object not found
        {
            res.status(404).send('The student with the given id was not found.');
            return;
        }
        const index=students.indexOf(student);
        students.splice(index,1);
        res.send(student)
});

app.put('/api/students/:id',(req,res)=>{

        const student = students.find(s => s.id === parseInt(req.params.id));
        if (!student) // error 404 object not found
                {
                    res.status(404).send('The student with the given id was not found.');
                    return;
                }

                const { error } = validateStudent(req.body); // result.error
                if (error) {
                    res.status(400).send(error.details[0].message);
                    return;
                }
                student.name = req.body.name;
                student.id=req.body.id
               
            
                res.send(student);

                
            
});


const port = process.env.PORT || 3000
app.listen(port);
//app.listen(port /*PortNumber*/, () => console.log(`Listeneing on port ${port}......`));