import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

const App = dynamic(() => import("./App"), { ssr: false, loading: () => <Loader /> });

export default App;
