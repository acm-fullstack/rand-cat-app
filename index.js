	(function () {
	/* Stores information and state with manipulations */
	function Model() {
		const initialState = [1, 2, 3, 4, 5];
		const state = {
			data: [...initialState],
			activeIndex: 0,
			nicknames: [],
		};

		return {
			getData: () => state.data.map(d => d),
			insertData: () => {
				state.data.push(state.data.length + 1);
			},
			getActiveIndex: () => state.activeIndex,
			setActiveIndex: i => {
				if (typeof i !== "number" || i >= state.data.length || i < 0) {
					throw new Error("data index out of bounds.");
				}
				state.activeIndex = i;
			},
			removeCurrent: () => {
				state.data.splice(state.activeIndex, 1);
				state.activeIndex = state.data.length > 0 ? 0 : -1;
			},
			resetData: () => {
				state.data = [...initialState];
				state.activeIndex = 0;
			},
			setNickname: (nickname) => {
				state.nicknames[state.activeIndex] = nickname;
			},
			getNickname: i => state.nicknames[i]
		};
	}

	/* Binds the data to view and responds to user events */
	function Controller(model, view) {
		function renderList() {
			const data = model.getData();
			const currIndex = model.getActiveIndex();
			view.setImageLink(currIndex);
			view.renderList(data, currIndex);
		}

		function onItemClickHandler(itemData) {
			const data = model.getData();
			const index = data.indexOf(itemData);
			model.setActiveIndex(index);
			view.setImageLink(itemData);
			const nick = model.getNickname(index);
			view.renderNickname(nick);
			renderList();
		}
		view.setOnItemClick(onItemClickHandler);

		function onAddClickHandler(event) {
			model.insertData();
			if(model.getActiveIndex() === -1) {
				model.setActiveIndex(0);
			}
			renderList();
		}
		view.setOnAddClick(onAddClickHandler);

		function onRemoveClickHandler(event) {
			if(model.getActiveIndex < 0) return; // ignore. list is empty
			model.removeCurrent();
			const data = model.getData();
			const activeIndex = model.getActiveIndex();
			view.setImageLink(data[activeIndex] || " ");
			renderList();
		}
		view.setOnRemoveClick(onRemoveClickHandler);
		
		function onResetClickHandler (event) {
			model.resetData();
			renderList();
		}
		view.setOnResetClick(onResetClickHandler);
    
		function onSaveButtonClickHandler(event) {
			const nick = view.getCatNicknameInput();
			model.setNickname(nick);
			view.renderNickname(nick);
		}
		view.setOnSaveNicknameClick(onSaveButtonClickHandler);
		renderList();
	}

	/* Renders and creates view populates ui events */
	function View() {
		const appContainer = document.getElementById("app");
		// List initialization.
		const listNode = document.createElement("ul");
		listNode.className = "number-list"
		appContainer.appendChild(listNode);

		// Add Button creation
		const addButton = document.getElementById("add-button");

		const saveButton = document.getElementById("cat-nickname-save");

		// Delete Button
		const resetButton = document.getElementById("reset-button");


		// Remove Button creation
		const removeButton = document.createElement("button");
		removeButton.innerHTML = "Remove";
		appContainer.appendChild(removeButton);

		const imageView = document.getElementById("image-view");

		const inputItem = document.getElementById("cat-nickname");

		const nicknameView = document.getElementById("nickanme-view");

		let onItemClick;
		return {
			renderList: (data, activeIndex) => {
				if (!Array.isArray(data)) {
					throw new Error("invalid data for list");
				}
				while(listNode.firstChild) {
					listNode.removeChild(listNode.firstChild);
				}
				data.forEach((datum, index) => {
					var listItem = document.createElement("li");
					listItem.innerHTML = datum;
					listItem.className = "list-item" + (index === activeIndex ? " active-list-item" : "");
					listItem.onclick = function (event) {
						onItemClick(datum);
					};
					listNode.appendChild(listItem);
				});
			},
			setOnResetClick: handler => {
				if (typeof handler !== "function") {
					throw new Error("invalid on reset click handler.");
				}
				resetButton.onclick = handler;
			},
			setOnAddClick: handler => {
				if (typeof handler !== "function") {
					throw new Error("invalid on add click handler.");
				}
				addButton.onclick = handler;
			},
			setOnItemClick: handler => {
				if (typeof handler !== "function") {
					throw new Error("invalid on item click handler.");
				}
				onItemClick = handler;
			},
			setOnSaveNicknameClick: handler => {
				if (typeof handler !== "function") {
					throw new Error("invalid on item click handler.");
				}
				saveButton.onclick = handler;
			},
			setImageLink: n => {
				var imageLink = imageView.getAttribute("src");
				var newImageLink = imageLink.slice(0, imageLink.length - 1) + n;
				imageView.setAttribute("src", newImageLink);
			},
			setOnRemoveClick: handler => {
				if(typeof handler !== "function") {
					throw new Error("invalid on remove click handler.");	
				}
				removeButton.onclick = handler;
      },
			getCatNicknameInput: () => inputItem.value,
			renderNickname: (nickname) => {
				nicknameView.innerHTML = nickname == null ? "" : nickname;
			}
		}
	}

	function Init() {
		const model = Model();
		const view = View();
		const controller = Controller(model, view);
	}

	Init();
})();
