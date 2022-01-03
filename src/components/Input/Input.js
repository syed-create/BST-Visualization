import React from "react";

function Input(props) {
	return (
		<div className=" flex justify-center items-center gap-3 mb-3">
			<input
				placeholder={props.placeholder}
				className="sm:flex items-center w-72 text-left space-x-3 px-4 h-10 bg-white ring-1 ring-gray-900/10 hover:ring-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm rounded-lg text-gray-400 dark:bg-gray-800 dark:ring-0 dark:text-gray-300 dark:highlight-white/5 dark:hover:bg-gray-700 "
				type="number"
				min={0}
				id={props.id}
				onChange={props.onChange}
				value={props.value}
				onKeyDown={props.onKeyDown}
			/>

			<button
				className=" dark:bg-gray-800 dark:hover:bg-gray-700  ring-1 ring-gray-900/10 hover:ring-green-500 focus:outline-none focus:ring-1 hover:text-green-500 rounded-xl px-3 py-1 w-24 font-bold shadow-sm text-green-400 h-10 text-base"
				onClick={props.onClick}
				id={props.id}
			>
				{props.btnText}
			</button>
		</div>
	);
}

export default Input;
