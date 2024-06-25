
import MainHeaders from './MainHeaders';


const Layout = (props) => {
  return (
    <>
      <MainHeaders />
      <main >{props.children}</main>
    </>
  );
};

export default Layout;
