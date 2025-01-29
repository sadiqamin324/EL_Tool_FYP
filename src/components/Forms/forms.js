

const a1 = document.getElementsByClassName("a1");
const back_arrow = document.getElementsByClassName("back-arrow");
const db_details=document.getElementsByClassName("db-details");
const inputs = document.getElementsByTagName("input");


export function OpenDropDown() {
  a1[0].classList.toggle("hidden");
  back_arrow[0].classList.toggle('rotate-180');
}

export function CloseDropDown(){
    a1[0].classList.add("hidden");
    db_details[0].classList.remove('hidden');
}

export function MouseOver(){
    event.target.classList.add('bg-gray-300');
}

export function MouseLeave(){
    event.target.classList.remove('bg-gray-300');
} 

export function MouseOverRed(){
    event.target.classList.add('bg-red-200');
}

export function MouseLeaveRed(){
    event.target.classList.remove('bg-red-200');
}

export function EmptyInput(){
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = ''; // Set the value to an empty string
    }
    
}


export async function HandleClick(){
    console.log("🔵 Sending request to backend...");

    try {
        const response = await fetch('http://localhost:5000/connect-database', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.success) {
            alert(`Database connected successfully! Time: ${data.time}`);
        } else {
            alert('Database connection failed.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to the database.');
    }
}