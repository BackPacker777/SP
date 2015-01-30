/*AUTHOR: hbates@northmen.org
*VERSION: 1.0
*CREATED:
*TO DO: hill choice selection, hill list jQuery csv grab, hill difficulty label, move hill difficulty inline
*/

"use strict";

var $day, $month, $year, $weekDay;
var $difficultyList = ["Easier", "More difficult", "Most Difficult", "Experts only", "Not Applicable"];

function setDate() {
     var $date = new Date();
     $month = $date.getMonth() + 1;
     $day = $date.getDate();
     $year = $date.getFullYear();
     $weekDay = $date.getDay();
     var $fullDate = ($month + "/" + $day + "/" + $year);
     return $fullDate;
}

function setWeekDayString() {
     var $days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
     var $weekDayString = $days[$weekDay];
     return $weekDayString;
}

function setDifficulty() {
     var $difficultyList = ["Easier", "More difficult", "Most Difficult", "Experts only", "Not Applicable"];
     var $whichHill = document.getElementById("whichHill");
     $whichHill.onchange = function() {
          var $hillChoice = this.options[this.selectedIndex].value;
          if ($hillChoice >= 0) {
               if ($hillChoice <= 12) {
                    document.getElementById("difficulty").innerHTML = $difficultyList[0];
               } else if ($hillChoice > 12 && $hillChoice <= 13) {
                    document.getElementById("difficulty").innerHTML = $difficultyList[1];
               } else if ($hillChoice > 13) {
                    document.getElementById("difficulty").innerHTML = $difficultyList[2];
               } else if ($hillChoice == 10) {
                    document.getElementById("difficulty").innerHTML = $difficultyList[3];
               } else if ($hillChoice == 0) {
                    document.getElementById("difficulty").innerHTML = $difficultyList[4];
               }
          }
     };
}

function setAge() {
     var $dob = document.getElementById("dob");
     $dob.onchange = function() {
          var $dobString = document.getElementById("dob").value;
          var $birthDate = new Date($dobString);
          var $age = $year - $birthDate.getFullYear();
          var $birthMonth = ($month - $birthDate.getMonth());
          if ($birthMonth < 0 || ($birthMonth === 0 && $day < $birthDate.getDate())) {
               $age--;
          }
          document.getElementById("age").innerHTML = $age;
     }
}

function setLocation() {
     var $locations = document.forms[0].elements["location"];
     var $counter = 0;

     $locations[0].onclick = function() {
          if($("#whichLift").length == 0) {
            $("#whichHill").remove();
            loadLifts();
          }

          // Select Lift in 'Skiing History' -- Arek Bregula
          $("input[name=numTimes][value=lift]", $("#history")).prop("checked", true);
     };
     $locations[1].onclick = function() {
          if($("#whichHill").length == 0) {
            $("#whichLift").remove();
            loadHills();
          }

          // Select Hill in 'Skiing History' -- Arek Bregula
          $("input[name=numTimes][value=hill]", $("#history")).prop("checked", true);
     };
     $locations[2].onclick = function() {
          if (document.getElementById("lift")) {
               if (document.getElementById("lift")) {
                    var $div = document.getElementById("lifts");
                    var $removeDiv = document.getElementById("lift");
                    if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
                         $div.removeChild($removeDiv);
                         $counter--;
                    }
               }
          } else if (document.getElementById("hill")) {
               var $div = document.getElementById("hills");
               var $removeDiv = document.getElementById("hill");
               if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
                    $div.removeChild($removeDiv);
                    $counter--;
               }
          }
     };
}

function setLifts() {
     var $lifts = [];
     $.ajax({
          url: 'data/lifts.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $lifts = text.split(/\n/);
               return;
          }
     });
     return $lifts;
}

