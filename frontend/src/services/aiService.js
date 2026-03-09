export const generateAIResponse = async (question, dashboardData) => {
  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      // Pass the fully contextualized question to the backend
      body: JSON.stringify({ question })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.answer || "No response received from backend.";
  } catch (error) {
    console.error("Error communicating with backend:", error);
    return "AI error occurred while contacting the server.";
  }
};