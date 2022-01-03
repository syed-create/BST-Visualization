import React, { useEffect, useState } from "react";
import BinarySearchTree from "../models/BST";
import * as d3 from "d3";
// import Circle from "./Circle/Circle";
import Input from "./Input/Input";
import Node from "../models/Node";
import "./style.css";
let svg;
function BST() {
	const [numbers, setNumbers] = useState([]);
	const [tree, setTree] = useState(new BinarySearchTree());
	const ref = React.useRef();
	const [search, setSearch] = useState("");
	const [find, setFind] = useState([]);
	const [insert, setInsert] = useState("");
	const [del, setDelete] = useState("");
	const [showSidePanel, setShowSidePanel] = useState(false);
	const [order, setOrder] = useState({
		orderName: "",
		order: [],
	});

	const d3Svg = () => {
		d3.select("svg").remove();
		svg = d3
			.select(ref.current)
			.append("svg")
			.attr("width", "100%")
			.attr("height", "500")
			.attr("viewBox", "0 0 800 800")
			.append("g")
			.attr("transform", "translate(0," + 80 + ")");
	};
	useEffect(() => {
		hierarchyCreate();
	}, [numbers]);

	const onChangeHandler = event => {
		if (event.target.id === "search") {
			setSearch(event.target.value);
		}
		if (event.target.id === "insert") {
			setInsert(+event.target.value);
		}
		if (event.target.id === "delete") {
			setDelete(+event.target.value);
		}
		setOrder(() => {
			return {
				order: [],
				orderName: "",
			};
		});
	};

	const onClick = event => {
		if (event.target.id === "search") {
			// tree.search(tree.root, search);
			console.log("searchin", search);
			setFind([...find, search]);
			hierarchyCreate(search);
			setSearch("");
		}
		if (event.target.id === "insert") {
			setNumbers([...numbers, insert]);
			tree.insert(insert);
			setInsert("");
		}
		if (event.target.id === "delete") {
			const node = numbers.filter(t => t !== del);
			tree.remove(del);
			setNumbers(node);
			setDelete("");
		}
	};

	const handleKeyDown = event => {
		if (event.key === "Enter") {
			if (event.target.value.trim() !== "") {
				onClick(event);
			}
		}
	};
	const hierarchyCreate = find => {
		// console.log("find", find);
		d3Svg();
		// console.log("run again", numbers[numbers.length - 1]);

		let root = tree.getRootNode();

		tree.setArrayPost();
		tree.postorder(root);

		// In-Order => Left -> root -> right
		var rootInorder = tree.getRootNode();
		tree.setArrayInorder();
		tree.inorder(rootInorder);

		//Pre-order => root -> left -> right
		var nodeRootPreOrder = tree.getRootNode();
		tree.setArrayPreOrder();
		tree.preOrder(nodeRootPreOrder);

		tree.setlevelOrder();
		tree.LevelOrder(tree.getRootNode());

		// Declares a tree layout and assigns the size

		// Assigns parent, children, height, depth, and coordinates

		root = d3.hierarchy(tree.root, function (d) {
			if (d) {
				d.children = [];
				if (d.left) {
					d.children.push(d.left);
					if (myXOR(d.left, d.right)) {
						d.children.push(new Node("e"));
					}
				}
				if (d.right) {
					if (myXOR(d.left, d.right)) {
						d.children.push(new Node("e"));
					}
					d.children.push(d.right);
				}
				return d.children;
			}
		});
		root.x0 = 800 / 2;
		root.y0 = 0;
		if (root.data) {
			update(root, find);
		}
	};
	function update(source, find) {
		let treemap = d3.tree().size([1200, 500]);
		let duration = 750;
		let search = +find;
		// Assigns the x and y position for the nodes
		let treeData = treemap(source);
		let nodes = treeData.descendants();
		let links = treeData.descendants().slice(1);
		// Normalize for fixed-depth
		nodes.forEach(function (d) {
			d.y = d.depth * 100;
		});
		let node = svg.selectAll("g.node").data(nodes, function (d) {
			return d.id;
		});

		let nodeEnter = node
			.enter()
			.append("g")
			.attr("class", "node")
			.attr("transform", function () {
				return "translate(" + source.x0 + "," + source.y0 + ")";
			});

		nodeEnter
			.append("circle")
			.attr("class", "node")
			.attr("r", 1e-6)
			.style("fill", function (d) {
				return d._children ? "lightsteelblue" : "#fff";
			})
			.on("click", click);

		// Add labels for the nodes
		nodeEnter
			.append("text")
			.attr("dy", ".35em")
			.attr("x", "0")
			.style("text-anchor", "middle")
			.attr("text-anchor", function (d) {
				return d.children || d._children ? "end" : "start";
			})
			.text(function (d) {
				return d.data.data;
			});

		// Update
		//console.log("merger node", node);
		let nodeUpdate = nodeEnter.merge(node);
		// console.log(" node update", nodeUpdate);
		// Transition to the proper position for the nodes
		nodeUpdate
			.transition()
			.duration(duration)
			.attr("transform", function (d) {
				return "translate(" + d.x + "," + d.y + ")";
			});

		// Update the node attributes and style
		nodeUpdate
			.select("circle.node")
			.attr("r", 20)
			.style("fill", function (d) {
				if (search === d.data.data) {
					return "#ff0000";
				} else {
					return d._children ? "lightsteelblue" : "#fff";
				}
			})
			.attr("cursor", "pointer");

		// Remove any exiting nodes
		let nodeExit = node
			.exit()
			.transition()
			.duration(duration)
			.attr("transform", function () {
				return "translate(" + source.x + "," + source.y + ")";
			})
			.remove();

		// On exit reduce the node circles size to 0
		nodeExit.select("circle").attr("r", 1e-6);

		// On exit reduce the opacity of text lables
		nodeExit.select("text").style("fill-opacity", 1e-6);

		// Update the links...
		let link = svg.selectAll("path.link").data(links, d => {
			// console.log(links);
			// console.log(d.id);
			return d.id;
		});
		// console.log(link)
		let linkEnter = link
			.enter()
			.insert("path", "g")
			.attr("class", "link")
			.attr("d", function () {
				let o = { x: source.x0, y: source.y0 };
				return diagonal(o, o);
			});

		let linkUpdate = linkEnter.merge(link);

		linkUpdate
			.transition()
			.duration(duration)
			.attr("d", function (d) {
				return diagonal(d, d.parent);
			});

		// Remove any existing links
		link.exit()
			.transition()
			.duration(duration)
			.attr("d", function () {
				let o = { x: source.x, y: source.y };
				return o;
			})
			.remove();

		// Store the old positions for transition.
		nodes.forEach(function (d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});

		// // Update
		// let linkUpdate = linkEnter.merge(link);
		// Create a curved (diagonal) path from parent to the child nodes
		function diagonal(s, d) {
			let path = `M ${s.x} ${s.y}
				C ${(s.x + d.x) / 2} ${s.y},
				${(s.x + d.x) / 2} ${d.y},
				${d.x} ${d.y}`;

			return path;
		}
		function click(event, d) {
			if (d.children) {
				d._children = d.children;
				d.children = null;
			} else {
				d.children = d._children;
				d._children = null;
			}
			update(d);
		}
	}

	function myXOR(a, b) {
		return (a || b) && !(a && b);
	}
	const onSidePanelClick = () => {
		setShowSidePanel(!showSidePanel);
		if (showSidePanel) {
			document.getElementById("mySidenav").style.width = "0px";
		} else {
			document.getElementById("mySidenav").style.width = "200px";
		}
	};

	const showOrder = event => {
		onSidePanelClick();
		if (event.target.id === "inorder") {
			setOrder(() => {
				return {
					order: tree.getArrayInorder(),
					orderName: "Inorder",
				};
			});
		}
		if (event.target.id === "preorder") {
			setOrder(() => {
				return {
					order: tree.getArrayPreOrder(),
					orderName: "Preorder",
				};
			});
		}
		if (event.target.id === "postorder") {
			setOrder(() => {
				return {
					order: tree.getArrayPost(),
					orderName: "Postorder",
				};
			});
		}
		if (event.target.id === "bfs") {
			let data = [];
			tree.getLevelOrder().forEach(element => {
				data.push(element.data);
			});

			setOrder(() => {
				return {
					order: data,
					orderName: "Breadth First Search",
				};
			});
		}
	};

	return (
		<div className="h-screen">
			<header className="dark:bg-black text-center h-24 w-full border-b-2 border-green-900">
				<div className="h-full flex items-center justify-center">
					<h1 className=" border-green-900 border-2  p-5 text-white flex justify-center items-center text-3xl font-bold h-4/6 rounded-lg bg-transparent">
						Binary Search Tree Visualization
					</h1>
				</div>
			</header>
			<main
				className="pt-5 bg-black z-0 relative"
				style={{ minHeight: "calc(100vh - 94px)" }}
			>
				<div className="flex justify-between items-center px-5 flex-wrap">
					<Input
						id="search"
						btnText="Search"
						placeholder="Search Node"
						onChange={onChangeHandler}
						onClick={onClick}
						value={search}
						onKeyDown={handleKeyDown}
					/>
					<Input
						id="insert"
						btnText="Insert"
						placeholder="Insert Node"
						onChange={onChangeHandler}
						onClick={onClick}
						value={insert}
						onKeyDown={handleKeyDown}
					/>
					<Input
						id="delete"
						btnText="Delete"
						placeholder="Delete Node"
						onChange={onChangeHandler}
						onClick={onClick}
						value={del}
						onKeyDown={handleKeyDown}
					/>
				</div>
				<div
					className="overflow-y-auto h-full"
					id="asd"
					ref={ref}
				></div>
				<div
					className="w-10 h-32 bg-green-600 left-0 top-2/4 z-10 absolute cursor-pointer flex justify-center items-center"
					onClick={onSidePanelClick}
				>
					<span className="text-white font-bold text-2xl px-3 select-none">
						{">"}
					</span>
				</div>

				<div className="sidenav" id="mySidenav">
					<span
						className="px-5 py-2 text-base cursor-pointer whitespace-nowrap text-white border hover:bg-green-600 hover:border-green-700 hover:transition-all"
						id="inorder"
						onClick={showOrder}
					>
						In Order
					</span>
					<span
						className="px-5 py-2 text-base cursor-pointer whitespace-nowrap text-white border hover:bg-green-600 hover:border-green-700 hover:transition-all"
						id="preorder"
						onClick={showOrder}
					>
						Pre Order
					</span>
					<span
						className="px-5 py-2 text-base cursor-pointer whitespace-nowrap text-white border hover:bg-green-600 hover:border-green-700 hover:transition-all"
						id="postorder"
						onClick={showOrder}
					>
						Post Order
					</span>

					<span
						className="px-5 py-2 text-base cursor-pointer whitespace-nowrap text-white border hover:bg-green-600 hover:border-green-700 hover:transition-all"
						id="bfs"
						onClick={showOrder}
					>
						Breadth First Search
					</span>
				</div>
				<div className="flex justify-center items-center">
					<span className="text-white tex-2xl font-bold pr-5">
						{order.orderName}
					</span>
					{order.order.length > 0 &&
						order.order.map(order => (
							<span className="border px-5 py-1 text-white">
								{order}
							</span>
						))}
				</div>
			</main>
		</div>
	);
}

export default BST;
