
var hourlyArray;
var currentTime = moment();
var currentHour;
var textBlock = $(".col-8");
var plannerTask = $("textarea");
$.each(plannerTask, function () {
    this.value = "";
});

// If a local hourly tasks exist, import them, otherwise initialize the array
if (localStorage.getItem("localHourlyTasks")) {
    hourlyArray = JSON.parse(localStorage.getItem("localHourlyTasks"));
} else {
    hourlyArray = [];
};

// Write the current date by "DayofWeek, Month DayofMonth"
$("#currentDay").text(`${currentTime.format('dddd, D MMMM YYYY')}`);

// The current hour is offset by 9 to match the array indicies, since 9AM is the first slot
function updateCurrentScheduleTime() {
    textBlock.removeClass('past present future');
    $.each(textBlock, function (scheduleBlockHour) {
        if (scheduleBlockHour < (currentTime.hour() - 9)) {
            $(this).addClass('past');
        } else if (scheduleBlockHour == (currentTime.hour() - 9)) {
            $(this).addClass('present');
        } else {
            $(this).addClass('future');
        }
    });
    currentHour = currentTime.hour();
};

// The delay to adding the animation class allows enough time to fully remove the class,
// allowing the animation to play again.
function updateLocalStorage() {
    event.preventDefault();
    let btnIndex = Number($(this).attr('id'));
    $('.alert-success').removeClass('alert-animation');

    if (plannerTask[btnIndex].value.trim() != "") {
        hourlyArray[btnIndex] = {
            time: $(".hour")[btnIndex].textContent.trim(),
            task: plannerTask[btnIndex].value
        };

        localStorage.setItem("localHourlyTasks", JSON.stringify(hourlyArray));
        setTimeout(function () {
            $('.alert-success').addClass('alert-animation');
            $('.alert-success').text(`Successfully saved task at ${$(".hour")[btnIndex].textContent.trim()}!`);
        }, 100);
    };
};

// Write saved tasks to the planner on page load
function writeCurrentTasks() {
    $.each(hourlyArray, function (i) {
        if (hourlyArray[i]) {
            plannerTask[i].value = hourlyArray[i].task;
        };
    });
};

// Updates the current time every minute and updates the planner style every hour
setInterval(function () {
    currentTime = moment();
    if (currentHour < currentTime.hour()) {
        updateCurrentScheduleTime();
    } else if (currentHour > currentTime.hour()) {
        updateCurrentScheduleTime();
        $("#currentDay").text(`${currentTime.format('dddd,D MMMM YYYY')}`);
    }
}, 1000);

// Initial function calls and event listener
updateCurrentScheduleTime();
writeCurrentTasks();
$("button").click(updateLocalStorage);

