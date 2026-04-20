import { memo } from 'react';
import Controlbtn from '../../components/controlbtn/controlbtn.jsx';
import styles from "../css/department.module.css"
import Table from '../../components/table/Table.jsx';

const Department = () => {
  return (
    <>
    <Controlbtn/>
   <Table tableheader={["S.N","Department Name","HOD","Description","Established On"]}>
    <tr rowid={"lakdhsglfksdj343534343"}>
      <td>1.</td>
      <td>Information Technology</td>
      <td>Sulav Khatiwada</td>
      <td>N/A</td>
      <td>2026/05/05</td>
    </tr>

    
   </Table>
   
    </>
    
  );
};

export default Department;