const axios = require('axios');

const odooUrl = 'http://localhost:8069';  // Replace with your Odoo instance URL
const database = 'NEDUniversity-7';             // Use the database name you're working with
const username = 'admin';               // Replace with your Odoo username
const password = 'admin';               // Replace with your Odoo password

// Function to authenticate and get user ID
async function authenticate() {
  const url = `${odooUrl}/jsonrpc`;
  const headers = { 'Content-Type': 'application/json' };

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'common',
      method: 'login',
      args: [database, username, password]
    },
    id: 1
  };

  try {
    const response = await axios.post(url, payload, { headers });
    if (response.data.result) {
      console.log('Authenticated successfully');
      return response.data.result;  // user_id
    } else {
      console.error('Authentication failed');
      return null;
    }
  } catch (error) {
    console.error('Error in authentication:', error);
    return null;
  }
}

// Function to call Odoo ORM methods (e.g., search, read, create)
async function callOdooMethod(model, method, args) {
  const url = `${odooUrl}/jsonrpc`;
  const headers = { 'Content-Type': 'application/json' };

  const payload = {
    jsonrpc: '2.0',
    method: 'call',
    params: {
      service: 'object',
      method: method,
      args: [database, await authenticate(), password, model, ...args]
    },
    id: 1
  };

  try {
    const response = await axios.post(url, payload, { headers });
    return response.data.result;
  } catch (error) {
    console.error(`Error calling ${method} on model ${model}:`, error);
    return null;
  }
}

// Example: Using the callOdooMethod function to search for records
async function getStudents() {
  const model = 'student.model';  // Replace with your specific model
  const method = 'search_read';
  const args = [['active', '=', true], ['name', 'address']];  // example filter and fields
  const result = await callOdooMethod(model, method, args);
  console.log(result);
}

// Example of 'create' method
async function createStudent() {
  const model = 'student.model';  // Replace with your specific model
  const method = 'create';
  const args = [{ 'name': 'John Doe', 'address': '123 Street' }];  // example data
  const result = await callOdooMethod(model, method, args);
  console.log(result);  // Returns the ID of the newly created record
}

// Run examples
getStudents();
createStudent();