function loadLifts() {
     var $lifts = setLifts();
     var $select = $('<select size="1" class="select" required autofocus name="whichLift" id="whichLift">').appendTo('#lifts');
     $select.append('<option value="" disabled selected>CHOOSE LIFT</option>');
     for (var $i = 0; $i < $lifts.length; $i++) {
          $select.append('<option value="' + $lifts[$i] + '">' + $lifts[$i] + '</option>');
     }
     $("#lifts").append("</select>");

     $("#whichLift").change(liftChangeEvt);
}

function liftChangeEvt(e) {
  $("input[name=liftName]").val($("#whichLift option:selected").text());
}

function setHills() {
     var $hills = [];
     $.ajax({
          url: 'data/hills.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $hills = text.split(/\n/);
               return;
          }
     });
     $hills.toString();
     return $hills;
}

function loadHills() {
     var $hills = setHills();

     //$hills = $hills.replace(/(\r\n|\n|\r)/gm,"");
     var $difficulty = [];
     //$hills.push($hillData);
     //for (var $i = 0; $i < $hillData.length; $i++) {
     //     //alert($hillData[$i]);
     //     $hills.push($hillData[$i]);
     //     $difficulty.push($hillData[$i + 1]);
     //     $hillData.shift();
     //     $hillData.shift();    
     //}
     var $select = $('<select size="1" class="select" required autofocus name="whichHill" id="whichHill">').appendTo('#hills');
     $select.append('<option value="" disabled selected>CHOOSE HILL</option>');

     for (var $i = 0; $i < $hills.length; $i++) {
          var $hillData = $hills[$i].split(',');
          $select.append('<option value="' + $hillData[1] + '">' + $hillData[0] + '</option>');
     }

     $("#hills").append("</select>");

     $("#whichHill").change(hillsChangeEvt);
}

function hillsChangeEvt(e) {
  var $hill = $(e.target).val();
  $("span.#difficulty").html($difficultyList[parseInt($hill)-1]);
  $("input[name=hillName]").val($("#whichHill option:selected").text());
}

function setHelmet() {
     var $helmets = document.forms[0].elements["helmet"];
     var $counter = 0;
     $helmets[0].onclick = function() {
          if ($counter < 1) {
               var $div = document.createElement("div");
               $div.id = "hadHelmet";
               var $line =    '<label for="helmetRental">Helmet area rental?</label>' +
                              '<input type="radio" class="radio" required autofocus name="helmetRental" value="yes">Yes' +
                              '<input type="radio" class="radio" required autofocus name="helmetRental" value="no">No';
               $div.innerHTML = $line;
               document.getElementById("helmetYes").appendChild($div);
               $counter++
          }
     };
     $helmets[1].onclick = function() {
          if (document.getElementById("hadHelmet")) {
               var $div = document.getElementById("helmetYes");
               var $removeDiv = document.getElementById("hadHelmet");
               if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
                    $div.removeChild($removeDiv);
                    $counter--;
               }
          }
     };
}

function setGlasses() {
     var $glasses = document.forms[0].elements["correctiveLenses"];
     var $counter = 0;
     $glasses[0].onclick = function() {
          if ($counter < 1) {
               var $div = document.createElement("div");
               $div.id = "wornLenses";
               var $line =    '<label for="correctiveLensesWorn">Worn?</label>' +
                              '<input type="radio" class="radio" required autofocus name="correctiveLensesWorn" value="yes">Yes' +
                              '<input type="radio" class="radio" required autofocus name="correctiveLensesWorn" value="no">No'
               $div.innerHTML = $line;
               document.getElementById("lensesYes").appendChild($div);
               $counter++
          }
     };
     $glasses[1].onclick = function() {
          if (document.getElementById("wornLenses")) {
               var $div = document.getElementById("lensesYes");
               var $removeDiv = document.getElementById("wornLenses");
               if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
                    $div.removeChild($removeDiv);
                    $counter--;
               }
          }
     };
}

