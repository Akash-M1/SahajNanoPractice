const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const fs=require('fs');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
// Greeting 
app.get('/greeting', (req, res) => {
    return res.send('Hello world!');
});

// Register Employee
app.post('/employee', (req, res) => {
    const empDet = require('./home/employee.json');
    let empId = crypto.randomBytes(10).toString('hex');
    let empName = req.body.name;
    let empCity = req.body.city;
    let empObj = {
        employeeId:empId,
        name:empName,
        city:empCity
    }
    empDet.push(empObj);
    const data=JSON.stringify(empDet);
    try{
        fs.writeFileSync("./home/employee.json",data);
    }
    catch(err){
        console.log("Error");
    }
    return res.status(201).json({ 
        "employeeId": empId 
    });
});

// Get Employee detail
app.get('/employee/:id', (req, res) => {
    const empDet = require('./home/employee.json');
    let empId = req.params.id;
    let filEmp = empDet.filter((emp)=>{
        return emp.employeeId == empId;
    });
    if(filEmp.length>0){
        return res.status(200).json(filEmp[0]);
    }
    else{
        return res.status(404).json({ 
            message : `Employee with ${empId} was not found`
        });
    }
});

// Get all Employee details
app.get('/employees/all', (req, res) => {
    const empDet = require('./home/employee.json');
    return res.status(200).json(empDet);
});

// Update Employee
app.put('/employee/:id', (req, res) => {
    const empDet = require('./home/employee.json');
    let empId = req.params.id;
    let filEmp = empDet.findIndex(x => x.employeeId==empId);
    if(filEmp==-1){
        return res.status(404).json({ 
            message : `Employee with ${empId} was not found`
        });
    }
    else{
        let empName = req.body.name;
        let empCity = req.body.city;
        let empObj = {
            employeeId:empId,
            name:empName,
            city:empCity
        };
        empDet.splice(filEmp,1,empObj);
        const data=JSON.stringify(empDet);
        try{
            fs.writeFileSync("./home/employee.json",data);
        }
        catch(err){
            console.log("Error");
        }
        return res.status(201).json(empObj);
    }
});

// Delete Employee
app.delete('/employee/:id', (req, res)=>{
    const empDet = require('./home/employee.json');
    let empId = req.params.id;
    let filEmp = empDet.findIndex(x => x.employeeId==empId);
    if(filEmp==-1){
        return res.status(404).json({ 
            message : `Employee with ${empId} was not found`
        });
    }
    else{
        let empObj = empDet[filEmp];
        empDet.splice(filEmp,1);
        const data=JSON.stringify(empDet);
        try{
            fs.writeFileSync("./home/employee.json",data);
        }
        catch(err){
            console.log("Error");
        }
        return res.status(200).json(empObj);
    }
});

app.listen(PORT, () => {
    console.log("Server running at PORT", PORT);
});