import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const hideLayoutPages = [""];
  const shouldHideLayout = hideLayoutPages.includes(location.pathname);

  return (
    <div className="bg-white w-full max-w-[420px] min-h-screen mx-auto flex flex-col items-center">
      <Header />
      <div
        className={`w-full flex flex-col flex-1 overflow-y-auto ${
          !shouldHideLayout ? "pb-[52px]" : ""
        }`}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
