// ============================================================================
// --- SPECIFY RUNTIME PARAMS
// ============================================================================

// --- specify task name and version
const experiment_name_verbose = "This is a template for JSPSYCH";
const experiment_name = "template";
const TASK_VERSION = "0.1a";
const api_url = "https://z8ktdbtwhe.execute-api.us-east-1.amazonaws.com/api/save";

// --- set debug flag
const DEBUG = false;

// NOTES -----
// Those in both of the experimental groups will have the chance to "win" $1,000,000 dollars. 
// Participants will start off with $200,000 and every false alarm and miss will result in a deduction of $1,000. 
// Correct rejections and hits will earn them $1,000. The only difference is that 
// one group will be playing for all the winnings and the other will be playing to 
// split the winnings and their hypothetical team is "counting on them."
// The event rate will be 40 events per min for a vigilance task lasting 20 mins
// 1 second of stimulus and .5 seconds for them to view their points change
// Total of 800 events. The max they can earn is $1,000,000
// Control group sees no points and receives no feedback.

// ============================================================================
// --- SPECIFY TASK PARAMETERS
// ============================================================================

// specify trial tables
// load from automate/trial_table.json after running through R script
const trial_table = [
    { num: "0"},
    { num: "0"},
    { num: "2"},
    { num: "4"},
    { num: "3"},
    { num: "9"},
    { num: "1"},
    { num: "2"},
    { num: "3"},
    { num: "4"},
    { num: "5"},
    { num: "6"},
    { num: "7"},
    { num: "8"},
    { num: "9"},
];

// --- Durations

// time in ms for the fixation cross preceding each stimuli
const fixation_duration = 1000;

// time in ms before trial times out
const timeout_duration = 10000;

// time in ms for each number to be on screen
const trial_duration = 1000;

// time in ms for each feedback screen to be shown
const feedback_duration = 500;

// --- init any counters
var event_type; // for logging event type that causes data to be saved

// --- init points
var starting_points = 200000;
var action_value = 1000;
var current_points = starting_points;

// ============================================================================
// --- DETERMINE USER PLATFORM
// ============================================================================

// t/f - whether participant is on a mobile platform or not
const onMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
document.body.className += onMobile ? "mobile" : "desktop";

// ============================================================================
// --- INITIALIZE JSPSYCH
// ============================================================================

const jsPsych = initJsPsych({
    // setting the display element (default: body)
    display_element: "container",

    // send data to server if browser interaction changes (e.g. participant leaves tab)
    on_interaction_data_update: () => {
        console.log("callback: on_interaction_data_update()");
        event_type = "on_interaction_data_update()";

        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, curr_data, DEBUG);
    },
    on_close: () => {
        console.log("callback: on_close()");
        event_type = "on_close()";

        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, curr_data, DEBUG);
    },
    on_timeline_start: function() {
        console.log("callback: on_timeline_start()");
        event_type = "on_timeline_start()";

        console.log(`Running on: ${onMobile ? "mobile" : "desktop"}.`);
        const curr_data = jsPsych.data.get();
        console.log(curr_data);
    },
    on_timeline_finish: function() {
        console.log("callback: on_timeline_finish()");
        event_type = "on_timeline_finish()";

        // --- save data to server
        const curr_data = jsPsych.data.get();
        console.log(curr_data);
        //upload_data(api_url, final_data, DEBUG);
    },
});

// ============================================================================
// --- EXTRACT IDs from URL
// ============================================================================

// --- extract participant ID and other params from URL
var participant_id = jsPsych.data.getURLVariable("PARTICIPANT_ID") || "NA";
var study_id = jsPsych.data.getURLVariable("STUDY_ID") || "NA";
var session_id = jsPsych.data.getURLVariable("SESSION_ID") || "NA";
var session_uuid = create_uuid() || "NA";

// -- get task_length_params
var num_blocks_prac = jsPsych.data.getURLVariable("N_BLOCKS_PRAC") || 1;
var num_blocks_exp = jsPsych.data.getURLVariable("N_BLOCKS_EXP") || 1;

// -- get expeirmental condition
var exp_condition = jsPsych.data.getURLVariable("CONDITION") || 1;

// --- get session start
var timestamp_start = new Date();
timestamp_start = timestamp_start.toISOString();

// --- get the current date
var now = new Date();
var currentDateString = now.toISOString();

// --- echo to log
console.log("Participant ID: " + participant_id);
console.log("Study ID: " + study_id);
console.log("Session ID: " + session_id);
console.log("Session UUID: " + session_uuid);

