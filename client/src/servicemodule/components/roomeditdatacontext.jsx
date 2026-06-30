import { createContext, useContext } from "react";

export let RoomEditContext = createContext()
export let useRoomEditContext = ()=>useContext(RoomEditContext)



