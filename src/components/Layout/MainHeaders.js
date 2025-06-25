import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { mainActions } from "../../store/main-slice";
import { useDispatch } from "react-redux";
import "./MainHeaders.css";

import { Link } from "react-router-dom";
import { useClientData } from "../../store/hook";
import { addRoom } from "../../store/room-slice";
import { useAuth0 } from "@auth0/auth0-react";
import { addPerson } from "../../store/user-slice";
import { useSelector } from "react-redux";

const MainHeaders = (props) => {
  const { myRooms, myPersons, room, person, clientId, chatPerson, roomActive } =
    useClientData();

  const personChatId = useSelector((state) => state.user.chatId);
  console.log("personChatId ooooooooooooooo", personChatId);

  const personsRooms = [...myPersons, ...myRooms];
  console.log(personsRooms);
  const personMessage = personsRooms.find(
    (person) => person.personId === personChatId
  );

  const { logout } = useAuth0();
  const localToken = localStorage.getItem("token");
  const dispatch = useDispatch();

  const handleOptionClick = (value) => {
    dispatch(mainActions.setCity(value));
  };

  const handleCreateRoom = async () => {
    dispatch(addRoom(clientId, room));
  };

  const handleCreatePerson = async () => {
    dispatch(addPerson(clientId, person));
  };

  const path1 = room ? "/protected" : "/regroommain";

  return (
    <>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Main
          </Navbar.Brand>
          <Navbar.Brand as={Link} to="/sosedi">
            Sosedi
          </Navbar.Brand>
          {clientId && (
            <>
              <Navbar.Brand>
                {!personMessage && (
                  <img
                    style={{
                      margin: "4px",
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      zIndex: "999",
                      position: "relative",
                    }}
                    src={ chatPerson?.images.find((image) => !!image) || ""}
                    alt="active person"
                  />
                )}
              </Navbar.Brand>
              <Navbar.Brand>
                {personMessage && (
                  <img
                    style={{
                      margin: "4px",
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      zIndex: "999",
                      position: "relative",
                    }}
                    src={personMessage?.images.find((image) => !!image) || ""}
                    alt="message person"
                  />
                )}
              </Navbar.Brand>
            </>
          )}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
              {(myRooms || myPersons) && (
                <Nav.Link as={Link} to="/protected">
                  Cabinet
                </Nav.Link>
              )}
         
              <NavDropdown title="City" id="collasible-nav-dropdown">
                <NavDropdown.Item onClick={() => handleOptionClick("Ереван")}>
                  Ереван
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleOptionClick("Москва")}>
                  Москва
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => handleOptionClick("Санкт-Петербург")}
                >
                  Санкт-Петербург
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleOptionClick("Тбилиси")}>
                  Тбилиси
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleOptionClick("Стамбул")}>
                  Стамбул
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link as={Link}>Find a neighbor</Nav.Link>
              <Nav.Link as={Link} to={"/rooms"}>
                Rent housing
              </Nav.Link>
              <Nav.Link
                as={Link}
                onClick={handleCreatePerson}
                to={"/regusergeneral"}
              >
                Сreate a character
              </Nav.Link>

              {clientId && (
                <Navbar.Brand>
                  {!personMessage && (
                    <img
                      style={{
                        margin: "4px",
                        width: "52px",
                        height: "52px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        zIndex: "999",
                        position: "relative",
                      }}
                      src={ roomActive?.images.find((image) => !!image) || ""}
                      alt="active person"
                    />
                  )}
                </Navbar.Brand>
              )}

              {!room ? (
                <Nav.Link as={Link} onClick={handleCreateRoom} to={path1}>
                  Rent out housing
                </Nav.Link>
              ) : (
                <Nav.Link
                  onClick={handleCreateRoom}
                  as={Link}
                  to={"/regroommain"}
                >
                  New room rent out
                </Nav.Link>
              )}
              {clientId && (
                <Nav.Link
                  as={Link}
                  onClick={() =>
                    logout({
                      logoutParams: { returnTo: "http://localhost:3000/" },
                    })
                  }
                >
                  Exit
                </Nav.Link>
              )}
              {!clientId && !localToken && (
                <Nav.Link as={Link} to="/local-login">
                  Local Login
                </Nav.Link>
              )}
              {localToken && (
                <Nav.Link
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location = "/";
                  }}
                >
                  Local Logout
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default MainHeaders;