function setInstructor() {
     var $inst = document.forms[0].elements["inLesson"];
     var $counter = 0;
     $inst[0].onclick = function() {
          if ($counter < 1) {
               var $div = document.createElement("div");
               $div.id = "nameInst";
               var $line = '<input name="instructor" class="line" type="text" autofocus placeholder="Instructor">';
               $div.innerHTML = $line;
               document.getElementById("instYes").appendChild($div);
               $counter++
          }
     }
     $inst[1].onclick = function() {
          if (document.getElementById("nameInst")) {
               var $div = document.getElementById("instYes");
               var $removeDiv = document.getElementById("nameInst");
               if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
                    $div.removeChild($removeDiv);
                    $counter--;
               }
          }
     }
}

function populateRental() {
     var $div = document.createElement("div");
     $div.id = "rentalPlace";
     var $line =    '<input name="shopName" class="line" type="text"placeholder="If rented, shop name">' +
                    '<input name="shopStreet" class="line" type="text"placeholder="Street number">' +
                    '<input name="shopCity" class="line" type="text"placeholder="City">' +
                    '<select name="shopState" id="shopState" class="select" required>' +
                        '<option value="" disabled selected>ST</option>' +
                        '<option value="AL">AL</option>' +
                        '<option value="AK">AK</option>' +
                        '<option value="AZ">AZ</option>' +
                        '<option value="AR">AR</option>' +
                        '<option value="CA">CA</option>' +
                        '<option value="CO">CO</option>' +
                        '<option value="CT">CT</option>' +
                        '<option value="DE">DE</option>' +
                        '<option value="DC">DC</option>' +
                        '<option value="FL">FL</option>' +
                        '<option value="GA">GA</option>' +
                        '<option value="HI">HI</option>' +
                        '<option value="ID">ID</option>' +
                        '<option value="IL">IL</option>' +
                        '<option value="IN">IN</option>' +
                        '<option value="IA">IA</option>' +
                        '<option value="KS">KS</option>' +
                        '<option value="KY">KY</option>' +
                        '<option value="LA">LA</option>' +
                        '<option value="ME">ME</option>' +
                        '<option value="MD">MD</option>' +
                        '<option value="MA">MA</option>' +
                        '<option value="MI">MI</option>' +
                        '<option value="MN">MN</option>' +
                        '<option value="MS">MS</option>' +
                        '<option value="MO">MO</option>' +
                        '<option value="MT">MT</option>' +
                        '<option value="NE">NE</option>' +
                        '<option value="NV">NV</option>' +
                        '<option value="NH">NH</option>' +
                        '<option value="NJ">NJ</option>' +
                        '<option value="NM">NM</option>' +
                        '<option value="NY">NY</option>' +
                        '<option value="NC">NC</option>' +
                        '<option value="ND">ND</option>' +
                        '<option value="OH">OH</option>' +
                        '<option value="OK">OK</option>' +
                        '<option value="OR">OR</option>' +
                        '<option value="PA">PA</option>' +
                        '<option value="RI">RI</option>' +
                        '<option value="SC">SC</option>' +
                        '<option value="SD">SD</option>' +
                        '<option value="TN">TN</option>' +
                        '<option value="TX">TX</option>' +
                        '<option value="UT">UT</option>' +
                        '<option value="VT">VT</option>' +
                        '<option value="VA">VA</option>' +
                        '<option value="WA">WA</option>' +
                        '<option value="WV">WV</option>' +
                        '<option value="WI">WI</option>' +
                        '<option value="WY">WY</option>' +
                    '<input name="shopZipCode" class="line" type="number"placeholder="Zip code">' +
                    '<input name="skiNum" class="line" type="number" placeholder="Ski/Board Number">' +
                    '<input name="bootNum" class="line" type="number" placeholder="Boot Number">';
     $div.innerHTML = $line;
     document.getElementById("rentalEquip").appendChild($div);
}

function removeRental() {
     if (document.getElementById("rentalPlace")) {
          var $div = document.getElementById("rentalEquip");
          var $removeDiv = document.getElementById("rentalPlace");
          if (typeof($removeDiv) != "undefined" && $removeDiv != null) {
               $div.removeChild($removeDiv);
          }
     }    
}

