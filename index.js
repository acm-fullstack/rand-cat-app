(function () {
	/* Stores information and state with manipulations */
	function Model() {
		var state = {
			data: [1, 2, 3, 4, 5],
			activeIndex: 0,
		};
		return {
			getData: function () {
				return state.data.map(function (d) {
					return d;
				});
			},
			insertData: function () {
				state.data.push(state.data.length + 1);
			},
			getActiveIndex: function () {
				return state.activeIndex;
			},
			setActiveIndex: function (i) {
				if (typeof i !== "number" || i >= state.data.length || i < 0) {
					throw new Error("data index out of bounds.");
				}
				state.activeIndex = i;
			}
		};
	}

	/* Binds the data to view and responds to user events */
	function Controller(model, view) {
		function renderList() {
			view.renderList(model.getData(), model.getActiveIndex());
		}

		function onItemClickHandler(itemData) {
			var data = model.getData();
			model.setActiveIndex(data.indexOf(itemData));
			view.setImageLink(itemData);
			renderList();
		}
		view.setOnItemClick(onItemClickHandler);

		function onAddClickHandler(event) {
			model.insertData();
			renderList();
		}
		view.setOnAddClick(onAddClickHandler);

		renderList();
	}

	/* Renders and creates view populates ui events */
	function View() {
		var appContainer = document.getElementById("app");
		// List initialization.
		var listNode = document.createElement("ul");
		listNode.className = "number-list"
		appContainer.appendChild(listNode);

		// Add Button creation
		var addButton = document.createElement("button");
		addButton.innerHTML = "Add Item";
		appContainer.appendChild(addButton);

		var imageView = document.getElementById("image-view");

		var onItemClick;
		return {
			renderList: function (data, activeIndex) {
				if (!Array.isArray(data)) {
					throw new Error("invalid data for list");
				}
				while(listNode.firstChild) {
					listNode.removeChild(listNode.firstChild);
				}
				data.forEach(function (datum, index) {
					var listItem = document.createElement("li");
					listItem.innerHTML = datum;
					listItem.className = "list-item" + (index === activeIndex ? " active-list-item" : "");
					listItem.onclick = function (event) {
						onItemClick(datum);
					};
					listNode.appendChild(listItem);
				});
			},
			setOnAddClick: function (handler) {
				if (typeof handler !== "function") {
					throw new Error("invalid on add click handler.");
				}
				addButton.onclick = handler;
			},
			setOnItemClick: function (handler) {
				if (typeof handler !== "function") {
					throw new Error("invalid on item click handler.");
				}
				onItemClick = handler;
			},
			setImageLink: function (n) {
				var imageLink = imageView.getAttribute("src");
				var newImageLink = imageLink.slice(0, imageLink.length - 1) + n;
				imageView.setAttribute("src", newImageLink);
			}
		}
	}

	function Init() {
		var model = Model();
		var view = View();
		var controller = Controller(model, view);
	}

	Init();
})();


