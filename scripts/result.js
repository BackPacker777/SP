/* AUTHOR: hbates@northmen.org
*  VERSION: 1.0
*  CREATED:
*  TO DO: hill choice selection, patroller list, hill list (array?), hill difficulty label, move hill difficulty inline
*/

"use strict";

var $day, $month, $year, $weekDay;

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

window.onload = function() {
     document.getElementById("date").innerHTML = setDate();
     document.getElementById("day").innerHTML = setWeekDayString();
};