function populateNubsAddress() {
  var $rentalPlaceWrapper = $("div.#rentalPlace");
  $("input[name=shopName]", $rentalPlaceWrapper).val("Nub's Nob");
  $("input[name=shopStreet]", $rentalPlaceWrapper).val("500 Nub's Nob Road");
  $("input[name=shopCity]", $rentalPlaceWrapper).val("Harbor Springs");
  $("input[name=shopZipCode]", $rentalPlaceWrapper).val("49740");
  $("select[name=shopState]", $rentalPlaceWrapper).val("MI");
}

function clearRentalAdddress() {
  var $rentalPlaceWrapper = $("div.#rentalPlace");
  $("input[name=shopName]", $rentalPlaceWrapper).val("");
  $("input[name=shopStreet]", $rentalPlaceWrapper).val("");
  $("input[name=shopCity]", $rentalPlaceWrapper).val("");
  $("input[name=shopZipCode]", $rentalPlaceWrapper).val("");
  $("select[name=shopState]", $rentalPlaceWrapper).val(""); 
}

function setRental() {
     var $rental = document.forms[0].elements["owner"];
     var $counter = 0;

     // Owned
     $rental[0].onclick = function() {
          removeRental();
          $counter--;
     }

     // Area Rental
     $rental[1].onclick = function() {    
          if ($counter < 1) {
               populateRental();
               $counter++;
          }
     }

     // Other Rental
     $rental[2].onclick = function() {
          if ($counter < 1) {
               populateRental();
               $counter++;
          }
          clearRentalAdddress();
     }

     // Borrowed
     $rental[3].onclick = function() {
          removeRental();
          $counter--;
     }

     // Demo
     $rental[4].onclick = function() {
          if ($counter < 1) {
               populateRental();
               $counter++;
          }
          populateNubsAddress();
     }
}

function setNames() {
     var $lines = [];
     //var $lastNames = [];
     //var $firstNames = [];
     $.ajax({
          url: 'data/patrollers.csv',
          contentType: "text/csv",
          async: false,
          success: function(text) {
               $lines = text.split(/\n/);
               //for (var $i = 0; $i < $lines.length; $i++) {
               //     $lastNames = $lines[$i].split(',');
               //     $firstNames = $lines[$i].split(',');
               //}
               return;
          }
     });
     return $lines;
}

function loadPatrollers($placePatroller,$counter) {
     var $names = setNames();
     var $patrollerLocation = $placePatroller + $counter;
     //var $li = $('<li>').appendTo('#' + $placePatroller);
     var $select = $('<select size="1" class="select" name="' + $patrollerLocation + '" id="' + $patrollerLocation + '">').appendTo('#' + $placePatroller);
     $select.append('<option value="" disabled selected>CHOOSE PATROLLER</option>');
     for (var $i = 0; $i < $names.length; $i++) {
          $select.append('<option value="' + $names[$i] + '">' + $names[$i] + '</option>');
     }
     //var $liEnd = $('</li>').appendTo('#' + $placePatroller);
     var $chosePatroller = document.forms[0].elements[$patrollerLocation];
     $chosePatroller.onchange = function(e) {
          $counter++;
          e.target.onchange = function () {}
          $("#incidentForm").append("<input type='hidden' name='" + $placePatroller + "Names' value='" + $(e.target).val() + "'/>");
          loadPatrollers($placePatroller,$counter);
     }
}

window.onload = function() {
     setLocation();
     setAge();
     document.getElementById("dateComplete").value = setDate();
     setHelmet();
     setLocation();
     setGlasses();
     setInstructor();
     setRental();
     loadPatrollers('scenePatrollers',0);
     loadPatrollers('transportingPatrollers',0);
     loadPatrollers('aidRoomPatrollers',0);

     document.getElementById("date").value = setDate();
     document.getElementById("day").value = setWeekDayString();
     //document.getElementById("date").innerHTML = setDate();
     //document.getElementById("day").innerHTML = setWeekDayString();
     $(document).load().scrollTop(0); //ensure page starts at top
};




