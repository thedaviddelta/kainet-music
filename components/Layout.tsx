import { FC } from "react";
import { Player } from ".";

const Layout: FC = ({ children }) => {
    return (
        <div>
            {children}
            <Player />
        </div>
    );
}

export default Layout;
