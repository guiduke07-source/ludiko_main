import ClickSpark from "./Components/ClickSpark/ClickSpark.jsx";
import AppRoutes from "./routes.jsx";

function App() {
  return (
    <ClickSpark
      sparkColor="#000000"
      sparkSize={10}
      sparkRadius={30}
      sparkCount={8}
      duration={400}
    >
      <AppRoutes />
    </ClickSpark>
  );
}

export default App;