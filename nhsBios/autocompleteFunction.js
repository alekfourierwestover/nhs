// the clicking stuff for the autocomplete is CRAP. fix it later maybe?
 
function spaceNameToUnderscores(space_name){
	return space_name.replace(" ", "_");
}


function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
			killppl();
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
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[name].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
					b.id = "list_"+spaceNameToUnderscores(arr[name]);
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[name].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[name].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[name] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values, (or any other open lists of autocompleted values:*/
							killppl();
              closeAllLists();
							$("#"+spaceNameToUnderscores(inp.value)).css("display", "");
          });
          a.appendChild(b);
					$("#"+spaceNameToUnderscores(arr[name])).css("display", "");
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

/*An array containing all the country names in the world:*/
let names = ["Nadia Baghdady", "Anna Biondo", "Matthew Brody", "Molly Calkins", "Meredith Chasse", "Melina Chen", "Ziyong Cui", "Catherine Cunningham", "Anthony DeMarco", "Katherine Devitt", "Anna Doherty", "Justin Dong", "Leon Fan", "Caroline Findlay", "Matthew Fiore", "Ani Ganjian", "Julia Giatrelis", "Ilana Gut", "Alice Guyumdzhyan", "Joy He", "Joseph Hurley", "Gilchrist Imboywa", "Luke Jackson", "Adrine Kaligian", "Emily Kim", "Madeline Kitch", "Isabelle Lefebvre", "David Leigh", "Victoria Lesser", "Maya Logan", "Kathryn Magno", "Maya Manela", "Romi Manela", "Sara Manganelli", "Ella Miller", "Paul Muser", "Lila Newberry", "Maiah Newell", "Charlotte Nilsen", "Meaghan Noone", "Matt OConnell-Vale", "Margaret OConnor", "Seong Hyeon Park", "Grace Patrone", "Michael Pizzuto", "Valentine Reynolds", "Kara Rowan", "Emily Sabia", "Migena Satyal", "Ella Serrano-Wu", "Emmett Smith", "Heather Sorenson", "Cheyenne Stringfellow", "Chloe Sturgeon", "Emma Sutherland", "Anvitha Veeragandham", "Shankar Veludandi", "Allan Wang", "Alek Westover", "Samantha Widdison", "Andrew Xu", "Lydia Yoon", "Abigail Yu", "Olivia Zarkadas", "Hongyi Zhang"];

/*initiate the autocomplete function on the "myInput" element, and pass along the names array as possible autocomplete values:*/
autocomplete(document.getElementById("myInput"), names);

function killppl(){
	for (let i = 0; i < names.length; i++){
		$("#"+spaceNameToUnderscores(names[i])).css("display", "none");
	}
}