// console.log(trial_table);
let date_now = new Date();

// ============================================================================
// -- QUESTIONS
// ============================================================================
// for practice, everyone gets check and red x feedback? or only certain conditions?

// ============================================================================
// -- CREATE CONDITION TOGGLE (SHOW/NOT SHOW FEEDBACK)
// ============================================================================

// ============================================================================
// --- SAVE DATA PROPERTIES TO JSPSYCH DATA COLLECTION
// ============================================================================

// --- save to JsPsych data file
jsPsych.data.addProperties({
    experiment_condition: exp_condition,
    experiment_version: TASK_VERSION,
    trial_timestamp: null,
    task_section: null,
    completion: null,
    experiment_name: experiment_name,
    subject_id: participant_id,
    study_id: study_id,
    session_id: session_id,
    session_uuid: session_uuid,
    experiment_platform: onMobile ? "mobile" : "desktop",
    timestamp_start: timestamp_start,
    session_date: `${("0" + (date_now.getMonth() + 1).toString()).slice(-2)}-` +
        `${("0" + date_now.getDate().toString()).slice(-2)}-` +
        `${date_now.getFullYear().toString()}`,

    // --- echo durations, timeouts
    expected_trial_count: trial_table.length,
    fixation_duration: fixation_duration,
    timeout_duration: timeout_duration,
    trial_num: null,

    // --- initialize points
    total_points_start: starting_points, // set to $1,000,000 at beginning of experiment
    total_points_per_action: action_value,

    current_points: starting_points,

    // --- collect window /screen information
    useragent: navigator.userAgent,
    on_mobile: onMobile,
    window_innerHeight: window.innerHeight,
    window_innerWidth: window.innerWidth,
    screen_availHeight: screen.availHeight,
    screen_availWidth: screen.availWidth,
    screen_width: screen.width,
    screen_height: screen.height,
});

// ============================================================================
// --- SPECIFY INSTRUCTIONS, MESSAGES
// ============================================================================

const instructions = {
    type: jsPsychInstructions,
    css_classes: [],
    pages: [
        "In this test, small numbers (0-9) will flash very briefly at the center of the screen.",
        "Your job is to let us know when you see the number 0 (zero) flash on the screen by pressing the [SPACE] key in your keyboard.",
        "If you see “0”, press [SPACE].",
        "If you see anything else, do nothing.",
        "For example, if you see a “0” on the screen, press [SPACE] as soon as possible.<br>But if you see a “3”, do not press anything.",
        "You will see a check mark ✔️ if you pressed [SPACE] when there was a '0'",
        "You will see a cross ❌ if you missed or pressed [SPACE] for the wrong number.",
        "Try your best to respond quickly and correctly.",
        "First, we will have a practice run.",
        "Proceed to the next page when you are ready to start practicing.",
        "Press 'Next' to start the activity.",
    ].map((it) => "<div class='instructions'>" + it + "</div>"),
    show_clickable_nav: true,
    button_label_previous: "Previous",
    button_label_next: "Next",
    on_finish: (data) => {
        data.task_section = "instructions";
    },
};

const msg_exp_complete = {
    type: jsPsychInstructions,
    css_classes: ["instructions"],
    pages: ["Thank you for your time! To learn more about our lab's work, visit <a href='https://sciences.ucf.edu/psychology/contextlab/' target='_blank'>https://sciences.ucf.edu/psychology/contextlab/</a>"],
    show_clickable_nav: true,
    button_label_next: "Close Task",
    on_finish: (data) => {
        data.task_section = "debriefing";
    },
};

// ============================================================================
// --- SPECIFY TASK PROCEDURE
// ============================================================================

// create fixation cross screen
var fixation = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div style="font-size:60px;">+</div>',
    choices: "NO_KEYS", // i.e., do not accept keyboard input to advance
    trial_duration: fixation_duration,
};

