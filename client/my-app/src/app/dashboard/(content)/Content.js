import Header from "../(header)/Header";
import Analytics from "../(analytics)/Analytics";
import Footer from "../(footer)/Footer";
const Content = () => {
  return (
    <div className="flex w-[90%] flex-col">
      <Header />
      <Analytics />
      <Footer />
    </div>
  );
};
export default Content;
