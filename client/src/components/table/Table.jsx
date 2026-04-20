import React, { useEffect } from "react";
import styles from "./table.module.css";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export const ActionData = ({ id }) => {
  useEffect(() => {
    console.log(id);
  }, []);
  return (
    <td>
      <div className={styles.actionbtnsholder}>
        <div className={`${styles.actionbtn} ${styles.deletebtn}`}>
          <MdOutlineDeleteOutline />
        </div>
        <div className={`${styles.actionbtn} ${styles.normalbtn}`}>
          <MdOutlineRemoveRedEye />
        </div>
        <div className={`${styles.actionbtn} ${styles.normalbtn}`}>
          <MdOutlineDeleteOutline />
        </div>
      </div>
    </td>
  );
};
const Table = ({ tableheader = [], children }) => {
  return (
    <div className={styles.tablecontainer}>
      <table>
        <thead>
          <tr>
            {tableheader && tableheader.map((th) => <th>{th}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {React.Children.map(children, (child, index) => {
            return React.cloneElement(child, {
              key: index,
              children: (
                <React.Fragment key={index}>
                  {child.props.children}

                  <ActionData id={child.props.rowid} />
                </React.Fragment>
              ),
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