// create main 'stimuli' screen
var trial = {
    type: jsPsychHtmlKeyboardResponse,
    choices: [' '], // only allow spacebar press
    prompt: "",
    trial_duration: trial_duration,
    stimulus: function(){
        var html='<div class="bigbox" id="stimuli">' + jsPsych.timelineVariable('num') + '</div>';
        return html;
    }, 
    on_finish: (data) => {
        // add trial timestamps and other metadata
        data.trial_timestamp = new Date().toISOString();

        // determine accuracy first (if 0 and spacebar pressed, this is correct)
        var spacebar_pressed = jsPsych.pluginAPI.compareKeys(data.response, " ");
        console.log("Trial timestamp: " + data.trial_timestamp);
        console.log("Stimuli value: " + jsPsych.timelineVariable('num'));
        console.log("response:" + data.response);
        console.log("response if spacebar:" + spacebar_pressed);

        // coding accuracy
        // {SPACE} AND {0} = true
        // {NULL} AND {!0} = true

        if(jsPsych.pluginAPI.compareKeys(data.response, " ") && jsPsych.timelineVariable('num') == '0'){
            data.correct = true;
            data.accuracy_recode = "HIT";
            current_points = current_points + action_value;
        }
        else if(jsPsych.pluginAPI.compareKeys(data.response, null) && jsPsych.timelineVariable('num') != '0') {
            data.correct = true;
            data.accuracy_recode = "CORRECT_REJECTION";
            current_points = current_points - action_value;
        } 
        else {
            data.correct = false;
            data.accuracy_recode = "FALSE_ALARM";
            current_points = current_points - action_value;
        }

        // echo points to verify calculations
        data.current_points = current_points;
        console.log("accuracy (binary): " + data.correct);
        console.log("accuracy (recoded): " + data.accuracy_recode);
        console.log("current points:" + current_points);
        console.log("----------------------------------------"); // end of console.log stream for this trial

        // add other metadata
        data.trial_type = "vigilance-stimuli";
        data.task_section = "test";
        trial_counter++;
        data.trial_num = trial_counter;

        return data;
    },
};


// --- create feedback screens for each type of feedback
var feedback_binary = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS", // i.e., do not accept keyboard input to advance
    trial_duration: feedback_duration,

    // get the last trial's accuracy value to 'draw' feedback
    stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        if(last_trial_correct){
          return "<div class='bigbox' id='feedback-good'><p>Correct!</p></div>"; // the parameter value has to be returned from the function
        } else {
          return "<div class='bigbox' id='feedback-bad'><p>Wrong ❌.</p></div>"; // the parameter value has to be returned from the function
        }
    }, 

    // add additional data to current trial
    on_finish: (data) => {
        // add trial timestamps and other metadata
        data.trial_timestamp = new Date().toISOString();
        data.trial_type = "feedback-binary";
        data.task_section = "feedback";
    },
};

var feedback_points = {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS", // i.e., do not accept keyboard input to advance
    trial_duration: feedback_duration,

    // get the last trial's accuracy value to 'draw' feedback
    stimulus: function(){
        var last_trial_correct = jsPsych.data.get().last(1).values()[0].correct;
        var last_trial_points = jsPsych.data.get().last(1).values()[0].current_points;
        if(last_trial_correct){
            return "<div class='bigbox' id='feedback-good'><p>Correct!</p><br><p>Points:"+last_trial_points+"</p></div>"; // the parameter value has to be returned from the function
        } 
        else {
            return "<div class='bigbox' id='feedback-bad'><p>Wrong ❌.</p><br><p>Points:"+last_trial_points+"</p></div>"; // the parameter value has to be returned from the function
        }
    }, 

    // add additional data to current trial
    on_finish: (data) => {
        // add trial timestamps and other metadata
        data.trial_timestamp = new Date().toISOString();
        data.trial_type = "feedback-pointvalue";
        data.task_section = "feedback";
    },
};

// --- specify trial procedures
var trial_procedure_prac = {
    timeline: [trial, feedback_binary],
    timeline_variables: trial_table,
    randomize_order: true,
    repetitions: num_blocks_prac
}

var trial_procedure_exp = {
    timeline: [trial, feedback_points],
    timeline_variables: trial_table,
    randomize_order: true,
    repetitions: num_blocks_exp
}

// ============================================================================
// --- SPECIFY SEQUENCE AND RUN TIMELINE
// ============================================================================

// init trial counter
var trial_counter = 0;
var trial_table_length = trial_table.length;

// // to manually preload media files, create an array of file paths
// // TODO: generate with R script
// var images = ['img/real.png', 'img/fake.png'];

// // these array can be passed into the preload plugin using the images, audio 
// // and video parameters
// var preload = {
//     type: jsPsychPreload,
//     images: images
// }

// prepare timeline
//var tl = [instructions, trial_procedure_prac, trial_procedure_exp, msg_exp_complete];

var tl = [instructions, trial_procedure_exp, msg_exp_complete];

// jspsych event timeline
jsPsych.run(tl);