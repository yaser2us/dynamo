import React, { Fragment, useState } from "react";

const LocalPagination = (props) => {
  const { name, child, item, field, sharedItems } = props;
  const { theme } = item;
  const { onChange, value = 0 } = field;
  const [page, setPage] = useState(parseInt(value));

  const Child = child.map((item, index) => {
    // if (value !== index) return null;
    return React.createElement("div", { ...props, style:{display: value === index ? 'block' : 'none' } }, item);
  });

  const nextPage = () => {
    console.log(field, child.length, "LocalPaginationsLocalPaginations", onChange);
    if (value === child.length - 1) {
      // setPage(0);
      onChange(0);
      // sharedItems.setValue('pages',0,{
      //   shouldValidate: true,
      //   shouldDirty: true,
      //   shouldTouch: true
      // })
    } else {
      // sharedItems.setValue('pages',1,{
      //   shouldValidate: true,
      //   shouldDirty: true,
      //   shouldTouch: true
      // })
      // setPage(page + 1);
      onChange(1);
      // onChange(page + 1);
    }
  };


  console.log(item, "defaultContainerlllllll", props, theme);
  return (
    <React.Fragment>
      {Child && Child}
      <button onClick={nextPage}>Next</button>
      {value}
    </React.Fragment>
  );
};

export default LocalPagination;
