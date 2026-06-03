
import Maincontainer from '../../../maincontainer/maincontainer';
import Leftnavbar,{NavbarLink} from '../../../leftnavbar/leftnavbar';
import {
  FaConciergeBell,
  FaTachometerAlt,
  FaUserAlt,
  FaCalendarAlt,
  FaSignInAlt,
  FaReceipt,
  FaMoneyBillWave,
  FaPlusCircle,
  FaPercent,
  FaClipboardList,
  FaDollarSign,
  FaSignOutAlt,
  FaHistory,
  FaExchangeAlt,
  FaEdit,
  FaUsers,
  FaBan,
} from "react-icons/fa";
import { Outlet, useParams } from 'react-router';

const FrontOfficeOutlet = () => {
    let {hotelid}=useParams()
  return (
   <Maincontainer>
   <Leftnavbar orgname={"Front Office"} >

  <NavbarLink
    text="Dashboard"
    icon={<FaTachometerAlt />}
    path={`/services/${hotelid}/frontoffice`}
    end
  />

  <NavbarLink
    text="Guest Info"
    icon={<FaUserAlt />}
    path={`/services/${hotelid}/frontoffice/guest-info`}
  />

  <NavbarLink
    text="Reservation"
    icon={<FaCalendarAlt />}
    path={`/services/${hotelid}/frontoffice/reservation`}
  />

  <NavbarLink
    text="Check In"
    icon={<FaSignInAlt />}
    path={`/services/${hotelid}/frontoffice/check-in`}
  />

  <NavbarLink
    text="Receipt"
    icon={<FaReceipt />}
    path={`/services/${hotelid}/frontoffice/receipt`}
  />

  <NavbarLink
    text="Payment"
    icon={<FaMoneyBillWave />}
    path={`/services/${hotelid}/frontoffice/payment`}
  />

  <NavbarLink
    text="Additional Rate"
    icon={<FaPlusCircle />}
    path={`/services/${hotelid}/frontoffice/additional-rate`}
  />

  <NavbarLink
    text="Discount"
    icon={<FaPercent />}
    path={`/services/${hotelid}/frontoffice/discount`}
  />

  <NavbarLink
    text="Room Rate Posting"
    icon={<FaClipboardList />}
    path={`/services/${hotelid}/frontoffice/room-rate-posting`}
  />

  <NavbarLink
    text="Change Rate"
    icon={<FaDollarSign />}
    path={`/services/${hotelid}/frontoffice/change-rate`}
  />

  <NavbarLink
    text="Check Out"
    icon={<FaSignOutAlt />}
    path={`/services/${hotelid}/frontoffice/check-out`}
  />

  <NavbarLink
    text="In House & Guest History"
    icon={<FaHistory />}
    path={`/services/${hotelid}/frontoffice/guest-history`}
  />

  <NavbarLink
    text="Room Transfer"
    icon={<FaExchangeAlt />}
    path={`/services/${hotelid}/frontoffice/room-transfer`}
  />

  <NavbarLink
    text="Amend Stay"
    icon={<FaEdit />}
    path={`/services/${hotelid}/frontoffice/amend-stay`}
  />

  <NavbarLink
    text="Groups And Link"
    icon={<FaUsers />}
    path={`/services/${hotelid}/frontoffice/groups-link`}
  />

  <NavbarLink
    text="Cancel Check-In"
    icon={<FaBan />}
    path={`/services/${hotelid}/frontoffice/cancel-check-in`}
  />
</Leftnavbar>

<Outlet/>
   </Maincontainer>
  );
};

export default FrontOfficeOutlet;