const Button = ({name, clickFunction}) => {
    return (
            <button onClick={clickFunction}
            className="h-8 w-24 bg-slate-100 font-semibold text-gray-400"
            >
                    {name}
                </button>
    )
}

export default Button;