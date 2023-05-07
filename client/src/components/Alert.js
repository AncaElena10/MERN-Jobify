import { useAppContext } from "../context/appContext";

const Alert = () => {
    const { alertType, alertText } = useAppContext();

    console.log(alertType);

    return (
        <div className={`alert alert-${alertType}`}>{alertText}</div>
    );
};

export default Alert;
