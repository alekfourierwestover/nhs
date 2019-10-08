// the clicking stuff for the autocomplete is CRAP. fix it later maybe?
 
function spaceNameToUnderscores(space_name){
	return space_name.replace(" ", "_");
}

/**
 * inp is the id of the input element that we are getting the value from
 * arr is the autocomplete values
 * extraShowingFn and extraHidingFn control what stuff is shown / hidden while searching
 * matchType is either 
 * 	'prefix' a term is suggested if the current query is a prefix of the term
 * 	'anywhere' a term is suggested if the query appears anywhere in the term
 */
function autocomplete(inp, arr, extraShowingFn, extraHidingFn, matchType) {
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
		extraHidingFn();
		var val = this.value;
		var a,b;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) { return false;}
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");

		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (let name = 0; name < arr.length; name++) {
			let match = false;
			if(matchType == 'prefix'){
				match = arr[name].substr(0, val.length).toUpperCase() == val.toUpperCase();
			}
			if(matchType == 'anywhere'){
				match = arr[name].toUpperCase().indexOf(val.toUpperCase()) != -1;
			}

			if (match) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				b.id = "list_"+spaceNameToUnderscores(arr[name]);
				if(matchType == "prefix"){
					b.innerHTML = "<strong>" + arr[name].substr(0, val.length) + "</strong>";
					b.innerHTML += arr[name].substr(val.length);
				}
				if(matchType == "anywhere"){
					matchIdx = arr[name].toUpperCase().indexOf(val.toUpperCase());
					b.innerHTML = arr[name].substr(0, matchIdx);
					b.innerHTML += "<strong>" + arr[name].substr(matchIdx, matchIdx+val.length) + "</strong>";
					b.innerHTML += arr[name].substr(matchIdx+val.length);
				}

				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[name] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function(e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
					extraHidingFn();
					closeAllLists();
					extraShowingFn(inp.value);
				});
				a.appendChild(b);
				extraShowingFn(arr[name]);
			}
		}
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists() {
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++){ 
			x[i].parentNode.removeChild(x[i]);
		}
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
			closeAllLists();
  });
}

let names = [];
$.getJSON("names.json", function(data){
	for (let i = 0; i < data.length; i++){
		names.push(data[i]);
	}
});

autocomplete(document.getElementById("searchByName"), names, 
	function(autocompleteKey){
		$("#"+spaceNameToUnderscores(autocompleteKey)).css("display", "");
	},
	function(){
		for (let i = 0; i < names.length; i++){
			$("#"+spaceNameToUnderscores(names[i])).css("display", "none");
		}
	}, 
"prefix");
let mods = [];
$.getJSON("Mods.json", function(data){
	for(let i = 0; i < data.length; i++){
		mods.push(data[i]);
	}
});
let modTutors = {};
$.getJSON("ModTutors.json", function(data){
	for(let i in data){
		modTutors[i] = data[i];
	}
});

let tutorData = [];
let subjectDescriptions = [];
$.getJSON("tutorData.json", function(data){
	for(let i in data){
		tutorData.push([i, data[i][0], data[i][1]]);
		subjectDescriptions.push(data[i][1]);
	}
});

autocomplete(document.getElementById("searchByMod"), mods, 
function(autocompleteKey){
	let tutorName = "none";
	let subjectsTutored = "none";
	if (modTutors.hasOwnProperty(autocompleteKey)){
		tutorName = modTutors[autocompleteKey][0];
		subjectsTutored = modTutors[autocompleteKey][1];
	}
	let resp = "<div class='container card searchByModResult' >"; 
	resp += "<h2>";
	resp += "Mod: " + autocompleteKey;
	resp += "</h2>";
	resp += "<h3>"
	resp += "Tutor: " + tutorName;
	resp += "</h3>";
	resp += "<p>"
	resp += "Subjects: " + subjectsTutored;
	resp += "</p>";
	resp += "</div>";
	$("#searchByModResults").append(resp);
}, 
function(){
	let previousResults = document.getElementsByClassName("searchByModResult");
	for (let i = previousResults.length-1; i >= 0; i--){
		previousResults[i].remove();
	}
},
"prefix");


autocomplete(document.getElementById("searchBySubject"), subjectDescriptions, 
function(autocompleteKey){
	let idx = subjectDescriptions.indexOf(autocompleteKey);
	let tutorName = tutorData[idx][0];
	let mod = tutorData[idx][1];
	let subjectDescription = tutorData[idx][2];

	let resp = "<div class='container card searchBySubjectResult' >"; 
	resp += "<h2>";
	resp += "Mod: " + mod;
	resp += "</h2>";
	resp += "<h3>"
	resp += "Tutor: " + tutorName;
	resp += "</h3>";
	resp += "<p>"
	resp += "Subjects: " + subjectDescription;
	resp += "</p>";
	resp += "</div>";
	$("#searchBySubjectResults").append(resp);
},
function() {
	let previousResults = document.getElementsByClassName("searchBySubjectResult");
	for (let i = previousResults.length-1; i >= 0; i--){
		previousResults[i].remove();
	}
},
"anywhere");

