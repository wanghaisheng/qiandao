// Get reference to the component from the window object
// No import needed since we're exposing the component globally in ChallengeApp.jsx

// Add custom CSS for animations
const style = document.createElement('style');
style.innerHTML = `
  @keyframes bounce-in {
    0% { transform: scale(0.5); opacity: 0; }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes fade-in-up {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  .animate-bounce-in {
    animation: bounce-in 0.5s ease-out forwards;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out forwards;
  }
  
  .animate-pulse {
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(style);

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(window.ChallengeApp));
