import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as YourSvg } from "./ua-logo.svg";
import Modal from "./Modal/Modal";
import { useState } from "react";
import ValidateContent from "./Modal/components/ValidateContent";
import ExportContent from "./Modal/components/ExportContent";

function Navbar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const ids = window.profsIdsAndNames;
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [warnings, setWarnings] = useState(null);

  function loadNavComponents() {
    let result = [];

    if (location.pathname == "/change-acronym") {
      result.push(<li className="on-page">Alterar siglas</li>);
    } else
      result.push(
        <li className="nav-item" onClick={changeAcronym}>
          Alterar siglas
        </li>
      );

    return <>{result}</>;
  }

  function handleClick() {
    props.onReload();
  }

  function changeValidateModal() {
    setShowValidateModal(!showValidateModal);
  }

  function changeExportModal() {
    setShowExportModal(!showExportModal);
  }

  function changeAcronym() {
    navigate("/change-acronym", { state: { profs: ids } });
  }

  function goHome() {
    navigate("/");
  }

  function validateDSD() {
    var max_hours = 8;
    fetch(`http://localhost:8000/v1/validate_dsd/?max_hours=${max_hours}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setWarnings(data);
        setShowValidateModal(!showValidateModal);
      });
  }

  function exportDSD(type) {
      if (type==="json") {
        window.location.href =
        "http://localhost:8000/v1/export_dsd/?file_type=json";
        setShowExportModal(!showExportModal);
      } else if (type==="csv"){
        window.location.href = "http://localhost:8000/v1/export_dsd/?file_type=csv";
        setShowExportModal(!showExportModal);
      } else if (type==="xls") {
        window.location.href = "http://localhost:8000/v1/export_dsd/?file_type=xls";
        setShowExportModal(!showExportModal);
      } else {
          console.log("bad type");
      }
  }

  return (
    <>
      {showValidateModal && (
        <Modal changeModal={changeValidateModal}>
          <ValidateContent
            changeModal={changeValidateModal}
            warnings={warnings}
          />
        </Modal>
      )}

      {showExportModal && (
        <Modal changeModal={changeExportModal}>
          <ExportContent
            onJSONClick={exportDSD("json")}
            onCSVClick={exportDSD("csv")}
            onXLSClick={exportDSD("xls")}
          />
        </Modal>
      )}
      <div className="navbar">
        <div className="ua-logo" onClick={goHome}>
          <YourSvg className="ua-logo-img" />
          <span className="logo-legend">dsd</span>
        </div>
        <ul className="navbar-items">
          {loadNavComponents()}
          <li className="nav-item" onClick={validateDSD}>
            Validar
          </li>
          <li className="nav-item" onClick={changeExportModal}>
            Exportar
          </li>
          <i style={{ fontSize: "18px" }} className="fa" onClick={handleClick}>
            &#xf021;
          </i>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
