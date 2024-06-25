import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import styles from'./Nav.module.css'
import Image from 'react-bootstrap/Image'
import iconGo from"./images/iconGo.png"
import { useDispatch } from 'react-redux';
import { closeChat } from '../../store/chat-slice';
function NavDropdownExample(props) {
const dispatch= useDispatch();

  const handleSelect = (eventKey) => alert(`selected ${eventKey}`);
 const CloseChat=()=>{
props.onLeaveUser()
dispatch(closeChat())
 }

  return (
    <Nav className={styles.navLink} activeKey="1" onSelect={handleSelect}>
      <Nav.Item  >
        <Nav.Link eventKey="1" href="#/home">
         <Image className={styles.userImage} src={props.image}  alt=''/>
        </Nav.Link>
      </Nav.Item>
      <NavDropdown title="Dropdown" id="nav-dropdown">
        <NavDropdown.Item  onClick={props.onDeliteLikeUser}>Delete partner</NavDropdown.Item>
        <NavDropdown.Item onClick={props.onSetShowDelete}> Delete Chat</NavDropdown.Item>
        <NavDropdown.Item eventKey="4.3">Something else here</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item eventKey="4.4">Separated link</NavDropdown.Item>
      </NavDropdown>
      <Nav.Item  >
        <Nav.Link onClick={CloseChat}>
         <Image className={styles.userImage} src={iconGo}  alt='' style= {{left: "135px"}}/>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default NavDropdownExample