/*
 *Helpful URLs:
 *
 *http://stackoverflow.com/questions/6601952/programmatically-create-select-list
 *
 *http://stackoverflow.com/questions/5805059/select-placeholder/5859221#5859221 - 2nd answer!
 *
 *http://stackoverflow.com/questions/3664381/html-force-page-scroll-position-to-top-at-page-refresh/3664406#3664406 - 2nd answer
 *
 *
 *
 */






















































//$(document).ready(function() {
//
//});

/*
 *DEPRECATED
 */
//function loadPatrollers() {
//     window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
//     
//     var $reader = new fileReader();
//     var $PATROLLER_FILE = "http://127.0.0.1/scripts/patrollers.csv";
//     $reader.onloadend = function(event) {
//          var $contents = event.target.result;
//          alert($contents);
//     }
//     //$reader.readAsText($PATROLLER_FILE);
//     
//     //var $names = [];
//     //var $PATROLLER_FILE = "http://127.0.0.1/scripts/patrollers.csv";
//     //var $openInFile = new XMLHttpRequest();
//     //$openInFile.onreadystatechange = function() {
//     //     if ($openInFile.readyState == 4 && $openInFile.status == 200) {
//     //         alert($openInFile.responseText);
//     //     } else {
//     //          alert("FILE NOT OPENED!");
//     //     }
//     //}
//     
//     //$openInFile.open('GET', $PATROLLER_FILE, true);
//     //$openInFile.send();
//     //var $data = $openInFile.responseText;
//     //alert($data);
//     //var $rows = $data.split('\n');
//     //if ($openInFile.readyState === 4) {
//     //     if ($openInFile.status === 200) {
//     //          var $data = $openInFile.responseText;
//     //          var $rows = $data.split("\n");
//     //     }
//     //} else {
//     //     alert('FILE NOT OPENED!');
//     //}
//     /*for (var $i = 0; $i < $rows.length; $i++) {
//          $names = $rows[$i].split(',');
//          var $lastNames = $names[0];
//          var $firstNames = $names[1];
//     }*/ //For future use (http://blog.amcharts.com/2011/03/amcharts-javascript-tutorials-part-2.html)
//     //alert($names[1]);
//     //return $rows;
//}
//
//function setPatrollers() {
//     var $patrollers = loadPatrollers();
//     alert($patrollers[0]);
//     //for (var $i = 0; $i < $patrollers.length; $i++) {
//     //     document.getElementById("poop").innerHTML = $patrollers[0];
//     //}
//}


//function getPatrollers($placePatroller,$counter) {
//     var $patrollers = [
//          'NONE',
//          'Bates, Howard',
//          'Bailey, Fred',
//          'Davis, Ed',
//          'Norris, Annika',
//          'Mogford, Bob'
//     ]
//     var $patrollerLocation = $placePatroller + $counter;
//     var $lines =   '<li>' +
//                    '<select size="1" class="select" required autofocus name="' + $patrollerLocation + '" id="' + $patrollerLocation + '">' +
//                    '<option value="0">Choose Patroller</option>';
//     var $lines2 = '';
//     for (var $i = 0; $i < $patrollers.length; $i++) {
//          $lines2 = $lines2 + '<option value="' + ($i + 1) + '">' + $patrollers[$i] + '</option>';
//     }
//     $lines2 = $lines2 + '</select>' + '</li>';
//     $lines = $lines + $lines2;
//     return $lines;
//}

//function loadPatrollers($placePatroller,$counter) {
//     var $div = document.createElement("div");
//     $div.id = $placePatroller + "List" + $counter;
//     var $list = $placePatroller + $counter;
//     $div.innerHTML = getPatrollers($placePatroller,$counter);
//     document.getElementById($placePatroller).appendChild($div);
//     var $chosePatroller = document.forms[0].elements[$list];
//     $chosePatroller.onchange = function() {
//          $counter++;
//          loadPatrollers($placePatroller,$counter);
//     }
//}