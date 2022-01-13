import React from 'react'
import './Sidebar.css';
const sidebutton = [
  {
    icon: "schedule",
    name: "Approvals",
    notification: 36,
  },
  {
    icon: "receipt_long",
    name: "Bill Payment",
    notification: null,
  },
  {
    icon: "monetization_on",
    name: "Transfer",
    notification: null,
  },
  {
    icon: "event_note",
    name: "Scheduled Transactions",
    notification: null,
  },
  {
    icon: "account_tree",
    name: "Bulk Payment",
    notification: null,
  },
  {
    icon: "smartphone",
    name: "RPP",
    notification: null,
  },
  {
    icon: "analytics",
    name: "Business Dashboard",
    notification: null,
  },
  {
    icon: "post_add",
    name: "Apply",
    notification: null,
  },
  {
    icon: "emoji_objects",
    name: "Investment",
    notification: null,
  },
  {
    icon: "currency_exchange",
    name: "Forex Counter",
    notification: null,
  },
  {
    icon: "inbox",
    name: "Inbox",
    notification: 86,
  },
  {
    icon: "settings",
    name: "Settings",
    notification: null,
  },
];

// Due to using tailwind css last time, need redo the classname in css file
const Sidebar = () => {
  return (
    <div className="container">
      <div className="w-56 h-8 text-yellow-custom px-[31px] pt-[35px] pb-[70px]">Maybank2u Biz</div>
      <div className="flex">
        <div className="h-14 w-1.5 bg-blue-custom rounded-r-[100px] absolute" />
        <div className="w-72 h-14 bg-yellow-custom">
          <div className="h-full flex items-center">
            <div className=" flex h-full w-full items-center flex-shrink-0 pl-8">
              <div className=" h-8 w-8 flex items-center justify-center  border rounded-full  border-solid border-blue-custom">
                <img
                  className="h-[27px] w-[27px]"
                  src="icon_tick@2x.png"
                  alt="icon"
                />
              </div>
              <div className="text-sm text-blue-custom font-medium pl-6">Canvas Valley</div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-[41px]">
        {sidebutton.map((side) => (
          <div className="flex w-[220px] mx-auto mb-[42px] items-center cursor-pointer">
            <i className="material-icons text-white">{side.icon}</i>
            <div className="text-white w-full text-[14px] ml-[27px]">{side.name}</div>
            <div className={side.notification === null ? "hidden" : "text-white text-[11px] font-medium text-center rounded-[7.5px] bg-[#ff6167] w-[29px] h-[15px]"}>
                {side.notification}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;