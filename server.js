const express = require("express");
const res = require("express/lib/response");
const app = express();
const fs = require('fs');
const winston = require('winston');
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculate-service' },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

// functions for each type of arithmetic operation
const add = (n1,n2) => {
  return n1+n2;
}
const subtract = (n1,n2) => {
  return n1-n2;
}
const multiply = (n1,n2) => {
  return n1*n2;
}
const divide = (n1,n2) => {
  return n1/n2; 
}
const exponentiation = (n1, n2) => {
  return n1**n2; 
}
const squareroot = (n1) => {
  return Math.sqrt(n1); 
}
const modulo = (n1, n2) => {
  return n1%n2; 
}

// Function for validating numbers based on the operation. 
function validateNumbers(operation, number, order) {
  var result
  if(isNaN(number)) {
    result = "Is not a valid number. "
  }
  else if ( operation == 'div' & number == 0 & order == '2' ) {
    result = "Cannot divide by zero. "
  }
  else if ( operation == 'sqrt' & number <0 & order == '1' ) {
    //for square root, only need to check the first number is greater than or equal to zero - can't square root a negative
    result = "Cannot find a square root of a negative number. "
  }
  else {
    result = "OK"
  }
  return result;
}

// Error handling function
function errorHandling(operation, n1, n2) {
  // while this error handling is a little more onerous, it provides info on both numbers provided, which is better feedback for the user. 
  error1 = validateNumbers(operation, n1, '1')
  error2 = validateNumbers(operation, n2, '2')
  if( error1 != 'OK' | error2 != 'OK') {
    if (error1 != 'OK' & error2 != 'OK') {
      logger.error("Errors: " + error1 + "\nand: " + error2)
      throw new Error("n1 " + error1 + "n2 " + error2)
    } 
    else if ( error1 != 'OK' ) {
      logger.error("Errors: " + error1)
      throw new Error("n1 " + error1)
    }
    else if ( error2 != 'OK' ) {
      logger.error("Errors: " + error2)
      throw new Error("n2 " + error2)
    }
  }
}

// api endpoint for /add
app.get("/add", (req, res) => {
  try{
    const operation = "add"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)

    errorHandling(operation, n1, n2)
    
    logger.info("Parameters " + n1 + " and " + n2 + " received for addition. ") 
    const result = add(n1, n2)
    res.status(200).json({statuscode:200, data: result})
  } 
  catch(error) { 
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

// api endpoint for /sub
app.get("/sub", (req, res) => {
  try {
    const operation = "sub"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)

    errorHandling(operation, n1, n2)

    logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for subtraction. ')
    const result = subtract(n1, n2)
    res.status(200).json({statuscode: 200, data: result})
  }
  catch(error) {
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

//api endpoint for /mult
app.get("/mult", (req, res) => {
  try {
    const operation = "mult"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)

    //errors checked here. 
    errorHandling(operation, n1, n2)

    logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for multiplication. ')
    const result = multiply(n1, n2)
    res.status(200).json({statuscode: 200, data: result})
  }
  catch(error) {
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

//api endpoint for /div
app.get("/div", (req, res) => {
  try {
    const operation = "div"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)
    
    //errors checked here. 
    errorHandling(operation, n1, n2)

    logger.info('Parameters ' + n1 + ' and ' + n2 + ' received for division. ')
    const result = divide(n1, n2)
    res.status(200).json({statuscode:200, data: result})
  }
  catch(error) {
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

// CREDIT API POINTS FROM HERE: 

// exponentiation
// api endpoint for /exp 
app.get("/exp", (req, res) => {
  try{
    const operation = "exp"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)

    errorHandling(operation, n1, n2)
    
    logger.info("Parameters " + n1 + " and " + n2 + " received for exponentiaition. ") 
    const result = exponentiation(n1, n2)
    res.status(200).json({statuscode:200, data: result})
  } 
  catch(error) { 
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

// squareroot - only needs one parameter 
// api endpoint for /sqrt 
app.get("/sqrt", (req, res) => {
  try{
    const operation = "sqrt"
    const n1 = parseFloat(req.query.n1)

    errorHandling(operation, n1, 0)
    
    logger.info("Parameter " + n1 + " received for squareroot. ") 
    const result = squareroot(n1)
    res.status(200).json({statuscode:200, data: result})
  } 
  catch(error) { 
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

// modulo 
// api endpoint for /mod 
app.get("/mod", (req, res) => {
  try{
    const operation = "mod"
    const n1 = parseFloat(req.query.n1)
    const n2 = parseFloat(req.query.n2)

    errorHandling(operation, n1, n2)
    
    logger.info("Parameters " + n1 + " and " + n2 + " received for modulo. ") 
    const result = modulo(n1, n2)
    res.status(200).json({statuscode:200, data: result})
  } 
  catch(error) { 
    console.error(error)
    res.status(500).json({statuscode: 500, msg: error.toString()})
  }
})

const port=3040
app.listen(port,()=> {
    console.log("hello i'm listening to port " + port)
})