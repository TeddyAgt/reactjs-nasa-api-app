import { useEffect, useState } from "react";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY;

    function handleToggleModal() {
        setShowModal(!showModal);
    }

    useEffect(() => {
        async function fetchApiDate() {
            const url =
                "https://api.nasa.gov/planetary/apod" +
                `?api_key=${NASA_API_KEY}`;

            const today = new Date().toDateString();
            const localKey = `NASA-${today}`;
            if (localStorage.getItem(localKey)) {
                const apiData = JSON.parse(localStorage.getItem(localKey));
                setData(apiData);
                console.log("Fetched from local storage today");
                return;
            }
            localStorage.clear();

            try {
                const response = await fetch(url);
                const apiData = await response.json();
                localStorage.setItem(localKey, JSON.stringify(apiData));
                setData(apiData);
                console.log("Fetched from API today");
            } catch (error) {
                console.log(error);
            }
        }
        fetchApiDate();
    }, []);

    return (
        <>
            {data ? (
                <Main data={data} />
            ) : (
                <div className="loadingState">
                    <i className="fa-solid fa-gear"></i>
                </div>
            )}
            {showModal && (
                <Sidebar
                    data={data}
                    handleToggleModal={handleToggleModal}
                />
            )}
            {data && (
                <Footer
                    data={data}
                    handleToggleModal={handleToggleModal}
                />
            )}
        </>
    );
}

export default App;
