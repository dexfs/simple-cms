import {Outlet} from "react-router";
import {InternalHeader} from "./InternalHeader.tsx";

export function InternalLayout() {
    return (
        <>
            <InternalHeader/>
            <Outlet/>
        </>
    )
}