import Layout from "./components/Layout/Layout";
import { useDispatch } from "react-redux";
import { loadAllUserPersons } from "./store/user-slice";
import { loadAllUserRooms } from "./store/room-slice";
import { initializeChats, subscribeToNewMessages } from "./store/chat-slice";
import Map from "./components/Map";
import Sosedi from "./components/cabinet/user/Sosedi";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import HomePage from "./components/HomePage";
import ProtectedPageWrapper from "./store/rout";
import CabinetUser from "./components/cabinet/CabinetUser";
import AuthCallback from "./store/AuthCallback";
import RegistrationRoom from "./components/cabinet/room/RegistrationRoom";
import RegistrationRoomPrice from "./components/cabinet/room/RegistrationRoomPrice";
import RegistrationRoomLocation from "./components/cabinet/room/RegistrationRoomLocation";
import Rooms from "./components/cabinet/room/Rooms";
import RegistrationUserGeneral from "./components/cabinet/user/RegistrationUserGeneral";
import RegistrationUserSundry from "./components/cabinet/user/RegistrationUserSundry";
import RegistrationUserMain from "./components/cabinet/user/RegistrationUserMain";
import FavoriteUsers from "./components/cabinet/user/FavoriteUsers";
import RegistrationRoomAdvants from "./components/cabinet/room/RegistrationRoomAdvants";
import RegistrationUserAdvants from "./components/cabinet/user/RegistrationUserAdvants";
import { useClientData } from "./store/hook";
import {
  subscribeToRoomsData,
  unsubscribeFromRoomsData,
} from "./store/rooms-slice";
import {
  subscribeToUsersData,
  unsubscribeFromUsersData,
} from "./store/users-slice";

function App() {
  console.log("App");
  const [beacons, setBeacons] = useState([]);

  const { clientId } = useClientData();

  function handleAddBeacon(beacon) {
    setBeacons((prevBeacons) => [...prevBeacons, beacon]);
  }

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(subscribeToUsersData());
    return () => {
      dispatch(unsubscribeFromUsersData());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(loadAllUserPersons(clientId));
  }, [clientId]);

  useEffect(() => {
    dispatch(loadAllUserRooms(clientId));
  }, [clientId]);

  useEffect(() => {
    dispatch(initializeChats(clientId));
    dispatch(subscribeToNewMessages(clientId));
  }, [clientId]);

  useEffect(() => {
    // Подписаться на данные комнат при монтировании компонента
    dispatch(subscribeToRoomsData());

    // Отписаться от данных комнат при размонтировании компонента
    return () => {
      dispatch(unsubscribeFromRoomsData());
    };
  }, [dispatch]);

  function handleDeleteBeacon(index) {
    setBeacons((prevBeacons) => {
      const newBeacons = [...prevBeacons];
      newBeacons.splice(index, 1);
      return newBeacons;
    });
  }

  return (
    <>
      <Layout>
        {false && (
          <Map
            beacons={beacons}
            onAddBeacon={handleAddBeacon}
            onDeleteBeacon={handleDeleteBeacon}
          />
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/rooms"
            element={
              <ProtectedPageWrapper>
                <Rooms />{" "}
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/sosedi"
            element={
              <ProtectedPageWrapper>
                <Sosedi />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regusergeneral"
            element={
              <ProtectedPageWrapper>
                <RegistrationUserGeneral />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regusermain"
            element={
              <ProtectedPageWrapper>
                <RegistrationUserMain />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regusersundry"
            element={
              <ProtectedPageWrapper>
                <RegistrationUserSundry />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regroommain"
            element={
              <ProtectedPageWrapper>
                <RegistrationRoom />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regroomlocation"
            element={
              <ProtectedPageWrapper>
                <RegistrationRoomLocation />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regroomprice"
            element={
              <ProtectedPageWrapper>
                <RegistrationRoomPrice />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/regroomadvants"
            element={
              <ProtectedPageWrapper>
                <RegistrationRoomAdvants />
              </ProtectedPageWrapper>
            }
          />
          <Route
            path="/reguseradvants"
            element={
              <ProtectedPageWrapper>
                <RegistrationUserAdvants />
              </ProtectedPageWrapper>
            }
          />
          <Route path="/api/auth/callback" element={<AuthCallback />} />
          <Route
            path="/protected"
            element={
              <ProtectedPageWrapper>
                <CabinetUser />
              </ProtectedPageWrapper>
            }
          />
<Route path={`/message/:personId`} element={<FavoriteUsers />} />
        </Routes>
      </Layout>
    </>
  );
}

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  font-size: calc(8px + 2vmin);
  color: white;
  background-color: #454552;
  text-align: center;
`;

export default App;
