import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Date.css";
import EventIcon from "@mui/icons-material/Event";
import Label from "../Label/Label"
import { Error } from "../Error"


const DatePick = (props) => {
  const { name, item, error, field } = props;
  const errorMsg = error && error[name] && error[name].message || ""

  if (item === undefined) return null;

  const { placeholder } = item;
  const { value } = field;

  return (
    <>
      <Label {...props} />
      <div className="input-icons">
        <i className="icon">
          <EventIcon />
        </i>
        <DatePicker
          className="datepick"
          formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 1)}
          dateFormat="d MMMM yyyy"
          selected={value}
          showYearDropdown
          yearDropdownItemNumber={10}
          scrollableYearDropdown
          {...field}
        ></DatePicker>
      </div>
      <Error {...props} />
    </>
  );
};

export default DatePick;
