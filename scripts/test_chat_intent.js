import fetch from 'node-fetch'; // Polyfill if node version is < 18, otherwise global fetch is used.

/**
 * To run this script: 
 * node scripts/test_chat_intent.js
 * 
 * NOTE: Ensure the backend is running on http://localhost:5000
 */

async function testChatIntent() {
  const url = 'http://localhost:5000/chat';
  
  const testCases = [
    { 
        name: 'General Greeting', 
        body: { message: 'Hello, how are you?' } 
    },
    { 
        name: 'Attendance Query (No Student ID)', 
        body: { message: 'What is my attendance?' } 
    },
    { 
        name: 'Attendance Query (With Student ID)', 
        body: { message: 'What is my attendance?', rollNo: '12345' } 
    },
    { 
        name: 'Marks Query (With Student ID)', 
        body: { message: 'Show my marks.', regNo: '12345' } 
    },
    { 
        name: 'Timetable Query (With Student ID)', 
        body: { message: 'When is my next class?', rollNo: '12345' } 
    }
  ];

  console.log("Starting Chat Intent Detection Tests...");
  console.log("---------------------------------------");

  for (const tc of testCases) {
    console.log(`[Test] ${tc.name}`);
    console.log(`[Payload] ${JSON.stringify(tc.body)}`);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tc.body),
      });

      if (!res.ok) {
        console.error(`[Error] HTTP Status: ${res.status}`);
        const errText = await res.text();
        console.error(`[Body] ${errText}`);
        continue;
      }

      const data = await res.json();
      console.log(`[Response] ${JSON.stringify(data, null, 2)}`);
      console.log("---------------------------------------");
    } catch (err) {
      console.error(`[Fatal] ${err.message}`);
      console.log("---------------------------------------");
    }
  }
}

testChatIntent();
