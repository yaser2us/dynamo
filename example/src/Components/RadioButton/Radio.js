import React from 'react'
import { Error } from "../Error"
import styles from "./Radio.module.scss";

const Radio = (props) => {
  const { name, item, field } = props;
  const { label, options } = item || { label: "" };

  const renderOption = () => {
    return options && options.map(el => <label className={styles.container}>
      IBG Transfer
      <input type="radio" name="radio" />
      <span className={styles.checkmark}></span>
    </label>)
  }

  return (
    <div>
      {label}
      {renderOption()}
      <label className={styles.container}>
        Instant Transfer
        <input
          type="radio"
          checked="checked"
          name={name}
          {...field}
        />
        <span className={styles.checkmark}></span>
      </label>
      <label className={styles.container}>
        IBG Transfer
        <input type="radio" name="radio" />
        <span className={styles.checkmark}></span>
      </label>
      <Error {...props} />
    </div>
  );
};

export default Radio;
