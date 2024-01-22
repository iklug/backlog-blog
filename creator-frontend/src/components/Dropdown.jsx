import { useState } from "react";

const Dropdown = () => {

const [dropdown, setDropdown] = useState(false);

const toggleDropdown = () => {
    setDropdown(!dropdown);
};

    return (
        {
            dropdown &&
            <div>
            </div>
        }
    )
}

export default Dropdown;