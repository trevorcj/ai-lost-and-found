import AddItemModal from "../components/AddItemModal";
import FinderModal from "../components/FinderModal";
import {
  FinderModalProvider,
  useFinderModal,
} from "../contexts/FinderModalContext";
import {
  AddItemModalProvider,
  useModalContext,
} from "../contexts/AddItemModalContext";

function FeedInner() {
  const { items } = useModalContext();

  return (
    <div className="text-(--text-main)">
      <Header />
      <Items items={items} />
      <ModalWrapper />
    </div>
  );
}

function Feed() {
  return (
    <AddItemModalProvider>
      <FinderModalProvider>
        <FeedInner />
      </FinderModalProvider>
    </AddItemModalProvider>
  );
}

function ModalWrapper() {
  const { showAddItemModal, handleAddItem } = useModalContext();

  return (
    <>
      {showAddItemModal && <AddItemModal setShowAddItemModal={handleAddItem} />}
      {/* FinderModal handles its own visibility via FinderModalContext */}
      <FinderModal />
    </>
  );
}

function Items({ items }) {
  const { openFinder } = useFinderModal();
  console.log(items);

  return (
    <div className="w-full pt-[110px] px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <p className="tracing-tight">No items yet. Add a lost item.</p>
      ) : (
        items.map((item) => (
          <div
            key={item.id}
            className="p-3 bg-white rounded-2xl shadow-natural">
            <div className="flex gap-2.5 items-center mb-3">
              <img
                src={`https://avatar.iran.liara.run/username?username=${item.username}`}
                width="40px"
                alt={item.description}
              />
              <div className="text-[15px]">
                <p className="font-semibold">{item.username}</p>
                <span className="text-stone-400">
                  Lost near — {item.location}
                </span>
              </div>
            </div>
            <img
              className="mb-3 rounded-2xl"
              src={item.imgUrl}
              alt={item.description}
            />
            <div className="flex flex-col gap-3">
              <div
                onClick={() => openFinder(item)}
                className="flex self-start gap-1 py-2 pl-4 pr-6 text-white transition duration-300 ease-in-out rounded-full cursor-pointer bg-amber-500/70 hover:bg-amber-500/80 ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-6">
                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                </svg>

                <p className="inline-block font-semibold tracking-tight">
                  Found this item?
                </p>
              </div>
              <p>{item.description}</p>
              <span className="text-sm tracking-tight text-stone-400">
                Posted on • {item.date}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="container fixed flex items-center justify-between px-4 py-4 -translate-x-1/2 bg-white rounded-full w-md sm:w-full left-1/2 shadow-natural">
      <Search />
      <div className="flex space-x-3">
        <AddItem />
        <User />
      </div>
    </div>
  );
}

function Search() {
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none size-6 left-3 top-1/2 text-stone-400">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>

      <input
        className="text-[15px]  bg-stone-200/50 pl-10 pr-3 py-3 tracking-tighter rounded-full sm:w-sm focus:outline-none  "
        type="search"
        placeholder="Search"
      />
    </div>
  );
}

function AddItem() {
  const { handleAddItem } = useModalContext();

  return (
    <div
      onClick={handleAddItem}
      className="items-center self-center p-3 rounded-full cursor-pointer bg-stone-200/50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    </div>
  );
}

function User() {
  return <img src="https://avatar.iran.liara.run/public/1" width="47.9px" />;
}

export default Feed;
